'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/lib/constants/units-data'
import ContactForm from '@/components/home/CTASection/ContactForm'
import { useState } from 'react'
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa'
import { HiMail, HiLocationMarker } from 'react-icons/hi'
import { MdDirections } from 'react-icons/md'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface UnitContactProps {
  unit: Unit
}

export default function UnitContact({ unit }: UnitContactProps) {
  const [showForm, setShowForm] = useState(false)
  const { isMobile } = useMobileOptimization();

  const contactMethods = [
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: unit.whatsapp,
      action: `https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`,
      color: 'green',
      description: 'Resposta rápida'
    },
    {
      icon: FaPhone,
      title: 'Telefone',
      value: unit.phone,
      action: `tel:${unit.phone.replace(/\D/g, '')}`,
      color: 'primary',
      description: 'Atendimento direto'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Endereço',
      value: unit.address,
      action: `https://maps.google.com/?q=${encodeURIComponent(unit.address)}`,
      color: 'secondary',
      description: 'Como chegar'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-flex-dark to-flex-navy relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Contact-themed animations */}
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-flex-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-flex-secondary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Floating contact icons */}
        {Array.from({ length: isMobile ? 3 : 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-5 text-flex-primary"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              opacity: [0.02, 0.08, 0.02]
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            {i % 4 === 0 ? '📱' : i % 4 === 1 ? '📞' : i % 4 === 2 ? '📍' : '💬'}
          </motion.div>
        ))}
      </div>

      <div className="section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-display text-5xl md:text-6xl mb-6"
            whileHover={{ scale: 1.02 }}
          >
            FAÇA PARTE DA{' '}
            <motion.span 
              className="gradient-text relative"
              whileHover={{ 
                textShadow: "0 0 30px rgba(30, 64, 175, 0.5)"
              }}
            >
              FLEX {unit.name.toUpperCase()}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-flex-primary to-flex-secondary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-flex-light/80 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {unit.comingSoon 
              ? 'Seja um dos primeiros a conhecer nossa nova unidade. Cadastre-se para receber informações exclusivas sobre a inauguração!'
              : 'Agende uma visita e conheça de perto toda nossa estrutura e diferenciais. Nossa equipe está pronta para receber você!'
            }
          </motion.p>
        </motion.div>

        {/* Contact methods grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.action}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: method.color === 'green' 
                  ? "0 20px 40px rgba(34, 197, 94, 0.3)"
                  : method.color === 'primary'
                  ? "0 20px 40px rgba(30, 64, 175, 0.3)"
                  : "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="glass-effect p-8 rounded-2xl backdrop-blur-lg border border-white/10 group cursor-pointer text-center relative overflow-hidden"
            >
              {/* Background hover effect */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  method.color === 'green' 
                    ? 'bg-gradient-to-br from-green-500/10 to-transparent'
                    : method.color === 'primary'
                    ? 'bg-gradient-to-br from-flex-primary/10 to-transparent'
                    : 'bg-gradient-to-br from-flex-secondary/10 to-transparent'
                }`}
              />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  method.color === 'green' 
                    ? 'bg-green-500/20 text-green-400'
                    : method.color === 'primary'
                    ? 'bg-flex-primary/20 text-flex-primary'
                    : 'bg-flex-secondary/20 text-flex-secondary'
                } relative z-10`}
              >
                <method.icon className="text-3xl" />
              </motion.div>
              
              <h3 className="font-display text-2xl text-flex-light mb-2 group-hover:text-white transition-colors relative z-10">
                {method.title}
              </h3>
              
              <p className="text-flex-light/70 text-sm mb-3 group-hover:text-flex-light/90 transition-colors relative z-10">
                {method.description}
              </p>
              
              <p className="text-flex-light/80 font-medium group-hover:text-white transition-colors relative z-10 break-words">
                {method.value}
              </p>

              {/* Pulse effect */}
              <motion.div
                className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                  method.color === 'green' ? 'bg-green-400' : 'bg-flex-primary'
                } opacity-50`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Action buttons */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(30, 64, 175, 0.4)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="group relative bg-flex-primary text-white px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 shadow-lg overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {unit.comingSoon ? '📝 Cadastrar Interesse' : '📅 Agendar Visita'}
              </span>
            </motion.button>
            
            <motion.a
              href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#25D366",
                boxShadow: "0 20px 40px rgba(37, 211, 102, 0.3)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative glass-effect text-flex-light px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 border border-white/20 hover:border-green-400/50"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaWhatsapp className="text-xl" />
              </motion.div>
              Falar no WhatsApp
            </motion.a>
          </div>
        </motion.div>

        {/* Map section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          <div className="text-center mb-8">
            <motion.h3 
              className="font-display text-3xl gradient-text mb-4 inline-flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <HiLocationMarker className="text-flex-accent" />
              NOSSA LOCALIZAÇÃO
              <HiLocationMarker className="text-flex-accent" />
            </motion.h3>
            <p className="text-flex-light/80">
              {unit.landmark} - Fácil acesso e estacionamento
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-effect rounded-2xl overflow-hidden h-96 backdrop-blur-lg border border-white/10 relative group"
          >
            {/* Map placeholder with improved styling */}
            <div className="w-full h-full bg-gradient-to-br from-flex-primary/20 to-flex-secondary/20 flex items-center justify-center relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-center"
              >
                <HiLocationMarker className="text-6xl text-flex-primary mb-4 mx-auto" />
                <h4 className="font-display text-2xl gradient-text mb-2">Flex {unit.name}</h4>
                <p className="text-flex-light/80 max-w-md">{unit.address}</p>
                
                <motion.a
                  href={`https://maps.google.com/?q=${encodeURIComponent(unit.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 inline-flex items-center gap-2 bg-flex-primary text-white px-6 py-3 rounded-full font-medium hover:bg-flex-secondary transition-all duration-300"
                >
                  <MdDirections />
                  Como Chegar
                </motion.a>
              </motion.div>
              
              {/* Animated location pins */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-4 h-4 bg-flex-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-flex-secondary rounded-full"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Quick info cards */}
          <motion.div
            className="mt-8 grid md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-effect p-4 rounded-xl backdrop-blur-lg border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">🚗</div>
              <h4 className="font-medium text-flex-light mb-1">Estacionamento</h4>
              <p className="text-flex-light/70 text-sm">{unit.parking}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-effect p-4 rounded-xl backdrop-blur-lg border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">♿</div>
              <h4 className="font-medium text-flex-light mb-1">Acessibilidade</h4>
              <p className="text-flex-light/70 text-sm">100% Acessível</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-effect p-4 rounded-xl backdrop-blur-lg border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">📐</div>
              <h4 className="font-medium text-flex-light mb-1">Área Total</h4>
              <p className="text-flex-light/70 text-sm">{unit.area}</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </div>
    </section>
  )
}