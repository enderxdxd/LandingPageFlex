import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.CHAMADOS_FROM_EMAIL || 'chamados@flexacademia.com.br'
const REPLY_TO = process.env.CHAMADOS_REPLY_TO || 'suporte@flexacademia.com.br'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flexfitness.com.br'

// Cores por prioridade
const CORES_PRIORIDADE: Record<string, string> = {
  baixa: '#3B82F6',
  media: '#F59E0B',
  alta: '#F97316',
  critica: '#EF4444',
}

const LABELS_PRIORIDADE: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
}

function gerarEmailHTML(dados: {
  tipo: string
  protocolo: string
  titulo: string
  prioridade: string
  unidade: string
  categoria: string
  departamento?: string
  mensagemPrincipal: string
  chamadoId: string
  detalhes?: string
}) {
  const corPrioridade = CORES_PRIORIDADE[dados.prioridade] || '#3B82F6'
  const labelPrioridade = LABELS_PRIORIDADE[dados.prioridade] || dados.prioridade

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <!-- Header -->
        <div style="background: #1E40AF; border-radius: 12px 12px 0 0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 1px;">SISTEMA DE CHAMADOS</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Flex Fitness Center</p>
        </div>

        <!-- Body -->
        <div style="background: white; border-left: 4px solid ${corPrioridade}; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">${dados.mensagemPrincipal}</p>

          <!-- Chamado Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Protocolo</td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600; text-align: right; font-family: monospace;">${dados.protocolo}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Titulo</td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600; text-align: right;">${dados.titulo}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Unidade</td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 13px; text-align: right;">${dados.unidade}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Categoria</td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 13px; text-align: right;">${dados.categoria}</td>
              </tr>
              ${dados.departamento ? `
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Departamento</td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 13px; text-align: right;">${dados.departamento}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Prioridade</td>
                <td style="padding: 6px 0; text-align: right;">
                  <span style="background: ${corPrioridade}20; color: ${corPrioridade}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${labelPrioridade}</span>
                </td>
              </tr>
            </table>
          </div>

          ${dados.detalhes ? `<p style="color: #64748b; font-size: 13px; margin: 16px 0; padding: 12px; background: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7;">${dados.detalhes}</p>` : ''}

          <!-- CTA Button -->
          <div style="text-align: center; margin: 24px 0 8px;">
            <a href="${BASE_URL}/chamados/meus/${dados.chamadoId}" style="background: #1E40AF; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
              Ver Chamado
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 16px; color: #94a3b8; font-size: 11px;">
          <p style="margin: 0;">Flex Fitness Center - Sistema de Chamados Internos</p>
          <p style="margin: 4px 0 0;">Este email foi gerado automaticamente. Nao responda diretamente.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

const ASSUNTO_MAP: Record<string, (protocolo: string, extra?: string) => string> = {
  novo: (p) => `Chamado ${p} aberto com sucesso`,
  novo_admin: (p, cat) => `Novo chamado ${p} - ${cat}`,
  novo_departamento: (p, dep) => `Novo chamado ${p} - Departamento: ${dep}`,
  atribuido: (p) => `Chamado ${p} atribuido a voce`,
  comentario: (p) => `Novo comentario no chamado ${p}`,
  status: (p, status) => `Chamado ${p} - Status: ${status}`,
  sla_proximo: (p) => `SLA do chamado ${p} proximo do prazo`,
  sla_estourado: (p) => `SLA estourado - Chamado ${p}`,
  resolvido: (p) => `Chamado ${p} resolvido - Avalie o atendimento`,
}

const MENSAGEM_MAP: Record<string, string> = {
  novo: 'Seu chamado foi aberto com sucesso e ja esta sendo processado.',
  novo_admin: 'Um novo chamado foi aberto e aguarda atribuicao.',
  novo_departamento: 'Um novo chamado foi aberto para o seu departamento.',
  atribuido: 'Um chamado foi atribuido a voce. Por favor, verifique os detalhes e inicie o atendimento.',
  comentario: 'Um novo comentario foi adicionado ao chamado.',
  status: 'O status do seu chamado foi alterado.',
  sla_proximo: 'O prazo de SLA deste chamado esta proximo de expirar. Por favor, priorize o atendimento.',
  sla_estourado: 'O SLA deste chamado foi estourado. Acao imediata necessaria.',
  resolvido: 'Seu chamado foi resolvido. Por favor, avalie o atendimento.',
}

/**
 * Gera link do WhatsApp com mensagem formatada
 */
function gerarLinkWhatsApp(telefone: string, dados: {
  protocolo: string
  titulo: string
  prioridade: string
  unidade: string
  categoria: string
  tipo: string
}): string {
  const labelPrioridade = LABELS_PRIORIDADE[dados.prioridade] || dados.prioridade
  const mensagem = encodeURIComponent(
    `*FLEX FITNESS - Sistema de Chamados*\n\n` +
    `${dados.tipo === 'novo_departamento' ? 'Novo chamado para seu departamento' : 'Notificacao de chamado'}:\n\n` +
    `*Protocolo:* ${dados.protocolo}\n` +
    `*Titulo:* ${dados.titulo}\n` +
    `*Unidade:* ${dados.unidade}\n` +
    `*Categoria:* ${dados.categoria}\n` +
    `*Prioridade:* ${labelPrioridade}\n\n` +
    `Acesse o sistema para mais detalhes.`
  )
  const cleanNumber = telefone.replace(/\D/g, '')
  const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`
  return `https://wa.me/${fullNumber}?text=${mensagem}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tipo,
      chamadoId,
      protocolo,
      titulo,
      prioridade,
      unidade,
      categoria,
      departamento,
      destinatarios,
      detalhes,
      enviarWhatsApp,
    } = body

    if (!tipo || !chamadoId || !protocolo || !destinatarios?.length) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const assuntoFn = ASSUNTO_MAP[tipo] || ASSUNTO_MAP['novo']
    const mensagem = MENSAGEM_MAP[tipo] || ''

    const html = gerarEmailHTML({
      tipo,
      protocolo,
      titulo: titulo || '',
      prioridade: prioridade || 'media',
      unidade: unidade || '',
      categoria: categoria || '',
      departamento: departamento || undefined,
      mensagemPrincipal: mensagem,
      chamadoId,
      detalhes,
    })

    const emails = destinatarios.map((d: { email: string; nome: string }) => d.email)
    const assunto = assuntoFn(protocolo, detalhes || departamento)

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: `Flex Chamados <${FROM_EMAIL}>`,
      to: emails,
      replyTo: REPLY_TO,
      subject: assunto,
      html,
    })

    if (error) {
      console.error('Erro Resend:', error)
      return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
    }

    // Gerar links WhatsApp para membros com telefone
    const whatsappLinks: { nome: string; link: string }[] = []
    if (enviarWhatsApp) {
      for (const d of destinatarios) {
        if (d.telefone) {
          whatsappLinks.push({
            nome: d.nome,
            link: gerarLinkWhatsApp(d.telefone, {
              protocolo,
              titulo: titulo || '',
              prioridade: prioridade || 'media',
              unidade: unidade || '',
              categoria: categoria || '',
              tipo,
            }),
          })
        }
      }
    }

    return NextResponse.json({ success: true, data, whatsappLinks })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
