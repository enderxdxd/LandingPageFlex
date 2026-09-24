// app/api/send-email/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
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

const resend = new Resend(process.env.RESEND_API_KEY);

// Templates como funções (muito mais flexível que EmailJS!)
const templates = {
  comprovante: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Comprovante - Flex Fitness</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Cabeçalho -->
          <div style="text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #007bff; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
            <div style="background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
              ✅ SOLICITAÇÃO RECEBIDA
            </div>
          </div>

          <!-- Saudação -->
          <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome_cliente}</strong>,</p>

          <!-- Protocolo -->
          <div style="background: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>Protocolo: ${data.numero_solicitacao}</strong><br>
            <small>Data: ${data.data_solicitacao}</small>
          </div>

          <!-- Dados da Solicitação -->
          <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📋 Dados da Solicitação</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Unidade</td>
              <td style="padding: 12px; background: white;">${data.unidade}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Procedimento</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.procedimento}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Motivo</td>
              <td style="padding: 12px; background: white;">${data.motivo}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Detalhes</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.detalhes}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">WhatsApp</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">E-mail</td>
              <td style="padding: 12px; background: white;">${data.email_cliente}</td>
            </tr>
          </table>

          <!-- Blocos Condicionais -->
          ${data.resgate_block || ''}
          ${data.cancelamento_block || ''}

          <!-- Próximos Passos -->
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #1976d2; margin: 0 0 10px 0;">📞 Próximos Passos</h4>
            <p style="color: #1976d2; margin: 0;">Nossa equipe entrará em contato em até através do WhatsApp informado para dar continuidade ao seu procedimento.</p>
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
  `,

  cancelamento: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cancelamento - Assinatura Digital - Flex Fitness</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Cabeçalho -->
          <div style="text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #007bff; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
            <div style="background: #ffc107; color: #212529; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
              📋 ASSINATURA NECESSÁRIA
            </div>
          </div>

          <!-- Saudação -->
          <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome_cliente}</strong>,</p>
          <p style="color: #666;">Recebemos sua solicitação de <strong>cancelamento</strong>.</p>

          <!-- Protocolo -->
          <div style="background: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>Protocolo: ${data.numero_solicitacao}</strong><br>
            <small>Data: ${data.data_solicitacao}</small>
          </div>

          <!-- Ação Necessária -->
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #856404; margin: 0 0 15px 0;">⚠️ AÇÃO NECESSÁRIA</h3>
            <p style="color: #856404; margin: 0 0 15px 0; font-size: 16px;">
              Para prosseguirmos com o seu cancelamento, precisamos confirmar sua solicitação através da <strong>assinatura digital</strong>.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${data.link_assinatura}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                ✍️ ASSINAR DOCUMENTO
              </a>
            </div>
            
            <p style="color: #856404; margin: 15px 0 0 0; font-size: 14px;">
              <strong>Link direto:</strong> <a href="${data.link_assinatura}" style="color: #007bff;">${data.link_assinatura}</a>
            </p>
          </div>

          <!-- Dados da Solicitação -->
          <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📋 Dados da Solicitação</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Unidade</td>
              <td style="padding: 12px; background: white;">${data.unidade}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Procedimento</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.procedimento}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Motivo</td>
              <td style="padding: 12px; background: white;">${data.motivo}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Detalhes</td>
              <td style="padding: 12px; background: white;">${data.detalhes}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">WhatsApp</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">E-mail</td>
              <td style="padding: 12px; background: white;">${data.email_cliente}</td>
            </tr>
          </table>

          <!-- Aviso sobre prazo -->
          <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #721c24; margin: 0 0 10px 0;">📅 Importante sobre o prazo</h4>
            <p style="color: #721c24; margin: 0;">Em caso de solicitação de rescisão o prazo é de <strong>ATÉ 40 DIAS</strong>.</p>
          </div>

          <!-- Próximos Passos -->
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #1976d2; margin: 0 0 10px 0;">📞 Próximos Passos</h4>
            <ol style="color: #1976d2; margin: 0; padding-left: 20px;">
              <li>Clique no link acima para assinar o documento</li>
              <li>Após a assinatura, nossa equipe processará seu cancelamento</li>
            </ol>
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
  `,

  'cessao-plano': (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Termo de Cessão de Plano - Flex Fitness</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <div style="text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #007bff; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
            <div style="background: #ffc107; color: #212529; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
              📋 CONFIRMAÇÃO NECESSÁRIA
            </div>
          </div>

          <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome_cliente}</strong>,</p>
          <p style="color: #666;">Recebemos sua solicitação de <strong>Transferência de Dias</strong>.</p>

          <div style="background: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>Protocolo: ${data.numero_solicitacao}</strong><br>
            <small>Data: ${data.data_solicitacao}</small>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #856404; margin: 0 0 15px 0;">⚠️ AÇÃO NECESSÁRIA</h3>
            <p style="color: #856404; margin: 0 0 15px 0; font-size: 16px;">
              Para prosseguirmos, confirme o <strong>Termo de Cessão de Plano</strong> no link abaixo.
            </p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${data.link_assinatura}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                ✍️ CONFIRMAR DOCUMENTO
              </a>
            </div>

            <p style="color: #856404; margin: 15px 0 0 0; font-size: 14px; overflow-wrap: anywhere;">
              <strong>Link direto:</strong> <a href="${data.link_assinatura}" style="color: #007bff;">${data.link_assinatura}</a>
            </p>
          </div>

          <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📋 Dados da Solicitação</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Unidade</td>
              <td style="padding: 12px; background: white;">${data.unidade}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Procedimento</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.procedimento}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Motivo</td>
              <td style="padding: 12px; background: white;">${data.motivo}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #007bff; color: white; font-weight: bold;">Detalhes</td>
              <td style="padding: 12px; background: #f8f9fa;">${data.detalhes}</td>
            </tr>
          </table>

          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #1976d2; margin: 0 0 10px 0;">📞 Próximos Passos</h4>
            <ol style="color: #1976d2; margin: 0; padding-left: 20px;">
              <li>Clique no link acima e confirme o documento</li>
              <li>Após a confirmação, nossa equipe dará continuidade à transferência</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
            <p><strong>Flex Fitness</strong><br>Transformando vidas através do movimento</p>
            <p style="font-size: 12px;">Este é um e-mail automático. Guarde este comprovante para seus registros.</p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `,

  empresa: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nova Solicitação - Flex Fitness</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          
          <h2 style="color: #dc3545; margin: 0 0 20px 0;">🚨 NOVA SOLICITAÇÃO RECEBIDA</h2>
          
          <p><strong>Segue dados da solicitação realizada pelo site.</strong></p>
          <p>Lembrando que o procedimento leva em consideração a data de solicitação para os cálculos.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Data Solicitação:</strong> ${data.data_solicitacao}<br>
            <strong>Protocolo:</strong> ${data.numero_solicitacao}
          </div>

          <h3>📋 Dados Completos da Solicitação</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Unidade</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.unidade}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Procedimento</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.procedimento}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Motivo</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.motivo}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Nome Cliente</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.nome_cliente}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">WhatsApp</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">E-mail</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.email_cliente}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Matrícula</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.matricula}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Data Início</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.data_inicio}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Data Fim</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.data_fim}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Detalhes</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.detalhes || 'Nenhum detalhe informado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Anexo</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.nome_arquivo || 'Nenhum arquivo anexado'}</td>
            </tr>
          </table>

          ${data.resgate_block || ''}
          ${data.cancelamento_block || ''}

          ${data.link_assinatura && data.link_assinatura !== 'Não se aplica' ? `
            <div style="background: #e1f5fe; border-left: 4px solid #0277bd; padding: 15px; margin: 20px 0;">
              <h4 style="color: #0277bd; margin: 0 0 10px 0;">🔗 Link para Assinatura Digital</h4>
              <p style="color: #0277bd; margin: 0;">
                <a href="${data.link_assinatura}" style="color: #0277bd;">${data.link_assinatura}</a>
              </p>
            </div>
          ` : ''}

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <strong>⚠️ AÇÃO NECESSÁRIA:</strong><br>
            Entre em contato com o cliente através do WhatsApp ${data.whatsapp}.
          </div>

        </div>
      </div>
    </body>
    </html>
  `
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
  cancelamento: 'https://app.zapsign.com.br/verificar/doc/7e0e84ef-36ac-432d-b60e-614136502106',
  'transferencia-dias': 'https://app.zapsign.com.br/verificar/doc/1b8f4550-b9ec-42dd-9a94-02a9c5235fd9',
};

/* Os dois blocos condicionais são HTML montado pelo SERVIDOR, e por isso
   entram depois do escape — nunca vêm do corpo da requisição. */
const RESGATE_BLOCK = `<div style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0;">
  <h4 style="color:#856404;margin:0 0 10px 0;">Sobre resgate de cheques:</h4>
  <p style="color:#856404;margin:0;">O processo para resgate de cheques só poderá ser efetuado após o pagamento total dos cheques a serem resgatados + a taxa de resgate.</p>
  </div>`;

const CANCELAMENTO_BLOCK = `<div style="background:#f8d7da;padding:15px;border-left:4px solid #dc3545;margin:20px 0;">
  <h4 style="color:#721c24;margin:0 0 10px 0;">Em caso de solicitação de rescisão:</h4>
  <p style="color:#721c24;margin:0;">O prazo é de <strong>ATÉ 40 DIAS</strong>.</p>
  </div>`;

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

    const clientTemplate = isCancelamento
      ? 'cancelamento'
      : isTransferenciaDias
        ? 'cessao-plano'
        : 'comprovante';

    const clientSubject = isCancelamento
      ? `📋 Confirmação Necessária - Cancelamento ${numeroSolicitacao} - Flex Fitness`
      : isTransferenciaDias
        ? `📋 Confirmação Necessária - Termo de Cessão de Plano ${numeroSolicitacao} - Flex Fitness`
        : `✅ Comprovante de Solicitação - ${numeroSolicitacao} - Flex Fitness`;

    const clientSignatureLink = isCancelamento
      ? signatureLinks.cancelamento
      : isTransferenciaDias
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
        subject: `🚨 Nova Solicitação - ${safeData.procedimento} - ${numeroSolicitacao}`,
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

        const result = await resend.emails.send({
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
