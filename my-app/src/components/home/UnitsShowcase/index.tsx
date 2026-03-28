'use client'

import { motion } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { unitsData } from '@/lib/constants/units-data'
import { UnitCard } from './UnitCard'
import { useIsMobile } from '@/components/ClientOnly'
import dynamic from 'next/dynamic'
import { Building2, Users, Award } from 'lucide-react'

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
      className="scroll-section min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden"
      role="region"
      aria-labelledby="units-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-14">
          <motion.h2
            id="units-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5"
            {...fadeUp}
          >
            Nossas{' '}
            <span className="gradient-text">Unidades</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-500 max-w-3xl mx-auto mb-10"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Escolha a unidade mais proxima e comece sua transformacao
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-4"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { number: '4', label: 'Unidades', icon: Building2 },
              { number: '5k+', label: 'Alunos', icon: Users },
              { number: '30+', label: 'Anos', icon: Award }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <stat.icon className="w-5 h-5 text-flex-primary mx-auto mb-1.5" />
                <div className="font-display text-2xl font-bold text-flex-dark">{stat.number}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
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

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-block bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-display text-2xl md:text-3xl gradient-text mb-3">
              Mais unidades em breve
            </h3>
            <p className="text-gray-500 mb-6 max-w-xl mx-auto">
              Estamos expandindo para atender voce ainda melhor
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Equipamentos de ultima geracao
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Professores especializados
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
