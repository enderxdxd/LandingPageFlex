'use client'

/**
 * Capítulo 1 — cinco cenas em 380vh.
 *
 * A régua sob o wordmark FLEX se solta, é puxada para além do quadro, volta ao
 * comprimento da barra, dobra para baixo nas duas pontas para fechar um volume,
 * é etiquetada como uma planta baixa, recebe sua cota e, por fim, é preenchida
 * pela fotografia da sala que acabou de medir.
 *
 * Não existe halter aqui de propósito — uma versão anterior construiu um e o
 * resultado lia como configurador de produto. Não reintroduzir.
 */

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'
import { yearsInBusiness } from '@/lib/home/brand'
import { useCompact, useNarrow, usePrefersReducedMotion } from '@/hooks/useCompact'
import { setHeaderSolid } from '@/lib/home/header-state'
import {
  CHAPTER_HEIGHTS,
  MOBILE_BAR_CLEARANCE,
  clamp01,
  ease,
  impact,
  lerp,
  seg,
  usePinnedChapter,
} from '@/hooks/usePinnedChapter'

const LOGO = '/images/units/alphaville/flex-logo-outline.png'
const ROOM = '/images/optimized/alphaville-wide.webp'

/** As quatro anotações arquitetônicas, na caixa da planta. */
const LABELS = [
  { text: 'Área de treino', side: 'left' as const, style: { left: '6%', top: '18%' } },
  { text: 'Musculação', side: 'right' as const, style: { right: '7%', top: '33%' } },
  { text: 'Cardio', side: 'left' as const, style: { left: '13%', bottom: '24%' } },
  { text: 'Funcional', side: 'right' as const, style: { right: '15%', bottom: '13%' } },
]

const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
}

export default function OpeningChapter() {
  const wrapRef = useRef<HTMLDivElement>(null)

  const rigInnerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const planRef = useRef<HTMLDivElement>(null)
  const plLRef = useRef<HTMLDivElement>(null)
  const plRRef = useRef<HTMLDivElement>(null)
  const plBRef = useRef<HTMLDivElement>(null)
  const plDepthRef = useRef<HTMLDivElement>(null)
  const plDimRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const roomRef = useRef<HTMLDivElement>(null)
  const roomImgRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([])

  const compact = useCompact()
  const narrow = useNarrow()
  const reduced = usePrefersReducedMotion()

  const apply = useCallback((p: number) => {
    const logo = logoRef.current
    const bar = barRef.current
    const rigInner = rigInnerRef.current
    const plan = planRef.current
    const room = roomRef.current
    const roomImg = roomImgRef.current
    const scrim = scrimRef.current
    const area = areaRef.current
    const hint = hintRef.current
    if (!logo || !bar || !rigInner || !plan || !room || !roomImg || !scrim || !area) return

    /* ── CENA 1 · 0.00–0.12 — a identidade, sozinha em cena ─────────────────
       Respiração mínima (1 → 1.015) e saída. A escala de 1.03 competia com o
       traço que nasce logo em seguida. */
    logo.style.transform = `translate3d(0, ${lerp(0, -4, ease(seg(p, 0.05, 0.15)))}vh, 0) scale(${lerp(1, 1.015, seg(p, 0, 0.09))})`
    logo.style.opacity = String(1 - clamp01(seg(p, 0.07, 0.15)))

    /* ── CENA 2 · 0.10–0.30 — o traço se desprende e assenta com peso ───────
       Toda a régua acontece dentro desta faixa: aparece, cresce quase linear
       (uma linha sendo traçada), passa do quadro e recua. Assim a planta pode
       começar em 0.28 sem herdar movimento da barra. */
    const appear = clamp01(seg(p, 0.08, 0.13))
    const grow = seg(p, 0.1, 0.22) // quase linear: uma linha sendo traçada
    const settle = ease(seg(p, 0.21, 0.3)) // ease-out pesado, de volta à barra
    const thick = ease(seg(p, 0.23, 0.31))
    const barX = lerp(lerp(0.1, 1.9, grow), 1, settle)
    const barY = lerp(0.16, 1, thick)
    const barDrop = lerp(6.2, 0, ease(seg(p, 0.11, 0.22)))
    bar.style.opacity = String(appear * (1 - clamp01(seg(p, 0.9, 0.97))))
    bar.style.transform = `translate(-50%,-50%) translate3d(0, ${barDrop}vh, 0) scaleX(${barX}) scaleY(${barY})`

    /* perspectiva: 9° no total, espalhados — sentidos antes de percebidos.
       `flat` esquadreja o rig antes do crop abrir, para que as linhas
       desenhadas e a borda da foto sejam UM retângulo, não dois.

       O `impact` é UMA chegada só, quando o volume se fecha (~0.50). Antes
       ele disparava em 0.68–0.76 e disputava atenção com a abertura do
       recorte — massa e precisão, não elasticidade de interface. */
    const tilt = ease(seg(p, 0.3, 0.46))
    const drift = seg(p, 0.62, 0.72)
    const flat = ease(seg(p, 0.7, 0.79))
    const rigScale = lerp(lerp(1, 1.05, drift), 1, flat)
    const rotY = lerp(0, -9, tilt) * (1 - flat)
    const rotX = lerp(0, 4, tilt) * (1 - flat)
    const sag = ease(seg(p, 0.56, 0.7)) * (1 - flat)
    const arrival = impact(seg(p, 0.5, 0.58)) * 0.05
    rigInner.style.transform = `translate3d(0, ${lerp(0, 0.8, sag) + arrival}vh, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${lerp(0, 0.35, sag)}deg) scale(${rigScale})`

    /* ── CENA 3 · 0.28–0.50 — a linha dobra nas pontas e fecha um volume ────
       Laterais e base em sequência curta: a forma fica inequívoca ANTES de
       receber qualquer dado. */
    if (plLRef.current) plLRef.current.style.transform = `scaleY(${ease(seg(p, 0.29, 0.39))})`
    if (plRRef.current) plRRef.current.style.transform = `scaleY(${ease(seg(p, 0.32, 0.42))})`
    if (plBRef.current) plBRef.current.style.transform = `scaleX(${ease(seg(p, 0.4, 0.5))})`

    /* ── CENA 4 · 0.47–0.70 — anotações e, por último, a medida ─────────────
       As labels entram em ordem espacial e a última só chega depois da base da
       planta estar concluída (0.50). Leitura de projeto, não chuva de dados. */
    const lbGone = clamp01(seg(p, 0.7, 0.78))
    labelRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity = String(
        clamp01(seg(p, 0.47 + i * 0.05, 0.53 + i * 0.05)) * (1 - lbGone)
      )
    })

    let depth = clamp01(seg(p, 0.52, 0.62)) * 0.9
    // a cota é o último elemento da cena 4 — a medida fecha a leitura
    if (plDimRef.current) {
      plDimRef.current.style.opacity = String(
        clamp01(seg(p, 0.61, 0.69)) * (1 - clamp01(seg(p, 0.92, 0.98)))
      )
    }
    const areaIn = ease(clamp01(seg(p, 0.63, 0.73)))
    area.style.opacity = String(areaIn * (1 - clamp01(seg(p, 0.88, 0.96))))
    area.style.transform = `translate3d(0, ${lerp(18, 0, areaIn)}px, 0)`

    /* ── CENA 5 · 0.70–1.00 — planta → realidade ────────────────────────────
       A fotografia é uma camada de viewport inteiro que só é RECORTADA, nunca
       ampliada — assim permanece em resolução nativa enquanto o corte abre. */
    const open = ease(clamp01(seg(p, 0.8, 1)))
    const planH = Math.min(window.innerWidth * 0.26, window.innerHeight * 0.52)
    const hPct = (planH / window.innerHeight) * 100
    const clip = `inset(${lerp(50, 0, open)}% ${lerp(27, 0, open)}% ${lerp(Math.max(0, 50 - hPct), 0, open)}% ${lerp(27, 0, open)}%)`
    room.style.opacity = String(clamp01(seg(p, 0.8, 0.87)))
    room.style.clipPath = clip
    roomImg.style.transform = `scale(${lerp(1.04, 1, open)})`
    plan.style.transform = `translate(-50%,0) translate3d(0, ${lerp(0, -6, open)}%, 0) scale(${lerp(1, 1.05, open)})`

    /* o fio de luz que acompanha a borda do recorte: o espaço é REVELADO por
       uma leitura arquitetônica, não por um wipe genérico. Sobe e sai dentro
       da abertura, some antes da cena terminar. */
    if (glowRef.current) {
      glowRef.current.style.clipPath = clip
      glowRef.current.style.opacity = String(Math.sin(seg(p, 0.8, 0.97) * Math.PI))
    }

    const shed = clamp01(seg(p, 0.84, 0.94))
    const lineOpacity = String(1 - shed)
    if (plLRef.current) plLRef.current.style.opacity = lineOpacity
    if (plRRef.current) plRRef.current.style.opacity = lineOpacity
    if (plBRef.current) plBRef.current.style.opacity = lineOpacity
    depth *= 1 - shed
    if (plDepthRef.current) plDepthRef.current.style.opacity = String(depth)

    scrim.style.opacity = String(
      lerp(0.32, 0.86, clamp01(seg(p, 0.14, 0.62))) * (1 - clamp01(seg(p, 0.86, 1)))
    )

    if (hint) hint.style.opacity = String(1 - clamp01(seg(p, 0.02, 0.09)))
    /* só governa o header enquanto este capítulo está de fato em cena — em
       p === 1 o capítulo 2 assume, e os dois brigariam pelo mesmo booleano */
    if (p < 1) setHeaderSolid(false)

    const active = Math.min(4, Math.floor(p * 5))
    tickRefs.current.forEach((tick, i) => {
      if (!tick) return
      tick.style.width = i === active ? '44px' : '22px'
      tick.style.background = i === active ? 'var(--color-accent-600)' : 'var(--color-neutral-700)'
    })
  }, [])

  usePinnedChapter(wrapRef, apply)

  /* a barra fixa é dona dos ~67px de baixo quando compacto: a linha de apoio
     do 3.500 m² precisa sair de trás dela, ou lê como ausente */
  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    area.style.bottom = compact
      ? `calc(clamp(24px,9vh,88px) + ${MOBILE_BAR_CLEARANCE}px)`
      : 'clamp(24px,9vh,88px)'
  }, [compact])

  const height = reduced
    ? '100vh'
    : narrow
      ? CHAPTER_HEIGHTS.one.narrow
      : CHAPTER_HEIGHTS.one.wide

  return (
    <div id="topo" ref={wrapRef} style={{ position: 'relative', height }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--color-stage)',
        }}
      >
        {/* o rig: traço do logo → barra → planta */}
        <div style={{ position: 'absolute', inset: 0, perspective: '1400px' }}>
          <div
            ref={rigInnerRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <div
              ref={barRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '46vw',
                height: 14,
                borderRadius: 8,
                background: 'linear-gradient(180deg,#6b7285 0%,#3a3f4f 42%,#1a1d27 100%)',
                boxShadow: '0 18px 44px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.22)',
                transform: 'translate(-50%,-50%)',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            />

            {/* a planta desenhada: a barra É sua aresta superior */}
            <div
              ref={planRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '46vw',
                height: 'min(26vw, 52vh)',
                transform: 'translate(-50%,0)',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div
                ref={plDepthRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(233,233,237,.16)',
                  transform: 'translateZ(-70px) translate(3%, 4%)',
                  opacity: 0,
                }}
              />
              <div
                ref={plLRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'linear-gradient(180deg,#7c8496,#2b2f3c)',
                  transformOrigin: 'top',
                  transform: 'scaleY(0)',
                }}
              />
              <div
                ref={plRRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'linear-gradient(180deg,#7c8496,#2b2f3c)',
                  transformOrigin: 'top',
                  transform: 'scaleY(0)',
                }}
              />
              <div
                ref={plBRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  background: 'linear-gradient(90deg,#2b2f3c,#7c8496)',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                }}
              />
              {/* a cota vive DENTRO da caixa da planta: a 34px abaixo dela
                  cai fora do overflow:hidden em qualquer palco baixo e largo */}
              <div
                ref={plDimRef}
                style={{
                  position: 'absolute',
                  left: 10,
                  bottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 22, height: 1, background: 'var(--color-accent-600)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '.14em',
                    color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
                  }}
                >
                  3.500 M<sup style={{ fontSize: 8 }}>2</sup>&nbsp;&nbsp;ALPHAVILLE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* a sala que a planta mediu — renderizada em tamanho real, só recortada */}
        <div
          ref={roomRef}
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: 0,
            willChange: 'clip-path, opacity',
          }}
        >
          <div ref={roomImgRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <Image
              src={ROOM}
              alt="Unidade Alphaville"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* o fio de luz na aresta do recorte — só existe durante a abertura */}
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            boxShadow:
              'inset 0 0 0 1.5px var(--color-accent-400), inset 0 0 26px rgba(59,130,246,.34)',
            willChange: 'clip-path, opacity',
          }}
        />

        <div
          ref={scrimRef}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(78% 68% at 50% 46%, transparent 18%, rgba(11,12,20,.86) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* 01 · identidade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div ref={logoRef} style={{ textAlign: 'center', willChange: 'transform, opacity' }}>
            <Image
              src={LOGO}
              alt="FLEX"
              width={620}
              height={280}
              priority
              style={{
                height: 'min(38vh, 280px)',
                width: 'auto',
                maxWidth: 'min(62vw, 620px)',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <p
              style={{
                margin: '22px 0 0',
                fontSize: 11,
                letterSpacing: '.42em',
                textTransform: 'uppercase',
                color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
              }}
            >
              {yearsInBusiness()} anos em movimento
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: 30,
                pointerEvents: 'auto',
              }}
            >
              {/* a barra fixa já carrega WhatsApp no compacto — não imprimir a
                  mesma ação primária duas vezes na mesma tela */}
              {!compact && (
                <a
                  className="btn btn-primary"
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '11px 20px' }}
                >
                  Falar no WhatsApp
                </a>
              )}
              <a className="btn btn-ghost" href="#rede" style={{ padding: '11px 16px' }}>
                Ver informações
              </a>
            </div>
          </div>
        </div>

        {/* 02 · as anotações. Mesma caixa da planta, mas FORA do rig 3D,
            para que a tipografia continue nítida. */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '46vw',
            height: 'min(26vw, 52vh)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          {LABELS.map((label, i) => (
            <div
              key={label.text}
              ref={el => {
                labelRefs.current[i] = el
              }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                opacity: 0,
                whiteSpace: 'nowrap',
                willChange: 'opacity',
                ...label.style,
              }}
            >
              {label.side === 'left' && (
                <span style={{ width: 14, height: 1, background: 'var(--color-accent-600)' }} />
              )}
              <span style={monoLabel}>{label.text}</span>
              {label.side === 'right' && (
                <span style={{ width: 14, height: 1, background: 'var(--color-accent-600)' }} />
              )}
            </div>
          ))}
        </div>

        {/* 03 · a medida a que a arquitetura chega */}
        <div
          ref={areaRef}
          style={{
            position: 'absolute',
            left: 'var(--edge)',
            bottom: 'clamp(24px,9vh,88px)',
            maxWidth: 'min(30ch, 66vw)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(56px,11vw,180px)',
              lineHeight: 0.84,
              letterSpacing: '-.02em',
            }}
          >
            3.500 m²
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(14px,1.5vw,19px)',
              lineHeight: 1.5,
              color: 'color-mix(in srgb, var(--color-text) 66%, transparent)',
            }}
          >
            Um espaço construído para movimento.
          </p>
        </div>

        {/* trilho de scroll — uma marca por cena. Escondido no compacto: divide
            a borda direita com o botão de menu e leria como um segundo menu. */}
        {!compact && (
          <div
            style={{
              position: 'absolute',
              right: 'var(--edge)',
              top: 'calc(50% + 40px)',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              alignItems: 'flex-end',
            }}
          >
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                ref={el => {
                  tickRefs.current[i] = el
                }}
                style={{
                  width: 22,
                  height: 2,
                  background: 'var(--color-neutral-700)',
                  transition: 'width .3s, background .3s',
                }}
              />
            ))}
          </div>
        )}

        {/* a dica de scroll é um recurso de desktop: no compacto a barra fixa é
            dona do rodapé e o "Ver informações" já diz a mesma coisa */}
        {!compact && (
          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 26,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              fontSize: 10,
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--color-text) 42%, transparent)',
            }}
          >
            <span>Explore</span>
            <span
              style={{
                width: 1,
                height: 38,
                background: 'linear-gradient(180deg, var(--color-accent-600), transparent)',
                animation: 'exploreLine 2.6s var(--ease-arch) infinite',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
