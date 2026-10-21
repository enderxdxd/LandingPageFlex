// app/api/send-aula-experimental/route.ts
import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';
import { UNIT_SALES_INBOX, recipientsForUnit } from '@/lib/constants/unit-inboxes';
import {
  MAIL_FROM,
  MAIL_REPLY_TO,
  cleanRecipientList,
  isBot,
  normalizeEmail,
  garantirEnvio,
  rateLimit,
  sanitizeDeep,
} from '@/lib/api/security';
import { folha, secao, dados, paragrafo, aviso, lista, botao } from '@/lib/email/layout';


/**
 * Os dois templates da aula experimental.
 *
 * Antes eram ~190 linhas de HTML com paleta própria (âmbar, azul-claro, verde),
 * emoji nos títulos e seis blocos coloridos empilhados. Agora montam blocos do
 * kit em `lib/email/layout`, que é o mesmo das outras rotas — a ênfase vem de
 * peso e espaço, não de caixa colorida.
 */

const templateEmpresa = (data: any) =>
  folha({
    assunto: `Aula experimental - ${data.qual_unidade} - FP-${data.numero_protocolo}`,
    previa: `${data.nome} pediu aula experimental na unidade ${data.qual_unidade}. Contato em ate 24h.`,
    etiqueta: `Protocolo FP-${data.numero_protocolo}`,
    titulo: 'Nova solicitação de aula experimental',
    corpo: [
      paragrafo(
        `Recebida em ${data.data_solicitacao}. Entre em contato com esta pessoa para agendar a visita e o treino.`
      ),
      secao('Dados do interessado'),
      dados([
        ['Nome', data.nome],
        ['Unidade', data.qual_unidade],
        ['E-mail', data.email_interessado],
        ['Celular', data.celular],
      ]),
      aviso(
        'Responder este e-mail fala direto com a pessoa interessada — o remetente da resposta já está configurado para isso.'
      ),
      secao('Próximos passos'),
      lista(
        [
          'Fazer contato por telefone em até 24 horas',
          'Agendar data e horário da visita',
          'Designar profissional para a recepção',
          'Fazer o acompanhamento depois da visita',
        ],
        { numerada: true }
      ),
      aviso('Cada CPF tem direito a apenas uma aula experimental.', { destaque: true }),
    ].join(''),
  });

const templateCliente = (data: any) =>
  folha({
    assunto: `Aula experimental solicitada - FP-${data.numero_protocolo}`,
    previa: 'Recebemos seu pedido. Entramos em contato em ate 24 horas uteis para agendar.',
    etiqueta: `Protocolo FP-${data.numero_protocolo}`,
    titulo: 'Sua aula experimental está reservada',
    corpo: [
      paragrafo(`Olá, ${data.nome}.`),
      paragrafo(
        'Recebemos seu pedido de aula experimental. Nossa equipe entra em contato em até 24 horas úteis para combinar o melhor dia e horário.'
      ),
      secao('Resumo do pedido'),
      dados([
        ['Unidade', data.qual_unidade],
        ['E-mail', data.email],
        ['Celular', data.celular],
        ['Solicitado em', data.data_solicitacao],
      ]),
      secao('O que está incluso'),
      lista([
        'Visita guiada pela academia',
        'Treino experimental gratuito',
        'Orientação com nossos profissionais',
      ]),
      secao('Para o dia'),
      lista([
        'Roupa adequada para exercício',
        'Toalha e garrafa de água',
        'Chegar 15 minutos antes do horário combinado',
      ]),
      botao('Conhecer as unidades', 'https://www.flexfitnesscenter.com.br/unidades/alphaville'),
      aviso('Cada CPF tem direito a apenas uma aula experimental.', { destaque: true }),
    ].join(''),
    rodape:
      'Se não receber nossa ligação, confira se o número informado está correto e com DDD. Guarde o número do protocolo.',
  });

/* As listas viviam aqui, com cinco endereços que não existiam e com cada
   unidade copiando as outras três. Agora saem de `lib/constants/unit-inboxes`. */
const unitRecipients: Record<string, string> = Object.fromEntries(
  Object.keys(UNIT_SALES_INBOX).map(slug => [slug, recipientsForUnit(slug)])
);

export async function POST(request: NextRequest) {
  try {
    /* Teto por IP: um interessado real preenche isto uma vez, não cinco por
       hora. Antes de qualquer parse pesado, para o abuso sair barato. */
    const limited = rateLimit(request, { scope: 'freepass', limit: 3, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    const rawData = await request.json();

    /* Campo-armadilha preenchido: responde como se tivesse dado certo e não
       envia nada. Erro explícito só ensinaria o robô a desviar. */
    if (isBot(rawData)) {
      return NextResponse.json({ success: true, message: 'Solicitação recebida' });
    }

    /* `destinatarios` é DESCARTADO de propósito. Ele vinha do corpo da
       requisição e mandava e-mail, assinado pelo domínio verificado, para
       qualquer endereço que o cliente listasse — relay aberto. Quem decide
       para quem vai, daqui em diante, é esta rota. */
    const { destinatarios: _ignorado, ...emailData } = rawData;

    const emailInteressado = normalizeEmail(emailData.email);
    if (!emailInteressado) {
      return NextResponse.json(
        { success: false, error: 'Informe um e-mail válido para receber a confirmação.' },
        { status: 400 }
      );
    }

    if (typeof emailData.nome !== 'string' || emailData.nome.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Informe seu nome.' },
        { status: 400 }
      );
    }

    // Log para debug
    console.log('🎁 Iniciando envio de solicitação de aula experimental:', {
      nome: emailData.nome,
      qual_unidade: emailData.qual_unidade,
      email: emailInteressado
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email da unidade usando o código enviado
    const unidadeCode = emailData.codigo_unidade || 'marista';
    // Converte a lista de emails da unidade (separados por vírgula) em um array
    const managerEmails = cleanRecipientList(unitRecipients[unidadeCode] || '');

    if (managerEmails.length === 0) {
      throw new Error('Unidade não encontrada no sistema');
    }

    /* Escapa tudo que veio do visitante ANTES de virar HTML. Os templates são
       template strings; sem isto, `nome` entra como marcação no e-mail que a
       equipe abre. */
    const safeData = sanitizeDeep(emailData);

    // Dados formatados
    const formattedEmailData = {
      ...safeData,
      numero_protocolo: numeroProtocolo,
      data_solicitacao: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      email_interessado: emailInteressado,
    };

    /* Destinatários resolvidos AQUI, a partir do código da unidade. A equipe
       responde direto para o interessado; o interessado responde para uma
       caixa monitorada. */
    const finalDestinatarios: Array<{
      email: string
      subject: string
      template: string
      replyTo: string
    }> = managerEmails.map(email => ({
      email,
      subject: `Nova solicitação de aula experimental - ${safeData.qual_unidade} - FP-${numeroProtocolo}`,
      template: 'empresa',
      replyTo: emailInteressado,
    }));

    // Confirmação para o interessado
    finalDestinatarios.push({
      email: emailInteressado,
      subject: `Aula experimental solicitada - FP-${numeroProtocolo} - Flex Fitness`,
      template: 'cliente',
      replyTo: MAIL_REPLY_TO,
    });

    // Templates
    const templates = {
      empresa: templateEmpresa,
      cliente: templateCliente
    };

    console.log(`📧 Enviando para ${finalDestinatarios.length} destinatários...`);

    // ENVIO SEQUENCIAL com delay
    const results = [];
    const errors = [];

    for (let i = 0; i < finalDestinatarios.length; i++) {
      const dest = finalDestinatarios[i];
      
      try {
        console.log(`📧 Enviando email ${i + 1}/${finalDestinatarios.length} para: ${dest.email}`);
        
        const template = templates[dest.template as keyof typeof templates];
        if (!template) {
          throw new Error(`Template '${dest.template}' não encontrado`);
        }

        const result = await mailer.emails.send({
          from: MAIL_FROM,
          to: [dest.email],
          replyTo: dest.replyTo,
          subject: dest.subject,
          html: template(formattedEmailData),
        });

        const id = garantirEnvio(result);
        console.log(`Email ${i + 1} enviado. ID: ${id}`);
        results.push(result);

        // Delay de 500ms entre envios para evitar rate limit
        if (i < finalDestinatarios.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.error(`❌ Erro ao enviar email ${i + 1} para ${dest.email}:`, error);
        errors.push({
          email: dest.email,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        
        continue;
      }
    }

    
    if (errors.length > 0) {
      console.log('🚨 Detalhes dos erros:', errors);
    }

    if (results.length > 0) {
      console.log('🎯 IDs dos emails enviados:', results.map(r => r.data?.id));
    }

    return NextResponse.json({ 
      success: results.length > 0,
      message: results.length > 0
        ? `Solicitação enviada. ${results.length} de ${finalDestinatarios.length} e-mails entregues ao provedor.`
        : 'Não foi possível enviar sua solicitação agora. Tente novamente ou fale conosco pelo WhatsApp.',
      protocolo: numeroProtocolo,
      enviado_para: managerEmails.join(', '),
      confirmacao_cliente: true,
      enviados: results.length,
      erros: errors.length,
      detalhes_erros: errors.length > 0 ? errors : undefined,
      ids: results.map(r => r.data?.id).filter(Boolean)
    });

  } catch (error) {
    console.error('💥 Erro geral ao solicitar aula experimental:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}