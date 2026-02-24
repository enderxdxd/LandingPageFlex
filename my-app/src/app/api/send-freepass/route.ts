// app/api/send-aula-experimental/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template da empresa para aula experimental
const templateEmpresa = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Solicitação de Aula Experimental - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        
        <h2 style="color: #f59e0b; margin: 0 0 20px 0;">🎁 NOVA SOLICITAÇÃO DE AULA EXPERIMENTAL</h2>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong>Data:</strong> ${data.data_solicitacao}<br>
          <strong>Protocolo:</strong> FP-${data.numero_protocolo}
        </div>

        <h3>📋 Dados do Interessado</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Unidade de Interesse</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.qual_unidade}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Nome</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.nome}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Email</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.email_interessado}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Celular</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${data.celular}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Termos Aceitos</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">✅ Sim</td>
          </tr>
        </table>

        <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 15px; margin: 20px 0;">
          <h4 style="color: #0277bd; margin: 0 0 10px 0;">🎯 O que inclui a Aula Experimental:</h4>
          <ul style="color: #0277bd; margin: 0; padding-left: 20px;">
            <li>Visita guiada pela academia</li>
            <li>Treino experimental gratuito</li>
            <li>Avaliação física completa</li>
            <li>Orientação com nossos profissionais</li>
          </ul>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <strong style="color: #92400e;">⚠️ IMPORTANTE:</strong><br>
          <span style="color: #92400e;">Cada CPF tem direito a apenas uma aula experimental.</span>
        </div>

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <strong>⚠️ AÇÃO NECESSÁRIA:</strong><br>
          Entre em contato com este interessado para agendar a visita e o treino experimental.
        </div>

        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">📞 Próximos Passos:</h4>
          <ol style="color: #059669; margin: 0; padding-left: 20px;">
            <li>Fazer contato telefônico em até 24h</li>
            <li>Agendar data e horário da visita</li>
            <li>Preparar documentação necessária</li>
            <li>Designar profissional para recepção</li>
            <li>Realizar follow-up pós-visita</li>
          </ol>
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
    <title>Aula Experimental Solicitada - Flex Fitness</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Cabeçalho -->
        <div style="text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">💪 FLEX FITNESS</h1>
          <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 15px 0;">
            🎁 AULA EXPERIMENTAL SOLICITADA
          </div>
        </div>

        <!-- Saudação -->
        <p style="font-size: 16px; color: #333;">Olá <strong>${data.nome}</strong>,</p>
        <p style="color: #666;">Sua solicitação de aula experimental foi <strong>recebida com sucesso</strong>!</p>

        <!-- Protocolo -->
        <div style="background: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <strong>Protocolo: FP-${data.numero_protocolo}</strong><br>
          <small>Data: ${data.data_solicitacao}</small>
        </div>

        <!-- Resumo da solicitação -->
        <h3 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">📝 Resumo da sua solicitação</h3>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #92400e;"><strong>Unidade:</strong> ${data.qual_unidade}</p>
          <p style="margin: 10px 0 0 0; color: #92400e;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 10px 0 0 0; color: #92400e;"><strong>Celular:</strong> ${data.celular}</p>
        </div>

        <!-- O que está incluso -->
        <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #0277bd; margin: 0 0 10px 0;">🎯 Sua Aula Experimental Inclui:</h4>
          <ul style="color: #0277bd; margin: 0; padding-left: 20px;">
            <li>Visita guiada pela academia</li>
            <li>Treino experimental gratuito</li>
            <li>Orientação com nossos profissionais</li>
          </ul>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Atenção:</h4>
          <p style="color: #92400e; margin: 0; font-size: 14px;"><strong>Cada CPF tem direito a apenas uma aula experimental.</strong></p>
        </div>

        <!-- Próximos Passos -->
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">🚀 O que acontece agora?</h4>
          <ul style="color: #059669; margin: 0; padding-left: 20px;">
            <li>Agendaremos sua visita no melhor horário para você</li>
            <li>Você receberá todas as orientações por WhatsApp/telefone</li>
            <li>No dia, será recebido(a) por um de nossos profissionais</li>
          </ul>
        </div>

        <!-- Informações importantes -->
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Informações Importantes:</h4>
          <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Traga roupas adequadas para exercícios</li>
            <li>Leve uma toalha e garrafa de água</li>
            <li>Chegue 15 minutos antes do horário agendado</li>
            <li>Limitado a uma aula experimental por CPF</li>
          </ul>
        </div>

        <!-- Agradecimento -->
        <div style="background: #fef3c7; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">🙏 Muito Obrigado!</h3>
          <p style="color: #92400e; margin: 0;">Estamos ansiosos para recebê-lo(a) e mostrar como a Flex pode transformar sua vida através do movimento!</p>
        </div>

        <!-- Rodapé -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
          <p><strong>Flex Fitness</strong><br>
          Transformando vidas através do movimento</p>
          <p style="font-size: 12px;">Este é um e-mail automático. Guarde este comprovante para seus registros.</p>
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin-top: 15px; border-radius: 4px;">
            <p style="color: #856404; margin: 0; font-size: 12px;"><strong>💡 Dica:</strong> Se não receber nossa ligação, verifique se seu número está correto e com DDD.</p>
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
`;



const unitRecipients: Record<string, string> = {
  'marista': 'vendasmarista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendas.flexbuenavista@flexacademia.com.br, vendas.alphaville@flexacademia.com.br',
  'buena-vista': 'vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendas.flexmarista@flexacademia.com.br,vendas.flexalphaville@flexacademia.com.br,vendas.flexpalmas@flexacademia.com.br',
  'alphaville': 'vendas.alphaville@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendas.flexmarista@flexacademia.com.br,vendas.flexbuenavista@flexacademia.com.br,vendas.flexpalmas@flexacademia.com.br',
  'palmas': 'comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendasflexmarista@flexacademia.com.br,vendasflexbuenavista@flexacademia.com.br,vendas.flexalphaville@flexacademia.com.br,gestaotecnica@flexpalmas.com.br,comercial@flexpalmas.com.br,vendaspalmas@flexacademia.com.br', 
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { destinatarios, ...emailData } = data;

    // Log para debug
    console.log('🎁 Iniciando envio de solicitação de aula experimental:', { 
      nome: emailData.nome, 
      qual_unidade: emailData.qual_unidade,
      email: emailData.email,
      destinatarios_fornecidos: !!destinatarios
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email da unidade usando o código enviado
    const unidadeCode = emailData.codigo_unidade || 'marista';
    // Converte a lista de emails da unidade (separados por vírgula) em um array
    const managerEmails = (unitRecipients[unidadeCode] || '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    if (managerEmails.length === 0) {
      throw new Error('Unidade não encontrada no sistema');
    }

    // Dados formatados
    const formattedEmailData = {
      ...emailData,
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
      email_interessado: emailData.email,
    };

    // Definir destinatários se não fornecidos
    const defaultDestinatarios = managerEmails.map(email => ({
      email,
      subject: `🎁 Nova Solicitação de Aula Experimental - ${emailData.qual_unidade} - FP-${numeroProtocolo}`,
      template: 'empresa'
    }));

    // Adicionar email de confirmação para o cliente
    defaultDestinatarios.push({
      email: emailData.email,
      subject: `🎁 Aula Experimental Solicitada - FP-${numeroProtocolo} - Flex Fitness`,
      template: 'cliente'
    });

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
          html: template(formattedEmailData),
        });

        console.log(`✅ Email ${i + 1} enviado com sucesso! ID: ${result.data?.id}`);
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
      message: `Solicitação de aula experimental enviada com sucesso! ${results.length} de ${finalDestinatarios.length} emails enviados`,
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