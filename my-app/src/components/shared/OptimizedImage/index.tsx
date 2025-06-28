'use client'

import { useState, useEffect, useRef } from 'react'
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
  width?: number
  height?: number
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  mobileSrc,
  tabletSrc,
  priority = false,
  sizes = '100vw',
  quality = 75,
  width,
  height
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  const { isMobile, isTablet, networkSpeed } = useMobileOptimization({
    optimizePerformance: true
  })

  // Determinar qual imagem usar baseado no dispositivo e conexão
  useEffect(() => {
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

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true)
      return
    }

    const options = {
      root: null,
      rootMargin: isMobile ? '50px' : '100px', // Carrega mais cedo no mobile
      threshold: 0.1
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      })
    }, options)

    observerRef.current.observe(imgRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isMobile, priority])

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

  // Placeholder otimizado para mobile
  const placeholderStyle = {
    background: isMobile 
      ? 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
      : 'linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%)',
    backgroundSize: '200% 100%',
    animation: isLoading ? 'shimmer 1.5s infinite' : 'none'
  } as React.CSSProperties

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder de loading */}
      {isLoading && (
        <div 
          className="absolute inset-0 rounded animate-pulse"
          style={placeholderStyle}
        />
      )}
      
      {/* Imagem otimizada */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
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
            transform: isMobile ? 'translateZ(0)' : 'none',
            // Prevenir zoom no double tap (mobile)
            touchAction: isMobile ? 'manipulation' : 'auto',
            // Otimizações de performance
            contain: 'layout style paint',
            backfaceVisibility: 'hidden',
          }}
        />
      )}
      
      {/* Fallback para erro */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div>Erro ao carregar imagem</div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animação shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Otimizações para mobile */
        @media (max-width: 768px) {
          img {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        }
        
        /* Reduzir motion */
        @media (prefers-reduced-motion: reduce) {
          img {
            transition: none !important;
          }
          
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
} 