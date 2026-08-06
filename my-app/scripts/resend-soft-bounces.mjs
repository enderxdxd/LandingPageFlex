// scripts/resend-soft-bounces.mjs
//
// Reenvia SÓ os SOFT bounces (type "Temporary") capturados pelo webhook em
// /api/webhooks/resend e gravados no Firestore (coleção emailBounces).
// Ao contrário de resend-bounced.mjs (que pega tudo da API mas não separa hard/soft),
// aqui usamos o tipo do bounce que só o webhook fornece.
//
// Pré-requisitos:
//   - Webhook configurado no Resend (evento email.bounced) apontando para o site
//   - RESEND_WEBHOOK_SECRET no .env.local
//   - Chave FULL ACCESS do Resend (RESEND_FULL_API_KEY) para buscar o conteúdo original
//   - Credenciais FIREBASE_ADMIN_* já presentes no .env.local (mesmas da app)
//
// Uso (rode de dentro de my-app/):
//   node scripts/resend-soft-bounces.mjs            -> DRY RUN (só lista)
//   node scripts/resend-soft-bounces.mjs --send     -> reenvia de verdade
//   node scripts/resend-soft-bounces.mjs --send --limit=50

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESEND_API = 'https://api.resend.com';
const COLLECTION = 'emailBounces';

const args = process.argv.slice(2);
const SEND = args.includes('--send');
const LIMIT = Number((args.find(a => a.startsWith('--limit=')) || '--limit=0').split('=')[1]) || 0;
const DELAY_MS = 700;

// ---------- Carregar .env.local para process.env ----------
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvLocal();

const RESEND_KEY =
  process.env.RESEND_FULL_API_KEY || process.env.RESEND_ADMIN_KEY || process.env.RESEND_API_KEY;
if (!RESEND_KEY) {
  console.error('❌ Nenhuma chave Resend encontrada (RESEND_FULL_API_KEY/RESEND_ADMIN_KEY/RESEND_API_KEY).');
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function resendApi(pathname, options = {}) {
  const res = await fetch(`${RESEND_API}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
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
      throw new Error(`${res.status} ${msg} → precisa de chave FULL ACCESS (RESEND_FULL_API_KEY).`);
    }
    throw new Error(`${res.status} ${msg}`);
  }
  return body;
}

// ---------- Firebase Admin ----------
async function initFirestore() {
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '')
    .replace(/^"(.*)"$/, '$1')
    .replace(/\\n/g, '\n');

  if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error('Credenciais FIREBASE_ADMIN_* ausentes no .env.local');
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
  return getFirestore();
}

async function resendOne(emailId) {
  const full = await resendApi(`/emails/${emailId}`);
  if (!full.html && !full.text) throw new Error('sem conteúdo html/text recuperável');
  const payload = { from: full.from, to: full.to, subject: full.subject };
  if (full.html) payload.html = full.html;
  if (full.text) payload.text = full.text;
  if (full.reply_to) payload.reply_to = full.reply_to;
  const result = await resendApi('/emails', { method: 'POST', body: JSON.stringify(payload) });
  return result.id;
}

async function main() {
  console.log(`\n🔎 Soft bounces (Temporary) ainda não reenviados...`);
  console.log(`   Modo: ${SEND ? '🚀 ENVIO REAL (--send)' : '🧪 DRY RUN (nada será enviado)'}\n`);

  const db = await initFirestore();
  let query = db.collection(COLLECTION)
    .where('isPermanent', '==', false)
    .where('resent', '==', false);

  const snap = await query.get();
  let docs = snap.docs;
  if (LIMIT > 0) docs = docs.slice(0, LIMIT);

  console.log(`📊 Soft bounces pendentes: ${docs.length}\n`);
  if (docs.length === 0) {
    console.log('✅ Nada a reenviar.\n');
    return;
  }

  docs.forEach((doc, i) => {
    const d = doc.data();
    const to = Array.isArray(d.to) ? d.to.join(', ') : d.to || '—';
    console.log(`${String(i + 1).padStart(3)}. ${to.padEnd(38)} | ${d.bounceSubType || d.bounceType} | ${d.subject || '(sem assunto)'}`);
  });

  if (!SEND) {
    console.log('\n🧪 DRY RUN — nada foi enviado. Rode com --send para reenviar.\n');
    return;
  }

  console.log(`\n🚀 Reenviando ${docs.length} e-mail(s)...\n`);
  let ok = 0;
  const errors = [];
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const d = doc.data();
    try {
      const newId = await resendOne(d.emailId);
      await doc.ref.update({ resent: true, resentAt: new Date(), resentEmailId: newId });
      ok++;
      console.log(`✅ ${i + 1}/${docs.length} ${(Array.isArray(d.to) ? d.to.join(', ') : d.to)} -> novo id ${newId}`);
    } catch (err) {
      errors.push({ emailId: d.emailId, to: d.to, error: err.message });
      console.error(`❌ ${i + 1}/${docs.length} ${d.to}: ${err.message}`);
    }
    if (i < docs.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n📊 RESUMO: ${ok} reenviados, ${errors.length} com erro.`);
  if (errors.length) console.log(JSON.stringify(errors, null, 2));
  console.log('');
}

main().catch(err => {
  console.error('\n💥 Erro geral:', err.message, '\n');
  process.exit(1);
});
