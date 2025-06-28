'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMobileOptimization } from './useMobileOptimization'

interface PerformanceOptimizationOptions {
  enableIntersectionObserver?: boolean
  enableResizeObserver?: boolean
  enableScrollOptimization?: boolean
  enableImageOptimization?: boolean
  enableAnimationOptimization?: boolean
}

export function usePerformanceOptimization(options: PerformanceOptimizationOptions = {}) {
  const { isMobile, isTablet, networkSpeed, prefersReducedMotion } = useMobileOptimization({
    optimizePerformance: true
  })
  
  const frameIdRef = useRef<number>()
  const lastScrollTimeRef = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced scroll handler para melhor performance
  const createDebouncedScrollHandler = useCallback((callback: () => void, delay: number = 16) => {
    return () => {
      const now = Date.now()
      
      if (now - lastScrollTimeRef.current >= delay) {
        callback()
        lastScrollTimeRef.current = now
      } else {
        clearTimeout(scrollTimeoutRef.current!)
        scrollTimeoutRef.current = setTimeout(() => {
          callback()
          lastScrollTimeRef.current = Date.now()
        }, delay - (now - lastScrollTimeRef.current))
      }
    }
  }, [])

  // Throttled scroll handler
  const createThrottledScrollHandler = useCallback((callback: () => void, delay: number = 16) => {
    let isThrottled = false
    
    return () => {
      if (!isThrottled) {
        callback()
        isThrottled = true
        setTimeout(() => {
          isThrottled = false
        }, delay)
      }
    }
  }, [])

  // Otimização de animações baseada no dispositivo
  const getAnimationConfig = useCallback(() => {
    const shouldReduceAnimations = prefersReducedMotion || isMobile || networkSpeed === 'slow'
    
    return {
      duration: shouldReduceAnimations ? 0.3 : 0.6,
      ease: shouldReduceAnimations ? 'easeOut' : 'easeInOut',
      stagger: shouldReduceAnimations ? 0.05 : 0.1,
      disabled: shouldReduceAnimations,
      reducedMotion: shouldReduceAnimations
    }
  }, [isMobile, networkSpeed, prefersReducedMotion])

  // Otimização de imagens
  const getImageConfig = useCallback(() => {
    return {
      quality: networkSpeed === 'slow' ? 60 : 80,
      loading: isMobile ? 'lazy' : 'eager' as const,
      sizes: isMobile ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      priority: false
    }
  }, [isMobile, networkSpeed])

  // Intersection Observer otimizado
  const createOptimizedIntersectionObserver = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    if (typeof window === 'undefined') return null

    const defaultOptions: IntersectionObserverInit = {
      threshold: isMobile ? 0.1 : 0.2,
      rootMargin: isMobile ? '50px' : '100px',
      ...options
    }

    return new IntersectionObserver(callback, defaultOptions)
  }, [isMobile])

  // Resize Observer otimizado
  const createOptimizedResizeObserver = useCallback((callback: (entries: ResizeObserverEntry[]) => void) => {
    if (typeof window === 'undefined') return null

    return new ResizeObserver((entries) => {
      // Throttle resize events no mobile
      if (isMobile) {
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current)
        }
        frameIdRef.current = requestAnimationFrame(() => {
          callback(entries)
        })
      } else {
        callback(entries)
      }
    })
  }, [isMobile])

  // Preload de recursos críticos
  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' = 'image') => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    
    if (type === 'image') {
      link.as = 'image'
    } else if (type === 'script') {
      link.as = 'script'
    } else if (type === 'style') {
      link.as = 'style'
    }

    document.head.appendChild(link)
  }, [])

  // Cleanup de recursos
  useEffect(() => {
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Configurações
    animationConfig: getAnimationConfig(),
    imageConfig: getImageConfig(),
    
    // Handlers otimizados
    createDebouncedScrollHandler,
    createThrottledScrollHandler,
    createOptimizedIntersectionObserver,
    createOptimizedResizeObserver,
    
    // Utilitários
    preloadResource,
    
    // Estado do dispositivo
    isMobile,
    isTablet,
    networkSpeed,
    prefersReducedMotion,
    
    // Flags de otimização
    shouldReduceAnimations: prefersReducedMotion || isMobile || networkSpeed === 'slow',
    shouldOptimizeImages: isMobile || networkSpeed === 'slow',
    shouldOptimizeAnimations: isMobile || prefersReducedMotion
  }
} 