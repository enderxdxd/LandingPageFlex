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
import { unitsData } from '@/lib/constants/units-data'
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

/**
 * A prancha: as quatro unidades desenhadas sob a linha de referência, cada uma
 * com largura PROPORCIONAL à área real. Não é decoração — é a rede medida, e o
 * número de cada uma sai de `units-data`, não daqui.
 */
const PLATES = unitsData.map(u => ({
  slug: u.slug,
  name: u.name,
  area: u.area,
  m2: Number(u.area.replace(/[^0-9]/g, '')),
}))

const TOTAL_M2 = PLATES.reduce((sum, plate) => sum + plate.m2, 0)

/** Largura de cada prancha como fração da folha. */
const share = (m2: number) => m2 / TOTAL_M2

export default function OpeningChapter() {
  const wrapRef = useRef<HTMLDivElement>(null)

  const rigInnerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const plateRefs = useRef<(HTMLDivElement | null)[]>([])
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
    const sheet = sheetRef.current
    const room = roomRef.current
    const roomImg = roomImgRef.current
    const scrim = scrimRef.current
    const area = areaRef.current
    const hint = hintRef.current
    if (!logo || !bar || !rigInner || !sheet || !room || !roomImg || !scrim || !area) return

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
    const rigScale = lerp(lerp(1, 1.04, drift), 1, flat)
    // sem rotação: uma planta se lê de frente. Os 9° de antes faziam o
    // retângulo ler como tampa de notebook aberta, não como desenho técnico.
    const rotY = 0
    const rotX = 0
    const sag = ease(seg(p, 0.56, 0.7)) * (1 - flat)
    const arrival = impact(seg(p, 0.5, 0.58)) * 0.05
    rigInner.style.transform = `translate3d(0, ${lerp(0, 0.8, sag) + arrival}vh, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${lerp(0, 0.35, sag)}deg) scale(${rigScale})`

    /* ── CENA 3 · 0.28–0.66 — a rede é desenhada, unidade por unidade ──────
       Cada prancha desce da linha de referência e fecha, da maior para a
       menor, e só então recebe nome e cota. Onde antes havia UM retângulo
       parado por duas telas, agora há quatro eventos legíveis em sequência. */
    const PLATE_SPAN = 0.085
    plateRefs.current.forEach((el, i) => {
      if (!el) return
      const from = 0.28 + i * PLATE_SPAN
      const draw = ease(clamp01(seg(p, from, from + 0.07)))
      const legend = clamp01(seg(p, from + 0.05, from + 0.1))

      el.style.opacity = String(clamp01(seg(p, from, from + 0.03)))

      const [l, r, b] = [
        el.querySelector('[data-edge="l"]') as HTMLElement | null,
        el.querySelector('[data-edge="r"]') as HTMLElement | null,
        el.querySelector('[data-edge="b"]') as HTMLElement | null,
      ]
      if (l) l.style.transform = `scaleY(${draw})`
      if (r) r.style.transform = `scaleY(${ease(clamp01(seg(p, from + 0.012, from + 0.082)))})`
      if (b) b.style.transform = `scaleX(${ease(clamp01(seg(p, from + 0.03, from + 0.095)))})`

      const caption = el.lastElementChild as HTMLElement | null
      if (caption) caption.style.opacity = String(legend)
    })

    /* ── CENA 4 · 0.66–0.80 — a folha resolve ──────────────────────────────
       As quatro pranchas recuam e a folha inteira cede o palco à fotografia. */
    const sheetGone = ease(clamp01(seg(p, 0.7, 0.82)))
    sheet.style.opacity = String(1 - sheetGone)
    sheet.style.transform = `translate(-50%,0) translate3d(0, ${lerp(0, -3, sheetGone)}vh, 0) scale(${lerp(1, 1.04, sheetGone)})`

    // o total da rede é a soma das quatro cotas — nada digitado à mão
    const areaIn = ease(clamp01(seg(p, 0.6, 0.72)))
    area.style.opacity = String(areaIn * (1 - clamp01(seg(p, 0.88, 0.96))))
    area.style.transform = `translate3d(0, ${lerp(18, 0, areaIn)}px, 0)`

    /* ── CENA 5 · 0.70–1.00 — planta → realidade ────────────────────────────
       A fotografia é uma camada de viewport inteiro que só é RECORTADA, nunca
       ampliada — assim permanece em resolução nativa enquanto o corte abre. */
    const open = ease(clamp01(seg(p, 0.8, 1)))
    const planH = Math.max(Math.min(window.innerWidth * 0.26, window.innerHeight * 0.52), 200)
    const hPct = (planH / window.innerHeight) * 100
    const clip = `inset(${lerp(50, 0, open)}% ${lerp(27, 0, open)}% ${lerp(Math.max(0, 50 - hPct), 0, open)}% ${lerp(27, 0, open)}%)`
    room.style.opacity = String(clamp01(seg(p, 0.8, 0.87)))
    room.style.clipPath = clip
    roomImg.style.transform = `scale(${lerp(1.04, 1, open)})`

    /* o fio de luz que acompanha a borda do recorte: o espaço é REVELADO por
       uma leitura arquitetônica, não por um wipe genérico. Sobe e sai dentro
       da abertura, some antes da cena terminar. */
    if (glowRef.current) {
      glowRef.current.style.clipPath = clip
      glowRef.current.style.opacity = String(Math.sin(seg(p, 0.8, 0.97) * Math.PI))
    }

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

            {/* ── A PRANCHA ────────────────────────────────────────────────
                Quatro unidades desenhadas sob a linha de referência, cada uma
                com largura proporcional à ÁREA REAL. Substitui o retângulo
                único que ocupava duas telas de rolagem sem dizer nada. */}
            <div
              ref={sheetRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 'max(74vw, 330px)',
                height: 'max(min(24vw, 42vh), 168px)',
                transform: 'translate(-50%,0)',
                display: 'flex',
                alignItems: 'stretch',
                gap: 'clamp(6px,0.7vw,12px)',
                willChange: 'transform, opacity',
              }}
            >
              {PLATES.map((plate, i) => (
                <div
                  key={plate.slug}
                  ref={el => {
                    plateRefs.current[i] = el
                  }}
                  style={{
                    position: 'relative',
                    flex: `${share(plate.m2)} 1 0%`,
                    opacity: 0,
                    willChange: 'opacity, transform',
                  }}
                >
                  {/* as três arestas: a de cima é a própria linha de referência */}
                  <span
                    data-edge="l"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: 'linear-gradient(180deg,#aab3c6,#5a6274)',
                      transformOrigin: 'top',
                    }}
                  />
                  <span
                    data-edge="r"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: 'linear-gradient(180deg,#aab3c6,#5a6274)',
                      transformOrigin: 'top',
                    }}
                  />
                  <span
                    data-edge="b"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 2,
                      background: 'linear-gradient(90deg,#5a6274,#aab3c6)',
                      transformOrigin: 'left',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      right: 10,
                      bottom: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(9px,0.78vw,11px)',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent-400)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {plate.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(9px,0.78vw,11px)',
                        letterSpacing: '.1em',
                        fontVariantNumeric: 'tabular-nums',
                        color: 'color-mix(in srgb, var(--color-text) 72%, transparent)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {plate.area}
                    </span>
                  </div>
                </div>
              ))}
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


        {/* 03 · a medida a que a arquitetura chega */}
        <div
          ref={areaRef}
          style={{
            position: 'absolute',
            left: 'var(--edge)',
            bottom: 'clamp(24px,9vh,88px)',
            maxWidth: 'min(34ch, 74vw)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(30px,4.4vw,68px)',
              lineHeight: 0.92,
              letterSpacing: '-.01em',
            }}
          >
            {TOTAL_M2.toLocaleString('pt-BR')} m²
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(14px,1.5vw,19px)',
              lineHeight: 1.5,
              color: 'color-mix(in srgb, var(--color-text) 66%, transparent)',
            }}
          >
            Quatro unidades medidas. Um padrão só.
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
