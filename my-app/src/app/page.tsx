'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from '@/components/home/HeroSection'
import ConceptSection from '@/components/home/ConceptSection'
import UnitsShowcase from '@/components/home/UnitsShowcase'
import FeaturesSection from '@/components/home/FeaturesSection'
import CTASection from '@/components/home/CTASection'
import ScrollProgress from '@/components/layout/ScrollProgress'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { isMobile, isTablet, networkSpeed, prefersReducedMotion } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })

  useEffect(() => {
    // Configuração inicial do GSAP otimizada para mobile
    gsap.config({
      nullTargetWarn: false,
      force3D: !isMobile, // Desabilita force3D no mobile para melhor performance
      autoSleep: 120 // Reduz o tempo de sleep para economizar bateria
    })

    // Limpar animações existentes
    ScrollTrigger.getAll().forEach(t => t.kill())

    // Reduzir animações no mobile ou conexão lenta
    const shouldReduceAnimations = prefersReducedMotion || isMobile || networkSpeed === 'slow'

    const ctx = gsap.context(() => {
      // Animações simplificadas para mobile
      gsap.utils.toArray('.scroll-section').forEach((section: any, index) => {
        const elements = section.querySelectorAll('.animate-on-scroll')
        
        // Set inicial otimizado
        gsap.set(elements, { 
          opacity: shouldReduceAnimations ? 1 : 0, 
          y: shouldReduceAnimations ? 0 : 30, // Reduzido de 60 para 30
          scale: shouldReduceAnimations ? 1 : 0.98 // Reduzido de 0.95 para 0.98
        })

        // Animação de entrada otimizada
        ScrollTrigger.create({
          trigger: section,
          start: "top 90%", // Aumentado de 85% para 90%
          end: "bottom 10%", // Aumentado de 15% para 10%
          onEnter: () => {
            if (shouldReduceAnimations) {
              gsap.set(elements, { opacity: 1, y: 0, scale: 1 })
              return
            }
            
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: isMobile ? 0.4 : 0.8, // Reduzido no mobile
              stagger: isMobile ? 0.05 : 0.1, // Reduzido no mobile
              ease: "power2.out"
            })
          },
          onLeave: () => {
            if (shouldReduceAnimations) return
            
            gsap.to(elements, {
              opacity: isMobile ? 0.9 : 0.7, // Menos opaco no mobile
              scale: isMobile ? 0.99 : 0.98, // Menos escala no mobile
              duration: isMobile ? 0.2 : 0.3, // Mais rápido no mobile
              ease: "power1.out"
            })
          },
          onEnterBack: () => {
            if (shouldReduceAnimations) {
              gsap.set(elements, { opacity: 1, scale: 1 })
              return
            }
            
            gsap.to(elements, {
              opacity: 1,
              scale: 1,
              duration: isMobile ? 0.3 : 0.5, // Reduzido no mobile
              ease: "power2.out"
            })
          }
        })
      })

      // Parallax simplificado para mobile
      if (!shouldReduceAnimations) {
        ScrollTrigger.create({
          trigger: '.hero-section',
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.5 : 1, // Menos suave no mobile
          onUpdate: self => {
            const progress = self.progress
            gsap.set('.hero-content', {
              y: progress * (isMobile ? 50 : 100), // Reduzido no mobile
              opacity: 1 - progress * (isMobile ? 0.3 : 0.5) // Menos opaco no mobile
            })
          }
        })
      }

    }, mainRef)

    // Refresh otimizado
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, isMobile ? 50 : 100) // Mais rápido no mobile

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [isMobile, isTablet, networkSpeed, prefersReducedMotion])

  return (
    <>
      <ScrollProgress />
      <main ref={mainRef} className="relative">
        <HeroSection />
        <ConceptSection/>
        <UnitsShowcase />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  )
}