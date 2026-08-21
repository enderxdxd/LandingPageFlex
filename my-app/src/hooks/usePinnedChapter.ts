/**
 * usePinnedChapter — o motor de scroll dos capítulos fixados da home.
 *
 * Quatro decisões não-óbvias estão embutidas aqui, cada uma delas um bug antes:
 *
 *   1. O progresso é medido pelo getBoundingClientRect() do próprio wrapper A
 *      CADA FRAME — nunca de um offsetTop em cache. Offsets em cache ficam
 *      obsoletos no instante em que o passo responsivo reescreve a altura do
 *      capítulo, e o capítulo congela no frame 0 sem erro nenhum.
 *
 *   2. Nada depende de eventos de scroll. Qual elemento os emite depende do
 *      overflow do documento (`overflow-x` no body transforma o body no
 *      scroller), eles não sobem de containers, e são agrupados/descartados sob
 *      carga. Um único loop de rAF lê e aplica.
 *
 *   3. O amortecimento é BASEADO EM TEMPO (k = 1 - exp(-dt / tau)), não uma
 *      fração fixa por tick. Fração fixa trava no meio quando os frames caem.
 *
 *   4. Um handler de visibilitychange SALTA para o frame alvo quando a aba
 *      volta, em vez de percorrer uma sequência que o usuário já rolou.
 *      Um watchdog mantém a convergência se o rAF for estrangulado.
 *
 * apply() roda dentro de try/catch: um único throw não pode derrubar o loop —
 * essa falha esconde o H1 e o CTA principal da página inteira.
 */

import { useEffect } from 'react'

/* ── Helpers de easing — importados também pelos componentes de capítulo ───── */

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Mapeia o progresso global dentro de [a, b] para 0…1. */
export const seg = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a))

/** Cúbica in-out. */
export const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Assenta como massa, não como um card — um anel amortecido, rápido. */
export const impact = (t: number): number =>
  t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3) * Math.exp(-t * 7) * 7

/* ── O hook ────────────────────────────────────────────────────────────────── */

export interface PinnedChapterOptions {
  /**
   * Constante de tempo do amortecimento em ms — quanto tempo para fechar a
   * maior parte da distância entre o alvo e o valor aplicado. 180 lê como
   * inercial mas ainda responsivo.
   */
  tau?: number
  /** Progresso abaixo do qual não há re-aplicação. Padrão 0.0002. */
  epsilon?: number
}

export function usePinnedChapter(
  wrapRef: React.RefObject<HTMLElement>,
  apply: (progress: number) => void,
  options: PinnedChapterOptions = {}
): void {
  const { tau = 180, epsilon = 0.0002 } = options

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      wrap.style.height = '100vh'
      try {
        apply(1)
      } catch (err) {
        console.error('pinned chapter: reduced-motion frame failed', err)
      }
      return
    }

    let cur = 0
    let target = 0
    let dirty = true
    let warned = false
    let running = true
    let raf = 0
    let last = performance.now()

    const frame = (): void => {
      if (!running) return

      const now = performance.now()
      const dt = Math.min(260, Math.max(1, now - last))
      last = now
      const k = 1 - Math.exp(-dt / tau)

      const rect = wrap.getBoundingClientRect()
      const span = Math.max(1, rect.height - window.innerHeight)
      target = clamp01(-rect.top / span)

      const delta = target - cur
      if (Math.abs(delta) > epsilon) {
        cur += delta * k
        dirty = true
      } else if (cur !== target) {
        cur = target
        dirty = true
      } else if (!dirty) {
        raf = requestAnimationFrame(frame)
        return
      }

      dirty = false
      try {
        apply(cur)
      } catch (err) {
        if (!warned) {
          warned = true
          console.error('pinned chapter: apply failed', err)
        }
      }

      raf = requestAnimationFrame(frame)
    }

    frame()

    // Watchdog: se o rAF for estrangulado (frame fora de tela ou em segundo
    // plano), mantém a sequência convergindo em vez de congelá-la no meio.
    const watchdog = window.setInterval(() => {
      if (performance.now() - last > 400) frame()
    }, 300)

    // Voltando de uma aba em segundo plano: cai no frame certo imediatamente,
    // em vez de percorrer tudo que o usuário já rolou.
    const onVisible = (): void => {
      if (document.visibilityState !== 'visible') return
      const rect = wrap.getBoundingClientRect()
      const span = Math.max(1, rect.height - window.innerHeight)
      cur = target = clamp01(-rect.top / span)
      dirty = true
      last = performance.now()
      frame()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.clearInterval(watchdog)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [wrapRef, apply, tau, epsilon])
}

/* ── Alturas dos capítulos ─────────────────────────────────────────────────────
 * VALORES APROVADOS. Uma revisão anterior rodava 900vh + 520vh com pausas
 * mortas deliberadas; o veredito do cliente foi que parecia lento e que rolar
 * não produzia mudança visível. Toda faixa de progresso nos capítulos faz
 * trabalho visível dentro destas alturas:
 *
 *   - mais curto, e as cinco cenas começam a se sobrepor
 *   - mais longo, e a reclamação de "scroll morto" volta
 * ─────────────────────────────────────────────────────────────────────────── */
export const CHAPTER_HEIGHTS = {
  one: { wide: '380vh', narrow: '260vh' },
  two: { wide: '280vh', narrow: '200vh' },
  narrowBreakpoint: 820,
  /* o drawer, a barra fixa e o trilho de scroll trocam aqui — um limite
     diferente do das alturas, de propósito: é ditado pela linha de links do
     header ficando sem espaço, não pelo ritmo do scroll */
  compactBreakpoint: 1000,
} as const

/* ── O que precisa ceder à barra de ação fixa ──────────────────────────────────
 * A barra ocupa os ~67px de baixo (10 + 46 + 10) abaixo de compactBreakpoint.
 * Três elementos do frame de abertura colidem com ela; os três vieram de
 * revisão a 924×540, e nenhum aparece a 1440×900.
 * ─────────────────────────────────────────────────────────────────────────── */
export const MOBILE_BAR_CLEARANCE = 74
