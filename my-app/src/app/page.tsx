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
    // Se for mobile, não inicializa animações GSAP
    if (isMobile) {
      return
    }

    // Configuração inicial do GSAP apenas para desktop
    gsap.config({
      nullTargetWarn: false,
      force3D: true
    })

    // Limpar animações existentes
    ScrollTrigger.getAll().forEach(t => t.kill())

    const ctx = gsap.context(() => {
      // Animações originais apenas para desktop
      gsap.utils.toArray('.scroll-section').forEach((section: any, index) => {
        const elements = section.querySelectorAll('.animate-on-scroll')
        
        // Set inicial
        gsap.set(elements, { 
          opacity: 0, 
          y: 60,
          scale: 0.95
        })

        // Animação de entrada
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out"
            })
          },
          onLeave: () => {
            gsap.to(elements, {
              opacity: 0.7,
              scale: 0.98,
              duration: 0.3,
              ease: "power1.out"
            })
          },
          onEnterBack: () => {
            gsap.to(elements, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            })
          }
        })
      })

      // Parallax simples para o hero
      ScrollTrigger.create({
        trigger: '.hero-section',
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: self => {
          const progress = self.progress
          gsap.set('.hero-content', {
            y: progress * 100,
            opacity: 1 - progress * 0.5
          })
        }
      })

    }, mainRef)

    // Refresh após carregamento
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [isMobile])

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