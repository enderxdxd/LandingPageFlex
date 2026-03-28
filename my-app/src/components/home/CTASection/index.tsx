'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import ContactForm from './ContactForm'
import WhatsAppUnitSelector from '@/components/WhatsAppUnitSelector'
import { Dumbbell, GraduationCap, MapPin, MessageCircle } from 'lucide-react'

export default function CTASection() {
  const [showForm, setShowForm] = useState(false)
  const [showWhatsAppSelector, setShowWhatsAppSelector] = useState(false)
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
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-flex-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-flex-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <motion.h2
          className="font-display text-4xl md:text-6xl lg:text-7xl mb-4"
          {...fadeUp}
        >
          COMECE SUA{' '}
          <span className="gradient-text">TRANSFORMACAO</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 mb-12 max-w-3xl mx-auto"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Agende uma visita e descubra como podemos ajudar voce a alcancar seus objetivos
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => setShowWhatsAppSelector(true)}
            className="bg-white text-green-600 px-8 py-4 rounded-full font-medium text-base transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:bg-white/10 cursor-pointer"
          >
            Agendar Visita
          </button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { icon: Dumbbell, title: 'Equipamentos Premium', desc: 'Tecnologia de ponta para seus treinos' },
            { icon: GraduationCap, title: 'Instrutores Qualificados', desc: 'Profissionais certificados para te guiar' },
            { icon: MapPin, title: '4 Unidades', desc: 'Localizacoes estrategicas em Goiania' }
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex justify-center mb-3">
                <item.icon className="w-7 h-7 text-flex-accent" />
              </div>
              <h3 className="font-display text-lg mb-1">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="font-display text-xl md:text-2xl gradient-text mb-2">
            SUA JORNADA COMECA AGORA
          </h3>
          <p className="text-white/50 text-sm">
            Junte-se a nossa familia Flex e descubra o seu potencial maximo
          </p>
        </motion.div>
      </div>

      {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      <WhatsAppUnitSelector isOpen={showWhatsAppSelector} onClose={() => setShowWhatsAppSelector(false)} />
    </section>
  )
}
