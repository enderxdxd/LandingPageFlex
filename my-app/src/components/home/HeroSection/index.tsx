'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import dynamic from 'next/dynamic'

const WarpShaderBackground = dynamic(
  () => import('@/components/ui/warp-shader'),
  { ssr: false }
)

export default function HeroClean() {
  const { isMobile } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })

  const scrollToUnits = () => {
    const unitsSection = document.getElementById('units')
    if (unitsSection) {
      unitsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      <WarpShaderBackground speed={isMobile ? 0.4 : 0.8} />

      <div className="hero-content w-full max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <img
              src="/images/units/alphaville/flex-logo-outline.png"
              alt="FLEX FITNESS"
              className="w-full max-w-xs md:max-w-sm h-auto object-contain mx-auto"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))' }}
            />
          </motion.div>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/80 font-light tracking-[0.2em] mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A EVOLUCAO DO SEU TREINO
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button
              onClick={scrollToUnits}
              className="bg-white/15 backdrop-blur-sm border border-white/25 text-white px-8 py-4 rounded-full font-medium text-base hover:bg-white/25 transition-all duration-300 cursor-pointer"
            >
              Conheca Nossas Unidades
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-6 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { number: '4', label: 'Unidades' },
              { number: '5K+', label: 'Alunos' },
              { number: '30+', label: 'Anos' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/8 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-white/10"
              >
                <div className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/60 text-xs md:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-white/30 w-5 h-5" />
        </motion.div>
      </div>
    </section>
  )
}
