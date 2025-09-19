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

  // Desabilita animações framer-motion globalmente no mobile
  useEffect(() => {
    if (isMobile || prefersReducedMotion) {
      // Adiciona CSS global para desabilitar transições
      const style = document.createElement('style')
      style.textContent = `
        * {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        .animate-pulse {
          animation: none !important;
        }
        .animate-spin {
          animation: none !important;
        }
        .animate-bounce {
          animation: none !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
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