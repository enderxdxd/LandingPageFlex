/**
 * As redes sociais da FLEX — fonte única.
 *
 * Antes o Instagram estava escrito à mão em três lugares (Localização, o card
 * de unidade, e o campo `instagram` de cada unidade em `units-data.ts`, com o
 * mesmo perfil repetido quatro vezes). Trocar o perfil significava caçar
 * ocorrências. Agora é este arquivo.
 *
 * Para adicionar uma rede, basta acrescentar aqui: rodapé, drawer e a seção de
 * Localização leem esta lista e o ícone vem de `SocialLinks`.
 */

export type SocialId = 'instagram' | 'facebook'

export interface SocialLink {
  id: SocialId
  label: string
  /** o @ ou /pagina, para quando houver espaço de mostrar */
  handle: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@flexfitnesscenter',
    href: 'https://www.instagram.com/flexfitnesscenter/',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: '/FlexAcademia',
    href: 'https://www.facebook.com/FlexAcademia/',
  },
]
