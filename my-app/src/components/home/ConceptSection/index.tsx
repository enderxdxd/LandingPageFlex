'use client'

import { motion } from 'framer-motion'

export default function ConceptSection() {
  return (
    <section className="scroll-section min-h-screen bg-flex-dark text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll">
              <span className="text-flex-red">REDEFINA</span><br />
              <span className="text-flex-blue">SEUS LIMITES</span>
            </h2>
            
            <p className="text-lg text-flex-gray mb-6 animate-on-scroll">
              Na Flex Fitness Center, acreditamos que o verdadeiro luxo está na 
              excelência. Nossos espaços foram projetados para proporcionar uma 
              experiência única de treino, onde tecnologia, conforto e resultados 
              se encontram.
            </p>
            
            <p className="text-lg text-flex-gray mb-8 animate-on-scroll">
              Com equipamentos de última geração, profissionais altamente 
              qualificados e ambientes exclusivos, transformamos cada visita 
              em uma jornada de superação pessoal.
            </p>

            <div className="grid grid-cols-2 gap-6 animate-on-scroll">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center bg-flex-red/10 border border-flex-red/30 rounded-lg p-6"
              >
                <div className="text-4xl font-display text-flex-red mb-2">4</div>
                <p className="text-flex-gray">Unidades Premium</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center bg-flex-blue/10 border border-flex-blue/30 rounded-lg p-6"
              >
                <div className="text-4xl font-display text-flex-blue mb-2">50+</div>
                <p className="text-flex-gray">Modalidades</p>
              </motion.div>
            </div>
          </div>

          <div className="relative animate-on-scroll">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-flex-red/20 to-flex-blue/20" />
              <div className="w-full h-full bg-gradient-to-br from-flex-red to-flex-blue opacity-20" />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 gradient-bg rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="font-display text-2xl text-white">PREMIUM</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}