/**
 * Caixas de venda por unidade — fonte única.
 *
 * Estas quatro são as caixas que existem de fato no painel da Locaweb. Antes
 * cada rota mantinha a própria lista, e `send-freepass` tinha CINCO endereços
 * inventados (`vendas.flexbuenavista@`, `vendas.flexmarista@`,
 * `vendas.flexalphaville@`, `vendas.flexpalmas@`, `vendasflexmarista@`) que não
 * correspondiam a caixa nenhuma. Tudo que ia para eles batia em caixa
 * inexistente — parte dos bounces vinha daqui.
 *
 * Ao mexer: confira contra o painel de e-mail antes, não contra outra rota.
 */
export const UNIT_SALES_INBOX: Record<string, string> = {
  alphaville: 'vendas.alphaville@flexacademia.com.br',
  'buena-vista': 'vendasflexbuenavista@flexacademia.com.br',
  marista: 'vendasmarista@flexacademia.com.br',
  palmas: 'vendaspalmas@flexacademia.com.br',
}

/** Acompanham toda solicitação, qualquer que seja a unidade. */
export const CENTRAL_INBOXES = [
  'comercial.atendimento@flexacademia.com.br',
  'comercial@flexacademia.com.br',
]

/** Palmas é operação própria e tem um time técnico que também acompanha. */
const EXTRA_BY_UNIT: Record<string, string[]> = {
  palmas: ['gestaotecnica@flexpalmas.com.br', 'comercial@flexpalmas.com.br'],
}

/**
 * Quem recebe a solicitação de UMA unidade.
 *
 * A unidade da solicitação + o comercial central, e mais ninguém. Antes a lista
 * de cada unidade incluía as outras três, então um pedido do Marista chegava
 * na caixa da Buena Vista — foi exatamente a reclamação que originou isto.
 */
export function recipientsForUnit(slug: string): string {
  const own = UNIT_SALES_INBOX[slug]
  return [own, ...CENTRAL_INBOXES, ...(EXTRA_BY_UNIT[slug] ?? [])]
    .filter(Boolean)
    .join(',')
}
