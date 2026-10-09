import nodemailer, { type Transporter } from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

/**
 * Envio de e-mail pelo SMTP da Locaweb (substitui o Resend).
 *
 * Por que trocou: o Resend entrega pela Amazon SES, e a SES não conseguia
 * conectar no MX da Locaweb (`421 4.4.1 Failed to establish connection`),
 * então os e-mails para @flexacademia.com.br ficavam presos até expirar.
 * Saindo direto pelo SMTP da Locaweb, a mensagem já nasce dentro dela.
 *
 * A interface imita `resend.emails.send()` — mesmos campos e o mesmo retorno
 * `{ data, error }` — para as rotas e o `garantirEnvio` seguirem iguais.
 *
 * Serviço: SMTP Locaweb (smtplw.com.br), o SMTP transacional contratado à
 * parte — não é a caixa de e-mail. O domínio de remetente configurado no
 * painel é `envios.flexacademia.com.br` (DKIM e DMARC já autenticados), e
 * o endereço do remetente PRECISA terminar nele. Por isso, quando SMTP_FROM
 * existe, ele substitui o endereço de todo `from` e só o nome de exibição
 * ("Flex Chamados", "Flex Fitness Center") vem da rota.
 *
 * Variáveis de ambiente:
 *   SMTP_HOST  (padrão smtplw.com.br)
 *   SMTP_PORT  (padrão 587 com STARTTLS; 465 usa SSL direto)
 *   SMTP_USER  usuário do painel SMTP Locaweb
 *   SMTP_PASS  senha do painel SMTP Locaweb
 *   SMTP_FROM  remetente, ex.: noreply@envios.flexacademia.com.br
 */

type Endereco = string | string[]

export interface EmailAnexo {
  filename: string
  /** Base64 sem o prefixo `data:...;base64,` (formato que o Resend aceitava) ou Buffer. */
  content: string | Buffer
  contentType?: string
}

export interface EmailMensagem {
  from: string
  to: Endereco
  subject: string
  html?: string
  text?: string
  replyTo?: Endereco
  cc?: Endereco
  bcc?: Endereco
  attachments?: EmailAnexo[]
}

export interface EmailResultado {
  data: { id: string } | null
  error: { name: string; message: string } | null
}

let transporter: Transporter | null = null

function obterTransporter(): Transporter {
  if (transporter) return transporter

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error('SMTP_USER e SMTP_PASS precisam estar configurados no ambiente')
  }

  const port = Number(process.env.SMTP_PORT || 587)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtplw.com.br',
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    // Função serverless não pode ficar pendurada esperando o servidor.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  })
  return transporter
}

/** Mantém o nome de exibição e troca o endereço pelo remetente autorizado. */
function remetente(from: string): string {
  const autorizado = process.env.SMTP_FROM?.trim()
  if (!autorizado) return from
  const nome = from.match(/^\s*"?([^"<]*?)"?\s*</)?.[1]?.trim()
  return nome ? `"${nome.replace(/"/g, '')}" <${autorizado}>` : autorizado
}

function converterAnexo(anexo: EmailAnexo): Mail.Attachment {
  return {
    filename: anexo.filename,
    content: typeof anexo.content === 'string' ? Buffer.from(anexo.content, 'base64') : anexo.content,
    contentType: anexo.contentType,
  }
}

async function send(mensagem: EmailMensagem): Promise<EmailResultado> {
  try {
    const info = await obterTransporter().sendMail({
      from: remetente(mensagem.from),
      to: mensagem.to,
      cc: mensagem.cc,
      bcc: mensagem.bcc,
      replyTo: mensagem.replyTo,
      subject: mensagem.subject,
      html: mensagem.html,
      text: mensagem.text,
      attachments: (mensagem.attachments ?? []).map(converterAnexo),
    })

    if (info.rejected?.length) {
      return {
        data: null,
        error: { name: 'smtp_rejected', message: `Recusado: ${info.rejected.join(', ')} — ${info.response}` },
      }
    }
    return { data: { id: info.messageId }, error: null }
  } catch (err) {
    const e = err as Error & { code?: string; responseCode?: number; response?: string }
    return {
      data: null,
      error: {
        name: e.code || (e.responseCode ? `smtp_${e.responseCode}` : 'smtp_error'),
        message: e.response || e.message || 'Falha no envio SMTP',
      },
    }
  }
}

/** Mesmo formato de uso do SDK antigo: `mailer.emails.send({...})`. */
export const mailer = { emails: { send } }
