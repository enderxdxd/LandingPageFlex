'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectCoverflow, Controller } from 'swiper/modules'
import UnitCard from '@/components/home/UnitsShowcase/UnitCard'
import { Unit } from '@/lib/constants/units-data'
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useMobileSwiperConfig } from '@/hooks/useMobileOptimization'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

interface MobileSwiperProps {
  units: Unit[]
}

export default function MobileSwiper({ units }: MobileSwiperProps) {
  const { swiperConfig, isMobile, isTablet, animationConfig } = useMobileSwiperConfig()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoplayActive, setIsAutoplayActive] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set<string>())
  const swiperRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isDragging = useRef(false)

  // Intersection Observer para ativar apenas quando visível
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && isAutoplayActive && swiperRef.current) {
          swiperRef.current.autoplay.start()
        } else if (swiperRef.current) {
          swiperRef.current.autoplay.stop()
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isAutoplayActive])

  // Preload de imagens críticas
  const preloadImages = useCallback(() => {
    units.slice(0, 3).forEach((unit) => {
      if (!loadedImages.has(unit.id) && unit.heroImage) {
        const img = new Image()
        img.onload = () => {
          setLoadedImages(prev => new Set(Array.from(prev).concat(unit.id)))
        }
        img.src = unit.heroImage
      }
    })
  }, [units, loadedImages])

  useEffect(() => {
    preloadImages()
  }, [preloadImages])

  // Handlers otimizados
  const handleSlideChange = useCallback((swiper: any) => {
    setActiveIndex(swiper.activeIndex)
    
    // Preload próximas imagens
    const nextIndex = (swiper.activeIndex + 1) % units.length
    const unit = units[nextIndex]
    if (unit && !loadedImages.has(unit.id)) {
      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(Array.from(prev).concat(unit.id)))
      }
      img.src = unit.heroImage
    }
  }, [units, loadedImages])

  const handleTouchStart = useCallback((swiper: any, event: TouchEvent | MouseEvent | PointerEvent) => {
    if ('touches' in event) {
      touchStartX.current = event.touches[0].clientX
      touchStartY.current = event.touches[0].clientY
    }
    isDragging.current = false
    setIsAutoplayActive(false)
  }, [])

  const handleTouchMove = useCallback((swiper: any, event: TouchEvent | MouseEvent | PointerEvent) => {
    if (!isDragging.current && 'touches' in event) {
      const deltaX = Math.abs(event.touches[0].clientX - touchStartX.current)
      const deltaY = Math.abs(event.touches[0].clientY - touchStartY.current)
      
      // Só considera como drag horizontal se o movimento X for maior que Y
      if (deltaX > deltaY && deltaX > 10) {
        isDragging.current = true
        event.preventDefault() // Previne scroll vertical
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    // Reativa autoplay após 3 segundos de inatividade
    setTimeout(() => {
      if (isVisible) {
        setIsAutoplayActive(true)
      }
    }, 3000)
    isDragging.current = false
  }, [isVisible])

  const toggleAutoplay = useCallback(() => {
    setIsAutoplayActive(prev => {
      const newState = !prev
      if (swiperRef.current) {
        if (newState && isVisible) {
          swiperRef.current.autoplay.start()
        } else {
          swiperRef.current.autoplay.stop()
        }
      }
      return newState
    })
  }, [isVisible])

  // Configurações de animação responsivas
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationConfig.disabled ? 0 : 0.8,
        ease: animationConfig.easing,
        staggerChildren: animationConfig.disabled ? 0 : 0.1
      }
    }
  }), [animationConfig])

  const slideVariants = useMemo(() => ({
    inactive: {
      opacity: isMobile ? 0.7 : 0.8,
      scale: isMobile ? 0.95 : 0.96,
      transition: { duration: animationConfig.duration / 1000, ease: animationConfig.easing }
    },
    active: {
      opacity: 1,
      scale: 1,
      transition: { duration: animationConfig.duration / 1000, ease: animationConfig.easing }
    }
  }), [isMobile, animationConfig])

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Indicador de progresso superior */}
      <motion.div 
        className="flex justify-center mb-4 gap-1 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {units.map((_, index) => (
          <motion.button
            key={index}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex 
                ? 'w-8 bg-gradient-to-r from-flex-primary to-flex-secondary' 
                : 'w-4 bg-gray-300 hover:bg-gray-400'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideTo(index)
              }
            }}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Controle de autoplay */}
      <motion.div
        className="absolute top-2 right-2 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAutoplay}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all"
          aria-label={isAutoplayActive ? 'Pausar autoplay' : 'Iniciar autoplay'}
        >
          {isAutoplayActive ? '⏸️' : '▶️'}
        </motion.button>
      </motion.div>

      {/* Swiper Container */}
      <Swiper
        {...swiperConfig}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="units-swiper pb-12"
        autoplay={isAutoplayActive && isVisible ? swiperConfig.autoplay : false}
      >
        {units.map((unit, index) => (
          <SwiperSlide key={unit.id}>
            <motion.div
              className="h-full relative"
              variants={slideVariants}
              initial="inactive"
              animate={index === activeIndex ? "active" : "inactive"}
              whileHover={!isMobile ? { 
                scale: index === activeIndex ? 1.02 : 0.97,
                transition: { duration: 0.2 }
              } : undefined}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <UnitCard unit={unit} />
              
              {/* Overlay para slides inativos */}
              <AnimatePresence>
                {index !== activeIndex && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMobile ? 0.3 : 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Loading placeholder */}
              {!loadedImages.has(unit.id) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl"
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                />
              )}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar mobile */}
      <motion.div 
        className="flex justify-center mt-4 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="bg-gray-200 rounded-full h-1 w-32 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-flex-primary to-flex-secondary rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((activeIndex + 1) / units.length) * 100}%`
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        </div>
      </motion.div>

      {/* Info adicional */}
      <motion.div
        className="text-center mt-4 text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>{activeIndex + 1} de {units.length} unidades</span>
        {!isMobile && (
          <span className="ml-4 text-gray-400">
            Use as setas do teclado para navegar
          </span>
        )}
      </motion.div>

      {/* Keyboard navigation */}
      {!isMobile && (
        <div className="sr-only">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Slide anterior"
          >
            Anterior
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Próximo slide"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Estilos otimizados com melhor performance */}
      <style jsx global>{`
        .units-swiper {
          overflow: visible;
          padding-bottom: 2rem !important;
          contain: layout style paint;
          will-change: transform;
        }

        .units-swiper .swiper-wrapper {
          transition-timing-function: ease-out !important;
          transform-style: preserve-3d;
          will-change: transform;
          backface-visibility: hidden;
        }

        .units-swiper .swiper-slide {
          transition: all 0.4s ease-out !important;
          will-change: transform, opacity;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .units-swiper .swiper-pagination {
          bottom: -0.5rem !important;
          left: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          z-index: 10;
        }

        .units-bullet {
          background: rgba(30, 64, 175, 0.3) !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
          transition: all 0.3s ease-out !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          outline: none !important;
          border: none !important;
          position: relative;
        }

        .units-bullet-active {
          background: linear-gradient(45deg, #1E40AF, #3B82F6) !important;
          transform: scale(1.5) !important;
          box-shadow: 
            0 0 10px rgba(30, 64, 175, 0.6), 
            0 0 20px rgba(30, 64, 175, 0.3) !important;
        }

        .units-bullet:hover:not(.units-bullet-active) {
          transform: scale(1.2) !important;
          background: rgba(59, 130, 246, 0.6) !important;
        }

        .units-bullet:focus {
          outline: 2px solid #1E40AF !important;
          outline-offset: 2px !important;
        }

        /* Otimizações específicas para mobile */
        @media (max-width: 768px) {
          .units-swiper {
            margin-left: -0.5rem;
            margin-right: -0.5rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            touch-action: pan-y pinch-zoom;
          }

          .units-swiper .swiper-slide {
            border-radius: 1rem;
            overflow: hidden;
            transform: translateZ(0); /* Force GPU acceleration */
          }

          .units-swiper .swiper-slide:not(.swiper-slide-active) {
            filter: brightness(0.85) contrast(0.95);
          }

          .units-swiper .swiper-slide-active {
            filter: brightness(1) contrast(1);
            box-shadow: 
              0 8px 25px rgba(0, 0, 0, 0.12),
              0 4px 12px rgba(30, 64, 175, 0.08);
          }

          /* Prevenir zoom no double tap */
          .units-swiper * {
            touch-action: manipulation;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }

          /* Smooth scrolling otimizado */
          .units-swiper .swiper-container {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 481px) and (max-width: 1024px) {
          .units-swiper .swiper-slide {
            opacity: 0.85;
            transform: scale(0.96) translateZ(0);
          }
          
          .units-swiper .swiper-slide-active,
          .units-swiper .swiper-slide-next {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
        }

        /* Loading states */
        .swiper-lazy-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .units-swiper .swiper-slide,
          .units-swiper .swiper-wrapper,
          .units-bullet,
          .swiper-lazy-loading {
            transition: none !important;
            animation: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .units-bullet {
            background: #000000 !important;
            border: 2px solid #FFFFFF !important;
          }
          
          .units-bullet-active {
            background: #FFFFFF !important;
            border: 2px solid #000000 !important;
          }
        }

        /* Dark mode optimizations */
        @media (prefers-color-scheme: dark) {
          .units-swiper .swiper-slide:not(.swiper-slide-active) {
            filter: brightness(0.7) contrast(1.1);
          }
          
          .swiper-lazy-loading {
            background: linear-gradient(90deg, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%);
          }
        }

        /* Performance optimizations */
        .units-swiper .swiper-slide-duplicate {
          will-change: auto;
        }

        .units-swiper .swiper-slide-active {
          will-change: transform;
        }

        /* Print styles */
        @media print {
          .units-swiper {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  )
}