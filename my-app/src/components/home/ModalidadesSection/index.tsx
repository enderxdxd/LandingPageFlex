'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import {
  Dumbbell,
  Activity,
  Sparkles,
  HeartPulse,
  Music,
  Info,
  type LucideIcon,
} from 'lucide-react'
import {
  modalidadesData,
  modalidadeCategories,
  type ModalidadeCategory,
} from '@/lib/constants/modalidades-data'

const categoryMeta: Record<ModalidadeCategory, { icon: LucideIcon; color: string }> = {
  'Força & Funcional': { icon: Dumbbell, color: 'primary' },
  'Mente & Corpo': { icon: Sparkles, color: 'secondary' },
  'Lutas': { icon: Activity, color: 'primary' },
  'Cardio': { icon: HeartPulse, color: 'secondary' },
  'Dança & Ritmos': { icon: Music, color: 'primary' },
}

type FilterOption = 'Todas' | ModalidadeCategory

export default function ModalidadesSection() {
  const sectionRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState<FilterOption>('Todas')

  const filters: FilterOption[] = ['Todas', ...modalidadeCategories]

  const visibleModalidades = useMemo(() => {
    if (activeFilter === 'Todas') return modalidadesData
    return modalidadesData.filter((m) => m.category === activeFilter)
  }, [activeFilter])

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  }

  return (
    <section
      ref={sectionRef}
      id="modalidades"
      className="scroll-section bg-gray-50 py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-flex-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-flex-secondary/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            className="inline-flex items-center gap-2 bg-flex-primary/5 text-flex-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            {...fadeUp}
          >
            <Dumbbell className="w-4 h-4" />
            Aulas coletivas
          </motion.div>

          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-5"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            NOSSAS <span className="gradient-text">MODALIDADES</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Uma grade completa de aulas para todos os objetivos e níveis
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2.5 mb-12"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'gradient-bg text-white border-transparent shadow-blue'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-flex-primary/30 hover:text-flex-primary'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </motion.div>

        {/* Modalidades grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleModalidades.map((modalidade) => {
              const meta = categoryMeta[modalidade.category]
              const Icon = meta.icon
              const isPrimary = meta.color === 'primary'
              return (
                <motion.div
                  key={modalidade.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="relative bg-white border border-gray-100 p-6 rounded-2xl hover:border-flex-primary/20 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                      isPrimary
                        ? 'bg-gradient-to-r from-flex-primary to-flex-secondary'
                        : 'bg-gradient-to-r from-flex-secondary to-flex-accent'
                    }`}
                  />

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        isPrimary
                          ? 'bg-flex-primary/10 text-flex-primary'
                          : 'bg-flex-secondary/10 text-flex-secondary'
                      }`}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-display text-lg text-flex-dark leading-tight">
                      {modalidade.name}
                      <span className="text-flex-primary align-super text-sm ml-0.5">*</span>
                    </h3>
                  </div>

                  <p className="text-flex-slate text-[14px] leading-relaxed">
                    {modalidade.description}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer note */}
        <motion.div
          className="mt-10 flex items-start gap-3 justify-center text-center max-w-2xl mx-auto"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Info className="w-4 h-4 text-flex-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500 leading-relaxed">
            <span className="text-flex-primary font-semibold">*</span> A disponibilidade das
            modalidades pode variar por unidade. Confirme com nossos consultores se a aula desejada
            faz parte da sua unidade.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
