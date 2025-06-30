'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { HiLocationMarker, HiArrowRight, HiPhone, HiClock, HiStar } from 'react-icons/hi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import React from 'react'

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
  heroImageMobile?: string
}

// Enhanced Tooltip Component
const Tooltip = ({ children, content, position = 'top' }: {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${
              position === 'top' ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' :
              position === 'bottom' ? 'top-full mt-2 left-1/2 transform -translate-x-1/2' :
              position === 'left' ? 'right-full mr-2 top-1/2 transform -translate-y-1/2' :
              'left-full ml-2 top-1/2 transform -translate-y-1/2'
            }`}
          >
            {content}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
              position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2' :
              'right-full top-1/2 translate-x-1/2 -translate-y-1/2'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Loading Component
const AdvancedImageLoader = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-gray-300/80 to-transparent" />
    {/* Skeleton content */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="h-8 bg-gray-300/60 rounded mb-2 w-3/4 animate-pulse" style={{ animationDelay: '0.1s' }} />
      <div className="h-4 bg-gray-300/60 rounded mb-4 w-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-300/60 rounded-full w-20 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="h-6 bg-gray-300/60 rounded-full w-16 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <div className="h-5 bg-gray-300/60 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
         style={{ animation: 'shimmer 2s infinite' }} />
  </div>
)

// Enhanced Social Button Component
const SocialButton = ({ 
  icon, 
  onClick, 
  tooltip, 
  color, 
  hoverColor,
  delay = 0 
}: {
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  tooltip: string
  color: string
  hoverColor: string
  delay?: number
}) => (
  <Tooltip content={tooltip}>
    <motion.button
      onClick={onClick}
      className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 group/social shadow-lg ${color}`}
      whileHover={{ 
        scale: 1.15, 
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 200 }}
    >
      <motion.div
        className={`text-lg transition-colors ${hoverColor}`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  </Tooltip>
)

// Enhanced Status Badge Component
const StatusBadge = ({ unit }: { unit: Unit }) => {
  if (!unit.comingSoon) return null

  return (
    <motion.div 
      className="absolute top-4 right-4 z-20"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg border-2 border-white/20"
        animate={{ 
          boxShadow: [
            "0 4px 15px rgba(245, 158, 11, 0.4)",
            "0 6px 20px rgba(245, 158, 11, 0.6)",
            "0 4px 15px rgba(245, 158, 11, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.05, rotate: 2 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.div>
          EM BREVE
        </div>
      </motion.div>
    </motion.div>
  )
}

// Phone numbers mapping - DADOS CORRETOS
const landlineNumbers = {
  'Alphaville': '62 3414-7330',
  'Buena Vista': '62 3515-0588', 
  'Marista': '62 3241-7700'
}

// WhatsApp numbers mapping - DADOS CORRETOS
const whatsappNumbers = {
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
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Enhanced Intersection Observer
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

  // Advanced image preloading
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

  // Enhanced handlers with haptic feedback
  const handleCardClick = useCallback(() => {
    triggerHaptic('light')
  }, [triggerHaptic])

  const handleInstagramClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    
    // URL do Instagram da Flex Fitness
    const instagramUrl = 'https://www.instagram.com/flexfitnesscenter/'
    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
  }, [triggerHaptic])

  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    
    // Usar o WhatsApp correto da unidade
    const whatsappNumber = whatsappNumbers[unit.name as keyof typeof whatsappNumbers] || unit.whatsapp
    if (!whatsappNumber || whatsappNumber === '----') return
    
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const fullNumber = `55${cleanNumber}`
    const message = `Olá! Gostaria de conhecer a unidade ${unit.name} da Flex Fitness.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }, [triggerHaptic, unit.whatsapp, unit.name])

  const handlePhoneClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHaptic('medium')
    
    const phoneNumber = landlineNumbers[unit.name as keyof typeof landlineNumbers]
    if (!phoneNumber) return
    
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    const telUrl = `tel:+55${cleanNumber}`
    
    // Para dispositivos móveis, abrir o discador
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = telUrl
    } else {
      // Para desktop, copiar número ou mostrar
      navigator.clipboard?.writeText(`+55 ${phoneNumber}`)
        .then(() => {
          alert(`Número copiado: +55 ${phoneNumber}`)
        })
        .catch(() => {
          alert(`Telefone da unidade ${unit.name}: +55 ${phoneNumber}`)
        })
    }
  }, [triggerHaptic, unit.name])

  // Enhanced animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 30 : 50,
      scale: 0.9,
      rotateY: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: config.animations.duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: config.animations.disabled ? 0 : index * 0.1
      }
    }
  }

  const hasLandline = landlineNumbers[unit.name as keyof typeof landlineNumbers]

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isMobile ? {
        y: -12,
        scale: 1.03,
        rotateY: 3,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      style={{ 
        willChange: config.performance.enableGPU ? 'transform' : 'auto',
        transform: 'translateZ(0)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Enhanced Social Media Links */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
        <SocialButton
          icon={<FaInstagram />}
          onClick={handleInstagramClick}
          tooltip="Seguir no Instagram"
          color="hover:text-pink-400"
          hoverColor="group-hover/social:text-pink-400"
          delay={0.3}
        />

        {/* WhatsApp Link - Só aparece se tiver WhatsApp válido */}
        {(() => {
          const whatsappNumber = whatsappNumbers[unit.name as keyof typeof whatsappNumbers] || unit.whatsapp
          const hasValidWhatsapp = whatsappNumber && whatsappNumber !== '----' && !unit.comingSoon
          
          if (!hasValidWhatsapp) return null
          
          return (
            <SocialButton
              icon={<FaWhatsapp />}
              onClick={handleWhatsAppClick}
              tooltip={`WhatsApp: ${whatsappNumber}`}
              color="hover:text-green-400"
              hoverColor="group-hover/social:text-green-400"
              delay={0.4}
            />
          )
        })()}

        {/* Phone Link - Só aparece se tiver telefone válido */}
        {(() => {
          const phoneNumber = landlineNumbers[unit.name as keyof typeof landlineNumbers]
          if (!phoneNumber) return null
          
          return (
            <SocialButton
              icon={<HiPhone />}
              onClick={handlePhoneClick}
              tooltip={`Telefone: ${phoneNumber}`}
              color="hover:text-blue-400"
              hoverColor="group-hover/social:text-blue-400"
              delay={0.5}
            />
          )
        })()}
      </div>

      {/* Enhanced Status Badge */}
      <StatusBadge unit={unit} />

      {/* Main Card Link */}
      <Link 
        href={`/unidades/${unit.slug}`}
        onClick={handleCardClick}
        className="block focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 rounded-2xl transition-all duration-200"
        aria-label={`Conhecer unidade ${unit.name}`}
      >
        <motion.div 
          className="relative h-[400px] lg:h-[450px] rounded-2xl overflow-hidden bg-gray-200 shadow-lg"
          whileHover={!isMobile ? {
            y: -5,
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          } : undefined}
          whileTap={isMobile ? { scale: 0.97 } : undefined}
        >
          {/* Advanced Loading State */}
          {!imageLoaded && !imageError && <AdvancedImageLoader />}

          {/* Enhanced Error State */}
          {imageError && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center text-gray-600">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏢
                </motion.div>
                <div className="text-lg font-medium">Imagem indisponível</div>
                <div className="text-sm opacity-75">Tente novamente mais tarde</div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Main Image */}
          {isInView && !imageError && (
            <Image
              ref={imageRef}
              src={isMobile && unit.heroImageMobile ? unit.heroImageMobile : unit.heroImage}
              alt={`${unit.name} - Academia Flex Fitness em ${unit.address}`}
              fill
              className={`object-cover transition-all duration-700 ${
                isMobile 
                  ? 'group-active:scale-105' 
                  : 'group-hover:scale-110'
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
          
          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-flex-dark/90 via-flex-dark/30 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          />
          
          {/* Enhanced Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <motion.h3 
              className="font-display text-2xl md:text-3xl text-white mb-2 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {unit.name.toUpperCase()}
            </motion.h3>
            
            <motion.div 
              className="flex items-start text-white/80 text-sm mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HiLocationMarker className="mr-2 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed">{unit.address}</span>
            </motion.div>

            {/* Enhanced Hours Display */}
            {unit.hours && (
              <motion.div 
                className="flex items-center text-white/70 text-xs mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <HiClock className="mr-2" />
                <span>Seg-Sex: {unit.hours.weekdays}</span>
              </motion.div>
            )}
            
            {/* Enhanced Special Features */}
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
                    className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 shadow-lg"
                    whileHover={!isMobile ? { 
                      scale: 1.05, 
                      backgroundColor: "rgba(255, 255, 255, 0.3)" 
                    } : undefined}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (featureIndex * 0.1) }}
                  >
                    {feature}
                  </motion.span>
                ))}
                {unit.specialFeatures.length > 2 && (
                  <Tooltip content={`Mais ${unit.specialFeatures.length - 2} características`}>
                    <motion.span 
                      className="bg-white/10 text-white/60 px-3 py-1.5 rounded-full text-xs border border-white/10 cursor-help"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      +{unit.specialFeatures.length - 2}
                    </motion.span>
                  </Tooltip>
                )}
              </motion.div>
            )}
            
            {/* Enhanced Action Indicator */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex items-center text-white font-semibold text-sm md:text-base"
                whileHover={!isMobile ? { x: 5 } : undefined}
              >
                <span>Conhecer unidade</span>
                <motion.div
                  animate={!isMobile ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiArrowRight className="ml-2" />
                </motion.div>
              </motion.div>

              {/* Rating Display (if available) */}
              <motion.div
                className="flex items-center text-amber-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <HiStar className="text-lg" />
                <span className="text-white text-sm ml-1 font-medium">4.8</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Focus Ring */}
          <div className="absolute inset-0 ring-0 ring-blue-500 rounded-2xl group-focus-within:ring-4 group-focus-within:ring-offset-2 transition-all duration-300" />

          {/* Accessibility Enhancement */}
          <div className="sr-only">
            Academia {unit.name} localizada em {unit.address}. 
            {unit.comingSoon ? 'Em breve' : 'Clique para mais informações'}
          </div>
        </motion.div>
      </Link>

      {/* Performance Monitor (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-2 rounded-lg font-mono">
          <div>{imageLoaded ? '✅ Loaded' : '⏳ Loading'}</div>
          <div>{config.performance.enableGPU ? '🚀 GPU' : '🐌 CPU'}</div>
          <div>Index: {index}</div>
        </div>
      )}
    </motion.div>
  )
})

// Add custom CSS for shimmer effect
const shimmerCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = shimmerCSS
  document.head.appendChild(style)
}

export { OptimizedUnitCard as UnitCard }