'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/lib/constants/units-data'
import { useState } from 'react'
import { FaWhatsapp, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { HiLocationMarker } from 'react-icons/hi'
import { MdDirections } from 'react-icons/md'
import { Calendar, Car, Accessibility, Ruler } from 'lucide-react'
import ContactForm from '@/components/home/CTASection/ContactForm'

interface UnitContactProps {
  unit: Unit
}

export default function UnitContact({ unit }: UnitContactProps) {
  const [showForm, setShowForm] = useState(false)

  const contactMethods = [
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: unit.whatsapp,
      action: `https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`,
      color: 'green' as const,
      description: 'Resposta rapida'
    },
    {
      icon: FaPhone,
      title: 'Telefone',
      value: unit.phone,
      action: `tel:${unit.phone.replace(/\D/g, '')}`,
      color: 'primary' as const,
      description: 'Atendimento direto'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Endereço',
      value: unit.address,
      action: `https://maps.google.com/?q=${encodeURIComponent(unit.address)}`,
      color: 'secondary' as const,
      description: 'Como chegar'
    }
  ]

  const colorMap = {
    green: {
      bg: 'bg-green-500/15',
      text: 'text-green-400',
      hover: 'hover:border-green-500/30',
    },
    primary: {
      bg: 'bg-flex-primary/15',
      text: 'text-flex-primary',
      hover: 'hover:border-flex-primary/30',
    },
    secondary: {
      bg: 'bg-flex-secondary/15',
      text: 'text-flex-secondary',
      hover: 'hover:border-flex-secondary/30',
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-flex-dark to-flex-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Faca parte da{' '}
            <span className="gradient-text">Flex {unit.name}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            {unit.comingSoon
              ? 'Seja um dos primeiros a conhecer nossa nova unidade. Cadastre-se para receber informações exclusivas sobre a inauguração!'
              : 'Agende uma visita e conheça de perto toda nossa estrutura e diferenciais. Nossa equipe está pronta para receber você!'
            }
          </p>
        </motion.div>

        {/* Contact methods */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {contactMethods.map((method, index) => {
            const colors = colorMap[method.color]
            return (
              <motion.a
                key={index}
                href={method.action}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white/5 backdrop-blur-sm p-7 rounded-xl border border-white/10 ${colors.hover} transition-all duration-200 text-center group`}
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className={`text-2xl ${colors.text}`} />
                </div>
                <h3 className="font-display text-xl text-white mb-1">{method.title}</h3>
                <p className="text-white/50 text-sm mb-2">{method.description}</p>
                <p className="text-white/80 font-medium text-sm break-words">{method.value}</p>
              </motion.a>
            )
          })}
        </div>

        {/* Action buttons */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.assign('/freepass')}
              className="inline-flex items-center justify-center gap-2 bg-flex-primary text-white px-8 py-4 rounded-full font-medium text-base hover:bg-flex-secondary transition-colors duration-200"
            >
              <Calendar className="w-5 h-5" />
              Agendar Visita
            </button>

            <a
              href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white px-8 py-4 rounded-full font-medium text-base hover:bg-green-600 hover:border-green-600 transition-all duration-200"
            >
              <FaWhatsapp className="text-lg" />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Map section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h3 className="font-display text-2xl text-white mb-2 inline-flex items-center gap-2">
              <HiLocationMarker className="text-flex-secondary" />
              Nossa Localização
            </h3>
            <p className="text-white/60 text-sm">
              {unit.landmark ? `${unit.landmark} - ` : ''}Fácil acesso e estacionamento
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden h-80 border border-white/10 flex items-center justify-center">
            <div className="text-center px-6">
              <HiLocationMarker className="text-5xl text-flex-primary mb-3 mx-auto" />
              <h4 className="font-display text-xl text-white mb-2">Flex {unit.name}</h4>
              <p className="text-white/60 max-w-md text-sm mb-5">{unit.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(unit.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-flex-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-flex-secondary transition-colors duration-200"
              >
                <MdDirections />
                Como Chegar
              </a>
            </div>
          </div>

          {/* Quick info */}
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <Car className="w-5 h-5 text-white/60 mx-auto mb-1.5" />
              <h4 className="text-white text-sm font-medium mb-0.5">Estacionamento</h4>
              <p className="text-white/50 text-xs">{unit.parking}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <Accessibility className="w-5 h-5 text-white/60 mx-auto mb-1.5" />
              <h4 className="text-white text-sm font-medium mb-0.5">Acessibilidade</h4>
              <p className="text-white/50 text-xs">100% Acessivel</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <Ruler className="w-5 h-5 text-white/60 mx-auto mb-1.5" />
              <h4 className="text-white text-sm font-medium mb-0.5">Area Total</h4>
              <p className="text-white/50 text-xs">{unit.area}</p>
            </div>
          </div>
        </motion.div>

        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </div>
    </section>
  )
}
