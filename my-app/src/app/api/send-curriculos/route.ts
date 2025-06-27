// app/api/send-curriculos/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mapeia destinatários por departamento (baseado na imagem)
const departmentRecipients: Record<string, string> = {
  'estagio-educacao-fisica': 'supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,wakson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br',   
    // Estágio Educação Física
  'financeiro':              'gestaofinanceira@flexacademia.com.br',     
        // Financeiro
  'limpeza':                 'rejane@flexacademia.com.br,marcio@flexacademia.com.br',        
    // Limpeza
  'manutencao':              'rejane@flexacademia.com.br,marcio@flexacademia.com.br',  
           // Manutenção
  'marketing':               'rejane@flexacademia.com.br',       
       // Marketing
  'natacao':                 'supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,wakson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br',    
            // Natação - Apenas Unid Palmas
  'professor-ginastica':     'supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,wakson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br',   
         // Professor Ginástica
  'professor-musculacao':    'supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,wakson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br',   
          // Professor Musculação
  'recepcao':                'vendas.alphaville@flexacademia.com.br,vendasmarista@flexacademia.com.br,vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br',             // Recepção
  'vendas':                  'vendas.alphaville@flexacademia.com.br,vendasmarista@flexacademia.com.br,vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br',               // Vendas
};

// Mapeia os códigos para nomes dos departamentos (exatamente como na imagem)
const departmentNames: Record<string, string> = {
  'estagio-educacao-fisica': 'Estágio Educação Física',
  'financeiro':              'Financeiro',
  'limpeza':                 'Limpeza',
  'manutencao':              'Manutenção',
  'marketing':               'Marketing',
  'natacao':                 'Natação- Apenas Unid Palmas',
  'professor-ginastica':     'Professor Ginástica',
  'professor-musculacao':    'Professor Musculação',
  'recepcao':                'Recepção',
  'vendas':                  'Vendas'
};

// Mapeia unidades
const unitNames: Record<string, string> = {
  'marista':     'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville':  'Flex Fitness Alphaville',
  'palmas':      'Flex Fitness Palmas (Em breve)',
  'qualquer':    'Qualquer Unidade'
};

// Template da empresa para currículos (VERSÃO CORRIGIDA)
const templateEmpresa = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Currículo - Flex Fitness</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #f3f4f6;
        padding: 20px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .badge {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        padding: 6px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 13px;
        border: 1px solid rgba(255,255,255,0.3);
      }
      .content {
        padding: 30px 20px;
      }
      .alert-box {
        background: #10b981;
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 25px;
        text-align: center;
      }
      .protocol {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .date {
        font-size: 13px;
        opacity: 0.9;
      }
      .section-title {
        color: #1f2937;
        font-size: 18px;
        font-weight: bold;
        margin: 25px 0 15px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid #8b5cf6;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      }
      .data-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #f3f4f6;
        vertical-align: top;
      }
      .data-table tr:last-child td {
        border-bottom: none;
      }
      .label-cell {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
        width: 35%;
        border-right: 2px solid #8b5cf6;
      }
      .value-cell {
        background: white;
        color: #1f2937;
        font-weight: 500;
      }
      .experience-box {
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #8b5cf6;
        margin: 15px 0;
      }
      .experience-text {
        color: #374151;
        line-height: 1.6;
        white-space: pre-wrap;
      }
      .attachment-box {
        background: #f0fdf4;
        border: 1px solid #22c55e;
        padding: 16px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .attachment-title {
        color: #15803d;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .attachment-text {
        color: #166534;
        font-weight: 500;
      }
      .action-box {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        padding: 16px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .action-title {
        color: #92400e;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .action-text {
        color: #a16207;
        font-weight: 500;
        line-height: 1.5;
      }
      .footer {
        background: #374151;
        padding: 20px;
        text-align: center;
        color: white;
      }
      .footer-logo {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .footer-text {
        opacity: 0.8;
        font-size: 13px;
      }
      
      /* Responsivo */
      @media only screen and (max-width: 600px) {
        .container {
          margin: 0 10px;
        }
        .header {
          padding: 20px 15px;
        }
        .content {
          padding: 20px 15px;
        }
        .logo {
          font-size: 24px;
        }
        .data-table {
          font-size: 14px;
        }
        .label-cell, .value-cell {
          padding: 10px 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo">💪 FLEX FITNESS</div>
        <div class="badge">💼 NOVO TALENTO IDENTIFICADO</div>
      </div>

      <!-- Conteúdo -->
      <div class="content">
        <!-- Alert de Protocolo -->
        <div class="alert-box">
          <div class="protocol">Protocolo: CV-${data.numero_protocolo}</div>
          <div class="date">${data.data_envio}</div>
        </div>

        <!-- Dados do Candidato -->
        <h3 class="section-title">👤 Perfil do Candidato</h3>
        
        <table class="data-table">
          <tr>
            <td class="label-cell">Nome Completo</td>
            <td class="value-cell">${data.nome}</td>
          </tr>
          <tr>
            <td class="label-cell">E-mail</td>
            <td class="value-cell">${data.email}</td>
          </tr>
          <tr>
            <td class="label-cell">Telefone</td>
            <td class="value-cell">${data.telefone}</td>
          </tr>
          <tr>
            <td class="label-cell">Área de Interesse</td>
            <td class="value-cell"><strong>${data.departamento}</strong></td>
          </tr>
          <tr>
            <td class="label-cell">Unidade</td>
            <td class="value-cell">${data.unidade}</td>
          </tr>
          <tr>
            <td class="label-cell">Cargo Pretendido</td>
            <td class="value-cell">${data.cargo}</td>
          </tr>
        </table>

        ${data.experiencia && data.experiencia !== 'Não informado' ? `
          <h3 class="section-title">💼 Experiência Profissional</h3>
          <div class="experience-box">
            <div class="experience-text">${data.experiencia}</div>
          </div>
        ` : ''}

        <!-- Anexo -->
        <div class="attachment-box">
          <div class="attachment-title">📎 Currículo Anexado</div>
          <div class="attachment-text">
            Arquivo: <strong>${data.nome_arquivo}</strong><br>
            ✅ O currículo completo foi anexado a este e-mail para análise.
          </div>
        </div>

        <!-- Call to Action -->
        <div class="action-box">
          <div class="action-title">⚡ PRÓXIMOS PASSOS</div>
          <div class="action-text">
            • Analise o perfil e o currículo anexado<br>
            • Verifique compatibilidade com vagas disponíveis<br>
            • Entre em contato se o candidato for adequado<br>
            • Mantenha o currículo no banco de talentos
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">FLEX FITNESS</div>
        <div class="footer-text">Transformando vidas através do movimento</div>
      </div>
    </div>
  </body>
  </html>
`;

// Template de confirmação para o candidato (VERSÃO CORRIGIDA)
const templateCandidato = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo Recebido - Flex Fitness</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #f3f4f6;
        padding: 20px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      .hero-header {
        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
        padding: 40px 20px;
        text-align: center;
        color: white;
      }
      .main-logo {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 12px;
        letter-spacing: -1px;
      }
      .success-badge {
        display: inline-block;
        background: rgba(255,255,255,0.25);
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid rgba(255,255,255,0.3);
      }
      .content {
        padding: 40px 20px;
      }
      .greeting {
        font-size: 18px;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .intro-text {
        color: #6b7280;
        margin-bottom: 25px;
      }
      .protocol-card {
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin: 25px 0;
      }
      .protocol-number {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .protocol-date {
        opacity: 0.9;
        font-size: 13px;
      }
      .section-header {
        color: #1f2937;
        font-size: 18px;
        font-weight: bold;
        margin: 30px 0 15px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #8b5cf6;
      }
      .summary-card {
        background: linear-gradient(135deg, #f3e8ff, #fce7f3);
        border: 1px solid #d8b4fe;
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
      }
      .summary-item {
        margin: 10px 0;
        color: #7c3aed;
        font-weight: 600;
      }
      .summary-item:before {
        content: '✨ ';
        margin-right: 5px;
      }
      .steps-card {
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        border: 1px solid #22c55e;
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
      }
      .steps-title {
        color: #059669;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .steps-list {
        color: #065f46;
        margin: 0;
        padding-left: 0;
        list-style: none;
      }
      .steps-list li {
        margin: 8px 0;
        padding-left: 20px;
        position: relative;
        font-weight: 500;
        line-height: 1.5;
      }
      .steps-list li:before {
        content: '▶️';
        position: absolute;
        left: 0;
        font-size: 10px;
      }
      .appreciation-card {
        background: linear-gradient(135deg, #fef3c7, #fed7d7);
        border: 2px solid #f59e0b;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        margin: 30px 0;
      }
      .appreciation-title {
        color: #92400e;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .appreciation-text {
        color: #a16207;
        font-weight: 600;
        line-height: 1.6;
      }
      .footer {
        background: #374151;
        padding: 30px 20px;
        text-align: center;
        color: white;
        border-top: 3px solid #8b5cf6;
      }
      .footer-logo {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .footer-tagline {
        opacity: 0.9;
        margin-bottom: 6px;
      }
      .footer-social {
        opacity: 0.7;
        font-size: 13px;
      }
      
      /* Responsivo */
      @media only screen and (max-width: 600px) {
        .container {
          margin: 0 10px;
        }
        .hero-header {
          padding: 30px 15px;
        }
        .content {
          padding: 30px 15px;
        }
        .main-logo {
          font-size: 28px;
        }
        .success-badge {
          font-size: 12px;
          padding: 8px 16px;
        }
        .protocol-card {
          padding: 16px;
        }
        .summary-card, .steps-card, .appreciation-card {
          padding: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Hero Header -->
      <div class="hero-header">
        <div class="main-logo">💪 FLEX FITNESS</div>
        <div class="success-badge">🎉 CURRÍCULO RECEBIDO COM SUCESSO</div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="content">
        <!-- Saudação Personalizada -->
        <div class="greeting">Olá, <strong>${data.nome}</strong>! 👋</div>
        <div class="intro-text">Ficamos muito felizes em receber seu currículo! Seu interesse em fazer parte da nossa equipe é muito importante para nós.</div>

        <!-- Card do Protocolo -->
        <div class="protocol-card">
          <div class="protocol-number">📋 Protocolo: CV-${data.numero_protocolo}</div>
          <div class="protocol-date">📅 Recebido em: ${data.data_envio}</div>
        </div>

        <!-- Resumo da Candidatura -->
        <h3 class="section-header">📝 Resumo da sua candidatura</h3>
        
        <div class="summary-card">
          <div class="summary-item"><strong>Área:</strong> ${data.departamento}</div>
          <div class="summary-item"><strong>Unidade:</strong> ${data.unidade}</div>
          ${data.cargo && data.cargo !== 'Não especificado' ? `<div class="summary-item"><strong>Cargo:</strong> ${data.cargo}</div>` : ''}
        </div>

        <!-- Próximos Passos -->
        <div class="steps-card">
          <div class="steps-title">🚀 Próximos Passos</div>
          <ul class="steps-list">
            <li>Nossa equipe de RH analisará cuidadosamente seu perfil</li>
            <li>Verificaremos a compatibilidade com vagas disponíveis</li>
            <li>Candidatos selecionados serão contatados para entrevista</li>
            <li>Manteremos seu currículo em nosso banco de talentos</li>
            <li>Você pode acompanhar oportunidades em nossas redes sociais</li>
          </ul>
        </div>

        <!-- Card de Agradecimento -->
        <div class="appreciation-card">
          <div class="appreciation-title">🙏 Muito obrigado pelo seu interesse!</div>
          <div class="appreciation-text">
            Estamos empolgados com a possibilidade de você fazer parte da nossa família Flex! 
            Continue sonhando grande e acreditando no seu potencial. 
            <strong>Juntos, transformamos vidas através do movimento!</strong> 💪✨
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">💪 FLEX FITNESS</div>
        <div class="footer-tagline">Transformando vidas através do movimento</div>
        <div class="footer-social">Siga-nos nas redes sociais para ficar por dentro das novidades!</div>
      </div>
    </div>
  </body>
  </html>
`;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { destinatarios, ...emailData } = data;

    // Log para debug
    console.log('📤 Iniciando envio de currículo:', { 
      nome: emailData.nome, 
      departamento: emailData.codigo_departamento,
      unidade: emailData.unidade,
      destinatarios_fornecidos: !!destinatarios
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email do departamento usando o código enviado
    const departmentCode = emailData.codigo_departamento;
    const managerEmailString = departmentRecipients[departmentCode];
    
    if (!managerEmailString) {
      throw new Error('Departamento não encontrado no sistema');
    }

    // Converter string em array de emails
    const managerEmails = managerEmailString.split(',').map(email => email.trim());

    // Dados formatados
    const formattedEmailData = {
      ...emailData,
      numero_protocolo: numeroProtocolo,
      data_envio: new Date().toLocaleString('pt-BR'),
    };

    // Preparar anexo do currículo
    const attachments = emailData.curriculo ? [{
      filename: emailData.nome_arquivo || 'curriculo.pdf',
      content: emailData.curriculo.split(',')[1], // Remove o "data:type/subtype;base64," do início
    }] : [];

    // Definir destinatários se não fornecidos
    const defaultDestinatarios = [];

    // 1. Emails para o departamento (COM anexo)
    managerEmails.forEach(email => {
      defaultDestinatarios.push({
        email: email,
        subject: `💼 Novo Currículo - ${emailData.departamento} - CV-${numeroProtocolo}`,
        template: 'empresa',
        attachments: attachments
      });
    });

    // 2. Email de confirmação para o candidato (SEM anexo)
    defaultDestinatarios.push({
      email: emailData.email,
      subject: `🎉 Currículo Recebido com Sucesso - CV-${numeroProtocolo} - Flex Fitness`,
      template: 'candidato',
      attachments: []
    });

    const finalDestinatarios = destinatarios || defaultDestinatarios;

    // Templates
    const templates = {
      empresa: templateEmpresa,
      candidato: templateCandidato
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
          from: 'Flex Fitness <noreply@flexfitnesscenter.com.br>',
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
    console.log('📊 RESUMO FINAL DO ENVIO DE CURRÍCULO:');
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
      message: `Currículo enviado com sucesso! ${results.length} de ${finalDestinatarios.length} emails enviados`,
      protocolo: numeroProtocolo,
      enviado_para: managerEmailString,
      departamento: emailData.departamento,
      enviados: results.length,
      erros: errors.length,
      detalhes_erros: errors.length > 0 ? errors : undefined,
      ids: results.map(r => r.data?.id).filter(Boolean)
    });

  } catch (error) {
    console.error('💥 Erro geral ao enviar currículo:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}