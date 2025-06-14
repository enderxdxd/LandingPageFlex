'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'

export default function HeroSection() {
  // const [isLoaded, setIsLoaded] = useState(false)

  // useEffect(() => {
  //   setIsLoaded(true)
  // }, [])

  return (
    <section className="panel bg-gradient-to-br from-flex-white via-flex-light-gray to-flex-white">
      <div className="panel-content text-center">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="panel-heading font-display text-7xl md:text-9xl mb-4 animate-element">
            <span className="gradient-text">FLEX FITNESS</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="panel-text text-xl md:text-3xl text-flex-gray mb-8 animate-element"
          >
            A EVOLUÇÃO DO SEU TREINO
          </motion.p>

          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center animate-element"
          >
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
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
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