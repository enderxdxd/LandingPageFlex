import { useEffect } from 'react'
import { initScrollAnimations } from '@/lib/animations/gsap-animations'

export const useScrollAnimation = () => {
  useEffect(() => {
    // Initialize GSAP animations
    initScrollAnimations()

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
}