/** A rede, em números. */

import Reveal from '@/components/shared/Reveal'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

/**
 * Ficha da rede: rótulo à esquerda, valor à direita.
 *
 * Antes isto era a grade de "número gigante + rótulo miúdo" — o mesmo bloco de
 * estatísticas que aparece em toda landing page gerada, e que por isso não
 * convence mais ninguém: o tamanho da fonte vira o argumento no lugar do fato.
 * Como ficha, os mesmos quatro fatos leem como documentação da operação, que é
 * o que eles são, e ficam alinhados com a tabela da seção Estrutura.
 *
 * "4:30" continua destacado porque é o único número aqui que é, de fato,
 * incomum — academia que abre às quatro e meia da manhã é a exceção.
 */
const FICHA = [
  { rotulo: 'Em operação', valor: `${yearsInBusiness()} anos`, nota: `desde ${FOUNDED_YEAR}` },
  { rotulo: 'Unidades', valor: '4', nota: 'três em Goiânia, uma em Palmas' },
  { rotulo: 'Abre às', valor: '4:30', nota: 'Alphaville e Buena Vista', destaque: true },
  { rotulo: 'Funciona', valor: '7 dias', nota: 'em todas as unidades' },
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
          {FICHA.map((linha, i) => (
            <div
              key={linha.rotulo}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'baseline',
                gap: 'clamp(14px,2vw,28px)',
                padding: '16px 0',
                borderBottom:
                  i === FICHA.length - 1 ? 'none' : '1px solid var(--color-divider)',
              }}
            >
              <span style={{ fontSize: 15, lineHeight: 1.4 }}>
                {linha.rotulo}
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    marginTop: 2,
                    color: 'color-mix(in srgb, var(--color-text) 52%, transparent)',
                  }}
                >
                  {linha.nota}
                </span>
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: 1.2,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                  color: linha.destaque ? 'var(--color-accent-300)' : 'var(--color-text)',
                }}
              >
                {linha.valor}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
