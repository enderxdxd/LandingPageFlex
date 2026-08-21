'use client'

import { useEffect, useState } from 'react'
import { CHAPTER_HEIGHTS } from './usePinnedChapter'

/**
 * `true` abaixo de 1000px — onde a linha de links do header fica sem espaço e
 * a barra de ação fixa aparece.
 *
 * Começa em `false` para casar com o HTML do servidor; o primeiro efeito
 * corrige antes da pintura útil. Tudo que depende disso (a barra fixa, o
 * trilho, o botão de WhatsApp da abertura) sai da MESMA flag, para que não
 * possam divergir entre si.
 */
export function useCompact(breakpoint: number = CHAPTER_HEIGHTS.compactBreakpoint): boolean {
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
  return useCompact(CHAPTER_HEIGHTS.narrowBreakpoint)
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
