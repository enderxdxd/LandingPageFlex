declare module 'lenis' {
  export interface LenisOptions {
    duration?: number
    easing?: (t: number) => number
    orientation?: 'vertical' | 'horizontal'
    smoothWheel?: boolean
    wheelMultiplier?: number
    smoothTouch?: boolean
    touchMultiplier?: number
    infinite?: boolean
  }

  export default class Lenis {
    constructor(options?: LenisOptions)
    raf(time: number): void
    destroy(): void
  }
} 