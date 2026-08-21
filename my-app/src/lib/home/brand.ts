/**
 * Fatos da marca que dependem do calendário.
 *
 * O número de anos era escrito à mão em cada lugar da copy, e as versões
 * divergiam entre si. Derivar do ano de fundação mantém a home, o rodapé e a
 * abertura dizendo a mesma coisa, e a frase não envelhece sozinha na virada
 * do ano.
 */

export const FOUNDED_YEAR = 1991

/**
 * Anos completos de operação, contados no fuso de Brasília — o servidor roda em
 * UTC, e no dia 31/12 os dois lados responderiam anos diferentes.
 */
export const yearsInBusiness = (): number => {
  const year = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
    }).format(new Date())
  )

  return year - FOUNDED_YEAR
}
