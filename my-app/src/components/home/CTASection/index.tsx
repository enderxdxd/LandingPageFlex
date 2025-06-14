'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import ContactForm from './ContactForm'

export default function CTASection() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="panel bg-gradient-to-br from-flex-dark to-flex-blue text-white">
      <div className="panel-content text-center">
        <h2 className="panel-heading font-display text-5xl md:text-7xl mb-6 animate-element">
          COMECE SUA <span className="text-flex-red">TRANSFORMAÇÃO</span>
        </h2>
        
        <p className="panel-text text-xl text-white/80 mb-12 max-w-3xl mx-auto animate-element">
          Agende uma visita e descubra como podemos ajudar você a alcançar seus objetivos
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-element">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-flex-red text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
          >
            Agendar Visita Gratuita
          </motion.button>
          
          <motion.a
            href="https://wa.me/5562999990001"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-flex-blue px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center shadow-lg"
          >
            Falar no WhatsApp
          </motion.a>
        </div>

        {showForm && (
          <ContactForm onClose={() => setShowForm(false)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-element">
          <div className="text-center">
            <div className="text-4xl font-display text-flex-red mb-2">5.000+</div>
            <p className="text-white/70">Alunos Ativos</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-display text-white mb-2">98%</div>
            <p className="text-white/70">Satisfação</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-display text-flex-red mb-2">10+</div>
            <p className="text-white/70">Anos de Excelência</p>
          </div>
        </div>
      </div>
    </section>
  )
}