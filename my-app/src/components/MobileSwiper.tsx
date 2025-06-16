'use client'

import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import UnitCard from '@/components/home/UnitsShowcase/UnitCard'
import { Unit } from '@/lib/constants/units-data'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

interface MobileSwiperProps {
  units: Unit[]
}

export default function MobileSwiper({ units }: MobileSwiperProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          autoplay={{ 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            bulletClass: 'swiper-pagination-bullet units-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active units-bullet-active'
          }}
          className="units-swiper pb-16"
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              centeredSlides: false
            },
            768: {
              slidesPerView: 2,
              centeredSlides: false
            }
          }}
          // Configurações específicas para mobile
          touchEventsTarget="container"
          simulateTouch={true}
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          // Prevent scrolling issues
          preventInteractionOnTransition={true}
          watchOverflow={true}
        >
          {units.map((unit) => (
            <SwiperSlide key={unit.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <UnitCard unit={unit} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Custom Swiper Styles - Inline para garantir que carregue */}
      <style jsx global>{`
        .units-swiper {
          overflow: hidden;
          padding-bottom: 3rem !important;
        }

        .units-swiper .swiper-pagination {
          bottom: 0 !important;
          left: 0 !important;
          width: 100% !important;
        }

        .units-bullet {
          background: rgba(30, 64, 175, 0.3) !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
          border-radius: 50% !important;
        }

        .units-bullet-active {
          background: linear-gradient(45deg, #1E40AF, #3B82F6) !important;
          transform: scale(1.3) !important;
          box-shadow: 0 0 10px rgba(30, 64, 175, 0.5) !important;
        }

        .units-bullet:hover {
          transform: scale(1.1) !important;
          background: rgba(59, 130, 246, 0.6) !important;
        }

        /* Fix para touch no mobile */
        .units-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .units-swiper .swiper-slide {
          transition: transform 0.3s ease !important;
        }

        /* Prevent scroll issues on mobile */
        .units-swiper .swiper-container {
          touch-action: pan-y !important;
        }

        @media (max-width: 768px) {
          .units-swiper {
            margin-left: -1rem;
            margin-right: -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .units-swiper .swiper-slide {
            opacity: 0.7;
            transform: scale(0.95);
            transition: all 0.3s ease;
          }
          
          .units-swiper .swiper-slide-active {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}