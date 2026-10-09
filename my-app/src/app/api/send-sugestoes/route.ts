// app/api/send-sugestoes/route.ts
import { mailer } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';
import { folha, secao, dados, paragrafo, citacao, aviso, lista, botao, divisor } from '@/lib/email/layout';
import {
  MAIL_FROM,
  MAIL_REPLY_TO,
  isBot,
  normalizeEmail,
  garantirEnvio,
  rateLimit,
  sanitizeDeep,
} from '@/lib/api/security';


const templateEmpresa = (data: any) =>
  folha({
    assunto: `Nova sugestao - ${data.qual_flex} - SUG-${data.numero_protocolo}`,
    previa: `${data.nome} enviou uma sugestao sobre a unidade ${data.qual_flex}.`,
    etiqueta: `Protocolo SUG-${data.numero_protocolo}`,
    titulo: 'Nova sugestão recebida',
    corpo: [
      paragrafo(`Enviada em ${data.data_sugestao}.`),
      secao('Quem enviou'),
      dados([
        ['Nome', data.nome],
        ['Perfil', data.sou],
        ['Unidade', data.qual_flex],
        ['Telefone', data.telefone],
        ['Fotos anexadas', data.quantidade_fotos ? String(data.quantidade_fotos) : 'nenhuma'],
      ]),
      secao('Sugestão'),
      citacao(data.sugestao ?? ''),
    ].join(''),
  });

const templateCliente = (data: any) =>
  folha({
    assunto: `Sugestao recebida - SUG-${data.numero_protocolo}`,
    previa: 'Sua sugestao chegou para a equipe da unidade.',
    etiqueta: `Protocolo SUG-${data.numero_protocolo}`,
    titulo: 'Obrigado pela sugestão',
    corpo: [
      paragrafo(`Olá, ${data.nome}.`),
      paragrafo('Sua sugestão foi encaminhada para a equipe da unidade. Nem toda sugestão vira mudança, mas todas são lidas.'),
      secao('Resumo'),
      dados([
        ['Unidade', data.qual_flex],
        ['Enviada em', data.data_sugestao],
      ]),
      secao('O que você escreveu'),
      citacao(String(data.sugestao ?? '').substring(0, 400)),
    ].join(''),
  });

const sharedRecipients = [
  'vendas.alphaville@flexacademia.com.br',
  'supervisaotecnicaalphaville@flexacademia.com.br',
  'vendasflexbuenavista@flexacademia.com.br',
  'supervisaotecnicabuenavista@flexacademia.com.br',
  'vendasmarista@flexacademia.com.br',
  'jonatas@flexacademia.com.br',
  'hudson@flexacademia.com.br',
  'comercial@flexacademia.com.br',
  'comercial.atendimento@flexacademia.com.br',
  'atendimento@paresconsultoria.com.br',
  'edson@flexacademia.com.br',
  'marcio@flexacademia.com.br',
  'vendaspalmas@flexacademia.com.br',
  'gestaotecnica@flexpalmas.com.br',
  'gestaofinanceira@flexacademia.com.br',
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
    const limited = rateLimit(request, { scope: 'sugestoes', limit: 3, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    const rawData = await request.json();

    if (isBot(rawData)) {
      return NextResponse.json({ success: true, message: 'Sugestão recebida' });
    }

    /* `destinatarios` descartado: vinha do cliente e virava relay aberto. */
    const { destinatarios: _ignorado, ...emailData } = rawData;

    /* Aqui o e-mail é opcional — a sugestão pode ser anônima. Só precisa ser
       válido SE veio preenchido; endereço malformado saindo daqui volta como
       hard bounce e cobra o preço na reputação do domínio. */
    const emailInteressado = emailData.email ? normalizeEmail(emailData.email) : null;
    if (emailData.email && !emailInteressado) {
      return NextResponse.json(
        { success: false, error: 'O e-mail informado não é válido. Corrija ou deixe o campo em branco.' },
        { status: 400 }
      );
    }

    // Log para debug
    console.log('📤 Iniciando envio de sugestão:', { 
      nome: emailData.nome, 
      qual_flex: emailData.qual_flex,
      quantidade_fotos: emailData.quantidade_fotos || 0
    });

    // Gerar número do protocolo
    const numeroProtocolo = Date.now().toString().slice(-6);

    // Determinar email da unidade usando o código enviado
    const flexCode = emailData.codigo_flex || 'geral';
    const managerEmails = unitRecipients[flexCode];
    
    if (!managerEmails || managerEmails.length === 0) {
      throw new Error('Unidade não encontrada no sistema');
    }

    /* Escapa o que veio do visitante antes de virar HTML. `fotos` fica de
       fora: é base64 de anexo, escapar corromperia o arquivo. */
    const safeData = sanitizeDeep(emailData, ['fotos']);

    // Dados formatados
    const formattedEmailData = {
      ...safeData,
      numero_protocolo: numeroProtocolo,
      data_sugestao: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    };

    // Preparar anexos (só fotos)
    const attachments = emailData.fotos ? emailData.fotos.map((foto: string, index: number) => ({
      filename: emailData.nomes_fotos[index] || `foto_${index + 1}.jpg`,
      content: foto.split(',')[1], // Remove o "data:image/jpeg;base64," do início
    })) : [];

    // Destinatários resolvidos no servidor
    const finalDestinatarios: Array<{
      email: string
      subject: string
      template: string
      attachments: any[]
      replyTo: string
    }> = managerEmails.map(email => ({
      email,
      subject: `Nova sugestão - ${safeData.qual_flex} - SUG-${numeroProtocolo}`,
      template: 'empresa',
      attachments: attachments,
      /* Sugestão anônima não tem para onde responder: cai na caixa monitorada. */
      replyTo: emailInteressado ?? MAIL_REPLY_TO,
    }));

    // Confirmação para quem sugeriu, se deixou e-mail
    if (emailInteressado) {
      finalDestinatarios.push({
        email: emailInteressado,
        subject: `Sugestão recebida - SUG-${numeroProtocolo} - Flex Fitness`,
        template: 'cliente',
        attachments: [],
        replyTo: MAIL_REPLY_TO,
      });
    }

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
          html: template({ ...formattedEmailData, ...dest }),
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
      message: results.length > 0
        ? `Sua sugestão foi enviada. ${results.length} de ${finalDestinatarios.length} e-mails entregues ao provedor.`
        : 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.',
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