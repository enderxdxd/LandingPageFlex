'use client'

import { useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function MobileAnimationKiller() {
  const { isMobile, prefersReducedMotion } = useMobileOptimization()

  useEffect(() => {
    if (!isMobile && !prefersReducedMotion) return

    // CSS mais agressivo para matar TODAS as animações
    const killAllAnimations = () => {
      const style = document.createElement('style')
      style.id = 'ultimate-animation-killer'
      style.textContent = `
        /* MATA TUDO - Nível Nuclear */
        *, *::before, *::after {
          animation: none !important;
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          animation-iteration-count: 1 !important;
          animation-fill-mode: none !important;
          transition: none !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          transform: none !important;
          will-change: auto !important;
          backface-visibility: visible !important;
        }
        
        /* Mata todas as classes de animação */
        [class*="animate"],
        [class*="motion"],
        [class*="transition"],
        [class*="transform"],
        [data-framer-motion] {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        
        /* Força visibilidade */
        .animate-on-scroll,
        [data-animate],
        .scroll-section > * {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        /* Remove filtros pesados */
        .blur-3xl, .blur-2xl, .blur-xl, .blur-lg, .blur-md, .blur-sm {
          filter: none !important;
        }
        
        .backdrop-blur-3xl, .backdrop-blur-2xl, .backdrop-blur-xl, 
        .backdrop-blur-lg, .backdrop-blur-md, .backdrop-blur-sm {
          backdrop-filter: none !important;
        }
        
        /* Mata hover effects */
        *:hover, *:focus, *:active {
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
        
        /* Mata pseudo-elementos animados */
        *::before, *::after {
          content: none !important;
        }
        
        /* Remove gradientes animados */
        .gradient-text {
          background: linear-gradient(45deg, #1E40AF, #3B82F6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
      `
      
      // Remove estilo anterior se existir
      const existing = document.getElementById('ultimate-animation-killer')
      if (existing) existing.remove()
      
      document.head.appendChild(style)
    }

    // Força elementos a ficarem estáticos
    const forceStaticState = () => {
      // Mata todos os elementos framer-motion
      document.querySelectorAll('[data-framer-motion]').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.cssText += `
            transform: none !important;
            opacity: 1 !important;
            will-change: auto !important;
            animation: none !important;
            transition: none !important;
          `
        }
      })

      // Força elementos com classes de animação
      document.querySelectorAll('.animate-on-scroll, [class*="animate-"]').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.cssText += `
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          `
        }
      })

      // Mata SVG animados
      document.querySelectorAll('svg path, svg circle, svg rect').forEach(el => {
        if (el instanceof SVGElement) {
          el.style.cssText += `
            animation: none !important;
            transition: none !important;
          `
        }
      })
    }

    // Executa imediatamente
    killAllAnimations()
    forceStaticState()

    // Executa periodicamente para pegar elementos que são criados dinamicamente
    const interval = setInterval(forceStaticState, 50)
    
    // Para depois de 5 segundos
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    // Observer para novos elementos
    const observer = new MutationObserver(() => {
      forceStaticState()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      observer.disconnect()
      
      const style = document.getElementById('ultimate-animation-killer')
      if (style) style.remove()
    }
  }, [isMobile, prefersReducedMotion])

  return null
}
