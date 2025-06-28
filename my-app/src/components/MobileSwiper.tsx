'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

// Importações CSS otimizadas
import 'swiper/css'
import 'swiper/css/pagination'

interface MobileSwiperProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
}

export default function MobileSwiper({ children, className = '' }: MobileSwiperProps) {
  const { isMobile, networkSpeed } = useMobileOptimization({
    optimizePerformance: true
  })

  // Configuração otimizada para mobile
  const swiperConfig = {
    modules: [Pagination, Autoplay],
    spaceBetween: isMobile ? 8 : 16,
    slidesPerView: 1.1,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: networkSpeed === 'slow' ? 5000 : 3000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    // Removido EffectCoverflow - muito pesado para mobile
    speed: isMobile ? 300 : 600,
    threshold: isMobile ? 5 : 10,
    // Otimizações de performance
    watchSlidesProgress: false,
    watchSlidesVisibility: false,
    preloadImages: false,
    lazy: true,
    // Reduzir re-renders
    observer: false,
    observeParents: false,
  }

  // Converter children para array se necessário
  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <div className={`mobile-swiper-container ${className}`}>
      <Swiper
        {...swiperConfig}
        className="w-full"
        style={{
          // Otimizações CSS para mobile
          willChange: isMobile ? 'auto' : 'transform',
          transform: isMobile ? 'translateZ(0)' : 'none',
        }}
      >
        {childrenArray.map((child, index) => (
          <SwiperSlide key={index} className="pb-8">
            <div className="h-full">
              {child}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}