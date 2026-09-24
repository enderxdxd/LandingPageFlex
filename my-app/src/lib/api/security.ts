/**
 * Defesas compartilhadas das rotas públicas de e-mail.
 *
 * Contexto de por que isto existe: as cinco rotas de envio aceitavam um campo
 * `destinatarios` vindo do corpo da requisição e mandavam e-mail para qualquer
 * endereço ali listado, com HTML montado a partir de campos do próprio
 * atacante. Era um relay aberto assinado pelo domínio verificado no Resend —
 * ou seja, munição para queimar a reputação de envio do domínio inteiro.
 *
 * A regra agora é única e inegociável: QUEM DECIDE O DESTINATÁRIO É O SERVIDOR.
 * O cliente manda dados do formulário; a rota resolve para quem vai.
 */

import { NextRequest, NextResponse } from 'next/server'

/* ── Escape de HTML ────────────────────────────────────────────────────────── */

/**
 * Neutraliza HTML em texto que veio do visitante.
 *
 * Os templates são strings montadas com `${}`, então qualquer campo não
 * escapado vira marcação dentro do e-mail que a equipe abre.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Limite por campo: nome de pessoa não tem 5 mil caracteres, spam tem. */
const MAX_FIELD_LENGTH = 5000

/**
 * Escapa recursivamente todos os campos de texto do payload.
 *
 * `skip` é para os campos que NÃO podem ser escapados: base64 de anexo e os
 * blocos de HTML que o próprio servidor monta. Tudo que o servidor gera entra
 * DEPOIS desta chamada, nunca antes.
 */
export function sanitizeDeep<T>(data: T, skip: string[] = []): T {
  if (typeof data === 'string') {
    return escapeHtml(data.slice(0, MAX_FIELD_LENGTH)) as unknown as T
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeDeep(item, skip)) as unknown as T
  }
  if (data && typeof data === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      out[key] = skip.includes(key) ? value : sanitizeDeep(value, skip)
    }
    return out as unknown as T
  }
  return data
}

/* ── Validação de e-mail ───────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[a-z]{2,}$/i

/**
 * Endereço único e sintaticamente válido.
 *
 * Recusar vírgula e ponto-e-vírgula é proposital: sem isso, "a@b.com,c@d.com"
 * passaria como um endereço só e viraria injeção de destinatário. Também é a
 * primeira linha contra os bounces — endereço malformado que sai do site volta
 * como hard bounce e cobra o preço na reputação do domínio.
 */
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim())
}

/** Só devolve o endereço se ele for válido; caso contrário, `null`. */
export function normalizeEmail(value: unknown): string | null {
  if (!isValidEmail(value)) return null
  return value.trim().toLowerCase()
}

/**
 * Filtra uma lista de destinatários internos (as constantes de cada rota).
 *
 * Elas são escritas à mão e já tiveram entradas com espaço sobrando e caixa
 * alta; endereço interno quebrado também vira bounce.
 */
export function cleanRecipientList(raw: string): string[] {
  return raw
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => isValidEmail(email))
}

/* ── Rate limit ────────────────────────────────────────────────────────────── */

type Hit = { count: number; resetAt: number }

/**
 * Janela fixa em memória, por IP.
 *
 * Em serverless o mapa vive por instância, então isto não é um limite global
 * exato — é um teto por instância. Para o tamanho do tráfego daqui já derruba o
 * abuso automatizado, e não exige Redis nem dependência nova. Se um dia o
 * volume justificar, o ponto de troca é só esta função.
 */
const buckets = new Map<string, Hit>()

/** Evita que o mapa cresça sem limite em instâncias de vida longa. */
function evictExpired(now: number) {
  if (buckets.size < 5000) return
  buckets.forEach((hit, key) => {
    if (hit.resetAt <= now) buckets.delete(key)
  })
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'desconhecido'
}

export interface RateLimitOptions {
  /** identificador da rota, para um formulário não consumir a cota de outro */
  scope: string
  /** envios permitidos dentro da janela */
  limit: number
  /** tamanho da janela em milissegundos */
  windowMs: number
}

/**
 * Devolve `null` quando a requisição pode seguir, ou a resposta 429 pronta.
 */
export function rateLimit(
  request: NextRequest,
  { scope, limit, windowMs }: RateLimitOptions
): NextResponse | null {
  const now = Date.now()
  evictExpired(now)

  const key = `${scope}:${clientIp(request)}`
  const hit = buckets.get(key)

  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  hit.count += 1
  if (hit.count <= limit) return null

  const retryAfter = Math.ceil((hit.resetAt - now) / 1000)
  return NextResponse.json(
    {
      error: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
      retryAfter,
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}

/* ── Honeypot ──────────────────────────────────────────────────────────────── */

/* O nome do campo vive em `honeypot.ts`, que não importa `next/server` — os
   formulários são componentes de cliente e precisam dele sem arrastar código
   de servidor para o bundle. */
export { HONEYPOT_FIELD } from './honeypot'
import { HONEYPOT_FIELD } from './honeypot'

/**
 * Verdadeiro quando o campo invisível veio preenchido — só um robô faria isso.
 *
 * A rota responde 200 nesse caso, sem enviar nada: devolver erro ensina o robô
 * a contornar a armadilha.
 */
export function isBot(data: Record<string, unknown>): boolean {
  const trap = data[HONEYPOT_FIELD]
  return typeof trap === 'string' && trap.trim().length > 0
}

/* ── Remetente ─────────────────────────────────────────────────────────────── */

/**
 * O remetente continua sendo o `noreply@` que já está em produção — trocar o
 * endereço de envio por conta própria arriscaria o que hoje funciona.
 *
 * `noreply@` é penalizado por filtro de spam e deixa quem responde falando com
 * o vazio, então o caminho é `RESEND_FROM` no ambiente, assim que existir uma
 * caixa de verdade no domínio (qualquer endereço do domínio verificado serve
 * para o Resend; o que precisa existir é a caixa para RECEBER a resposta).
 *
 * O ganho que já entra hoje, sem risco, é o `replyTo` das funções abaixo.
 */
export const MAIL_FROM =
  process.env.RESEND_FROM ?? 'Flex Fitness Center <noreply@flexfitnesscenter.com.br>'

/**
 * Para onde vai a resposta de quem recebeu o e-mail.
 *
 * No e-mail que vai para a equipe, responder tem que falar com o interessado —
 * é o caminho comercial mais curto que existe. No que vai para o interessado,
 * responder tem que cair numa caixa monitorada, nunca no vazio.
 */
export const MAIL_REPLY_TO =
  process.env.RESEND_REPLY_TO ?? 'comercial@flexacademia.com.br'

/* ── Resultado de envio ────────────────────────────────────────────────────── */

/**
 * O SDK do Resend NÃO lança exceção quando a API recusa o envio: ele devolve
 * `{ data: null, error: {...} }`. Todos os `try/catch` em volta de
 * `resend.emails.send()` passavam batido por isso, então chave inválida,
 * domínio não verificado e endereço recusado eram contabilizados como sucesso
 * — a rota respondia "6 de 6 enviados" com zero e-mail entregue.
 *
 * Esta função transforma o erro do retorno em exceção, que é o que o laço de
 * envio de cada rota já sabe tratar.
 */
export function garantirEnvio(
  resultado: { data?: { id?: string } | null; error?: { name?: string; message?: string } | null }
): string | undefined {
  if (resultado?.error) {
    const { name, message } = resultado.error
    throw new Error(`Resend recusou o envio (${name ?? 'erro'}): ${message ?? 'sem detalhe'}`)
  }
  return resultado?.data?.id
}
