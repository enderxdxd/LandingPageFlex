/**
 * Uma tabela, não uma grade de cards.
 *
 * As linhas 08–10 são específicas de unidade e o texto do item vem em
 * accent-300 — é o que diferencia "padrão da rede" de "só aqui".
 */

import Reveal from '@/components/shared/Reveal'

const ROWS: { item: string; scope: string; perUnit?: boolean }[] = [
  { item: 'Musculação completa', scope: '4 unidades' },
  { item: 'Cardio premium', scope: '4 unidades' },
  { item: 'Aulas coletivas', scope: '4 unidades' },
  { item: 'Personal training', scope: '4 unidades' },
  { item: 'Vestiários premium', scope: '4 unidades' },
  { item: 'Estacionamento gratuito', scope: '+180 vagas' },
  { item: 'Espaço Kids monitorado', scope: '4 unidades' },
  { item: 'CrossFit Box', scope: 'Alphaville', perUnit: true },
  { item: 'Loja de suplementos', scope: 'Alphaville e Buena Vista', perUnit: true },
  { item: 'Piscina semi-olímpica e sauna', scope: 'Palmas', perUnit: true },
]

/** Levas de 4/3/3: o padrão da rede, o resto do padrão, e o que é por unidade. */
const GROUPS = [ROWS.slice(0, 4), ROWS.slice(4, 7), ROWS.slice(7)]

export default function Estrutura() {
  return (
    <section id="estrutura" className="section-seam" style={{ padding: 'var(--band) var(--edge)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Reveal
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))',
            gap: 'clamp(28px,4vw,72px)',
            alignItems: 'end',
            marginBottom: 'clamp(32px,4vw,60px)',
          }}
        >
          <div>
            <h2 className="h-section">
              O que existe em
              <br />
              todas as unidades
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: '44ch',
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            }}
          >
            A lista abaixo é o padrão da rede. O que muda de uma unidade para outra está marcado na
            coluna da direita.
          </p>
        </Reveal>

        {/* a tabela entra em três levas, não em dez animações independentes —
            um <table> aceita vários <tbody>, então cada grupo é um bloco só */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          {GROUPS.map((group, groupIndex) => (
            <Reveal as="tbody" key={group[0].item} delay={groupIndex * 110}>
              {group.map(row => {
                const i = ROWS.indexOf(row)
                return (
                  <tr
                    key={row.item}
                    style={{
                      borderBottom:
                        i === ROWS.length - 1 ? 'none' : '1px solid var(--color-divider)',
                    }}
                  >
                    <td
                      style={{
                        padding: '15px 12px 15px 0',
                        width: 44,
                        color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td
                      style={{
                        padding: '15px 0',
                        color: row.perUnit ? 'var(--color-accent-300)' : undefined,
                      }}
                    >
                      {row.item}
                    </td>
                    <td
                      style={{
                        padding: '15px 0',
                        textAlign: 'right',
                        color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                      }}
                    >
                      {row.scope}
                    </td>
                  </tr>
                )
              })}
            </Reveal>
          ))}
        </table>
      </div>
    </section>
  )
}
