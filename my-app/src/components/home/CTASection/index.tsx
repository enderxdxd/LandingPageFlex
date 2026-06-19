'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import ContactForm from './ContactForm'
import WhatsAppUnitSelector from '@/components/WhatsAppUnitSelector'
import { Dumbbell, GraduationCap, MapPin, MessageCircle, ArrowRight } from 'lucide-react'

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
      className="scroll-section bg-flex-dark text-white py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-flex-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-flex-secondary/10 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Main headline */}
        <motion.h2
          className="font-display text-4xl md:text-6xl lg:text-7xl mb-5"
          {...fadeUp}
        >
          COMECE SUA{' '}
          <span className="gradient-text">TRANSFORMAÇÃO</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Agende uma visita e descubra como podemos ajudar você a alcançar seus objetivos
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => setShowWhatsAppSelector(true)}
            className="group bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
            <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:bg-white/20 cursor-pointer"
          >
            Agendar Visita
          </button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-20"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { icon: Dumbbell, title: 'Equipamentos Premium', desc: 'Tecnologia de ponta para seus treinos' },
            { icon: GraduationCap, title: 'Instrutores Qualificados', desc: 'Profissionais certificados para te guiar' },
            { icon: MapPin, title: '4 Unidades', desc: 'Localizações estratégicas em Goiânia' }
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-flex-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-flex-accent" strokeWidth={1.8} />
                </div>
              </div>
              <h3 className="font-display text-lg mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="relative inline-block"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Glow effect behind the card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/[0.06] backdrop-blur-sm rounded-3xl p-10 border border-white/[0.1]">
            <h3 className="font-display text-xl md:text-2xl gradient-text mb-3">
              SUA JORNADA COMEÇA AGORA
            </h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Junte-se à nossa família Flex e descubra o seu potencial máximo
            </p>
          </div>
        </motion.div>
      </div>

      {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      <WhatsAppUnitSelector isOpen={showWhatsAppSelector} onClose={() => setShowWhatsAppSelector(false)} />
    </section>
  )
}
