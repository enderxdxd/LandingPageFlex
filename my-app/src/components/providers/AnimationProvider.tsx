'use client'

import { useEffect, createContext, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

// Context para controle de animações
const AnimationContext = createContext({
  shouldAnimate: true,
  isMobile: false,
  config: {
    animations: {
      duration: 500,
      easing: 'easeInOut',
      stagger: 0.1,
      disabled: false
    }
  }
})

export const useAnimationContext = () => useContext(AnimationContext)

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  const { isMobile, config, prefersReducedMotion } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })

  const shouldAnimate = !isMobile && !config.animations.disabled && !prefersReducedMotion

  useEffect(() => {
    // Só registra GSAP se não for mobile
    if (!isMobile) {
      gsap.registerPlugin(ScrollTrigger)
      
      // Configure GSAP defaults
      gsap.config({
        nullTargetWarn: false,
        force3D: true
      })

      // Update on resize
      const handleResize = () => {
        ScrollTrigger.refresh()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    } else {
      // No mobile, mata todas as animações GSAP existentes
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isMobile])

  // Desabilita animações framer-motion globalmente no mobile (versão suave)
  useEffect(() => {
    if (isMobile || prefersReducedMotion) {
      // CSS mais suave - apenas força visibilidade dos elementos importantes
      const style = document.createElement('style')
      style.id = 'mobile-animation-helper'
      style.textContent = `
        /* Força elementos importantes a ficarem visíveis */
        .animate-on-scroll {
          opacity: 1 !important;
          transform: none !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        const existingStyle = document.getElementById('mobile-animation-helper')
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [isMobile, prefersReducedMotion])

  return (
    <AnimationContext.Provider value={{ 
      shouldAnimate, 
      isMobile, 
      config: {
        animations: {
          duration: config.animations.duration,
          easing: config.animations.easing,
          stagger: config.animations.stagger,
          disabled: config.animations.disabled || false
        }
      }
    }}>
      {children}
    </AnimationContext.Provider>
  )
}