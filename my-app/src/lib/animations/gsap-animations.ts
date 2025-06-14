import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initScrollAnimations = () => {
  // Hero parallax
  gsap.to('.hero-bg', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  // Section pins
  const sections = gsap.utils.toArray('.pin-section')
  sections.forEach((section: any) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      pin: true,
      pinSpacing: false,
      snap: {
        snapTo: 1,
        duration: { min: 0.2, max: 0.6 },
        ease: 'power1.inOut'
      }
    })
  })

  // Text reveals
  gsap.utils.toArray('.reveal-text').forEach((text: any) => {
    gsap.from(text, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Image parallax
  gsap.utils.toArray('.parallax-image').forEach((img: any) => {
    gsap.to(img, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })
}