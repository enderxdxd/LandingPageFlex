import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';
import { folha, secao, dados, paragrafo, citacao, aviso, lista, botao, divisor } from '@/lib/email/layout';
import {
  MAIL_FROM,
  MAIL_REPLY_TO,
  cleanRecipientList,
  isBot,
  normalizeEmail,
  rateLimit,
  sanitizeDeep,
} from '@/lib/api/security';


const templateEmpresa = (data: any) =>
  folha({
    assunto: `Novo contato - ${data.unidade} - CONT-${data.numero_protocolo}`,
    previa: `${data.nome} entrou em contato pela unidade ${data.unidade}.`,
    etiqueta: `Protocolo CONT-${data.numero_protocolo}`,
    titulo: 'Novo contato pelo site',
    corpo: [
      paragrafo(`Recebido em ${data.data_contato}. Retorne em até 24 horas úteis.`),
      secao('Dados do contato'),
      dados([
        ['Nome', data.nome],
        ['Unidade', data.unidade],
        ['Telefone', data.telefone],
        ['E-mail', data.email],
      ]),
      secao('Mensagem'),
      citacao(data.mensagem ?? ''),
      aviso('Responder este e-mail fala direto com a pessoa que escreveu.'),
    ].join(''),
  });

const templateCliente = (data: any) =>
  folha({
    assunto: `Contato recebido - CONT-${data.numero_protocolo}`,
    previa: 'Recebemos sua mensagem. Retornamos em ate 24 horas uteis.',
    etiqueta: `Protocolo CONT-${data.numero_protocolo}`,
    titulo: 'Recebemos sua mensagem',
    corpo: [
      paragrafo(`Olá, ${data.nome}.`),
      paragrafo(
        'Sua mensagem chegou para a equipe da unidade escolhida. Retornamos em até 24 horas úteis.'
      ),
      secao('Resumo'),
      dados([
        ['Unidade', data.unidade],
        ['Enviado em', data.data_contato],
      ]),
      secao('O que você escreveu'),
      citacao(String(data.mensagem ?? '').substring(0, 400)),
      botao('Ver as unidades', 'https://www.flexfitnesscenter.com.br/#localizacao'),
    ].join(''),
    rodape: 'Se não encontrar nossa resposta, confira a pasta de spam.',
  });

// Mapeia destinatários por unidade para contatos
const unitRecipients: Record<string, string> = {
  'marista':     'henriquepcosta@hotmail.com',
  /* Estes dois apontavam para `@flex.com`, dominio que nao e da rede: hard
     bounce garantido a cada contato dessas duas unidades, e portanto dano
     direto e continuo a reputacao de envio do dominio. Os enderecos abaixo sao
     os mesmos que send-freepass ja usa para as mesmas unidades. */
  'buena-vista': 'vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br',
  'alphaville':  'vendas.alphaville@flexacademia.com.br,comercial.atendimento@flexacademia.com.br',
  'palmas':      'comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,financeiro@flexacademia.com.br,COMERCIAL@FLEXPALMAS.COM.BR,gestaotecnica@flexpalmas.com.br',
  'geral':       'henriquepcosta@hotmail.com', 
};

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { scope: 'contato', limit: 5, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    const rawData = await request.json();

    if (isBot(rawData)) {
      return NextResponse.json({ success: true, message: 'Contato recebido' });
    }

    /* `destinatarios` descartado: vinha do cliente e virava relay aberto. */
    const { destinatarios: _ignorado, ...emailData } = rawData;

    const emailInteressado = normalizeEmail(emailData.email);
    if (!emailInteressado) {
      return NextResponse.json(
        { error: 'Informe um e-mail válido para receber a confirmação.' },
        { status: 400 }
      );
    }

    // Log para debug
    console.log('Enviando contato:', {
      nome: emailData.nome,
      unidade: emailData.unidade
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    /* Cada unidade guarda a lista separada por vírgula numa string só. Ela
       precisa virar um endereço por envio: "a@x.com,b@x.com" dentro de um
       único `to` não é endereço nenhum — o Resend rejeita e isso volta como
       falha de entrega. */
    const flexCode = emailData.codigo_flex || 'geral';
    const managerEmails = cleanRecipientList(unitRecipients[flexCode] || '');

    if (managerEmails.length === 0) {
      throw new Error('Unidade não encontrada no sistema');
    }

    const safeData = sanitizeDeep(emailData);

    // Dados formatados
    const formattedEmailData = {
      ...safeData,
      numero_protocolo: numeroProtocolo,
      data_contato: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    };

    // Destinatários resolvidos no servidor, um endereço por envio
    const finalDestinatarios = [
      // Equipe da unidade — responder fala direto com o interessado
      ...managerEmails.map(email => ({
        email,
        subject: `Novo contato - ${safeData.unidade} - CONT-${numeroProtocolo}`,
        template: 'empresa',
        replyTo: emailInteressado,
      })),
      // Confirmação para o interessado
      {
        email: emailInteressado,
        subject: `Contato recebido - CONT-${numeroProtocolo} - Flex Fitness`,
        template: 'cliente',
        replyTo: MAIL_REPLY_TO,
      }
    ];

    // Templates
    const templates = {
      empresa: templateEmpresa,
      cliente: templateCliente
    };

    // Envia emails para múltiplos destinatários
    const emailPromises = finalDestinatarios.map((dest: any) => {
      const template = templates[dest.template as keyof typeof templates];
      if (!template) {
        throw new Error(`Template '${dest.template}' não encontrado`);
      }

      return mailer.emails.send({
        from: MAIL_FROM,
        to: [dest.email],
        replyTo: dest.replyTo,
        subject: dest.subject,
        html: template({ ...formattedEmailData, ...dest }),
      });
    });

    const results = await Promise.all(emailPromises);

    /* O SDK do Resend devolve o erro no retorno em vez de lançar, entao um
       Promise.all "bem-sucedido" pode conter seis recusas. Sem esta conta, a
       rota responderia sucesso com zero e-mail entregue. */
    const recusados = results.filter(r => r.error);
    if (recusados.length === results.length) {
      const motivo = recusados[0]?.error?.message ?? 'sem detalhe';
      throw new Error(`Nenhum e-mail foi aceito pelo provedor: ${motivo}`);
    }
    if (recusados.length > 0) {
      console.error('Envios recusados pelo provedor:', recusados.map(r => r.error?.message));
    }

    console.log('Emails enviados:', results.filter(r => r.data?.id).map(r => r.data?.id));

    return NextResponse.json({ 
      success: true, 
      message: 'Contato enviado com sucesso',
      protocolo: numeroProtocolo,
      enviado_para: managerEmails.join(', '),
      confirmacao_cliente: true,
      ids: results.map(r => r.data?.id)
    });

  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 