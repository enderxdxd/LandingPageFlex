/**
 * A intro cinematográfica termina, a página respira.
 *
 * Sem imagem de fundo, sem borda, sem card. Esta seção é o respiro da página —
 * resistir a acrescentar qualquer coisa aqui.
 */

import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

export default function BrandStatement() {
  const years = yearsInBusiness()

  return (
    <section style={{ padding: 'clamp(88px,14vh,190px) var(--edge)', textAlign: 'center' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 'clamp(64px,13vw,210px)',
            lineHeight: 0.82,
            letterSpacing: '-.02em',
          }}
        >
          <span
            style={{
              display: 'block',
              marginBottom: 'clamp(12px,2vh,24px)',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(13px,1.5vw,20px)',
              fontWeight: 500,
              letterSpacing: '.28em',
              lineHeight: 1,
            }}
          >
            Desde {FOUNDED_YEAR}
          </span>
          {years} anos
        </p>
        <p
          style={{
            margin: 'clamp(20px,3vh,34px) 0 0',
            fontSize: 'clamp(15px,1.7vw,21px)',
            lineHeight: 1.55,
            letterSpacing: '.01em',
            color: 'color-mix(in srgb, var(--color-text) 64%, transparent)',
          }}
        >
          Construindo espaços para pessoas que se movem.
        </p>
      </div>
    </section>
  )
}
