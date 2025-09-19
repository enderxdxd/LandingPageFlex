'use client'

import { useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function MobileAnimationKiller() {
  const { isMobile, prefersReducedMotion } = useMobileOptimization()

  useEffect(() => {
    if (!isMobile && !prefersReducedMotion) return

    // CSS simples para garantir visibilidade
    const style = document.createElement('style')
    style.id = 'mobile-animation-optimizer'
    style.textContent = `
      /* Força elementos a ficarem visíveis */
      .animate-on-scroll {
        opacity: 1 !important;
        transform: none !important;
      }
    `
    
    // Remove estilo anterior se existir
    const existing = document.getElementById('mobile-animation-optimizer')
    if (existing) existing.remove()
    
    document.head.appendChild(style)

    return () => {
      const style = document.getElementById('mobile-animation-optimizer')
      if (style) style.remove()
    }
  }, [isMobile, prefersReducedMotion])

  return null
}
