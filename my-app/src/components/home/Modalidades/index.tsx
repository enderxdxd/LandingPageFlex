/**
 * Modalidades — o catálogo de aulas coletivas.
 *
 * A home tinha equipamento e estrutura, mas nada dizia o que ACONTECE nas
 * salas. Esta seção fecha essa lacuna entre "Estrutura" (o que existe) e
 * "Equipamentos" (com o que se treina).
 *
 * No CELULAR as categorias vêm fechadas. Aberta, esta seção ocupava 3,8 telas
 * — 23% da página inteira — de texto corrido que ninguém lê no telefone. Quem
 * quer o catálogo abre a categoria; quem está indo para horários ou unidades
 * passa por ela em meia tela.
 *
 * O padrão visual é o vocabulário que a página já usa — filete de 1px,
 * tipografia display à esquerda — em vez de mais um grid de cards. As
 * descrições vêm de `modalidades-data.ts`, a mesma fonte que a página da
 * unidade lê, então nenhuma copy é duplicada aqui.
 *
 * A grade com dias e horários NÃO vive aqui: ela é por unidade e sai do sistema
 * de PDFs no Firebase. Esta seção descreve as aulas e aponta para lá.
 */

'use client'

import Link from 'next/link'
import Reveal from '@/components/shared/Reveal'
import { useCompact } from '@/hooks/useCompact'
import { modalidadeCategories, modalidadesData } from '@/lib/constants/modalidades-data'

export default function Modalidades() {
  const compact = useCompact()

  return (
    <section
      id="modalidades"
      className="section-seam"
      style={{ padding: 'var(--band) var(--edge)' }}
    >
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
              O que acontece
              <br />
              dentro das salas
            </h2>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 20px',
                fontSize: 15,
                lineHeight: 1.65,
                maxWidth: '46ch',
                color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              }}
            >
              {modalidadesData.length} modalidades no catálogo da rede, de força e condicionamento a
              lutas, pilates e dança. A oferta varia por unidade — a grade vigente de cada endereço
              traz os dias e horários.
            </p>
            <Link
              className="btn btn-primary"
              href="/horarios#grades-coletivas"
              style={{ padding: '10px 16px' }}
            >
              Ver grade de aulas
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gap: 0 }}>
          {modalidadeCategories.map(category => {
            const classes = modalidadesData.filter(item => item.category === category)

            return (
              <Reveal key={category} className="modalidade-row">
                {/* no celular a categoria é um <details> nativo: sem JS de
                    abertura, acessível por teclado e com alvo de toque cheio */}
                {compact ? (
                  <details className="modalidade-fold">
                    <summary>
                      <span className="modalidade-categoria-nome">{category}</span>
                      <span className="modalidade-contagem">
                        {classes.length} {classes.length === 1 ? 'aula' : 'aulas'}
                      </span>
                    </summary>
                    <div className="modalidade-grid">
                      {classes.map(item => (
                        <article key={item.name}>
                          <h4
                            style={{
                              margin: '0 0 8px',
                              fontSize: 18,
                              letterSpacing: '.03em',
                            }}
                          >
                            {item.name}
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              lineHeight: 1.6,
                              color: 'color-mix(in srgb, var(--color-text) 64%, transparent)',
                            }}
                          >
                            {item.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </details>
                ) : (
                  <>
                <h3 className="modalidade-categoria">
                  {category}
                  <span>
                    {classes.length} {classes.length === 1 ? 'aula' : 'aulas'}
                  </span>
                </h3>

                <div className="modalidade-grid">
                  {classes.map(item => (
                    <article key={item.name}>
                      <h4
                        style={{
                          margin: '0 0 8px',
                          fontSize: 'clamp(17px,1.5vw,21px)',
                          letterSpacing: '.03em',
                        }}
                      >
                        {item.name}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: 'color-mix(in srgb, var(--color-text) 64%, transparent)',
                        }}
                      >
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
                  </>
                )}
              </Reveal>
            )
          })}
        </div>

        <p
          style={{
            margin: 'clamp(24px,3vw,36px) 0 0',
            paddingTop: 'clamp(24px,3vw,36px)',
            borderTop: '1px solid var(--color-divider)',
            fontSize: 12,
            lineHeight: 1.6,
            maxWidth: '70ch',
            color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          }}
        >
          A disponibilidade das modalidades varia por unidade. Confirme na grade da sua unidade —
          ou no WhatsApp dela — antes de se deslocar para uma aula específica.
        </p>
      </div>
    </section>
  )
}
