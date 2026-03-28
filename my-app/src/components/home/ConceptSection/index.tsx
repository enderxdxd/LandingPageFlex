'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Dumbbell, Clock, MapPin, Flame } from 'lucide-react'

export default function ConceptSection() {
  const sectionRef = useRef(null)

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <section
      ref={sectionRef}
      className="scroll-section bg-flex-dark text-white py-20 lg:py-28 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-14">
          <motion.h2
            className="font-display text-4xl md:text-6xl lg:text-7xl mb-5"
            {...fadeUp}
          >
            <span className="text-white">POR QUE A</span>
            <br />
            <span className="gradient-text">FLEX?</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 max-w-xl leading-relaxed"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            30 anos formando a maior rede de academias de Goiania.
            4 unidades, cada uma com identidade propria.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Large image - spans 2 cols */}
          <motion.div
            className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image
              src="/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_001.jpg"
              alt="Flex Fitness Alphaville"
              width={800}
              height={600}
              className="w-full h-full min-h-[300px] lg:min-h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-flex-secondary" />
                <span className="text-white/70 text-sm">Alphaville</span>
              </div>
              <p className="text-white font-display text-xl lg:text-2xl">
                3.500m² de estrutura completa
              </p>
            </div>
          </motion.div>

          {/* Stat card - Horario */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-2xl p-5 lg:p-6 flex flex-col justify-between"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Clock className="w-6 h-6 text-flex-secondary mb-4" />
            <div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-white mb-1">4:30</div>
              <div className="text-gray-400 text-sm">Abertura mais cedo de Goiania. Treino antes do sol nascer.</div>
            </div>
          </motion.div>

          {/* Stat card - Equipamentos */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-2xl p-5 lg:p-6 flex flex-col justify-between"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Dumbbell className="w-6 h-6 text-flex-secondary mb-4" />
            <div>
              <div className="font-display text-2xl lg:text-3xl font-bold text-white mb-1">ELEIKO</div>
              <div className="text-gray-400 text-sm">Equipamentos padrao olimpico em todas as unidades.</div>
            </div>
          </motion.div>

          {/* Feature card - CrossFit */}
          <motion.div
            className="relative rounded-2xl overflow-hidden group"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src="/images/units/alphaville/crossfit-box.jpeg"
              alt="CrossFit Box - Flex Fitness"
              width={400}
              height={300}
              className="w-full h-full min-h-[160px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium text-sm">CrossFit Box</span>
              </div>
            </div>
          </motion.div>

          {/* Feature card - Piscina */}
          <motion.div
            className="relative rounded-2xl overflow-hidden group"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Image
              src="/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_039.jpg"
              alt="Area de treino - Flex Fitness"
              width={400}
              height={300}
              className="w-full h-full min-h-[160px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-flex-secondary" />
                <span className="text-white font-medium text-sm">20+ Modalidades</span>
              </div>
            </div>
          </motion.div>

          {/* Wide feature card - spans 2 cols */}
          <motion.div
            className="col-span-2 bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20 border border-white/10 rounded-2xl p-5 lg:p-6"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg lg:text-xl text-white mb-2">
                  Aberta 7 dias por semana
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Seg-Sex 4:30-23h &middot; Sab 7-16h &middot; Dom 7-14h
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {['Alphaville', 'Buena Vista', 'Marista', 'Palmas'].map((name) => (
                  <div
                    key={name}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"
                    title={name}
                  >
                    <span className="text-white text-xs font-bold">{name.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image card - Marista */}
          <motion.div
            className="col-span-2 relative rounded-2xl overflow-hidden group"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Image
              src="/images/units/marista/Flex_Marista_by_NelsonPacheco_002.jpg"
              alt="Flex Fitness Marista"
              width={800}
              height={300}
              className="w-full h-[200px] lg:h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/70 text-sm mb-1">Estacionamento gratuito em todas as unidades</p>
              <p className="text-white font-display text-lg">80+ vagas por unidade</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
