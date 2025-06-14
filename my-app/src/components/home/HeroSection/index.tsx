'use client'

import { motion } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi'

export default function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
      <div className="hero-content w-full max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="animate-on-scroll"
        >
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 leading-none">
            <span className="gradient-text">FLEX FITNESS</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-flex-gray mb-12 animate-on-scroll">
            A EVOLUÇÃO DO SEU TREINO
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-on-scroll">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-xl transition-all duration-300"
            >
              Conheça Nossas Unidades
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-flex-blue border-2 border-flex-blue px-8 py-4 rounded-full font-medium text-lg hover:bg-flex-blue hover:text-white transition-all duration-300"
            >
              Agendar Visita
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-on-scroll"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-flex-red text-4xl"
          >
            <HiChevronDown />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}