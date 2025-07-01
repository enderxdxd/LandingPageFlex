// app/api/send-sugestoes/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template da empresa para sugestões
const templateEmpresa = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Sugestão - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        
        <h2 style="color: #f59e0b; margin: 0 0 20px 0;">💡 NOVA SUGESTÃO RECEBIDA</h2>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong>Data:</strong> ${data.data_sugestao}<br>
          <strong>Protocolo:</strong> SUG-${data.numero_protocolo}
        </div>

        <h3>📋 Dados da Sugestão</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Nome</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.nome}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Telefone</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.telefone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Sou</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.sou}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Sugestão para qual Flex ?</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.qual_flex}</td>
          </tr>
        </table>

        <h3>💬 Sugestão informada:</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.sugestao}</p>
        </div>

        ${data.quantidade_fotos > 0 ? `
          <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 15px; margin: 20px 0;">
            <h4 style="color: #0277bd; margin: 0 0 10px 0;">📸 Fotos Anexadas</h4>
            <p style="color: #0277bd; margin: 0;">
              <strong>${data.quantidade_fotos} foto(s)</strong> foram enviadas junto com esta sugestão.
            </p>
            <p style="color: #0277bd; margin: 5px 0 0 0; font-size: 14px;">
              Fotos: ${data.nomes_fotos}
            </p>
          </div>
        ` : ''}

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <strong>⚠️ AÇÃO NECESSÁRIA:</strong><br>
          Analise esta sugestão e considere implementá-la para melhorar a experiência dos clientes.
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
    <title>Sugestão Recebida - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Cabeçalho -->
        <div style="text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
          <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
            💡 SUGESTÃO RECEBIDA
          </div>
        </div>

        <!-- Saudação -->
        <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome}</strong>,</p>
        <p style="color: #666;">Sua sugestão foi <strong>recebida com sucesso</strong>!</p>

        <!-- Protocolo -->
        <div style="background: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <strong>Protocolo: SUG-${data.numero_protocolo}</strong><br>
          <small>Data: ${data.data_sugestao}</small>
        </div>

        <!-- Resumo da sugestão -->
        <h3 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">📝 Resumo da sua sugestão</h3>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #92400e;"><strong>Para:</strong> ${data.qual_flex}</p>
          <p style="margin: 10px 0 0 0; color: #92400e; line-height: 1.6;">"${data.sugestao.substring(0, 150)}${data.sugestao.length > 150 ? '...' : ''}"</p>
        </div>

        ${data.quantidade_fotos > 0 ? `
          <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #0277bd; margin: 0 0 10px 0;">📸 Fotos Enviadas</h4>
            <p style="color: #0277bd; margin: 0;">Você anexou <strong>${data.quantidade_fotos} foto(s)</strong> junto com sua sugestão.</p>
          </div>
        ` : ''}

        <!-- Próximos Passos -->
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">🚀 O que acontece agora?</h4>
          <ul style="color: #059669; margin: 0; padding-left: 20px;">
            <li>Nossa equipe vai analisar sua sugestão</li>
            <li>Avaliaremos a viabilidade de implementação</li>
            <li>Caso necessário, entraremos em contato para mais detalhes</li>
            <li>Você será informado sobre eventuais implementações</li>
          </ul>
        </div>

        <!-- Agradecimento -->
        <div style="background: #fef3c7; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">🙏 Muito Obrigado!</h3>
          <p style="color: #92400e; margin: 0;">Sua opinião é fundamental para continuarmos evoluindo e oferecendo a melhor experiência possível.</p>
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

// Mapeia destinatários por unidade para sugestões
const sharedRecipients = [
  'vendas.alphaville@flexacademia.com.br',
  'supervisaotecnicaalphaville@flexacademia.com.br',
  'vendasflexbuenavista@flexacademia.com.br',
  'supervisaotecnicabuenavista@flexacademia.com.br',
  'vendasmarista@flexacademia.com.br',
  'jonatas@flexacademia.com.br',
  'wakson@flexacademia.com.br',
  'hudson@flexacademia.com.br',
  'comercial@flexacademia.com.br',
  'comercial.atendimento@flexacademia.com.br',
  'atendimento@paresconsultoria.com.br',
  'rejanerp@hotmail.com',
  'edson@flexacademia.com.br',
  'marcio@flexacademia.com.br',
];

const unitRecipients: Record<string, string[]> = {
  'marista': sharedRecipients,
  'buena-vista': sharedRecipients,
  'alphaville': sharedRecipients,
  'palmas': sharedRecipients,
  'geral': sharedRecipients,
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { destinatarios, ...emailData } = data;

    // Log para debug
    console.log('📤 Iniciando envio de sugestão:', { 
      nome: emailData.nome, 
      qual_flex: emailData.qual_flex,
      quantidade_fotos: emailData.quantidade_fotos || 0,
      destinatarios_fornecidos: !!destinatarios
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email da unidade usando o código enviado
    const flexCode = emailData.codigo_flex || 'geral';
    const managerEmails = unitRecipients[flexCode];
    
    if (!managerEmails || managerEmails.length === 0) {
      throw new Error('Unidade não encontrada no sistema');
    }

    // Dados formatados
    const formattedEmailData = {
      ...emailData,
      numero_protocolo: numeroProtocolo,
      data_sugestao: new Date().toLocaleString('pt-BR'),
    };

    // Preparar anexos (só fotos)
    const attachments = emailData.fotos ? emailData.fotos.map((foto: string, index: number) => ({
      filename: emailData.nomes_fotos[index] || `foto_${index + 1}.jpg`,
      content: foto.split(',')[1], // Remove o "data:image/jpeg;base64," do início
    })) : [];

    // Definir destinatários se não fornecidos
    const defaultDestinatarios = managerEmails.map(email => ({
      email,
      subject: `💡 Nova Sugestão - ${emailData.qual_flex} - SUG-${numeroProtocolo}`,
      template: 'empresa',
      attachments: attachments
    }));

    // Adicionar email de confirmação para o cliente se tiver email
    if (emailData.email) {
      defaultDestinatarios.push({
        email: emailData.email,
        subject: `💡 Sugestão Recebida - SUG-${numeroProtocolo} - Flex Fitness`,
        template: 'cliente',
        attachments: []
      });
    }

    const finalDestinatarios = destinatarios || defaultDestinatarios;

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

        const result = await resend.emails.send({
          from: 'FlexFitnessCenter <noreply@flexfitnesscenter.com.br>',
          to: [dest.email],
          subject: dest.subject,
          html: template({ ...formattedEmailData, ...dest }),
          attachments: dest.attachments || [],
        });

        console.log(`✅ Email ${i + 1} enviado com sucesso! ID: ${result.data?.id}`);
        results.push(result);

        // Delay de 500ms entre envios para evitar rate limit
        if (i < finalDestinatarios.length - 1) {
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
    console.log('📊 RESUMO FINAL DO ENVIO DE SUGESTÃO:');
    console.log(`✅ Emails enviados com sucesso: ${results.length}`);
    console.log(`❌ Emails com erro: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('🚨 Detalhes dos erros:', errors);
    }

    if (results.length > 0) {
      console.log('🎯 IDs dos emails enviados:', results.map(r => r.data?.id));
    }

    return NextResponse.json({ 
      success: results.length > 0,
      message: `Sugestão enviada com sucesso! ${results.length} de ${finalDestinatarios.length} emails enviados`,
      protocolo: numeroProtocolo,
      enviado_para: managerEmails.join(', '),
      confirmacao_cliente: !!emailData.email,
      enviados: results.length,
      erros: errors.length,
      detalhes_erros: errors.length > 0 ? errors : undefined,
      ids: results.map(r => r.data?.id).filter(Boolean)
    });

  } catch (error) {
    console.error('💥 Erro geral ao enviar sugestão:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}