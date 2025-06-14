'use client'

import { motion } from 'framer-motion'
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
  return (
    <section className="scroll-section min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll">
            POR QUE ESCOLHER A <span className="gradient-text">FLEX</span>
          </h2>
          <p className="text-xl text-flex-gray max-w-3xl mx-auto animate-on-scroll">
            Oferecemos uma experiência completa que vai além do treino tradicional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}