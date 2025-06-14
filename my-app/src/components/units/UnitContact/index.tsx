'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/types/unit.types'
import ScrollReveal from '@/components/shared/ScrollReveal'
import ContactForm from '@/components/home/CTASection/ContactForm'
import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

interface UnitContactProps {
  unit: Unit
}

export default function UnitContact({ unit }: UnitContactProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="py-20 bg-flex-dark">
      <div className="section-padding">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl text-center mb-12">
            FAÇA PARTE DA <span className="gradient-text">FLEX {unit.name.toUpperCase()}</span>
          </h2>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xl text-flex-light/80 mb-8">
              {unit.comingSoon 
                ? 'Seja um dos primeiros a conhecer nossa nova unidade. Cadastre-se para receber informações exclusivas sobre a inauguração!'
                : 'Agende uma visita e conheça de perto toda nossa estrutura e diferenciais. Nossa equipe está pronta para receber você!'
              }
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-flex-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-flex-accent transition-all duration-300"
              >
                {unit.comingSoon ? 'Cadastrar Interesse' : 'Agendar Visita'}
              </motion.button>
              
              <motion.a
                href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-effect text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-xl" />
                Falar no WhatsApp
              </motion.a>
            </div>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal delay={0.4}>
            <div className="mt-16">
              <div className="glass-effect rounded-2xl overflow-hidden h-96">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(unit.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </div>
    </section>
  )
}