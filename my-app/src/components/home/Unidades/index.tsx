'use client'

/**
 * Seletor de unidade + painel.
 *
 * A esquerda é uma LISTA de seleção, não cards. A direita é o painel da unidade
 * escolhida — e a fotografia dele abre a página da unidade.
 *
 * A troca de unidade é um crossfade real: o painel que sai continua em cena
 * enquanto o que entra sobe, os dois na mesma célula do grid. Antes era
 * `display: none/block` com fade só na entrada — a saída sumia num frame e a
 * altura pulava quando os textos das unidades tinham tamanhos diferentes.
 * A fotografia não se desloca; ela só faz crossfade, e só depois de carregada.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { unitsData, unitWhatsAppUrl } from '@/lib/constants/units-data'
import PhotoCrossfade from '@/components/shared/PhotoCrossfade'

/** Precisa bater com a duração de panelIn/panelOut em globals.css. */
const SWAP_MS = 420

const PANEL_SIZES = '(max-width: 820px) 100vw, 55vw'

/** A coluna direita da lista: área, ou o estado quando ela não foi confirmada. */
const railMeta = (slug: string, area: string) =>
  slug === 'palmas' ? 'Tocantins' : area

/**
 * O bloco de dados da unidade. O painel que sai fica `inert`: continua visível
 * durante os 420ms, mas sai da ordem de tabulação e do leitor de tela — dois
 * "WhatsApp Alphaville" focáveis ao mesmo tempo seria pior que o corte seco.
 */
function UnitInfo({
  unit,
  className,
  leaving,
}: {
  unit: (typeof unitsData)[number]
  className: string
  leaving?: boolean
}) {
  return (
    <div
      className={className}
      aria-hidden={leaving || undefined}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px),1fr))',
        gap: '24px 40px',
      }}
    >
      <div>
        <p className="label-sm">Endereço</p>
        <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.5 }}>{unit.addressShort}</p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
          }}
        >
          {[unit.landmark, `${unit.parking} gratuitas`].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div>
        <p className="label-sm">Horário</p>
        <p style={{ margin: '0 0 4px', fontSize: 14 }}>
          Seg a Sex&nbsp;&nbsp;{unit.hours.weekdays}
        </p>
        <p style={{ margin: '0 0 4px', fontSize: 14 }}>Sábado&nbsp;&nbsp;{unit.hours.saturday}</p>
        <p style={{ margin: '0 0 14px', fontSize: 14 }}>Domingo&nbsp;&nbsp;{unit.hours.sunday}</p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
          }}
        >
          {unit.phone} · WhatsApp {unit.whatsapp}
        </p>
      </div>

      <div>
        <p className="label-sm">Diferenciais</p>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            fontSize: 14,
          }}
        >
          {(unit.specialFeatures ?? []).filter(Boolean).map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <a
          className="btn btn-primary"
          href={unitWhatsAppUrl(unit)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={leaving ? -1 : undefined}
          style={{ marginTop: 18, padding: '9px 16px' }}
        >
          WhatsApp {unit.name}
        </a>
      </div>
    </div>
  )
}

export default function Unidades() {
  const [selected, setSelected] = useState(unitsData[0].slug)
  /** a unidade que ainda está saindo de cena, ou null */
  const [leaving, setLeaving] = useState<string | null>(null)
  /** fotos aquecidas por intenção de hover/foco */
  const [warm, setWarm] = useState<string[]>([])
  const timer = useRef<number | null>(null)

  const unit = unitsData.find(u => u.slug === selected) ?? unitsData[0]
  const leavingUnit = leaving ? unitsData.find(u => u.slug === leaving) : undefined

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const select = useCallback(
    (slug: string) => {
      setSelected(current => {
        if (current === slug) return current
        setLeaving(current)
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setLeaving(null), SWAP_MS)
        return slug
      })
    },
    []
  )

  /** hover/foco só pré-carrega; o clique é que confirma. */
  const warmUp = useCallback((src: string) => {
    setWarm(current => (current.includes(src) ? current : [...current, src]))
  }, [])

  return (
    <section id="unidades" className="section-seam" style={{ padding: 'var(--band) 0' }}>
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '0 var(--edge) 40px',
        }}
      >
        <p className="kicker">Unidades</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <h2 className="h-section" style={{ maxWidth: '16ch' }}>
            Escolha por onde começar
          </h2>
          <Link
            className="btn btn-secondary"
            href={`/unidades/${unit.slug}`}
            style={{ padding: '10px 16px' }}
          >
            Abrir página da unidade
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '0 var(--edge)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(24px,3vw,56px)',
          alignItems: 'start',
        }}
      >
        {/* seletor */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid var(--color-divider)',
          }}
        >
          {unitsData.map(u => {
            const on = u.slug === selected
            return (
              <button
                key={u.slug}
                type="button"
                aria-pressed={on}
                onClick={() => select(u.slug)}
                onPointerEnter={() => warmUp(u.wideImage)}
                onFocus={() => warmUp(u.wideImage)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  width: '100%',
                  padding: '22px 4px',
                  paddingLeft: on ? 14 : 4,
                  background: 'transparent',
                  border: 0,
                  borderBottom: '1px solid var(--color-divider)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: 'clamp(26px,3vw,44px)',
                  lineHeight: 1,
                  color: on ? 'var(--color-accent-600)' : 'var(--color-text)',
                  transition: 'color .25s var(--ease-arch), padding-left .25s var(--ease-arch)',
                }}
              >
                <span>{u.name}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    letterSpacing: '.14em',
                    whiteSpace: 'nowrap',
                    color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
                  }}
                >
                  {railMeta(u.slug, u.area)}
                </span>
              </button>
            )
          })}
        </div>

        {/* painel */}
        <div>
          {/* a fotografia fica parada: só troca, e só quando a próxima carregou */}
          <Link
            href={`/unidades/${unit.slug}`}
            aria-label={`Abrir a página da unidade ${unit.name}`}
            style={{
              position: 'relative',
              display: 'block',
              aspectRatio: '16 / 10',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <PhotoCrossfade
              src={unit.wideImage}
              alt={`Unidade ${unit.name}`}
              sizes={PANEL_SIZES}
              warm={warm}
            />
            <span className="open-unit">Ver unidade →</span>
          </Link>

          {/* o texto é que faz o crossfade — os dois painéis dividem a célula,
              então a altura não pula durante a troca */}
          <div className="panel-stack" style={{ paddingTop: 26 }}>
            <UnitInfo key={unit.slug} unit={unit} className="panel-in" />
            {leavingUnit && (
              <UnitInfo key={leavingUnit.slug} unit={leavingUnit} className="panel-out" leaving />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
