// src/lib/animations/scroll-animations.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const createScrollAnimation = (container: HTMLElement) => {
  const sections = gsap.utils.toArray('.panel')
  const totalSections = sections.length

  // Main timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${totalSections * 100}%`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // markers: true // Debug
    }
  })

  sections.forEach((section: any, i) => {
    if (i === 0) return // Skip first section

    // Panel slide in
    tl.fromTo(section, 
      {
        yPercent: 100,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut"
      }
    )

    // Animate content elements
    const elements = section.querySelectorAll('.animate-element')
    if (elements.length) {
      tl.from(elements, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
    }

    // Hold section
    tl.to({}, { duration: 0.5 })

    // Animate out (except last)
    if (i < sections.length - 1) {
      const content = section.querySelector('.panel-content')
      tl.to(content, {
        opacity: 0,
        scale: 0.9,
        y: -100,
        duration: 0.8,
        ease: "power2.in"
      })
    }
  })

  return tl
}

export const createMobileAnimations = () => {
  gsap.utils.toArray('.panel').forEach((panel: any) => {
    const elements = panel.querySelectorAll('.animate-element')
    
    ScrollTrigger.create({
      trigger: panel,
      start: "top 80%",
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out"
        })
      }
    })
    
    gsap.set(elements, { opacity: 0, y: 30 })
  })
}