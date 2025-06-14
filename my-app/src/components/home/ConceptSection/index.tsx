'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ConceptSection() {
  return (
    <section className="panel bg-flex-dark text-white">
      <div className="panel-content">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="panel-heading font-display text-5xl md:text-7xl mb-6 animate-element">
              <span className="text-flex-red">REDEFINA</span><br />
              <span className="text-flex-blue">SEUS LIMITES</span>
            </h2>
            
            <p className="panel-text text-lg text-flex-gray mb-6 animate-element">
              Na Flex Fitness Center, acreditamos que o verdadeiro luxo está na 
              excelência. Nossos espaços foram projetados para proporcionar uma 
              experiência única de treino, onde tecnologia, conforto e resultados 
              se encontram.
            </p>
            
            <p className="text-lg text-flex-gray mb-8 animate-element">
              Com equipamentos de última geração, profissionais altamente 
              qualificados e ambientes exclusivos, transformamos cada visita 
              em uma jornada de superação pessoal.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-center bg-flex-red/10 border border-flex-red/30 rounded-lg p-6"
              >
                <div className="text-4xl font-display text-flex-red mb-2">4</div>
                <p className="text-flex-gray">Unidades Premium</p>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="text-center bg-flex-blue/10 border border-flex-blue/30 rounded-lg p-6"
              >
                <div className="text-4xl font-display text-flex-blue mb-2">50+</div>
                <p className="text-flex-gray">Modalidades</p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-flex-red/20 to-flex-blue/20" />
              <div className="w-full h-full bg-gradient-to-br from-flex-red to-flex-blue opacity-20" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 gradient-bg rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="font-display text-2xl text-white">PREMIUM</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}