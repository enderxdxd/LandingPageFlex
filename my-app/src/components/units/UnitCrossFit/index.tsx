'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Unit } from '@/lib/constants/units-data'
import { GiWeightLiftingUp, GiMuscleUp } from 'react-icons/gi'
import { FaFire, FaTrophy, FaUsers } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'
import { Flame } from 'lucide-react'
import WhatsAppUnitSelector from '@/components/WhatsAppUnitSelector'

interface UnitCrossFitProps {
  unit: Unit
}

const crossfitFeatures = [
  {
    icon: GiWeightLiftingUp,
    title: 'Equipamentos ELEIKO',
    description: 'Equipamentos oficiais Rogue Fitness, padrao mundial de CrossFit',
  },
  {
    icon: FaFire,
    title: 'WODs Diarios',
    description: 'Treinos do dia variados e desafiadores para todos os niveis',
  },
  {
    icon: FaUsers,
    title: 'Treinadores Certificados',
    description: 'Coaches com certificacao oficial CrossFit Level 1 e 2',
  },
  {
    icon: FaTrophy,
    title: 'Competicoes',
    description: 'Eventos internos e preparacao para competicoes oficiais',
  },
  {
    icon: HiLightningBolt,
    title: 'Alta Intensidade',
    description: 'Treinos funcionais que combinam forca, cardio e agilidade',
  },
  {
    icon: GiMuscleUp,
    title: 'Progressao Individual',
    description: 'Acompanhamento personalizado do seu desenvolvimento',
  },
]

export default function UnitCrossFit({ unit }: UnitCrossFitProps) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)

  return (
    <section className="py-20 bg-flex-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center">
              <GiWeightLiftingUp className="text-2xl text-white" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl gradient-text">
              CrossFit Box
            </h2>
          </div>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Experimente o CrossFit na sua forma mais autentica. Nossa box exclusiva oferece
            tudo que voce precisa para superar seus limites.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {crossfitFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-flex-primary/25 transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-flex-primary/15 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-2xl text-flex-secondary" />
              </div>
              <h3 className="font-display text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl text-white mb-3 inline-flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-400" />
              Primeira Aula Gratis
            </h3>
            <p className="text-white/60 mb-6">
              Venha conhecer o CrossFit mais autentico de Alphaville.
              Sua primeira aula e por nossa conta!
            </p>
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="bg-flex-primary text-white px-8 py-3 rounded-full font-medium hover:bg-flex-secondary transition-colors duration-200"
            >
              Agendar Aula Gratis
            </button>

            <WhatsAppUnitSelector
              isOpen={isWhatsAppOpen}
              onClose={() => setIsWhatsAppOpen(false)}
              message="Ola! Gostaria de agendar uma aula gratis de CrossFit ou conhecer o espaco."
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
