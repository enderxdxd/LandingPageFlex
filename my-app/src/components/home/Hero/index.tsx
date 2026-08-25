'use client'

/**
 * O átrio — a abertura da home.
 *
 * SUBSTITUI os dois capítulos fixados (380vh + 280vh de rolagem sequestrada).
 * Aquilo prendia o visitante por seis telas antes da primeira informação útil;
 * isto entrega a marca, o estado da rede e as quatro unidades em UMA tela, e o
 * conteúdo começa logo abaixo.
 *
 * A ideia: a academia se vende pelo espaço, então o espaço é o fundo. O índice
 * das quatro unidades no rodapé do herói é ao mesmo tempo a legenda da foto, o
 * seletor dela e o link para a página da unidade — um elemento com três
 * funções, em vez de três elementos.
 *
 * Nada aqui depende de scroll. A troca é por tempo, por hover ou por toque, e
 * para de girar assim que a pessoa escolhe — quem demonstrou intenção manda.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { unitsData } from '@/lib/constants/units-data'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'
import { yearsInBusiness } from '@/lib/home/brand'
import { useNetworkOpen } from '@/hooks/useLiveStatus'
import { usePrefersReducedMotion } from '@/hooks/useCompact'
import { setHeaderSolid } from '@/lib/home/header-state'
import PhotoCrossfade from '@/components/shared/PhotoCrossfade'

const ROTATE_MS = 6500
const HERO_SIZES = '100vw'

export default function Hero() {
  const [index, setIndex] = useState(0)
  /** verdadeiro assim que a pessoa escolhe uma unidade: o giro automático para */
  const [held, setHeld] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const open = useNetworkOpen()
  const reduced = usePrefersReducedMotion()

  const unit = unitsData[index]

  useEffect(() => {
    if (held || reduced) return
    const timer = window.setInterval(
      () => setIndex(i => (i + 1) % unitsData.length),
      ROTATE_MS
    )
    return () => window.clearInterval(timer)
  }, [held, reduced])

  /* O header ficava sólido por conta do capítulo 2. Sem os capítulos, quem
     decide é um sentinela no pé do herói — sem ouvir evento de scroll. */
  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => setHeaderSolid(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(node)
    return () => {
      io.disconnect()
      setHeaderSolid(false)
    }
  }, [])

  const choose = useCallback((i: number) => {
    setIndex(i)
    setHeld(true)
  }, [])

  return (
    <section className="hero" aria-label="Flex Fitness Center">
      <div className="hero-frame">
        <PhotoCrossfade
          src={unit.wideImage}
          alt={`Unidade ${unit.name}`}
          sizes={HERO_SIZES}
          priority
          warm={unitsData.map(u => u.wideImage)}
        />
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-lead">
          <p className="hero-eyebrow">
            <span
              className="hero-dot"
              data-open={open ? 'true' : 'false'}
              aria-hidden="true"
            />
            {open === null
              ? 'Rede FLEX'
              : open
                ? 'Aberto agora'
                : 'Fechado agora'}
            <span className="hero-eyebrow-sep" aria-hidden="true" />
            {yearsInBusiness()} anos
          </p>

          <h1 className="hero-title">
            A evolução
            <br />
            do seu treino
          </h1>

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
            <Link className="btn btn-secondary" href={`/unidades/${unit.slug}`}>
              Conhecer a {unit.name}
            </Link>
          </div>
        </div>

        {/* o índice: legenda da foto, seletor e link, no mesmo elemento */}
        <ul className="hero-index">
          {unitsData.map((u, i) => (
            <li key={u.slug}>
              <Link
                href={`/unidades/${u.slug}`}
                aria-current={i === index ? 'true' : undefined}
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onTouchStart={() => choose(i)}
              >
                <span className="hero-index-name">{u.name}</span>
                <span className="hero-index-meta">
                  {u.city.split(' — ')[0]} · {u.area}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div ref={sentinelRef} className="hero-sentinel" aria-hidden="true" />
    </section>
  )
}
