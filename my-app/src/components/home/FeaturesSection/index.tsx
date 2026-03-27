'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import FeatureCard from './FeatureCard'
import { Sparkles, Zap, Users, ShieldCheck, Clock, MapPin } from 'lucide-react'
const features = [
  {
    icon: Sparkles,
    title: 'Equipamentos Premium',
    description: 'Tecnologia de ponta com as melhores marcas do mercado mundial',
    color: 'primary'
  },
  {
    icon: Zap,
    title: 'Instrutores Flex',
    description: 'Profissionais certificados para maximizar seus resultados',
    color: 'secondary'
  },
  {
    icon: Users,
    title: 'Aulas Exclusivas',
    description: 'Modalidades variadas com turmas reduzidas para melhor experiencia',
    color: 'primary'
  },
  {
    icon: ShieldCheck,
    title: 'Seguranca Total',
    description: 'Protocolos rigorosos de higiene e seguranca em todos os espacos',
    color: 'secondary'
  },
  {
    icon: Clock,
    title: 'Horarios Flexiveis',
    description: 'Funcionamento estendido para se adequar a sua rotina',
    color: 'primary'
  },
  {
    icon: MapPin,
    title: 'Localizacoes Prime',
    description: 'Unidades em pontos estrategicos com facil acesso e estacionamento',
    color: 'secondary'
  }
]

export default function FeaturesSection() {
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
      className="scroll-section bg-white py-20 lg:py-28 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-flex-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-flex-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="font-display text-4xl md:text-6xl lg:text-7xl mb-4"
            {...fadeUp}
          >
            POR QUE ESCOLHER A{' '}
            <span className="gradient-text">FLEX</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-500 max-w-3xl mx-auto"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Oferecemos uma experiencia completa que vai alem do treino tradicional
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="animate-on-scroll"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-block bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-display text-2xl md:text-3xl gradient-text mb-3">
              PRONTO PARA COMECAR?
            </h3>
            <p className="text-gray-500 mb-6">
              Descubra como podemos transformar sua rotina de exercicios
            </p>
            <button className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-blue transition-all duration-200 cursor-pointer">
              Conhecer Unidades
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
