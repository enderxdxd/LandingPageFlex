// app/api/send-curriculos/route.ts
import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';
import { folha, secao, dados, paragrafo, citacao, aviso, lista, botao, divisor } from '@/lib/email/layout';
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


// Mapeia destinatários por departamento (baseado na imagem)
const departmentRecipients: Record<string, string> = {
  'estagio-educacao-fisica': 'rh@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br',   
    // Estágio Educação Física
  'financeiro':              'rh@flexacademia.com.br,gestaofinanceira@flexacademia.com.br',     
        // Financeiro
  'limpeza':                 'rh@flexacademia.com.br,marcio@flexacademia.com.br,vendaspalmas@flexacademia.com.br',        
    // Limpeza
  'manutencao':              'rh@flexacademia.com.br,marcio@flexacademia.com.br,vendaspalmas@flexacademia.com.br',  
           // Manutenção
  'marketing':               'rh@flexacademia.com.br,vendaspalmas@flexacademia.com.br',       
       // Marketing
  'natacao':                 'rh@flexacademia.com.br,hudson@flexacademia.com.br',    
            // Natação - Apenas Unid Palmas
  'professor-ginastica':     'rh@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br',   
         // Professor Ginástica
  'professor-musculacao':    'rh@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br',   
          // Professor Musculação
  'recepcao':                'rh@flexacademia.com.br,vendas.alphaville@flexacademia.com.br,vendasmarista@flexacademia.com.br,vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendaspalmas@flexacademia.com.br',             // Recepção
  'vendas':                  'rh@flexacademia.com.br,vendas.alphaville@flexacademia.com.br,vendasmarista@flexacademia.com.br,vendasflexbuenavista@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,comercial@flexacademia.com.br,vendaspalmas@flexacademia.com.br',   
  'crossfit':                'rh@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br',   
  'professor-lutas':         'rh@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br,hudson@flexacademia.com.br,xdhenriquecosta@gmail.com,jonatas@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br',   
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
  'vendas':                  'Vendas',
  'crossfit':                'Crossfit',
  'professor-lutas':         'Professor Lutas'
};

// Mapeia unidades
const unitNames: Record<string, string> = {
  'marista':     'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville':  'Flex Fitness Alphaville',
  'palmas':      'Flex Fitness Palmas',
  'qualquer':    'Qualquer Unidade'
};

const templateEmpresa = (data: any) =>
  folha({
    assunto: `Novo curriculo - ${data.departamento} - CV-${data.numero_protocolo}`,
    previa: `${data.nome} se candidatou para ${data.departamento}. Curriculo em anexo.`,
    etiqueta: `Protocolo CV-${data.numero_protocolo}`,
    titulo: 'Novo currículo recebido',
    corpo: [
      paragrafo(`Enviado em ${data.data_envio}. O arquivo está anexado a este e-mail.`),
      secao('Candidato'),
      dados([
        ['Nome', data.nome],
        ['Departamento', data.departamento],
        ['Unidade', data.unidade],
        ['E-mail', data.email],
        ['Telefone', data.telefone],
        ['Arquivo', data.nome_arquivo],
      ]),
      secao('Experiência informada'),
      citacao(data.experiencia ?? 'Não informado'),
      aviso('Responder este e-mail fala direto com a pessoa candidata.'),
    ].join(''),
  });

const templateCandidato = (data: any) =>
  folha({
    assunto: `Curriculo recebido - CV-${data.numero_protocolo}`,
    previa: 'Recebemos seu curriculo. Ele entra no nosso banco de talentos.',
    etiqueta: `Protocolo CV-${data.numero_protocolo}`,
    titulo: 'Recebemos seu currículo',
    corpo: [
      paragrafo(`Olá, ${data.nome}.`),
      paragrafo('Seu currículo chegou e foi encaminhado para a área responsável. Se o perfil for compatível com uma vaga aberta, entramos em contato.'),
      secao('Resumo'),
      dados([
        ['Departamento', data.departamento],
        ['Unidade', data.unidade],
        ['Arquivo', data.nome_arquivo],
        ['Enviado em', data.data_envio],
      ]),
      aviso('Guarde o número do protocolo. Currículos ficam no banco de talentos por 12 meses.'),
    ].join(''),
  });

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { scope: 'curriculos', limit: 3, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    const rawData = await request.json();

    if (isBot(rawData)) {
      return NextResponse.json({ success: true, message: 'Currículo recebido' });
    }

    /* `destinatarios` descartado: vinha do cliente e virava relay aberto —
       com anexo arbitrário junto, que é pior ainda. */
    const { destinatarios: _ignorado, ...emailData } = rawData;

    const emailCandidato = normalizeEmail(emailData.email);
    if (!emailCandidato) {
      return NextResponse.json(
        { success: false, error: 'Informe um e-mail válido para receber a confirmação.' },
        { status: 400 }
      );
    }

    // Log para debug
    console.log('📤 Iniciando envio de currículo:', { 
      nome: emailData.nome, 
      departamento: emailData.codigo_departamento,
      unidade: emailData.unidade
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email do departamento usando o código enviado
    const departmentCode = emailData.codigo_departamento;
    const managerEmailString = departmentRecipients[departmentCode];
    
    if (!managerEmailString) {
      throw new Error('Departamento não encontrado no sistema');
    }

    // Converter string em array de emails, descartando entradas quebradas
    const managerEmails = cleanRecipientList(managerEmailString);

    if (managerEmails.length === 0) {
      throw new Error('Departamento sem destinatário válido configurado');
    }

    /* `curriculo` fica de fora: é base64 do anexo. */
    const safeData = sanitizeDeep(emailData, ['curriculo']);

    // Dados formatados
    const formattedEmailData = {
      ...safeData,
      numero_protocolo: numeroProtocolo,
      data_envio: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    };

    // Preparar anexo do currículo
    const attachments = emailData.curriculo ? [{
      filename: emailData.nome_arquivo || 'curriculo.pdf',
      content: emailData.curriculo.split(',')[1], // Remove o "data:type/subtype;base64," do início
    }] : [];

    // Destinatários resolvidos no servidor
    const finalDestinatarios: Array<{
      to: string
      subject: string
      template: string
      attachments: any[]
      replyTo: string
    }> = [];

    // 1. Emails para o departamento (COM anexo) — responder fala com o candidato
    managerEmails.forEach(emailDestinatario => {
      finalDestinatarios.push({
        to: emailDestinatario,
        subject: `Novo currículo - ${safeData.departamento} - CV-${numeroProtocolo}`,
        template: 'empresa',
        attachments: attachments,
        replyTo: emailCandidato,
      });
    });

    // 2. Email de confirmação para o candidato (SEM anexo)
    finalDestinatarios.push({
      to: emailCandidato,
      subject: `🎉 Currículo Recebido com Sucesso - CV-${numeroProtocolo} - Flex Fitness`,
      template: 'candidato',
      attachments: [],
      replyTo: MAIL_REPLY_TO,
    });

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
        console.log(`📧 Enviando email ${i + 1}/${finalDestinatarios.length} para: ${dest.to}`);
        
        const template = templates[dest.template as keyof typeof templates];
        if (!template) {
          throw new Error(`Template '${dest.template}' não encontrado`);
        }

        const result = await mailer.emails.send({
          from: MAIL_FROM,
          to: [dest.to],
          replyTo: dest.replyTo,
          subject: dest.subject,
          html: template(formattedEmailData),
          attachments: dest.attachments || [],
        });

        const id = garantirEnvio(result);
        console.log(`Email ${i + 1} enviado. ID: ${id}`);
        results.push(result);

        // Delay de 500ms entre envios para evitar rate limit
        if (i < finalDestinatarios.length - 1) {
          console.log('⏳ Aguardando 500ms antes do próximo envio...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.error(`❌ Erro ao enviar email ${i + 1} para ${dest.to}:`, error);
        errors.push({
          email: dest.to,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        
        // Continue tentando os próximos emails mesmo se um falhar
        continue;
      }
    }

    // Log dos resultados finais

    if (errors.length > 0) {
      console.log('🚨 Detalhes dos erros:', errors);
    }

    if (results.length > 0) {
      console.log('🎯 IDs dos emails enviados:', results.map(r => r.data?.id));
    }

    return NextResponse.json({ 
      success: results.length > 0,
      message: results.length > 0
        ? `Sua currículo foi enviada. ${results.length} de ${finalDestinatarios.length} e-mails entregues ao provedor.`
        : 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.',
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