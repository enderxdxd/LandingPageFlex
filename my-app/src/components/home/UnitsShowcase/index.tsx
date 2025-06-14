'use client'

import { motion } from 'framer-motion'
import { unitsData } from '@/lib/constants/units-data'
import UnitCard from './UnitCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function UnitsShowcase() {
  return (
    <section className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll">
            NOSSAS <span className="gradient-text">UNIDADES</span>
          </h2>
          <p className="text-xl text-flex-gray animate-on-scroll">
            Escolha a unidade mais próxima e comece sua transformação
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {unitsData.map((unit, index) => (
              <div
                key={unit.id}
                className="animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <UnitCard unit={unit} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Swiper */}
        <div className="lg:hidden animate-on-scroll">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            className="units-swiper pb-12"
            breakpoints={{
              640: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false
              }
            }}
          >
            {unitsData.map((unit) => (
              <SwiperSlide key={unit.id}>
                <UnitCard unit={unit} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}