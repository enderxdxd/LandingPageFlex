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
      // Adiciona CSS global para desabilitar TODAS as animações
      const style = document.createElement('style')
      style.id = 'mobile-animation-killer'
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          transform: none !important;
          will-change: auto !important;
        }
        
        /* Mata todas as animações CSS */
        .animate-pulse,
        .animate-spin,
        .animate-bounce,
        .animate-ping,
        .animate-fade,
        [class*="animate-"] {
          animation: none !important;
        }
        
        /* Mata transforms de hover */
        *:hover {
          transform: none !important;
        }
        
        /* Força elementos a ficarem visíveis */
        .animate-on-scroll {
          opacity: 1 !important;
          transform: none !important;
        }
        
        /* Remove blur e filtros pesados */
        .blur-3xl,
        .blur-2xl,
        .blur-xl {
          filter: none !important;
        }
        
        /* Remove backdrop-blur */
        .backdrop-blur-sm,
        .backdrop-blur-md,
        .backdrop-blur-lg {
          backdrop-filter: none !important;
        }
      `
      document.head.appendChild(style)

      // Força todos os elementos motion a ficarem estáticos
      const forceStaticElements = () => {
        const motionElements = document.querySelectorAll('[data-framer-motion]')
        motionElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = 'none'
            el.style.opacity = '1'
            el.style.willChange = 'auto'
          }
        })
      }

      // Executa imediatamente e depois a cada 100ms por 2 segundos
      forceStaticElements()
      const interval = setInterval(forceStaticElements, 100)
      setTimeout(() => clearInterval(interval), 2000)

      return () => {
        const existingStyle = document.getElementById('mobile-animation-killer')
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
        clearInterval(interval)
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