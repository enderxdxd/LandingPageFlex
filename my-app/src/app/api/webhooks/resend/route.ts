import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

// Webhook do Resend para eventos de e-mail.
// Configure em https://resend.com/webhooks apontando para:
//   https://SEU_DOMINIO/api/webhooks/resend
// e habilite pelo menos o evento "email.bounced".
// Copie o "Signing Secret" (whsec_...) para o .env.local como RESEND_WEBHOOK_SECRET.
//
// Guarda cada bounce no Firestore (coleção emailBounces) com o TIPO do bounce
// (Permanent = hard / Temporary = soft), que é a única forma de separar hard de soft
// no Resend — essa info só vem no webhook, não na API de listagem.

const COLLECTION = 'emailBounces'
const TOLERANCE_SECONDS = 60 * 5 // rejeita eventos com timestamp > 5 min de diferença (anti-replay)

// Verificação de assinatura Svix (padrão usado pelo Resend).
function verifySvixSignature(params: {
  secret: string
  payload: string
  svixId: string
  svixTimestamp: string
  svixSignature: string
}): boolean {
  const { secret, payload, svixId, svixTimestamp, svixSignature } = params
  if (!svixId || !svixTimestamp || !svixSignature) return false

  // anti-replay
  const ts = Number(svixTimestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > TOLERANCE_SECONDS) return false

  // secret vem como "whsec_<base64>"
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`
  const expected = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')

  // header pode ter várias assinaturas separadas por espaço: "v1,xxxx v1,yyyy"
  const expectedBuf = Buffer.from(expected)
  return svixSignature.split(' ').some((part) => {
    const sig = part.includes(',') ? part.split(',')[1] : part
    const sigBuf = Buffer.from(sig)
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)
  })
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET não configurado')
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 })
  }

  // precisamos do corpo CRU para validar a assinatura
  const payload = await request.text()

  const ok = verifySvixSignature({
    secret,
    payload,
    svixId: request.headers.get('svix-id') || '',
    svixTimestamp: request.headers.get('svix-timestamp') || '',
    svixSignature: request.headers.get('svix-signature') || '',
  })
  if (!ok) {
    console.warn('[resend-webhook] assinatura inválida')
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Só nos interessa bounce aqui. Outros eventos retornam 200 (não reprocessar).
  if (event?.type !== 'email.bounced') {
    return NextResponse.json({ ok: true, ignored: event?.type }, { status: 200 })
  }

  try {
    const d = event.data || {}
    const emailId: string = d.email_id
    if (!emailId) {
      return NextResponse.json({ error: 'email_id ausente' }, { status: 400 })
    }

    const bounceType: string = d.bounce?.type || 'Undetermined' // Permanent | Temporary | Undetermined
    const isPermanent = bounceType === 'Permanent'

    const ref = adminDb.collection(COLLECTION).doc(emailId)
    const snap = await ref.get()

    const record: Record<string, unknown> = {
      emailId,
      messageId: d.message_id || null,
      to: Array.isArray(d.to) ? d.to : d.to ? [d.to] : [],
      from: d.from || null,
      subject: d.subject || null,
      bounceType,
      bounceSubType: d.bounce?.subType || null,
      bounceMessage: d.bounce?.message || null,
      isPermanent,
      updatedAt: FieldValue.serverTimestamp(),
    }

    // não resetar o flag "resent" se o webhook reenviar o mesmo evento
    if (!snap.exists) {
      record.resent = false
      record.bouncedAt = FieldValue.serverTimestamp()
    }

    await ref.set(record, { merge: true })

    console.log(`[resend-webhook] bounce registrado: ${emailId} (${bounceType})`)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('[resend-webhook] erro ao gravar bounce:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
