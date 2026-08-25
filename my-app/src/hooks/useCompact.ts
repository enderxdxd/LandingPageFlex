'use client'

import { useEffect, useState } from 'react'

/**
 * Os limites viviam em `usePinnedChapter`, que saiu junto com os capítulos
 * fixados. 1000px é onde a linha de links do header fica sem espaço — a mesma
 * flag liga o drawer e a barra de ação fixa, para não divergirem.
 */
const COMPACT_BREAKPOINT = 1000
const NARROW_BREAKPOINT = 820

/**
 * `true` abaixo de 1000px — onde a linha de links do header fica sem espaço e
 * a barra de ação fixa aparece.
 *
 * Começa em `false` para casar com o HTML do servidor; o primeiro efeito
 * corrige antes da pintura útil. Tudo que depende disso (a barra fixa, o
 * trilho, o botão de WhatsApp da abertura) sai da MESMA flag, para que não
 * possam divergir entre si.
 */
export function useCompact(breakpoint: number = COMPACT_BREAKPOINT): boolean {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [breakpoint])

  return compact
}

/** `true` abaixo de 820px — onde os capítulos encurtam. */
export function useNarrow(): boolean {
  return useCompact(NARROW_BREAKPOINT)
}

/**
 * `prefers-reduced-motion: reduce`.
 *
 * Os capítulos leem isto para colapsar em 100vh e renderizar o frame final
 * composto — nunca um palco vazio.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}
