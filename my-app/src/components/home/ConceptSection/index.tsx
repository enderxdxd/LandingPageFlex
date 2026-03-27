'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
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
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-flex-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-flex-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.h2
              className="font-display text-4xl md:text-6xl lg:text-7xl mb-6"
              {...fadeUp}
            >
              <span className="text-white">REDEFINA</span>
              <br />
              <span className="gradient-text">SEUS LIMITES</span>
            </motion.h2>

            <motion.p
              className="text-lg text-gray-400 mb-6 leading-relaxed"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Na Flex Fitness Center, acreditamos que o verdadeiro luxo esta na
              excelencia. Nossos espacos foram projetados para proporcionar uma
              experiencia unica de treino, onde tecnologia, conforto e resultados
              se encontram.
            </motion.p>

            <motion.p
              className="text-lg text-gray-400 mb-8 leading-relaxed"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Com equipamentos de ultima geracao, profissionais altamente
              qualificados e ambientes exclusivos, transformamos cada visita
              em uma jornada de superacao pessoal.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-4"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-3xl font-display font-bold gradient-text mb-1">4</div>
                <div className="text-gray-400 text-sm">Unidades Premium</div>
              </div>

              <div className="text-center bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-3xl font-display font-bold gradient-text mb-1">20+</div>
                <div className="text-gray-400 text-sm">Modalidades</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/units/alphaville/alphaville1.jpeg"
                alt="Flex Fitness Center - Ambiente Premium"
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[500px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-flex-dark/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 gradient-bg rounded-full flex items-center justify-center shadow-blue-lg">
              <span className="font-display text-lg text-white font-bold">PREMIUM</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
