/** A rede, em números. */

import Reveal from '@/components/shared/Reveal'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

const FIGURES = [
  {
    value: String(yearsInBusiness()),
    accent: false,
    label: (
      <>
        anos de operação
        <br />
        desde {FOUNDED_YEAR}, em Goiânia
      </>
    ),
  },
  { value: '4', accent: false, label: <>unidades — três em Goiânia,<br />uma em Palmas</> },
  {
    value: '4:30',
    accent: true,
    label: <>abertura mais cedo da cidade<br />Alphaville e Buena Vista</>,
  },
  { value: '7', accent: false, label: <>dias por semana,<br />em todas as unidades</> },
]

export default function Rede() {
  return (
    <section id="rede" className="section-seam" style={{ padding: 'var(--band) var(--edge)' }}>
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(32px,5vw,96px)',
          alignItems: 'start',
        }}
      >
        <Reveal>
          <h2 className="h-section" style={{ marginBottom: 22 }}>
            Uma história construída em Goiânia
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.65,
              maxWidth: '52ch',
              color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
            }}
          >
            Desde {FOUNDED_YEAR}, a FLEX construiu {yearsInBusiness()} anos de história em Goiânia.
            São quatro unidades e uma estrutura pensada para quem treina cedo, treina tarde e treina
            sério. Cada endereço tem identidade própria — o que não muda é o padrão de equipamento e
            de atendimento.
          </p>
        </Reveal>

        <Reveal delay={90} style={{ display: 'grid', gap: 0 }}>
          {FIGURES.map((figure, i) => (
            <div
              key={figure.value}
              style={{
                /* antes era space-between: a 1440px o número ficava a 400px do
                   próprio rótulo e o olho não associava um ao outro */
                display: 'grid',
                gridTemplateColumns: 'minmax(84px, auto) 1fr',
                alignItems: 'baseline',
                gap: 'clamp(14px,2vw,28px)',
                padding: '20px 0',
                borderBottom:
                  i === FIGURES.length - 1 ? 'none' : '1px solid var(--color-divider)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 'clamp(38px,4.4vw,58px)',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  color: figure.accent ? 'var(--color-accent-600)' : 'var(--color-text)',
                }}
              >
                {figure.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: 'color-mix(in srgb, var(--color-text) 58%, transparent)',
                }}
              >
                {figure.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
