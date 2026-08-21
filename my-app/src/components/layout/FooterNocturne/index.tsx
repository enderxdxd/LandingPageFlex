/**
 * Rodapé da home redesenhada.
 *
 * O padding-bottom de 120px existe para liberar a barra de ação fixa abaixo de
 * 1000px — sem ele a última linha de links termina atrás de uma superfície
 * opaca. O endereço vem de `units-data.ts`, não reescrito aqui.
 */

import Image from 'next/image'
import Link from 'next/link'
import { getUnitBySlug } from '@/lib/constants/units-data'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

const LEGAL = [
  { href: '/procedimentos', label: 'Procedimentos' },
  { href: '/privacy-policy', label: 'Política de Privacidade' },
  { href: '/termos-uso', label: 'Termos de Uso' },
  { href: '/trabalhe-aqui', label: 'Trabalhe aqui' },
]

export default function FooterNocturne() {
  const alphaville = getUnitBySlug('alphaville')

  return (
    <footer style={{ padding: 'clamp(40px,5vw,64px) var(--edge) 120px' }}>
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'clamp(28px,4vw,64px)',
        }}
      >
        <div style={{ maxWidth: '46ch' }}>
          <Image
            src="/images/units/alphaville/flex-logo-outline.png"
            alt="Flex Fitness Center"
            width={104}
            height={30}
            style={{ width: 104, height: 'auto', display: 'block' }}
          />

          <p
            style={{
              margin: '20px 0 6px',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
            }}
          >
            Evolution Flex Fitness Center Ltda · CNPJ 41.033.075/0001-56
          </p>

          {alphaville && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
              }}
            >
              {alphaville.addressShort}
            </p>
          )}

          <p
            style={{
              margin: '22px 0 0',
              fontSize: 11,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--color-text) 52%, transparent)',
            }}
          >
            {yearsInBusiness()} anos no mercado fitness · desde {FOUNDED_YEAR}
          </p>
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {LEGAL.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: 13,
                color: 'color-mix(in srgb, var(--color-text) 68%, transparent)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
