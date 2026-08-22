'use client'

/**
 * Localização — split screen: escolha uma unidade, a moldura acompanha.
 *
 * Hover PRÉ-VISUALIZA, clique COMPROMETE. O hover fica atrás de
 * `(hover: hover) and (pointer: fine)`, então o toque só recebe o clique — e o
 * `focus` também pré-visualiza, para que o teclado tenha o mesmo retorno.
 *
 * A fotografia à direita abre a página da unidade.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { unitsData, unitMapUrl, unitWhatsAppUrl } from '@/lib/constants/units-data'
import PhotoCrossfade from '@/components/shared/PhotoCrossfade'
import Reveal from '@/components/shared/Reveal'
import SocialLinks from '@/components/shared/SocialLinks'

const EMAIL = 'contato@flexacademia.com.br'
const FRAME_SIZES = '(max-width: 820px) 100vw, 46vw'

export default function Localizacao() {
  const [committed, setCommitted] = useState(unitsData[0].slug)
  const [preview, setPreview] = useState(unitsData[0].slug)
  const [fine, setFine] = useState(false)
  const [warm, setWarm] = useState<string[]>([])

  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  const unit = unitsData.find(u => u.slug === preview) ?? unitsData[0]

  const commit = useCallback((slug: string) => {
    setCommitted(slug)
    setPreview(slug)
  }, [])

  /**
   * Hover e foco carregam a fotografia; o clique confirma. Sem isto, a prévia
   * começava o fade antes da imagem existir e a moldura piscava vazia na
   * primeira passagem por cada unidade.
   */
  const warmUp = useCallback((src: string) => {
    setWarm(current => (current.includes(src) ? current : [...current, src]))
  }, [])

  return (
    <section
      id="localizacao"
      className="section-seam"
      style={{ padding: 'var(--band) var(--edge)' }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Reveal>
          <p className="kicker">Localização</p>
          <h2
            className="h-section"
            style={{ marginBottom: 'clamp(28px,4vw,52px)', maxWidth: '20ch' }}
          >
            Encontre a FLEX mais perto de você
          </h2>
        </Reveal>

        <Reveal
          delay={90}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))',
            gap: 'clamp(28px,4vw,64px)',
            alignItems: 'start',
          }}
        >
          {/* trilho */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            {unitsData.map(u => {
              const on = u.slug === preview
              return (
                <button
                  key={u.slug}
                  type="button"
                  aria-current={u.slug === committed ? 'true' : 'false'}
                  onClick={() => commit(u.slug)}
                  onFocus={() => {
                    warmUp(u.wideImage)
                    setPreview(u.slug)
                  }}
                  onBlur={() => setPreview(committed)}
                  onPointerEnter={() => warmUp(u.wideImage)}
                  onMouseEnter={fine ? () => setPreview(u.slug) : undefined}
                  onMouseLeave={fine ? () => setPreview(committed) : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 16,
                    width: '100%',
                    padding: '20px 4px',
                    paddingLeft: on ? 14 : 4,
                    background: 'transparent',
                    border: 0,
                    borderBottom: '1px solid var(--color-divider)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: on ? 'var(--color-accent-600)' : 'var(--color-text)',
                    transition: 'color .25s var(--ease-arch), padding-left .25s var(--ease-arch)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: 'clamp(22px,2.4vw,32px)',
                      lineHeight: 1,
                    }}
                  >
                    {u.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      textAlign: 'right',
                      color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                    }}
                  >
                    {u.city}
                  </span>
                </button>
              )
            })}

            <div
              style={{
                display: 'grid',
                gap: 10,
                fontSize: 13,
                paddingTop: 26,
                color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
              }}
            >
              {unitsData
                .filter(u => u.slug !== 'palmas')
                .map(u => (
                  <div
                    key={u.slug}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      paddingBottom: 10,
                      borderBottom: '1px solid var(--color-divider)',
                    }}
                  >
                    <span>{u.name}</span>
                    <span style={{ color: 'var(--color-text)' }}>{u.phone}</span>
                  </div>
                ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span>E-mail</span>
                <a href={`mailto:${EMAIL}`} style={{ color: 'var(--color-accent-300)' }}>
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* moldura */}
          <div>
            <Link
              href={`/unidades/${unit.slug}`}
              aria-label={`Abrir a página da unidade ${unit.name}`}
              style={{
                position: 'relative',
                display: 'block',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <PhotoCrossfade
                src={unit.wideImage}
                alt={`Unidade ${unit.name}`}
                sizes={FRAME_SIZES}
                warm={warm}
              />
              <span className="open-unit">Ver unidade →</span>
            </Link>

            <p style={{ margin: '22px 0 6px', fontSize: 15, lineHeight: 1.6 }}>
              {unit.addressShort}
            </p>
            <p
              style={{
                margin: '0 0 22px',
                fontSize: 13,
                color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
              }}
            >
              {[unit.landmark, unit.parking].filter(Boolean).join(' · ')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a
                className="btn btn-primary"
                href={unitMapUrl(unit)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '11px 18px' }}
              >
                Como chegar
              </a>
              <a
                className="btn btn-secondary"
                href={unitWhatsAppUrl(
                  unit,
                  `Olá! Gostaria de saber como chegar na unidade ${unit.name} da Flex Fitness.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '11px 18px' }}
              >
                Falar no WhatsApp
              </a>
              {/* as redes ficam como ícones ao lado das duas ações de ir até a
                  unidade — presentes, mas sem competir com "Como chegar" */}
              <SocialLinks label={`Redes sociais da Flex — unidade ${unit.name}`} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
