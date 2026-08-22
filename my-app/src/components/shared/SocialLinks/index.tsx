/**
 * A linha de redes sociais.
 *
 * Os ícones são SVG inline em vez de virem de uma biblioteca: as marcas de
 * terceiro foram removidas do lucide (a versão aqui é a 1.7.0) e puxar o
 * `react-icons` inteiro por dois glifos custa mais do que estas dez linhas.
 * Traço, não preenchimento, para casar com o resto da interface.
 *
 * Duas variantes:
 *   `icon`   — só o glifo, num alvo de 44px. Para barras e rodapés apertados.
 *   `inline` — glifo + nome, para quando há espaço e o nome ajuda a escanear.
 */

import { SOCIAL_LINKS, SocialId } from '@/lib/constants/social'

const PATHS: Record<SocialId, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
}

function SocialIcon({ id, size }: { id: SocialId; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[id]}
    </svg>
  )
}

interface SocialLinksProps {
  variant?: 'icon' | 'inline'
  /** rótulo do grupo para leitores de tela — o contexto muda por lugar */
  label?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function SocialLinks({
  variant = 'icon',
  label = 'Redes sociais da Flex',
  size = 18,
  className,
  style,
}: SocialLinksProps) {
  return (
    <ul
      className={className}
      aria-label={label}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: variant === 'icon' ? 8 : 10,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        ...style,
      }}
    >
      {SOCIAL_LINKS.map(social => (
        <li key={social.id}>
          <a
            className={variant === 'icon' ? 'social-icon' : 'social-inline'}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            // o glifo sozinho não tem texto: o nome da rede vira o nome acessível
            aria-label={variant === 'icon' ? `${social.label} da Flex` : undefined}
            title={variant === 'icon' ? social.label : undefined}
          >
            <SocialIcon id={social.id} size={size} />
            {variant === 'inline' && <span>{social.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
