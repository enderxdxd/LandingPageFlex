'use client'

import { ReactNode } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface OptimizedBackdropProps {
  children: ReactNode
  className?: string
  blur?: number
  opacity?: number
  fallbackClassName?: string
}

export default function OptimizedBackdrop({
  children,
  className = '',
  blur = 10,
  opacity = 0.8,
  fallbackClassName = ''
}: OptimizedBackdropProps) {
  const { isMobile, networkSpeed } = useMobileOptimization({
    optimizePerformance: true
  })

  // Determinar se deve usar backdrop-filter baseado no dispositivo e performance
  const shouldUseBackdrop = !isMobile && networkSpeed !== 'slow'

  if (shouldUseBackdrop) {
    // Versão desktop com backdrop-filter completo
    return (
      <div
        className={`backdrop-blur-${blur} bg-white/${Math.round(opacity * 100)} ${className}`}
        style={{
          backdropFilter: `blur(${blur}px)`,
          backgroundColor: `rgba(255, 255, 255, ${opacity})`,
          // Otimizações de performance
          willChange: 'auto',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>
    )
  }

  // Versão mobile otimizada - sem backdrop-filter
  return (
    <div
      className={`bg-white/90 ${fallbackClassName} ${className}`}
      style={{
        backgroundColor: `rgba(255, 255, 255, 0.9)`,
        // Otimizações específicas para mobile
        willChange: 'auto',
        transform: 'translateZ(0)',
        // Remover efeitos pesados
        filter: 'none',
        backdropFilter: 'none',
      }}
    >
      {children}
    </div>
  )
} 