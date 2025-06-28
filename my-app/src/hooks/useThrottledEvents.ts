'use client'

import { useCallback, useRef } from 'react'
import { useMobileOptimization } from './useMobileOptimization'

interface ThrottleOptions {
  delay?: number
  leading?: boolean
  trailing?: boolean
}

export function useThrottledEvents() {
  const { isMobile, networkSpeed } = useMobileOptimization({
    optimizePerformance: true
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastCallRef = useRef(0)

  // Throttle function para eventos
  const throttle = useCallback((
    func: Function,
    delay: number = isMobile ? 16 : 32, // 60fps no mobile, 30fps no desktop
    options: ThrottleOptions = { leading: true, trailing: true }
  ) => {
    return (...args: any[]) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCallRef.current

      if (timeSinceLastCall >= delay) {
        // Executa imediatamente se passou tempo suficiente
        if (options.leading !== false) {
          func(...args)
          lastCallRef.current = now
        }
      } else if (options.trailing !== false) {
        // Agenda execução para o final do delay
        clearTimeout(timeoutRef.current!)
        timeoutRef.current = setTimeout(() => {
          func(...args)
          lastCallRef.current = Date.now()
        }, delay - timeSinceLastCall)
      }
    }
  }, [isMobile])

  // Debounce function para eventos
  const debounce = useCallback((
    func: Function,
    delay: number = isMobile ? 150 : 300
  ) => {
    return (...args: any[]) => {
      clearTimeout(timeoutRef.current!)
      timeoutRef.current = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }, [isMobile])

  // Throttled scroll handler
  const createThrottledScrollHandler = useCallback((
    callback: (event: Event) => void,
    delay?: number
  ) => {
    return throttle(callback, delay || (isMobile ? 16 : 32))
  }, [throttle, isMobile])

  // Throttled resize handler
  const createThrottledResizeHandler = useCallback((
    callback: (event: Event) => void,
    delay?: number
  ) => {
    return throttle(callback, delay || (isMobile ? 100 : 200))
  }, [throttle, isMobile])

  // Throttled touch handler
  const createThrottledTouchHandler = useCallback((
    callback: (event: TouchEvent) => void,
    delay?: number
  ) => {
    return throttle(callback, delay || (isMobile ? 16 : 32))
  }, [throttle, isMobile])

  // Throttled mouse move handler
  const createThrottledMouseMoveHandler = useCallback((
    callback: (event: MouseEvent) => void,
    delay?: number
  ) => {
    return throttle(callback, delay || (isMobile ? 32 : 64))
  }, [throttle, isMobile])

  // Throttled wheel handler
  const createThrottledWheelHandler = useCallback((
    callback: (event: WheelEvent) => void,
    delay?: number
  ) => {
    return throttle(callback, delay || (isMobile ? 16 : 32))
  }, [throttle, isMobile])

  // Debounced search/input handler
  const createDebouncedInputHandler = useCallback((
    callback: (value: string) => void,
    delay?: number
  ) => {
    return debounce(callback, delay || (networkSpeed === 'slow' ? 500 : 300))
  }, [debounce, networkSpeed])

  // Throttled animation frame handler
  const createThrottledAnimationFrameHandler = useCallback((
    callback: () => void
  ) => {
    let ticking = false
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback()
          ticking = false
        })
        ticking = true
      }
    }
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    throttle,
    debounce,
    createThrottledScrollHandler,
    createThrottledResizeHandler,
    createThrottledTouchHandler,
    createThrottledMouseMoveHandler,
    createThrottledWheelHandler,
    createDebouncedInputHandler,
    createThrottledAnimationFrameHandler,
    cleanup
  }
} 