'use client'

import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import FeatureCard from './FeatureCard'
import { 
  HiOutlineSparkles, 
  HiOutlineLightningBolt, 
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineLocationMarker
} from 'react-icons/hi'

const features = [
  {
    icon: HiOutlineSparkles,
    title: 'Equipamentos Premium',
    description: 'Tecnologia de ponta com as melhores marcas do mercado mundial',
    color: 'red'
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Personal Trainers',
    description: 'Profissionais certificados para maximizar seus resultados',
    color: 'blue'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Aulas Exclusivas',
    description: 'Modalidades variadas com turmas reduzidas para melhor experiência',
    color: 'red'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Segurança Total',
    description: 'Protocolos rigorosos de higiene e segurança em todos os espaços',
    color: 'blue'
  },
  {
    icon: HiOutlineClock,
    title: 'Horários Flexíveis',
    description: 'Funcionamento estendido para se adequar à sua rotina',
    color: 'red'
  },
  {
    icon: HiOutlineLocationMarker,
    title: 'Localizações Prime',
    description: 'Unidades em pontos estratégicos com fácil acesso e estacionamento',
    color: 'blue'
  }
]

export default function FeaturesSection() {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section className="scroll-section bg-flex-white">
      <div className="content-wrapper w-full">
        <motion.div
          ref={ref as any}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isIntersecting ? 1 : 0, y: isIntersecting ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            POR QUE ESCOLHER A <span className="gradient-text">FLEX</span>
          </h2>
          <p className="text-xl text-flex-gray max-w-3xl mx-auto">
            Oferecemos uma experiência completa que vai além do treino tradicional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isIntersecting ? 1 : 0, y: isIntersecting ? 0 : 50 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}