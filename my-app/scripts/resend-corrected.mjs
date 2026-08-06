// scripts/resend-corrected.mjs
//
// Reenvia e-mails de CLIENTE que deram bounce por ERRO DE DIGITAÇÃO no endereço,
// corrigindo o domínio (gnail->gmail, hormail->hotmail, .con->.com, oitlook->outlook, etc.)
// e mandando o conteúdo ORIGINAL para o endereço corrigido.
//
// Ignora e-mails internos (@flex...) e endereços sem typo reconhecível.
//
// Uso (rode de dentro de my-app/):
//   node scripts/resend-corrected.mjs              -> DRY RUN (mostra o mapa errado->corrigido)
//   node scripts/resend-corrected.mjs --send       -> reenvia de verdade
//   node scripts/resend-corrected.mjs --days=120   -> muda a janela (default 90)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.resend.com';
const LOG_FILE = path.join(__dirname, 'resend-corrected.log.json');

const args = process.argv.slice(2);
const SEND = args.includes('--send');
const DAYS = Number((args.find(a => a.startsWith('--days=')) || '--days=90').split('=')[1]) || 90;
const DELAY_MS = 700;

// domínios internos que NÃO entram aqui
const INTERNAL = /@(flexacademia\.com\.br|flexpalmas\.com\.br|flexfitnesscenter\.com\.br|flexfitness\.com\.br)$/i;

// mapa de domínios digitados errado -> corretos
const DOMAIN_FIX = {
  'gnail.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.com.br': 'gmail.com',
  'hormail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'oitlook.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'yaho.com': 'yahoo.com',
};

// tenta corrigir um endereço; retorna o corrigido ou null se não mudou nada
function correct(email) {
  const at = email.lastIndexOf('@');
  if (at === -1) return null;
  const local = email.slice(0, at);
  let domain = email.slice(at + 1).toLowerCase();
  // typo de TLD (.con/.cmo/.vom -> .com). OBS: não mexo em .co (TLD válido) fora do mapa.
  domain = domain.replace(/\.con$/, '.com').replace(/\.cmo$/, '.com').replace(/\.vom$/, '.com');
  if (DOMAIN_FIX[domain]) domain = DOMAIN_FIX[domain];
  const fixed = `${local}@${domain}`;
  return fixed.toLowerCase() !== email.toLowerCase() ? fixed : null;
}

// ---------- chave (full access) ----------
const KEY_NAMES = ['RESEND_FULL_API_KEY', 'RESEND_ADMIN_KEY', 'RESEND_API_KEY'];
function loadApiKey() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const lines = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').split(/\r?\n/) : [];
  for (const name of KEY_NAMES) {
    if (process.env[name]) return process.env[name];
    for (const l of lines) {
      const m = l.trim().match(new RegExp(`^${name}\\s*=\\s*(.*)$`));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}
const API_KEY = loadApiKey();
if (!API_KEY) { console.error('❌ Chave Resend não encontrada.'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
function pd(s){ if(!s) return null; let i=s.replace(' ','T').replace(/(\.\d{3})\d+/,'$1').replace(/([+-]\d{2})$/,'$1:00'); const d=new Date(i); return isNaN(d)?null:d; }

async function api(pathname, options = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  let body; try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!res.ok) throw new Error(`${res.status} ${body?.message || body?.error || res.statusText}`);
  return body;
}

function loadLog(){ try { return new Set(JSON.parse(fs.readFileSync(LOG_FILE,'utf8')).resentIds||[]); } catch { return new Set(); } }
function saveLog(s){ fs.writeFileSync(LOG_FILE, JSON.stringify({ resentIds:[...s] }, null, 2)); }

async function main() {
  const cutoff = new Date(Date.now() - DAYS * 864e5);
  console.log(`\n🔎 Bounces de cliente com typo corrigível (últimos ${DAYS} dias)...`);
  console.log(`   Modo: ${SEND ? '🚀 ENVIO REAL (--send)' : '🧪 DRY RUN (nada será enviado)'}\n`);

  // coletar bounced
  let after = null, page = 0;
  const targets = [];
  const already = loadLog();
  while (page++ < 50) {
    const qs = new URLSearchParams({ limit: '100' }); if (after) qs.set('after', after);
    const { data = [], has_more } = await api(`/emails?${qs}`);
    if (!data.length) break;
    for (const e of data) {
      const c = pd(e.created_at); if (c && c < cutoff) continue;
      if (e.last_event !== 'bounced') continue;
      const to = Array.isArray(e.to) ? e.to[0] : e.to;
      if (!to || INTERNAL.test(to)) continue;       // só externos
      const fixed = correct(to);
      if (!fixed) continue;                          // só com typo corrigível
      targets.push({ id: e.id, from: to, to: fixed, subject: e.subject, date: c?.toLocaleDateString('pt-BR') });
    }
    const oldest = pd(data[data.length - 1].created_at);
    if (oldest && oldest < cutoff) break;
    if (!has_more) break;
    after = data[data.length - 1].id; await sleep(300);
  }

  const pending = targets.filter(t => !already.has(t.id));
  console.log(`📊 Endereços corrigíveis: ${targets.length}  (já reenviados antes: ${targets.length - pending.length})\n`);
  if (pending.length === 0) { console.log('✅ Nada a reenviar.\n'); return; }

  console.log('   ERRADO                                  ->  CORRIGIDO                               | assunto');
  console.log('   ' + '-'.repeat(110));
  pending.forEach(t => {
    console.log(`   ${t.from.padEnd(38)} ->  ${t.to.padEnd(38)} | ${t.subject}`);
  });

  if (!SEND) {
    console.log('\n🧪 DRY RUN — nada enviado. Revise o mapa acima e rode com --send.\n');
    return;
  }

  console.log(`\n🚀 Reenviando ${pending.length} e-mail(s) para os endereços corrigidos...\n`);
  let ok = 0; const errors = [];
  for (let i = 0; i < pending.length; i++) {
    const t = pending[i];
    try {
      const full = await api(`/emails/${t.id}`);
      if (!full.html && !full.text) throw new Error('sem conteúdo recuperável');
      const payload = { from: full.from, to: [t.to], subject: full.subject };
      if (full.html) payload.html = full.html;
      if (full.text) payload.text = full.text;
      if (full.reply_to) payload.reply_to = full.reply_to;
      const r = await api('/emails', { method: 'POST', body: JSON.stringify(payload) });
      already.add(t.id); saveLog(already); ok++;
      console.log(`✅ ${i + 1}/${pending.length} ${t.from} -> ${t.to} (novo id ${r.id})`);
    } catch (err) {
      errors.push({ id: t.id, to: t.to, error: err.message });
      console.error(`❌ ${i + 1}/${pending.length} ${t.to}: ${err.message}`);
    }
    if (i < pending.length - 1) await sleep(DELAY_MS);
  }
  console.log(`\n📊 RESUMO: ${ok} reenviados, ${errors.length} com erro.`);
  if (errors.length) console.log(JSON.stringify(errors, null, 2));
  console.log('');
}

main().catch(err => { console.error('\n💥 Erro geral:', err.message, '\n'); process.exit(1); });
