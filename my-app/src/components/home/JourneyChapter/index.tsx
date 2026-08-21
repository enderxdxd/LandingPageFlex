'use client'

/**
 * Capítulo 2 — três salas, 280vh.
 *
 * O capítulo 1 termina na foto wide de Alphaville em scale 1 e o capítulo 2
 * abre na MESMA fotografia em scale 1 — a emenda é invisível e a câmera
 * simplesmente continua. Preservar isso.
 *
 * A última sala fica full-bleed. Uma revisão anterior recortou-a num container
 * com moldura; o cliente achou confuso. O silêncio vem da declaração de marca
 * abaixo, não de um crop. Não recolocar o crop.
 */

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'
import { useNarrow, usePrefersReducedMotion } from '@/hooks/useCompact'
import { setHeaderSolid } from '@/lib/home/header-state'
import {
  CHAPTER_HEIGHTS,
  clamp01,
  ease,
  lerp,
  seg,
  usePinnedChapter,
} from '@/hooks/usePinnedChapter'

const J1 = '/images/optimized/buenavista-wide.webp'
const J2 = '/images/optimized/palmas-01.webp'
const J3 = '/images/optimized/alphaville-crossfit.webp'

export default function JourneyChapter() {
  const wrapRef = useRef<HTMLDivElement>(null)

  const j1Ref = useRef<HTMLDivElement>(null)
  const j2Ref = useRef<HTMLDivElement>(null)
  const j3Ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const wp1Ref = useRef<HTMLElement>(null)
  const wp2Ref = useRef<HTMLElement>(null)
  const finalRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const pathLenRef = useRef(0)

  const narrow = useNarrow()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    pathLenRef.current = len
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = String(len)
  }, [])

  const apply = useCallback((p: number) => {
    const j1 = j1Ref.current
    const j2 = j2Ref.current
    const j3 = j3Ref.current
    const svg = svgRef.current
    const path = pathRef.current
    const fin = finalRef.current
    if (!j1 || !j2 || !j3 || !svg || !fin) return

    /* ── 0.00–0.20 · Alphaville respira, a linha nasce e define a direção ───
       A câmera continua saindo do portal, então a emenda é invisível. */
    j1.style.transform = `scale(${lerp(1, 1.04, seg(p, 0, 0.3))})`

    /* ── 0.20–0.40 · Palmas · 0.44–0.64 · CrossFit ─────────────────────────
       Cada sala termina de entrar ANTES do card correspondente: a informação
       só é liberada quando a fotografia dela já está estabelecida. */
    const j2in = clamp01(seg(p, 0.2, 0.32))
    const j3in = clamp01(seg(p, 0.44, 0.56))
    j2.style.opacity = String(j2in * (1 - j3in))
    j2.style.transform = `scale(${lerp(1.05, 1, ease(j2in))})`
    j3.style.opacity = String(j3in)
    j3.style.transform = `scale(${lerp(1.05, 1, ease(j3in))})`

    /* a linha atravessa as três e se retira antes da copy chegar */
    const draw = clamp01(seg(p, 0.05, 0.6)) // quase linear: uma linha é traçada
    // sai junto com os cards (0.64–0.74): a rota e o que ela revelou são um só
    const routeGone = clamp01(seg(p, 0.64, 0.74))
    svg.style.opacity = String(clamp01(seg(p, 0.04, 0.11)) * (1 - routeGone))
    if (path && pathLenRef.current) {
      path.style.strokeDashoffset = String(pathLenRef.current * (1 - draw))
    }

    /* a linha ALCANÇAR a máquina é o que revela o fabricante — por isso cada
       waypoint começa depois da sua sala ter terminado de entrar */
    const waypoint = (el: HTMLElement | null, from: number) => {
      if (!el) return
      const t = ease(clamp01(seg(p, from, from + 0.08)))
      el.style.opacity = String(t * (1 - routeGone))
      el.style.transform = `translate3d(0, ${lerp(14, 0, t)}px, 0) scale(${lerp(0.96, 1, t)})`
    }
    waypoint(wp1Ref.current, 0.32) // Life Fitness, depois de Palmas assentar
    waypoint(wp2Ref.current, 0.56) // Eleiko, depois do CrossFit assentar

    /* ── 0.76–1.00 · a interface chega em duas microfases ───────────────────
       Kicker e título primeiro; CTAs e nomes das unidades logo atrás. Um ponto
       de pouso, em vez de tudo aparecendo no mesmo frame. */
    const f = ease(clamp01(seg(p, 0.76, 0.94)))
    fin.style.opacity = String(f)
    fin.style.transform = `translate3d(0, ${lerp(22, 0, f)}px, 0)`

    if (actionsRef.current) {
      const a = ease(clamp01(seg(p, 0.82, 1)))
      actionsRef.current.style.opacity = String(a)
      actionsRef.current.style.transform = `translate3d(0, ${lerp(10, 0, a)}px, 0)`
    }

    setHeaderSolid(p > 0.62)
  }, [])

  usePinnedChapter(wrapRef, apply)

  const height = reduced
    ? '100vh'
    : narrow
      ? CHAPTER_HEIGHTS.two.narrow
      : CHAPTER_HEIGHTS.two.wide

  return (
    <div ref={wrapRef} style={{ position: 'relative', height }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--color-stage)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div ref={j1Ref} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <Image
              src={J1}
              alt="Área de treino da unidade Buena Vista"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            ref={j2Ref}
            style={{ position: 'absolute', inset: 0, opacity: 0, willChange: 'transform, opacity' }}
          >
            <Image
              src={J2}
              alt="Sala de musculação da unidade Palmas"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            ref={j3Ref}
            style={{ position: 'absolute', inset: 0, opacity: 0, willChange: 'transform, opacity' }}
          >
            <Image
              src={J3}
              alt="CrossFit Box da unidade Alphaville"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(11,12,20,.44), rgba(11,12,20,.68))',
            }}
          />
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          <path
            ref={pathRef}
            d="M 96 792 C 372 770 402 566 636 540 S 1010 604 1214 372"
            fill="none"
            stroke="#3B82F6"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </svg>

        <figure
          ref={wp1Ref as React.RefObject<HTMLElement>}
          style={{
            position: 'absolute',
            left: '36%',
            top: '50%',
            width: 'clamp(130px,14vw,210px)',
            margin: 0,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Image
              src={J2}
              alt="Equipamentos Life Fitness na unidade Palmas"
              fill
              sizes="(max-width: 820px) 40vw, 210px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <figcaption
            style={{
              paddingTop: 8,
              fontSize: 11,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
            }}
          >
            Life Fitness
          </figcaption>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 11,
              color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
            }}
          >
            Cardio e força
          </p>
        </figure>

        <figure
          ref={wp2Ref as React.RefObject<HTMLElement>}
          style={{
            position: 'absolute',
            left: '68%',
            top: '24%',
            width: 'clamp(130px,14vw,210px)',
            margin: 0,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Image
              src={J3}
              alt="Anilhas e barras no CrossFit Box"
              fill
              sizes="(max-width: 820px) 40vw, 210px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <figcaption
            style={{
              paddingTop: 8,
              fontSize: 11,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
            }}
          >
            Eleiko
          </figcaption>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 11,
              color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
            }}
          >
            Peso livre, padrão olímpico
          </p>
        </figure>

        {/* a interface resolvida */}
        <div
          ref={finalRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 var(--edge) clamp(28px,5vh,56px)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', width: '100%' }}>
            <p className="kicker" style={{ marginBottom: 14 }}>
              Flex Fitness Center
            </p>
            <h1
              style={{
                margin: '0 0 20px',
                fontSize: 'clamp(44px,8vw,124px)',
                lineHeight: 0.9,
                letterSpacing: '-.01em',
                maxWidth: '14ch',
              }}
            >
              A evolução do seu treino
            </h1>
            <div
              ref={actionsRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px 28px',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              <a
                className="btn btn-primary"
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '11px 20px' }}
              >
                Falar no WhatsApp
              </a>
              <a className="btn btn-secondary" href="#unidades" style={{ padding: '11px 20px' }}>
                Ver as unidades
              </a>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                }}
              >
                Alphaville · Buena Vista · Marista · Palmas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
