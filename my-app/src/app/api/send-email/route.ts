// app/api/send-email/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

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
          <p style="color: #666;">Sua solicitação foi <strong>concluída com sucesso</strong>.</p>

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
            <p style="color: #1976d2; margin: 0;">Nossa equipe entrará em contato em até <strong>24 horas úteis</strong> através do WhatsApp informado para dar continuidade ao seu procedimento.</p>
          </div>

          <!-- Rodapé -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
            <p><strong>Flex Fitness</strong><br>
            Transformando vidas através do movimento</p>
            <p style="font-size: 12px;">Este é um e-mail automático. Guarde este comprovante para seus registros.</p>
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
              <td style="padding: 8px; border: 1px solid #ddd;">${data.detalhes}</td>
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { destinatarios, ...emailData } = data;

    // Log para debug
    console.log('📤 Iniciando envio para:', { quantidade: destinatarios.length });

    // Enviar emails sequencialmente com delay para evitar rate limit
    const results = [];
    const errors = [];

    for (let i = 0; i < destinatarios.length; i++) {
      const dest = destinatarios[i];
      
      try {
        console.log(`📧 Enviando email ${i + 1}/${destinatarios.length} para: ${dest.email}`);
        
        // Escolher o template
        const template = templates[dest.template as keyof typeof templates];
        if (!template) {
          throw new Error(`Template '${dest.template}' não encontrado`);
        }

        // Preparar dados específicos para este destinatário
        const dadosEspecificos = {
          ...emailData,
          anexo: dest.anexo || '',
          nome_arquivo: dest.nome_arquivo || ''
        };

        // Preparar anexos se existirem
        const attachments = dest.anexo ? [{
          filename: dest.nome_arquivo || 'documento.pdf',
          content: dest.anexo.split(',')[1] || dest.anexo, // Remove "data:type;base64," se existir
        }] : [];

        const result = await resend.emails.send({
          from: 'Flex Fitness <noreply@flexfitnesscenter.com.br>',
          to: [dest.email],
          subject: dest.subject,
          html: template(dadosEspecificos),
          attachments: attachments,
        });

        console.log(`✅ Email ${i + 1} enviado com sucesso! ID: ${result.data?.id}`);
        results.push(result);

        // Delay de 500ms entre envios para evitar rate limit
        if (i < destinatarios.length - 1) {
          console.log('⏳ Aguardando 500ms antes do próximo envio...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.error(`❌ Erro ao enviar email ${i + 1} para ${dest.email}:`, error);
        errors.push({
          email: dest.email,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        
        // Continue tentando os próximos emails mesmo se um falhar
        continue;
      }
    }

    // Log dos resultados finais
    console.log('📊 RESUMO FINAL DO ENVIO:');
    console.log(`✅ Emails enviados com sucesso: ${results.length}`);
    console.log(`❌ Emails com erro: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('🚨 Detalhes dos erros:', errors);
    }

    if (results.length > 0) {
      console.log('🎯 IDs dos emails enviados:', results.map(r => r.data?.id));
    }

    // Retornar resultado mesmo se houver alguns erros
    return NextResponse.json({ 
      success: results.length > 0, // Sucesso se pelo menos um foi enviado
      message: `${results.length} de ${destinatarios.length} emails enviados com sucesso${errors.length > 0 ? `, ${errors.length} com erro` : ''}`,
      enviados: results.length,
      erros: errors.length,
      detalhes_erros: errors.length > 0 ? errors : undefined,
      ids: results.map(r => r.data?.id).filter(Boolean),
      enviados_para: destinatarios
        .filter((_: any, i: number) => i < results.length)
        .map((d: any) => d.email)
        .join(', '),
      total_tentativas: destinatarios.length
    });

  } catch (error) {
    console.error('💥 Erro geral no servidor:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}