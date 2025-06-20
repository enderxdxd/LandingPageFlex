'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
// Interface atualizada baseada no units-data.ts
interface Unit {
  id: string
  slug: string
  name: string
  description: string
  address: string
  phone: string
  whatsapp: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  features: string[]
  specialFeatures?: string[]
  images: string[]
  heroImage: string
  heroVideo?: string
  comingSoon?: boolean
  hasPool?: boolean
  hasCrossfit?: boolean
  area: string
  parking: string
  accessibility: boolean
  metro?: string
  landmark: string
  coordinates: {
    lat: number
    lng: number
  }
}
import { HiLocationMarker, HiArrowRight } from 'react-icons/hi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface OptimizedUnitCardProps {
  unit: Unit
  lazy?: boolean
  priority?: boolean
  index?: number
}

export default function OptimizedUnitCard({ 
  unit, 
  lazy = false, 
  priority = false,
  index = 0 
}: OptimizedUnitCardProps) {
  const { isMobile, config, triggerHaptic } = useMobileOptimization({
    enableHapticFeedback: true,
    optimizePerformance: true
  })
  
  const [imageLoaded, setImageLoaded] = useState(!lazy)
  const [imageError, setImageError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || !cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: isMobile ? '50px' : '100px'
      }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [lazy, isMobile])

  // Preload da imagem quando em vista
  useEffect(() => {
    if (!isInView || imageLoaded) return

    const img = document.createElement('img')
    img.onload = () => {
      setImageLoaded(true)
      if (imageRef.current) {
        imageRef.current.style.opacity = '1'
      }
    }
    img.onerror = () => {
      setImageError(true)
      setImageLoaded(true)
    }
    img.src = unit.heroImage
  }, [isInView, imageLoaded, unit.heroImage])

  // Handlers otimizados
  const handleCardClick = useCallback(() => {
    triggerHaptic('light')
  }, [triggerHaptic])

  const handleSocialClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
  }, [triggerHaptic])

  // Função para abrir Instagram
  const handleInstagramClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    window.open('https://www.instagram.com/flexfitnesscenter/', '_blank', 'noopener,noreferrer')
  }, [triggerHaptic])

  // Função para abrir WhatsApp
  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    const phoneNumber = unit.whatsapp.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(`Olá! Gostaria de conhecer a unidade ${unit.name} da Flex Fitness.`)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }, [triggerHaptic, unit.whatsapp, unit.name])

  // Variantes de animação otimizadas
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 20 : 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: config.animations.duration / 1000,
        ease: config.animations.easing,
        delay: config.animations.disabled ? 0 : index * 0.1
      }
    }
  }

  const hoverVariants = isMobile ? {} : {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isMobile ? "hover" : undefined}
      whileTap={isMobile ? "tap" : undefined}
      className="relative group cursor-pointer"
      style={{ 
        willChange: config.performance.enableGPU ? 'transform' : 'auto',
        transform: 'translateZ(0)'
      }}
    >
      {/* Social Media Links - FORA DO LINK, POSICIONADOS ABSOLUTAMENTE */}
      <div className="absolute top-4 left-4 flex gap-2 z-30">
        {/* Instagram Link - SEMPRE VISÍVEL para todas as unidades */}
        <motion.button
          onClick={handleInstagramClick}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-300 group/social shadow-lg"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          title="Seguir no Instagram"
        >
          <FaInstagram className="text-lg group-hover/social:text-pink-400 transition-colors" />
        </motion.button>

        {/* WhatsApp Link - Só aparece se tiver WhatsApp válido */}
        {unit.whatsapp && unit.whatsapp !== '----' && !unit.comingSoon && (
          <motion.button
            onClick={handleWhatsAppClick}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-300 group/social shadow-lg"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            title={`WhatsApp da unidade ${unit.name}`}
          >
            <FaWhatsapp className="text-lg group-hover/social:text-green-400 transition-colors" />
          </motion.button>
        )}
      </div>

      {/* Link do Card - SEM os botões sociais dentro */}
      <Link 
        href={`/unidades/${unit.slug}`}
        onClick={handleCardClick}
        className="block focus:outline-none focus:ring-2 focus:ring-flex-primary focus:ring-offset-2 rounded-2xl"
      >
        <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-200">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-transparent" />
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🏢</div>
                <div className="text-sm">Imagem não disponível</div>
              </div>
            </div>
          )}

          {/* Main image */}
          {isInView && !imageError && (
            <Image
              ref={imageRef}
              src={unit.heroImage}
              alt={`${unit.name} - Academia Flex Fitness`}
              fill
              className={`object-cover transition-all duration-700 ${
                isMobile 
                  ? 'group-active:scale-105' 
                  : 'group-hover:scale-110'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={priority}
              quality={isMobile ? 85 : 90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Qtnl8SBos"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(true)
              }}
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-flex-dark via-flex-dark/50 to-transparent" />
          
          {/* Enhanced coming soon badge */}
          {unit.comingSoon && (
            <motion.div 
              className="absolute top-4 right-4 bg-flex-accent text-flex-dark px-3 py-1.5 rounded-full font-medium text-sm shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              EM BREVE
            </motion.div>
          )}
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <motion.h3 
              className="font-display text-2xl md:text-3xl text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {unit.name}
            </motion.h3>
            
            <motion.div 
              className="flex items-center text-white/70 text-sm mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HiLocationMarker className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{unit.address}</span>
            </motion.div>
            
            {/* Special features tags */}
            {unit.specialFeatures && unit.specialFeatures.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {unit.specialFeatures.slice(0, 2).map((feature, featureIndex) => (
                  <motion.span
                    key={featureIndex}
                    className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10"
                    whileHover={!isMobile ? { scale: 1.05 } : undefined}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (featureIndex * 0.1) }}
                  >
                    {feature}
                  </motion.span>
                ))}
                {unit.specialFeatures.length > 2 && (
                  <span className="bg-white/10 text-white/60 px-2 py-1 rounded-full text-xs">
                    +{unit.specialFeatures.length - 2}
                  </span>
                )}
              </motion.div>
            )}
            
            {/* Action indicator */}
            <motion.div
              className="flex items-center text-white font-medium text-sm md:text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={!isMobile ? { x: 5 } : undefined}
            >
              <span>Conhecer unidade</span>
              <motion.div
                animate={!isMobile ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HiArrowRight className="ml-2" />
              </motion.div>
            </motion.div>
          </div>

          {/* Hover effect overlay */}
          {!isMobile && config.performance.enableComplexAnimations && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-flex-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          )}

          {/* Focus indicator */}
          <div className="absolute inset-0 ring-0 ring-flex-primary rounded-2xl group-focus-within:ring-2 transition-all duration-200" />
        </div>
      </Link>

      {/* Performance monitor (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1 rounded">
          {imageLoaded ? '✓' : '⏳'} 
          {config.performance.enableGPU ? ' GPU' : ' CPU'}
        </div>
      )}
    </motion.div>
  )
}

// Export do componente otimizado como padrão
export { OptimizedUnitCard as UnitCard }