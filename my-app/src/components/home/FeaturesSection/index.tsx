'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import FeatureCard from './FeatureCard'
import { Sparkles, Zap, Users, ShieldCheck, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

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
    description: 'Modalidades variadas com turmas reduzidas para melhor experiência',
    color: 'primary'
  },
  {
    icon: ShieldCheck,
    title: 'Segurança Total',
    description: 'Protocolos rigorosos de higiene e segurança em todos os espaços',
    color: 'secondary'
  },
  {
    icon: Clock,
    title: 'Horários Flexíveis',
    description: 'Funcionamento estendido para se adequar à sua rotina',
    color: 'primary'
  },
  {
    icon: MapPin,
    title: 'Localizações Prime',
    description: 'Unidades em pontos estratégicos com fácil acesso e estacionamento',
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
      className="scroll-section bg-white py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-flex-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-flex-secondary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-flex-primary/5 text-flex-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            {...fadeUp}
          >
            <Sparkles className="w-4 h-4" />
            O diferencial Flex
          </motion.div>

          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-5"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            A EXPERIÊNCIA{' '}
            <span className="gradient-text">FLEX</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Oferecemos uma experiência completa que vai além do treino tradicional
          </motion.p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-block bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h3 className="font-display text-2xl md:text-3xl gradient-text mb-3">
              PRONTO PARA COMEÇAR?
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Descubra como podemos transformar sua rotina de exercícios
            </p>
            <Link
              href="/freepass"
              className="inline-block gradient-bg text-white px-10 py-4 rounded-full font-semibold text-base hover:shadow-blue hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              Agende sua Aula Experimental
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
