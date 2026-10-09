import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server'
import { folha, secao, dados as dados_, paragrafo, citacao, botao } from '@/lib/email/layout'


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

  return folha({
    assunto: `${dados.titulo} - ${dados.protocolo}`,
    previa: dados.mensagemPrincipal,
    etiqueta: `Protocolo ${dados.protocolo}`,
    titulo: dados.titulo,
    corpo: [
      paragrafo(dados.mensagemPrincipal),
      secao('Chamado'),
      dados_([
        ['Protocolo', dados.protocolo],
        ['Unidade', dados.unidade],
        ['Categoria', dados.categoria],
        ['Departamento', dados.departamento],
        ['Prioridade', labelPrioridade],
      ]),
      dados.detalhes ? secao('Detalhes') : '',
      dados.detalhes ? citacao(dados.detalhes) : '',
      botao('Abrir o chamado', `${BASE_URL}/chamados/meus/${dados.chamadoId}`),
    ].join(''),
  })
}

const ASSUNTO_MAP: Record<string, (protocolo: string, extra?: string) => string> = {
  novo: (p) => `Chamado ${p} aberto com sucesso`,
  novo_admin: (p, cat) => `Novo chamado ${p} - ${cat}`,
  novo_departamento: (p, dep) => `Novo chamado ${p} - Departamento: ${dep}`,
  atribuido: (p) => `Chamado ${p} atribuído a você`,
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
  atribuido: 'Um chamado foi atribuído a você. Por favor, verifique os detalhes e inicie o atendimento.',
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
    const { data, error } = await mailer.emails.send({
      from: `Flex Chamados <${FROM_EMAIL}>`,
      to: emails,
      replyTo: REPLY_TO,
      subject: assunto,
      html,
    })

    if (error) {
      console.error('Erro SMTP:', error)
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
