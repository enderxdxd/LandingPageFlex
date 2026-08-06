// scripts/resend-bounced.mjs
//
// Reenvia e-mails que deram BOUNCE no Resend.
//
// Como funciona:
//   1. Pagina o endpoint GET /emails do Resend e junta os que estão com last_event === "bounced"
//   2. Por padrão roda em DRY RUN (só mostra a lista, NÃO envia) — confira antes de disparar
//   3. Com --send, busca o conteúdo original de cada e-mail (GET /emails/{id}) e reenvia
//   4. Grava os IDs já reenviados em resend-bounced.log.json pra não duplicar em execuções futuras
//
// Uso (rode de dentro de my-app/):
//   node scripts/resend-bounced.mjs                 -> DRY RUN, últimos 30 dias
//   node scripts/resend-bounced.mjs --days=15       -> DRY RUN, últimos 15 dias
//   node scripts/resend-bounced.mjs --send          -> REENVIA de verdade
//   node scripts/resend-bounced.mjs --send --days=7 -> REENVIA só os dos últimos 7 dias
//   node scripts/resend-bounced.mjs --send --limit=50  -> reenvia no máximo 50 (trava de segurança)
//
// ⚠️ Atenção sobre reputação: reenviar HARD bounce (endereço inexistente) vai bouçar de novo
//    e desgasta a reputação do domínio no Resend. O Resend não separa hard/soft nesse endpoint,
//    então este script trata todos como "bounced". Se der pra separar depois, melhor.
//
// ⚠️ Anexos: a API do Resend NÃO retorna os anexos originais. E-mails que tinham PDF anexado
//    (ex.: comprovante/cancelamento) serão reenviados SEM o anexo. O texto/HTML vai completo.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.resend.com';
const LOG_FILE = path.join(__dirname, 'resend-bounced.log.json');

// ---------- Config via flags ----------
const args = process.argv.slice(2);
const SEND = args.includes('--send');
const DAYS = Number((args.find(a => a.startsWith('--days=')) || '--days=30').split('=')[1]) || 30;
const LIMIT = Number((args.find(a => a.startsWith('--limit=')) || '--limit=0').split('=')[1]) || 0; // 0 = sem limite
const ONLY = (args.find(a => a.startsWith('--only=')) || '--only=all').split('=')[1] || 'all'; // all | internal | external
const MAX_PAGES = 50;      // trava: no máx 50 páginas x 100 = 5000 e-mails varridos
const DELAY_MS = 700;      // Resend limita ~2 req/s; 700ms deixa folga

// domínios internos (@flex...) para o filtro --only
const INTERNAL = /@(flexacademia\.com\.br|flexpalmas\.com\.br|flexfitnesscenter\.com\.br|flexfitness\.com\.br)$/i;
const isInternal = e => (Array.isArray(e.to) ? e.to : [e.to]).some(t => INTERNAL.test(t || ''));

// ---------- Carregar a chave (precisa de FULL ACCESS pra listar) ----------
// A chave de produção (RESEND_API_KEY) costuma ser "Sending only" e NÃO consegue
// listar e-mails. Crie uma chave "Full access" no dashboard do Resend
// (Settings -> API Keys -> Create, permissão "Full access") e coloque no .env.local como:
//   RESEND_FULL_API_KEY=re_xxxxxxxx
// A ordem de busca prioriza a full-access.
const KEY_NAMES = ['RESEND_FULL_API_KEY', 'RESEND_ADMIN_KEY', 'RESEND_API_KEY'];

function loadApiKey() {
  for (const name of KEY_NAMES) {
    if (process.env[name]) return process.env[name];
  }
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const name of KEY_NAMES) {
      // tolera espaços em volta do "=" (ex.: NAME = valor)
      const re = new RegExp(`^${name}\\s*=\\s*(.*)$`);
      for (const l of lines) {
        const m = l.trim().match(re);
        if (m) return m[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return null;
}

const API_KEY = loadApiKey();
if (!API_KEY) {
  console.error('❌ Nenhuma chave encontrada (procurei ' + KEY_NAMES.join(', ') + ').');
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// created_at vem como "2026-04-03 22:13:42.674981+00" -> Date
function parseResendDate(s) {
  if (!s) return null;
  let iso = s.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1').replace(/([+-]\d{2})$/, '$1:00');
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

async function api(pathname, options = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!res.ok) {
    const msg = body?.message || body?.error || res.statusText;
    if (res.status === 401 && /restricted/i.test(String(msg))) {
      throw new Error(
        `${res.status} ${msg}\n` +
        '   → A chave em uso é "Sending only". Este script precisa de uma chave FULL ACCESS.\n' +
        '   → Crie em https://resend.com/api-keys (permissão "Full access") e adicione no .env.local:\n' +
        '        RESEND_FULL_API_KEY=re_xxxxxxxx'
      );
    }
    throw new Error(`${res.status} ${msg}`);
  }
  return body;
}

// ---------- Log de já-reenviados ----------
function loadLog() {
  try {
    return new Set(JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')).resentIds || []);
  } catch { return new Set(); }
}
function saveLog(set) {
  fs.writeFileSync(LOG_FILE, JSON.stringify({ resentIds: [...set] }, null, 2));
}

// ---------- 1) Coletar bounced ----------
async function collectBounced(cutoff) {
  const bounced = [];
  let after = null;
  let page = 0;

  while (page < MAX_PAGES) {
    page++;
    const qs = new URLSearchParams({ limit: '100' });
    if (after) qs.set('after', after);

    const { data = [], has_more } = await api(`/emails?${qs.toString()}`);
    if (data.length === 0) break;

    for (const e of data) {
      const created = parseResendDate(e.created_at);
      if (created && created < cutoff) continue;
      if (e.last_event === 'bounced') bounced.push(e);
    }

    // parada antecipada: lista vem do mais novo p/ o mais antigo,
    // se o último item da página já passou da janela, não precisa continuar
    const oldest = parseResendDate(data[data.length - 1].created_at);
    if (oldest && oldest < cutoff) break;
    if (!has_more) break;

    after = data[data.length - 1].id;
    await sleep(DELAY_MS);
  }
  return bounced;
}

// ---------- 2) Reenviar um ----------
async function resendOne(id) {
  const full = await api(`/emails/${id}`);
  if (!full.html && !full.text) {
    throw new Error('e-mail sem conteúdo html/text recuperável');
  }
  const payload = {
    from: full.from,
    to: full.to,
    subject: full.subject,
  };
  if (full.html) payload.html = full.html;
  if (full.text) payload.text = full.text;
  if (full.reply_to) payload.reply_to = full.reply_to;

  const result = await api('/emails', { method: 'POST', body: JSON.stringify(payload) });
  return result.id;
}

// ---------- Main ----------
async function main() {
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
  console.log(`\n🔎 Procurando bounces desde ${cutoff.toLocaleString('pt-BR')} (últimos ${DAYS} dias)...`);
  console.log(`   Modo: ${SEND ? '🚀 ENVIO REAL (--send)' : '🧪 DRY RUN (nada será enviado)'}\n`);

  const alreadyResent = loadLog();
  let bounced = await collectBounced(cutoff);

  // filtro --only=internal|external
  if (ONLY === 'internal') bounced = bounced.filter(isInternal);
  else if (ONLY === 'external') bounced = bounced.filter(e => !isInternal(e));
  if (ONLY !== 'all') console.log(`   Filtro: --only=${ONLY}\n`);

  // remove os que já reenviamos numa execução anterior
  const skipped = bounced.filter(e => alreadyResent.has(e.id)).length;
  bounced = bounced.filter(e => !alreadyResent.has(e.id));

  if (LIMIT > 0) bounced = bounced.slice(0, LIMIT);

  console.log(`📊 Bounces encontrados na janela: ${bounced.length + skipped}`);
  if (skipped) console.log(`   ↳ ${skipped} já reenviados antes (pulados)`);
  console.log('');

  if (bounced.length === 0) {
    console.log('✅ Nada a reenviar.\n');
    return;
  }

  // tabela
  const uniqueTo = new Set();
  bounced.forEach((e, i) => {
    (Array.isArray(e.to) ? e.to : [e.to]).forEach(t => uniqueTo.add(t));
    const to = (Array.isArray(e.to) ? e.to.join(', ') : e.to) || '—';
    const when = parseResendDate(e.created_at)?.toLocaleDateString('pt-BR') || '—';
    console.log(`${String(i + 1).padStart(3)}. [${when}] ${to.padEnd(38)} | ${e.subject || '(sem assunto)'}`);
  });
  console.log(`\n👥 Destinatários únicos: ${uniqueTo.size}`);

  if (!SEND) {
    console.log('\n🧪 DRY RUN — nada foi enviado.');
    console.log('   Revise a lista acima e rode de novo com --send para reenviar de verdade.\n');
    return;
  }

  console.log(`\n🚀 Reenviando ${bounced.length} e-mail(s)...\n`);
  let ok = 0;
  const errors = [];
  for (let i = 0; i < bounced.length; i++) {
    const e = bounced[i];
    try {
      const newId = await resendOne(e.id);
      alreadyResent.add(e.id);
      saveLog(alreadyResent); // salva a cada envio (resiliente a interrupção)
      ok++;
      console.log(`✅ ${i + 1}/${bounced.length} ${Array.isArray(e.to) ? e.to.join(', ') : e.to} -> novo id ${newId}`);
    } catch (err) {
      errors.push({ id: e.id, to: e.to, error: err.message });
      console.error(`❌ ${i + 1}/${bounced.length} ${e.to}: ${err.message}`);
    }
    if (i < bounced.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n📊 RESUMO: ${ok} reenviados, ${errors.length} com erro.`);
  if (errors.length) console.log(JSON.stringify(errors, null, 2));
  console.log('');
}

main().catch(err => {
  console.error('\n💥 Erro geral:', err.message, '\n');
  process.exit(1);
});
