export interface AnimationVariant {
  initial: any
  animate: any
  exit?: any
  transition?: any
}

export interface ScrollAnimationConfig {
  trigger: string
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
}