// hooks/useMobileOptimization.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'

interface MobileOptimizationOptions {
  reduceAnimations?: boolean
  enableHapticFeedback?: boolean
  optimizePerformance?: boolean
}

export function useMobileOptimization(options: MobileOptimizationOptions = {}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [screenOrientation, setScreenOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const performanceRef = useRef({ lastFrameTime: 0, frameCount: 0, fps: 60 })

  // Detectar características do dispositivo
  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent) || 
        (window.innerWidth >= 768 && window.innerWidth <= 1024)
      
      setIsMobile(isMobileDevice && !isTabletDevice)
      setIsTablet(isTabletDevice)
      setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    const checkNetworkSpeed = () => {
      // @ts-ignore - Navigator connection não está tipado
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        const effectiveType = connection.effectiveType
        setNetworkSpeed(effectiveType === '4g' || effectiveType === '3g' ? 'fast' : 'slow')
      }
    }

    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      mediaQuery.addEventListener('change', (e) => {
        setPrefersReducedMotion(e.matches)
      })
    }

    const checkOrientation = () => {
      setScreenOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    checkDeviceType()
    checkNetworkSpeed()
    checkReducedMotion()
    checkOrientation()

    window.addEventListener('resize', checkDeviceType)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkDeviceType)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  // Monitor de performance
  const measurePerformance = useCallback(() => {
    if (!options.optimizePerformance) return

    const now = performance.now()
    const frameTime = now - performanceRef.current.lastFrameTime
    
    if (frameTime > 0) {
      performanceRef.current.fps = Math.round(1000 / frameTime)
      performanceRef.current.frameCount++
    }
    
    performanceRef.current.lastFrameTime = now
  }, [options.optimizePerformance])

  // Haptic feedback para dispositivos móveis
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!options.enableHapticFeedback || !touchDevice) return

    // @ts-ignore - Vibration API
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }

    // @ts-ignore - Webkit haptic feedback
    if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        // Haptic feedback para iOS
        if ((window as any).Taptic) {
          const impact = new (window as any).Taptic.ImpactFeedback(type)
          impact?.impactOccurred()
        }
      } catch (error) {
        // Fallback silencioso
      }
    }
  }, [options.enableHapticFeedback, touchDevice])

  // Configurações otimizadas baseadas no dispositivo
  const getOptimizedConfig = useCallback(() => {
    const shouldReduceAnimations = prefersReducedMotion || 
      (options.reduceAnimations && (isMobile || networkSpeed === 'slow'))

    return {
      animations: {
        duration: shouldReduceAnimations ? 0 : isMobile ? 300 : 500,
        easing: isMobile ? 'easeOut' : 'easeInOut',
        stagger: shouldReduceAnimations ? 0 : 0.1,
        disabled: shouldReduceAnimations
      },
      swiper: {
        speed: isMobile ? 400 : 600,
        spaceBetween: isMobile ? 12 : 20,
        slidesPerView: isMobile ? 1.1 : isTablet ? 2.2 : 3,
        autoplayDelay: networkSpeed === 'slow' ? 6000 : 4000,
        resistance: isMobile ? 0.8 : 0.5,
        threshold: isMobile ? 5 : 10
      },
      performance: {
        enableGPU: !isMobile || performanceRef.current.fps > 45,
        enableBlur: !isMobile && networkSpeed !== 'slow',
        enableShadows: !isMobile,
        enableComplexAnimations: !isMobile && !shouldReduceAnimations
      }
    }
  }, [isMobile, isTablet, touchDevice, networkSpeed, prefersReducedMotion, options])

  // Debounced scroll handler
  const createScrollHandler = useCallback((callback: () => void, delay: number = 16) => {
    let timeoutId: NodeJS.Timeout
    let lastCallTime = 0

    return () => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCallTime

      clearTimeout(timeoutId)

      if (timeSinceLastCall >= delay) {
        callback()
        lastCallTime = now
      } else {
        timeoutId = setTimeout(() => {
          callback()
          lastCallTime = Date.now()
        }, delay - timeSinceLastCall)
      }
    }
  }, [])

  // Lazy loading com intersection observer otimizado
  const createLazyLoader = useCallback((threshold: number = 0.1) => {
    if (typeof window === 'undefined') return null

    const rootMargin = isMobile ? '50px' : '100px'
    
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.classList.add('in-view')
            
            // Trigger haptic feedback para elementos importantes
            if (target.dataset.haptic) {
              triggerHaptic('light')
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )
  }, [isMobile, triggerHaptic])

  // Preload crítico para mobile
  const preloadCriticalResources = useCallback((resources: string[]) => {
    if (!isMobile) return

    resources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      
      if (resource.includes('.woff2')) {
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
      } else if (resource.includes('.jpg') || resource.includes('.png') || resource.includes('.webp')) {
        link.as = 'image'
      }
      
      document.head.appendChild(link)
    })
  }, [isMobile])

  // Cleanup automático de event listeners
  useEffect(() => {
    if (options.optimizePerformance) {
      let animationId: number
      
      const performanceLoop = () => {
        measurePerformance()
        animationId = requestAnimationFrame(performanceLoop)
      }
      
      animationId = requestAnimationFrame(performanceLoop)
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
    }
  }, [measurePerformance, options.optimizePerformance])

  return {
    // Estados do dispositivo
    isMobile,
    isTablet,
    touchDevice,
    networkSpeed,
    prefersReducedMotion,
    screenOrientation,
    
    // Performance
    fps: performanceRef.current.fps,
    
    // Métodos utilitários
    triggerHaptic,
    getOptimizedConfig,
    createScrollHandler,
    createLazyLoader,
    preloadCriticalResources,
    
    // Configurações prontas
    config: getOptimizedConfig()
  }
}

// Hook específico para Swiper mobile
export function useMobileSwiperConfig() {
  const { isMobile, isTablet, config, triggerHaptic } = useMobileOptimization({
    enableHapticFeedback: true,
    optimizePerformance: true
  })

  const getSwiperConfig = useCallback(() => ({
    modules: [Pagination, Autoplay, ...(isMobile ? [] : [EffectCoverflow])],
    speed: config.swiper.speed,
    spaceBetween: config.swiper.spaceBetween,
    slidesPerView: config.swiper.slidesPerView,
    autoplay: {
      delay: config.swiper.autoplayDelay,
      disableOnInteraction: false,
      pauseOnMouseEnter: !isMobile,
      waitForTransition: true
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
      renderBullet: (index: number, className: string) => {
        return `<span class="${className}" data-index="${index}"></span>`
      }
    },
    breakpoints: {
      320: { slidesPerView: 1.05, spaceBetween: 8 },
      480: { slidesPerView: 1.2, spaceBetween: 12 },
      640: { slidesPerView: 1.8, spaceBetween: 16 },
      768: { slidesPerView: 2.2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 }
    },
    // Configurações otimizadas para touch
    touchEventsTarget: 'container' as const,
    simulateTouch: true,
    touchRatio: isMobile ? 1.5 : 1,
    touchAngle: 45,
    grabCursor: true,
    threshold: config.swiper.threshold,
    resistance: true,
    resistanceRatio: config.swiper.resistance,
    
    // Performance
    watchOverflow: true,
    watchSlidesProgress: true,
    preventInteractionOnTransition: false,
    
    // Callbacks com haptic feedback
    onSlideChange: () => {
      triggerHaptic('light')
    },
    onTouchStart: () => {
      triggerHaptic('light')
    }
  }), [isMobile, isTablet, config, triggerHaptic])

  return {
    swiperConfig: getSwiperConfig(),
    isMobile,
    isTablet,
    animationConfig: config.animations
  }
}