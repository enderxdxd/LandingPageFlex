'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/types/unit.types'
import { HiCheckCircle } from 'react-icons/hi'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface UnitFeaturesProps {
  unit: Unit
}

export default function UnitFeatures({ unit }: UnitFeaturesProps) {
  const allFeatures = [...unit.features, ...(unit.specialFeatures || [])]

  return (
    <section className="py-20 bg-gradient-to-b from-flex-dark to-flex-secondary">
      <div className="section-padding">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl text-center mb-12">
            O QUE OFERECEMOS EM <span className="gradient-text">{unit.name.toUpperCase()}</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {allFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-effect p-6 rounded-xl flex items-start gap-4"
              >
                <HiCheckCircle className="text-2xl text-flex-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-lg text-flex-light mb-1">{feature}</h3>
                  {unit.specialFeatures?.includes(feature) && (
                    <span className="text-xs text-flex-accent uppercase tracking-wider">
                      Exclusivo
                    </span>
                  )}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {unit.specialFeatures && unit.specialFeatures.length > 0 && (
          <ScrollReveal>
            <div className="mt-16 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="inline-block bg-flex-primary/20 backdrop-blur-lg rounded-2xl p-8"
              >
                <h3 className="font-display text-3xl gradient-text mb-4">
                  DIFERENCIAIS EXCLUSIVOS
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {unit.specialFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-flex-primary/30 text-flex-light px-6 py-2 rounded-full font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}