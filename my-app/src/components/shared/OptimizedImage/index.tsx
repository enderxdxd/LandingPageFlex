'use client'

import { useState, useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  mobileSrc?: string
  tabletSrc?: string
  priority?: boolean
  sizes?: string
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  mobileSrc,
  tabletSrc,
  priority = false,
  sizes = '100vw',
  quality = 75
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  const { isMobile, isTablet, networkSpeed } = useMobileOptimization({
    optimizePerformance: true
  })

  useEffect(() => {
    // Determinar qual imagem usar baseado no dispositivo e conexão
    let optimizedSrc = src
    
    if (isMobile && mobileSrc) {
      optimizedSrc = mobileSrc
    } else if (isTablet && tabletSrc) {
      optimizedSrc = tabletSrc
    }
    
    // Para conexões lentas, usar qualidade menor
    if (networkSpeed === 'slow' && !optimizedSrc.includes('?')) {
      optimizedSrc += `?q=${Math.max(50, quality - 25)}`
    }
    
    setImageSrc(optimizedSrc)
  }, [src, mobileSrc, tabletSrc, isMobile, isTablet, networkSpeed, quality])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    // Fallback para imagem original se a otimizada falhar
    if (imageSrc !== src) {
      setImageSrc(src)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-auto transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'object-contain' : ''}`}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          // Otimizações para mobile
          willChange: isMobile ? 'auto' : 'transform',
          transform: isMobile ? 'translateZ(0)' : 'none', // Force GPU acceleration only when needed
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Erro ao carregar imagem
        </div>
      )}
    </div>
  )
} 