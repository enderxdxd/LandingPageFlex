'use client'

import { motion } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { unitsData } from '@/lib/constants/units-data'
import { UnitCard } from './UnitCard'
import { useIsMobile } from '@/components/ClientOnly'
import dynamic from 'next/dynamic'

const MobileSwiper = dynamic(() => import('@/components/MobileSwiper'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-flex-primary" />
    </div>
  )
})

const UnitCardSkeleton = () => (
  <div className="h-[400px] rounded-2xl bg-gray-200 animate-pulse overflow-hidden">
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="h-8 bg-gray-300 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-300 rounded mb-4 w-full" />
      <div className="h-5 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
)

export default function UnitsShowcase() {
  const sectionRef = useRef(null)
  const isMobile = useIsMobile()

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <section
      id="units"
      ref={sectionRef}
      className="scroll-section bg-gray-50 py-24 lg:py-32 relative overflow-hidden"
      role="region"
      aria-labelledby="units-title"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-flex-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-14 lg:mb-16">
          <motion.h2
            id="units-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            NOSSAS{' '}
            <span className="gradient-text">UNIDADES</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Escolha a unidade mais próxima e comece sua transformação
          </motion.p>
        </div>

        {/* Cards */}
        {isMobile ? (
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
            <MobileSwiper>
              {unitsData.map((unit, idx) => (
                <UnitCard key={unit.id} unit={unit} priority={idx === 0} lazy={idx > 1} index={idx} />
              ))}
            </MobileSwiper>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } }
            }}
          >
            {unitsData.map((unit, idx) => (
              <motion.div
                key={unit.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
              >
                <Suspense fallback={<UnitCardSkeleton />}>
                  <UnitCard unit={unit} priority={idx === 0} lazy={idx > 2} index={idx} />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom info */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Equipamentos de última geração
          </span>
          <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Professores especializados
          </span>
          <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Estacionamento gratuito
          </span>
        </motion.div>
      </div>
    </section>
  )
}
