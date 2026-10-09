/**
 * Sistema visual dos e-mails transacionais.
 *
 * O problema que isto resolve: havia 12 templates espalhados por 6 rotas, cada
 * um com a própria paleta — um levantamento rápido achou 14 cores de fundo
 * diferentes (#fef3c7, #e0f2fe, #f0fdf4, #fff3cd, #f8d7da, #e3f2fd…). Somando
 * emoji nos títulos e blocos coloridos empilhados, o resultado não parecia
 * comunicação de uma empresa de 35 anos: parecia template genérico.
 *
 * Aqui há UMA paleta, UMA hierarquia tipográfica e UM rodapé. A ênfase vem de
 * peso e espaço, não de caixa colorida.
 *
 * ── Restrições de e-mail (por que o código é assim) ─────────────────────────
 * E-mail não é web. O Outlook renderiza com o motor do Word: não tem flexbox,
 * grid, nem `max-width` confiável. Por isso tudo aqui é tabela aninhada com
 * largura fixa e estilo inline — CSS externo e <style> são descartados por
 * boa parte dos clientes. Fonte web idem: o empilhamento cai em Arial, então
 * a hierarquia é construída com tamanho e peso, que funcionam em todo lugar.
 */

const SITE = 'https://www.flexfitnesscenter.com.br'

/** Uma paleta só. Qualquer cor fora daqui é regressão. */
export const COR = {
  tinta: '#16181D',
  tintaSuave: '#5B616B',
  tintaFraca: '#8A9099',
  papel: '#FFFFFF',
  fundo: '#F1F2F4',
  linha: '#E2E4E8',
  marca: '#1E40AF',
  marcaClara: '#EEF2FF',
  /** Só para o que é genuinamente atenção — prazo, irreversibilidade. */
  alerta: '#8A5300',
  alertaFundo: '#FFF8E6',
} as const

const FONTE =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, Helvetica, sans-serif"

/**
 * CONTRATO DE ESCAPE — leia antes de usar o kit.
 *
 * Este módulo NÃO escapa o conteúdo que recebe. Quem escapa é a rota, via
 * `sanitizeDeep` em `lib/api/security.ts`, antes de os dados chegarem aqui.
 *
 * Escapar de novo seria bug visível: um "Óleo & Cia" já escapado para
 * "Óleo &amp; Cia" viraria "Óleo &amp;amp; Cia" na caixa do destinatário.
 *
 * `esc()` fica reservado para o que o PRÓPRIO kit monta — valor de atributo
 * como `href` e `alt` —, onde o dado nunca passou pelo sanitize.
 */
function esc(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* ── Blocos ─────────────────────────────────────────────────────────────────
   Cada função devolve uma <tr> para entrar no corpo da folha. Assim a ordem
   do e-mail é uma lista legível na rota, em vez de 200 linhas de HTML. */

/** Parágrafo de texto corrido. */
export function paragrafo(texto: string, opcoes: { suave?: boolean } = {}): string {
  const cor = opcoes.suave ? COR.tintaSuave : COR.tinta
  return `<tr><td style="padding:0 32px 16px;font-family:${FONTE};font-size:15px;line-height:1.6;color:${cor};">${texto}</td></tr>`
}

/** Título de seção. Hierarquia por peso e tamanho — sem emoji, sem cor. */
export function secao(titulo: string): string {
  return `<tr><td style="padding:14px 32px 12px;font-family:${FONTE};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${COR.tintaFraca};">${titulo}</td></tr>`
}

/**
 * Tabela de dados: rótulo à esquerda, valor à direita.
 *
 * Substitui as tabelas de borda dupla que existiam antes. Linha fina entre os
 * itens em vez de grade fechada — o olho segue o par sem a moldura.
 */
export function dados(linhas: Array<[string, unknown]>): string {
  const corpo = linhas
    .filter(([, valor]) => valor !== undefined && valor !== null && String(valor).trim() !== '')
    .map(
      ([rotulo, valor], i) => `
        <tr>
          <td style="padding:${i === 0 ? '0' : '10px'} 16px 10px 0;border-top:${i === 0 ? 'none' : `1px solid ${COR.linha}`};font-family:${FONTE};font-size:13px;color:${COR.tintaSuave};white-space:nowrap;vertical-align:top;">${rotulo}</td>
          <td style="padding:${i === 0 ? '0' : '10px'} 0 10px;border-top:${i === 0 ? 'none' : `1px solid ${COR.linha}`};font-family:${FONTE};font-size:14px;font-weight:600;color:${COR.tinta};text-align:right;vertical-align:top;">${valor}</td>
        </tr>`
    )
    .join('')

  return `<tr><td style="padding:0 32px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${corpo}</table></td></tr>`
}

/** Bloco de texto longo do visitante (mensagem, sugestão, detalhes). */
export function citacao(texto: string): string {
  return `<tr><td style="padding:0 32px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding:16px 18px;background:${COR.fundo};font-family:${FONTE};font-size:14px;line-height:1.6;color:${COR.tinta};white-space:pre-wrap;">${texto}</td>
    </tr></table></td></tr>`
}

/**
 * Aviso. `destaque` só para o que é mesmo irreversível ou tem prazo —
 * se tudo é destaque, nada é.
 */
export function aviso(texto: string, opcoes: { destaque?: boolean } = {}): string {
  const fundo = opcoes.destaque ? COR.alertaFundo : COR.fundo
  const cor = opcoes.destaque ? COR.alerta : COR.tintaSuave
  return `<tr><td style="padding:0 32px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding:14px 18px;background:${fundo};font-family:${FONTE};font-size:13px;line-height:1.6;color:${cor};">${texto}</td>
    </tr></table></td></tr>`
}

/** Lista numerada ou com marcador, no mesmo tom do corpo. */
export function lista(itens: string[], opcoes: { numerada?: boolean } = {}): string {
  const tag = opcoes.numerada ? 'ol' : 'ul'
  const li = itens
    .map(i => `<li style="margin:0 0 7px;padding-left:4px;">${i}</li>`)
    .join('')
  return `<tr><td style="padding:0 32px 20px;"><${tag} style="margin:0;padding-left:20px;font-family:${FONTE};font-size:14px;line-height:1.6;color:${COR.tinta};">${li}</${tag}></td></tr>`
}

/** Botão. Tabela com fundo sólido — <a> estilizado some no Outlook. */
export function botao(rotulo: string, href: string): string {
  return `<tr><td style="padding:4px 32px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${COR.marca};">
        <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${FONTE};font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">${rotulo}</a>
      </td>
    </tr></table></td></tr>`
}

/** Separador fino. */
export function divisor(): string {
  return `<tr><td style="padding:4px 32px 20px;"><div style="height:1px;background:${COR.linha};line-height:1px;font-size:0;">&nbsp;</div></td></tr>`
}

/* ── Folha ──────────────────────────────────────────────────────────────── */

export interface FolhaOpcoes {
  /** Vai na barra de título do cliente. */
  assunto: string
  /**
   * Primeira linha do preview na caixa de entrada, escondida no corpo.
   * Sem isto o cliente mostra o começo do HTML, que costuma ser lixo.
   */
  previa: string
  /** Rótulo pequeno acima do título (ex.: "Protocolo FP-123456"). */
  etiqueta?: string
  titulo: string
  /** Blocos montados com as funções acima. */
  corpo: string
  /** Linha final do rodapé, abaixo da assinatura. */
  rodape?: string
}

/**
 * O invólucro: fundo, largura de 600px, cabeçalho com a logo e rodapé.
 *
 * A logo precisa de URL absoluta — cliente de e-mail não resolve caminho
 * relativo. O arquivo é `/images/email/flex-logo.png`, gerado a partir do
 * logotipo do site com duas correções: o traço é invertido (o original é
 * contorno BRANCO, que sumiria no fundo claro) e a arte é recortada na caixa
 * útil — o PNG de origem tem 38% de margem transparente, que fazia a marca
 * aparecer pequena e perdida. Sai em 300px e é exibida a 150px, para não
 * serrilhar em tela retina.
 */
export function folha({ assunto, previa, etiqueta, titulo, corpo, rodape }: FolhaOpcoes): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(assunto)}</title>
</head>
<body style="margin:0;padding:0;background:${COR.fundo};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(previa)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.fundo};">
    <tr><td align="center" style="padding:28px 12px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${COR.papel};">

        <tr><td style="padding:30px 32px 0;">
          <img src="${SITE}/images/email/flex-logo.png" width="150" alt="Flex Fitness Center" style="display:block;width:150px;height:auto;border:0;">
        </td></tr>

        ${etiqueta ? `<tr><td style="padding:26px 32px 0;font-family:${FONTE};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${COR.marca};">${etiqueta}</td></tr>` : ''}

        <tr><td style="padding:${etiqueta ? '8px' : '26px'} 32px 18px;font-family:${FONTE};font-size:24px;line-height:1.25;font-weight:700;color:${COR.tinta};">${titulo}</td></tr>

        ${corpo}

        <tr><td style="padding:8px 32px 30px;">
          <div style="height:1px;background:${COR.linha};line-height:1px;font-size:0;">&nbsp;</div>
          <p style="margin:18px 0 0;font-family:${FONTE};font-size:13px;line-height:1.6;color:${COR.tintaSuave};">
            <strong style="color:${COR.tinta};">Flex Fitness Center</strong><br>
            Goiânia e Palmas &middot; <a href="${SITE}" style="color:${COR.marca};text-decoration:none;">flexfitnesscenter.com.br</a>
          </p>
          ${rodape ? `<p style="margin:12px 0 0;font-family:${FONTE};font-size:12px;line-height:1.6;color:${COR.tintaFraca};">${rodape}</p>` : ''}
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`
}
