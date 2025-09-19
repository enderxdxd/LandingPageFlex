'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { useAnimationContext } from '@/components/providers/AnimationProvider'
import { forwardRef } from 'react'

// Wrapper para motion.div que respeita o contexto de animação
export const MotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }, ref) => {
    const { shouldAnimate, isMobile } = useAnimationContext()

    // Se não deve animar (mobile), renderiza div normal
    if (!shouldAnimate || isMobile) {
      return (
        <div ref={ref} {...(props as any)}>
          {children}
        </div>
      )
    }

    // Se deve animar (desktop), renderiza motion.div normal
    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        whileHover={whileHover}
        whileTap={whileTap}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

MotionDiv.displayName = 'MotionDiv'

// Wrapper para motion.section
export const MotionSection = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }, ref) => {
    const { shouldAnimate, isMobile } = useAnimationContext()

    if (!shouldAnimate || isMobile) {
      return (
        <section ref={ref} {...(props as any)}>
          {children}
        </section>
      )
    }

    return (
      <motion.section
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        whileHover={whileHover}
        whileTap={whileTap}
        {...props}
      >
        {children}
      </motion.section>
    )
  }
)

MotionSection.displayName = 'MotionSection'

// Wrapper para motion.nav
export const MotionNav = forwardRef<HTMLElement, HTMLMotionProps<"nav">>(
  ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }, ref) => {
    const { shouldAnimate, isMobile } = useAnimationContext()

    if (!shouldAnimate || isMobile) {
      return (
        <nav ref={ref} {...(props as any)}>
          {children}
        </nav>
      )
    }

    return (
      <motion.nav
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        whileHover={whileHover}
        whileTap={whileTap}
        {...props}
      >
        {children}
      </motion.nav>
    )
  }
)

MotionNav.displayName = 'MotionNav'

// Wrapper para motion.button
export const MotionButton = forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(
  ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }, ref) => {
    const { shouldAnimate, isMobile } = useAnimationContext()

    if (!shouldAnimate || isMobile) {
      return (
        <button ref={ref} {...(props as any)}>
          {children}
        </button>
      )
    }

    return (
      <motion.button
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        whileHover={whileHover}
        whileTap={whileTap}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

MotionButton.displayName = 'MotionButton'

// Hook para obter configurações de animação otimizadas
export const useOptimizedAnimation = () => {
  const { shouldAnimate, isMobile, config } = useAnimationContext()
  
  return {
    shouldAnimate,
    isMobile,
    duration: shouldAnimate ? config.animations.duration : 0,
    easing: config.animations.easing,
    stagger: shouldAnimate ? config.animations.stagger : 0,
    // Função helper para criar variantes condicionais
    variants: (desktopVariant: any, mobileVariant: any = {}) => 
      shouldAnimate ? desktopVariant : mobileVariant,
    // Função helper para transições condicionais
    transition: (desktopTransition: any) => 
      shouldAnimate ? desktopTransition : { duration: 0 }
  }
}
