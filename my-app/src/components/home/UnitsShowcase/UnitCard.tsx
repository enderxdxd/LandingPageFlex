'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { HiLocationMarker, HiArrowRight, HiPhone, HiClock } from 'react-icons/hi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import React from 'react'

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
  heroImageMobile?: string
}

// Phone numbers mapping
const landlineNumbers: Record<string, string> = {
  'Alphaville': '62 3414-7330',
  'Buena Vista': '62 3515-0588',
  'Marista': '62 3241-7700'
}

// WhatsApp numbers mapping
const whatsappNumbers: Record<string, string> = {
  'Alphaville': '(62) 9537-8033',
  'Buena Vista': '(62) 9244-1708',
  'Marista': '(62) 9383-0661'
}

interface OptimizedUnitCardProps {
  unit: Unit
  lazy?: boolean
  priority?: boolean
  index?: number
}

const OptimizedUnitCard = React.memo(function OptimizedUnitCard({
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
        rootMargin: isMobile ? '100px' : '150px'
      }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [lazy, isMobile])

  useEffect(() => {
    if (!isInView || imageLoaded) return

    const img = new window.Image()
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
    img.src = isMobile && unit.heroImageMobile ? unit.heroImageMobile : unit.heroImage
  }, [isInView, imageLoaded, unit.heroImage, unit.heroImageMobile, isMobile])

  const handleCardClick = useCallback(() => {
    triggerHaptic('light')
  }, [triggerHaptic])

  const handleInstagramClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    window.open('https://www.instagram.com/flexfitnesscenter/', '_blank', 'noopener,noreferrer')
  }, [triggerHaptic])

  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')

    const whatsappNumber = whatsappNumbers[unit.name] || unit.whatsapp
    if (!whatsappNumber || whatsappNumber === '----') return

    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const fullNumber = `55${cleanNumber}`
    const message = `Olá! Gostaria de conhecer a unidade ${unit.name} da Flex Fitness.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${fullNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer')
  }, [triggerHaptic, unit.whatsapp, unit.name])

  const handlePhoneClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')

    const phoneNumber = landlineNumbers[unit.name]
    if (!phoneNumber) return

    const cleanNumber = phoneNumber.replace(/\D/g, '')
    const telUrl = `tel:+55${cleanNumber}`

    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = telUrl
    } else {
      navigator.clipboard?.writeText(`+55 ${phoneNumber}`)
        .then(() => {
          alert(`Número copiado: +55 ${phoneNumber}`)
        })
        .catch(() => {
          alert(`Telefone da unidade ${unit.name}: +55 ${phoneNumber}`)
        })
    }
  }, [triggerHaptic, unit.name])

  const whatsappNumber = whatsappNumbers[unit.name] || unit.whatsapp
  const hasValidWhatsapp = whatsappNumber && whatsappNumber !== '----' && !unit.comingSoon
  const hasLandline = !!landlineNumbers[unit.name]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: config.animations.duration / 1000,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: config.animations.disabled ? 0 : index * 0.1
        }
      }}
      whileHover={!isMobile ? {
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : undefined}
      className="relative group cursor-pointer"
    >
      {/* Social Media Links */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
        <button
          onClick={handleInstagramClick}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/30 transition-colors duration-200 shadow-lg"
          aria-label="Seguir no Instagram"
        >
          <FaInstagram className="text-lg" />
        </button>

        {hasValidWhatsapp && (
          <button
            onClick={handleWhatsAppClick}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-green-500/40 transition-colors duration-200 shadow-lg"
            aria-label={`WhatsApp: ${whatsappNumber}`}
          >
            <FaWhatsapp className="text-lg" />
          </button>
        )}

        {hasLandline && (
          <button
            onClick={handlePhoneClick}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-blue-500/40 transition-colors duration-200 shadow-lg"
            aria-label={`Telefone: ${landlineNumbers[unit.name]}`}
          >
            <HiPhone className="text-lg" />
          </button>
        )}
      </div>

      {/* Status Badge */}
      {unit.comingSoon && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-display text-sm shadow-lg">
            EM BREVE
          </div>
        </div>
      )}

      {/* Main Card Link */}
      <Link
        href={`/unidades/${unit.slug}`}
        onClick={handleCardClick}
        className="block focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 rounded-2xl transition-all duration-200"
        aria-label={`Conhecer unidade ${unit.name}`}
      >
        <div className="relative h-[400px] lg:h-[450px] rounded-2xl overflow-hidden bg-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="h-8 bg-gray-300/60 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-300/60 rounded mb-4 w-full" />
                <div className="h-5 bg-gray-300/60 rounded w-1/2" />
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div className="text-lg font-medium">Imagem indisponivel</div>
                <div className="text-sm opacity-75">Tente novamente mais tarde</div>
              </div>
            </div>
          )}

          {/* Main Image */}
          {isInView && !imageError && (
            <Image
              ref={imageRef}
              src={isMobile && unit.heroImageMobile ? unit.heroImageMobile : unit.heroImage}
              alt={`${unit.name} - Academia Flex Fitness em ${unit.address}`}
              fill
              className={`object-cover transition-transform duration-500 ${
                isMobile
                  ? 'group-active:scale-105'
                  : 'group-hover:scale-105'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              sizes={isMobile ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
              priority={priority}
              quality={isMobile ? 80 : 95}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Qtnl8SBos"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(true)
              }}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-flex-dark/90 via-flex-dark/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h3 className="font-display text-2xl md:text-3xl text-white mb-2 drop-shadow-lg">
              {unit.name.toUpperCase()}
            </h3>

            <div className="flex items-start text-white/80 text-sm mb-3">
              <HiLocationMarker className="mr-2 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed">{unit.address}</span>
            </div>

            {unit.hours && (
              <div className="flex items-center text-white/70 text-xs mb-3">
                <HiClock className="mr-2" />
                <span>Seg-Sex: {unit.hours.weekdays}</span>
              </div>
            )}

            {/* Special Features */}
            {unit.specialFeatures && unit.specialFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {unit.specialFeatures.slice(0, 2).map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10"
                  >
                    {feature}
                  </span>
                ))}
                {unit.specialFeatures.length > 2 && (
                  <span className="bg-white/10 text-white/60 px-3 py-1.5 rounded-full text-xs border border-white/10">
                    +{unit.specialFeatures.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Action Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-1 transition-all duration-300">
                <span>Conhecer unidade</span>
                <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Focus Ring */}
          <div className="absolute inset-0 ring-0 ring-blue-500 rounded-2xl group-focus-within:ring-4 group-focus-within:ring-offset-2 transition-all duration-300" />

          {/* Accessibility */}
          <div className="sr-only">
            Academia {unit.name} localizada em {unit.address}.
            {unit.comingSoon ? 'Em breve' : 'Clique para mais informações'}
          </div>
        </div>
      </Link>
    </motion.div>
  )
})

export { OptimizedUnitCard as UnitCard }
