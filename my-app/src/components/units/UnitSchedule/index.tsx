'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/types/unit.types'
import { HiClock } from 'react-icons/hi'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface UnitScheduleProps {
  unit: Unit
}

export default function UnitSchedule({ unit }: UnitScheduleProps) {
  const scheduleItems = [
    { label: 'Segunda a Sexta', hours: unit.hours.weekdays },
    { label: 'Sábado', hours: unit.hours.saturday },
    { label: 'Domingo', hours: unit.hours.sunday }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-flex-secondary to-flex-dark">
      <div className="section-padding">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl text-center mb-12">
            HORÁRIOS DE <span className="gradient-text">FUNCIONAMENTO</span>
          </h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <HiClock className="text-5xl text-flex-primary" />
            </div>

            <div className="space-y-6">
              {scheduleItems.map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-between py-4 border-b border-flex-light/10 last:border-0"
                  >
                    <span className="text-lg text-flex-light/80">{item.label}</span>
                    <span className="font-display text-2xl gradient-text">{item.hours}</span>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>

            {unit.comingSoon && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-flex-accent">
                  * Horários sujeitos a alteração após inauguração
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}