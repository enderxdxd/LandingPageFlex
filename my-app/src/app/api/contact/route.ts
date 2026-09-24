import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import {
  MAIL_FROM,
  MAIL_REPLY_TO,
  cleanRecipientList,
  isBot,
  normalizeEmail,
  rateLimit,
  sanitizeDeep,
} from '@/lib/api/security';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template para a empresa
const templateEmpresa = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Contato - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        
        <h2 style="color: #007bff; margin: 0 0 20px 0;">📞 NOVO CONTATO RECEBIDO</h2>
        
        <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong>Data:</strong> ${data.data_contato}<br>
          <strong>Protocolo:</strong> CONT-${data.numero_protocolo}
        </div>

        <h3>📋 Dados do Contato</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Nome</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.nome}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Telefone</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.telefone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">E-mail</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Unidade de Interesse</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.unidade}</td>
          </tr>
        </table>

        <h3>💬 Mensagem:</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; margin: 20px 0;">
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.mensagem}</p>
        </div>

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <strong>⚠️ AÇÃO NECESSÁRIA:</strong><br>
          Entre em contato com o cliente através do telefone ${data.telefone} ou e-mail ${data.email} em até 24 horas úteis.
        </div>

      </div>
    </div>
  </body>
  </html>
`;

// Template de confirmação para o cliente
const templateCliente = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato Recebido - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Cabeçalho -->
        <div style="text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #007bff; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
          <div style="background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
            📞 CONTATO RECEBIDO
          </div>
        </div>

        <!-- Saudação -->
        <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome}</strong>,</p>
        <p style="color: #666;">Seu contato foi <strong>recebido com sucesso</strong>!</p>

        <!-- Protocolo -->
        <div style="background: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <strong>Protocolo: CONT-${data.numero_protocolo}</strong><br>
          <small>Data: ${data.data_contato}</small>
        </div>

        <!-- Resumo do contato -->
        <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📝 Resumo do seu contato</h3>
        
        <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1976d2;"><strong>Unidade de interesse:</strong> ${data.unidade}</p>
          <p style="margin: 10px 0 0 0; color: #1976d2; line-height: 1.6;">"${String(data.mensagem ?? '').substring(0, 150)}${String(data.mensagem ?? '').length > 150 ? '…' : ''}"</p>
        </div>

        <!-- Próximos Passos -->
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">🚀 O que acontece agora?</h4>
          <ul style="color: #059669; margin: 0; padding-left: 20px;">
            <li>Nossa equipe vai analisar sua mensagem</li>
            <li>Entraremos em contato em até 24 horas úteis</li>
            <li>Forneceremos todas as informações solicitadas</li>
            <li>Agendaremos uma visita se necessário</li>
          </ul>
        </div>

        <!-- Agradecimento -->
        <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">🙏 Muito Obrigado!</h3>
          <p style="color: #1976d2; margin: 0;">Estamos ansiosos para atendê-lo e mostrar como podemos transformar sua vida através do movimento.</p>
        </div>

        <!-- Rodapé -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
          <p><strong>Flex Fitness</strong><br>
          Transformando vidas através do movimento</p>
          <p style="font-size: 12px;">Este é um e-mail automático. Guarde este comprovante para seus registros.</p>
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin-top: 15px; border-radius: 4px;">
            <p style="color: #856404; margin: 0; font-size: 12px;"><strong>💡 Dica:</strong> Se não receber nossa resposta, verifique sua pasta de spam/lixo eletrônico.</p>
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
`;

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
        subject: `📞 Novo Contato - ${safeData.unidade} - CONT-${numeroProtocolo}`,
        template: 'empresa',
        replyTo: emailInteressado,
      })),
      // Confirmação para o interessado
      {
        email: emailInteressado,
        subject: `📞 Contato Recebido - CONT-${numeroProtocolo} - Flex Fitness`,
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

      return resend.emails.send({
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