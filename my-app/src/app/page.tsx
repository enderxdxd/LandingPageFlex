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

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    
    mm.add("(min-width: 768px)", () => {
      const sections = gsap.utils.toArray('.panel')
      
      // Configuração principal do ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top 90px", // Ajustado para começar abaixo da navbar
          end: () => `+=${sections.length * 100}%`,
          scrub: 0.5, // Reduzido para animação mais suave
          pin: true, // Reabilitado
          anticipatePin: 1, // Reabilitado
          invalidateOnRefresh: true,
          fastScrollEnd: true, // Melhora performance em scroll rápido
          preventOverlaps: true, // Evita sobreposição de animações
        }
      })

      sections.forEach((panel: any, i) => {
        const content = panel.querySelector('.panel-content')
        const elements = panel.querySelectorAll('.animate-element')
        
        if (i > 0) {
          // Animação de entrada mais suave
          tl.fromTo(panel, 
            {
              yPercent: 100,
              opacity: 0
            },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.inOut"
            }
          )
          
          // Animações de conteúdo com timing ajustado
          if (elements.length) {
            tl.from(elements, {
              opacity: 0,
              y: 30,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out"
            }, "-=0.8")
          }
        }
        
        // Tempo de espera reduzido
        tl.to({}, { duration: 0.3 })
        
        // Animação de saída mais suave
        if (i < sections.length - 1) {
          tl.to(content, {
            opacity: 0,
            scale: 0.98,
            y: -30,
            duration: 0.6,
            ease: "power2.inOut"
          })
        }
      })
      
      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    })
    
    // Animação mobile simplificada
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray('.panel').forEach((panel: any) => {
        const elements = panel.querySelectorAll('.animate-element')
        
        ScrollTrigger.create({
          trigger: panel,
          start: "top 85%",
          once: true, // Anima apenas uma vez
          onEnter: () => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out"
            })
          }
        })
        
        gsap.set(elements, { opacity: 0, y: 20 })
      })
    })
    
    return () => mm.revert()
  }, [])

  return (
    <>
      <ScrollProgress />
      <main ref={mainRef} className="relative overflow-hidden bg-yellow-200"> {/* Temporary background for debugging */}
        <HeroSection />
        <ConceptSection />
        <UnitsShowcase />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  )
}
