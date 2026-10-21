// app/api/send-email/route.ts
import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';
import { folha, secao, dados, paragrafo, citacao, aviso, botao } from '@/lib/email/layout';
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


/**
 * Os quatro templates de procedimento.
 *
 * `resgate_block` e `cancelamento_block` continuam sendo HTML montado pelo
 * SERVIDOR (constantes mais abaixo) e entram crus de propósito — são a única
 * exceção ao contrato de escape do kit, e nunca vêm do visitante.
 */
const templates = {
  comprovante: (data: any) =>
    folha({
      assunto: `Comprovante ${data.numero_solicitacao}`,
      previa: `Sua solicitacao de ${data.procedimento} foi registrada.`,
      etiqueta: `Solicitação ${data.numero_solicitacao}`,
      titulo: 'Solicitação registrada',
      corpo: [
        paragrafo(`Olá, ${data.nome_cliente}.`),
        paragrafo('Sua solicitação foi registrada e encaminhada para a equipe da unidade. Guarde este comprovante.'),
        secao('Dados da solicitação'),
        dados([
          ['Procedimento', data.procedimento],
          ['Motivo', data.motivo],
          ['Unidade', data.unidade],
          ['Matrícula', data.matricula],
          ['Início', data.data_inicio],
          ['Fim', data.data_fim],
          ['Registrada em', data.data_solicitacao],
        ]),
        data.detalhes ? secao('Detalhes informados') : '',
        data.detalhes ? citacao(data.detalhes) : '',
        data.resgate_block ?? '',
      ].join(''),
      rodape: 'Dúvidas sobre o andamento: fale com a recepção da sua unidade.',
    }),

  'cessao-plano': (data: any) =>
    folha({
      assunto: `Confirmacao necessaria - Cessao de plano ${data.numero_solicitacao}`,
      previa: 'Falta assinar o termo de cessao de plano.',
      etiqueta: `Solicitação ${data.numero_solicitacao}`,
      titulo: 'Falta assinar o termo de cessão',
      corpo: [
        paragrafo(`Olá, ${data.nome_cliente}.`),
        paragrafo('Registramos sua solicitação de transferência de dias. Para seguir, assine o termo de cessão no link abaixo.'),
        data.link_assinatura ? botao('Assinar o termo', data.link_assinatura) : '',
        secao('Dados da solicitação'),
        dados([
          ['Procedimento', data.procedimento],
          ['Unidade', data.unidade],
          ['Matrícula', data.matricula],
          ['Início', data.data_inicio],
          ['Fim', data.data_fim],
          ['Registrada em', data.data_solicitacao],
        ]),
      ].join(''),
      rodape: 'Enquanto o termo não for assinado, a solicitação fica parada.',
    }),

  empresa: (data: any) =>
    folha({
      assunto: `Nova solicitacao - ${data.procedimento} - ${data.numero_solicitacao}`,
      previa: `${data.nome_cliente} abriu uma solicitacao de ${data.procedimento}.`,
      etiqueta: `Solicitação ${data.numero_solicitacao}`,
      titulo: 'Nova solicitação de procedimento',
      corpo: [
        paragrafo(`Aberta em ${data.data_solicitacao}.`),
        secao('Solicitante'),
        dados([
          ['Nome', data.nome_cliente],
          ['Matrícula', data.matricula],
          ['WhatsApp', data.whatsapp],
          ['E-mail', data.email_cliente],
        ]),
        secao('Solicitação'),
        dados([
          ['Procedimento', data.procedimento],
          ['Motivo', data.motivo],
          ['Unidade', data.unidade],
          ['Início', data.data_inicio],
          ['Fim', data.data_fim],
          ['Anexo', data.nome_arquivo],
        ]),
        data.detalhes ? secao('Detalhes informados') : '',
        data.detalhes ? citacao(data.detalhes) : '',
        data.cancelamento_block ?? '',
        data.resgate_block ?? '',
        aviso('Responder este e-mail fala direto com a pessoa solicitante.'),
      ].join(''),
    }),
};

/**
 * Destinatários por unidade e links de assinatura.
 *
 * Estavam no componente de `/procedimentos`, o que significava que a lista de
 * quem recebe cada solicitação viajava dentro do corpo da requisição — e esta
 * rota obedecia. Era o pior dos cinco relays: destinatário, assunto, template
 * E anexo, todos escolhidos por quem chamasse a API. Agora moram aqui.
 */
const unitRecipients: Record<string, string> = {
  'marista': 'jonatas@flexacademia.com.br,hudson@flexacademia.com.br,comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br,vendasmarista@flexacademia.com.br',
  'buena-vista': 'vendasflexbuenavista@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br,hudson@flexacademia.com.br,comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br',
  'alphaville': 'hudson@flexacademia.com.br,comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br,vendas.alphaville@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br',
  'palmas': 'comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,financeiro@flexacademia.com.br,vendaspalmas@flexacademia.com.br,gestaotecnica@flexpalmas.com.br,atendimento@paresconsultoria.com.br',
};

const signatureLinks: Record<string, string> = {
  'transferencia-dias': 'https://app.zapsign.com.br/verificar/doc/1b8f4550-b9ec-42dd-9a94-02a9c5235fd9',
};

/* Os dois blocos condicionais são HTML montado pelo SERVIDOR, e por isso
   entram depois do escape — nunca vêm do corpo da requisição. */
/* Estes dois eram HTML cru com caixa amarela e caixa vermelha de borda grossa —
   sobravam do template antigo e destoavam do resto do e-mail. Agora saem do
   mesmo kit que o corpo, então herdam a paleta e o espaçamento. */
const RESGATE_BLOCK = aviso(
  'Resgate de cheques: o processo só pode ser efetuado após o pagamento total dos cheques a resgatar, somado à taxa de resgate.'
);

const CANCELAMENTO_BLOCK = aviso('O prazo para a rescisão é de até 40 dias.', { destaque: true });

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { scope: 'procedimentos', limit: 5, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    const rawData = await request.json();

    if (isBot(rawData)) {
      return NextResponse.json({ success: true, message: 'Solicitação recebida' });
    }

    /* `destinatarios` descartado. Esta rota antes enviava EXCLUSIVAMENTE com
       base nele: sem lista padrão, sem validação, com anexo arbitrário. */
    const { destinatarios: _ignorado, ...emailData } = rawData;

    const emailCliente = normalizeEmail(emailData.email_cliente);
    if (!emailCliente) {
      return NextResponse.json(
        { success: false, error: 'Informe um e-mail válido para receber o comprovante.' },
        { status: 400 }
      );
    }

    const unidadeCode = String(emailData.unidade_codigo ?? '');
    const managerEmails = cleanRecipientList(unitRecipients[unidadeCode] ?? '');
    if (managerEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Unidade não encontrada no sistema' },
        { status: 400 }
      );
    }

    const procedimentoCode = String(emailData.procedimento_codigo ?? '');
    const isCancelamento = procedimentoCode === 'cancelamento';
    const isTransferenciaDias = procedimentoCode === 'transferencia-dias';

    const numeroSolicitacao = `FLEX-${Date.now().toString().slice(-6)}`;
    const dataFormatada = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    /* `anexo` fica fora do escape: é base64 do arquivo enviado. */
    const safeData = sanitizeDeep(emailData, ['anexo']);

    const anexoBase64 = typeof emailData.anexo === 'string' ? emailData.anexo : '';
    const nomeArquivo = typeof safeData.nome_arquivo === 'string' && safeData.nome_arquivo
      ? safeData.nome_arquivo
      : 'documento.pdf';

    const attachments = anexoBase64.trim() !== ''
      ? [{
          filename: nomeArquivo,
          content: anexoBase64.includes(',') ? anexoBase64.split(',')[1] : anexoBase64,
        }]
      : [];

    /* Cancelamento não pede mais assinatura: a pessoa recebe o comprovante
       normal, com o prazo de 40 dias no corpo. A etapa de assinatura digital
       saiu do fluxo por decisão de operação. `transferencia-dias` continua
       exigindo o termo de cessão. */
    const clientTemplate = isTransferenciaDias ? 'cessao-plano' : 'comprovante';

    const clientSubject = isTransferenciaDias
      ? `Confirmação necessária - Termo de cessão de plano ${numeroSolicitacao} - Flex Fitness`
      : `Comprovante de solicitação - ${numeroSolicitacao} - Flex Fitness`;

    const clientSignatureLink = isTransferenciaDias
      ? signatureLinks['transferencia-dias']
      : '';

    const formattedEmailData = {
      ...safeData,
      numero_solicitacao: numeroSolicitacao,
      data_solicitacao: dataFormatada,
      // blocos gerados aqui, depois do escape
      resgate_block: procedimentoCode.includes('resgate-cheque') ? RESGATE_BLOCK : '',
      cancelamento_block: isCancelamento ? CANCELAMENTO_BLOCK : '',
    };

    /* Cliente primeiro (sem anexo), equipe depois (com anexo). */
    const finalDestinatarios: Array<{
      email: string
      subject: string
      template: string
      link_assinatura: string
      attachments: any[]
      replyTo: string
    }> = [
      {
        email: emailCliente,
        subject: clientSubject,
        template: clientTemplate,
        link_assinatura: clientSignatureLink,
        attachments: [],
        replyTo: MAIL_REPLY_TO,
      },
      ...managerEmails.map(email => ({
        email,
        subject: `Nova solicitação - ${safeData.procedimento} - ${numeroSolicitacao}`,
        template: 'empresa',
        link_assinatura: '',
        attachments,
        replyTo: emailCliente,
      })),
    ];

    console.log('Iniciando envio de procedimento:', {
      protocolo: numeroSolicitacao,
      unidade: unidadeCode,
      procedimento: procedimentoCode,
      destinatarios: finalDestinatarios.length,
    });

    // Enviar emails sequencialmente com delay para evitar rate limit
    const results = [];
    const errors = [];

    for (let i = 0; i < finalDestinatarios.length; i++) {
      const dest = finalDestinatarios[i];

      try {
        const template = templates[dest.template as keyof typeof templates];
        if (!template) {
          throw new Error(`Template '${dest.template}' não encontrado`);
        }

        const dadosEspecificos = {
          ...formattedEmailData,
          link_assinatura: dest.link_assinatura,
          nome_arquivo: nomeArquivo,
        };

        const result = await mailer.emails.send({
          from: MAIL_FROM,
          to: [dest.email],
          replyTo: dest.replyTo,
          subject: dest.subject,
          html: template(dadosEspecificos),
          attachments: dest.attachments,
        });

        const id = garantirEnvio(result);
        console.log(`Email ${i + 1} enviado. ID: ${id}`);
        results.push(result);

        if (i < finalDestinatarios.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.error(`Erro ao enviar email ${i + 1}:`, error);
        errors.push({
          email: dest.email,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        continue;
      }
    }

    console.log(`RESUMO: ${results.length} enviados, ${errors.length} com erro`);

    return NextResponse.json({
      success: results.length > 0,
      message: `${results.length} de ${finalDestinatarios.length} emails enviados com sucesso`,
      protocolo: numeroSolicitacao,
      enviados: results.length,
      erros: errors.length,
      detalhes_erros: errors.length > 0 ? errors : undefined,
      ids: results.map(r => r.data?.id).filter(Boolean),
    });

  } catch (error) {
    console.error('Erro geral no servidor:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
