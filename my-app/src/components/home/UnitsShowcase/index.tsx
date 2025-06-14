'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { unitsData } from '@/lib/constants/units-data'
import UnitCard from './UnitCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function UnitsShowcase() {
  const [activeUnit, setActiveUnit] = useState(0)

  return (
    <section className="scroll-section bg-gradient-to-br from-flex-white to-flex-light-gray">
      <div className="content-wrapper w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            NOSSAS <span className="gradient-text">UNIDADES</span>
          </h2>
          <p className="text-xl text-flex-gray">
            Escolha a unidade mais próxima e comece sua transformação
          </p>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-8">
            {unitsData.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <UnitCard unit={unit} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View - Swiper */}
        <div className="lg:hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="units-swiper"
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