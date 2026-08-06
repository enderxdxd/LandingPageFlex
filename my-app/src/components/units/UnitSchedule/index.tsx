'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/lib/constants/units-data'
import { HiClock, HiCalendar } from 'react-icons/hi'
import { FaSun, FaRegMoon } from 'react-icons/fa'
import { Clock, Info } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/constants/contact'

interface UnitScheduleProps {
  unit: Unit
}

export default function UnitSchedule({ unit }: UnitScheduleProps) {

  const scheduleItems = [
    {
      label: 'Segunda a Sexta',
      hours: unit.hours.weekdays,
      icon: FaSun,
      description: 'Horário completo para sua rotina'
    },
    {
      label: 'Sábado',
      hours: unit.hours.saturday,
      icon: HiCalendar,
      description: 'Treino de fim de semana'
    },
    {
      label: 'Domingo',
      hours: unit.hours.sunday,
      icon: FaRegMoon,
      description: 'Relaxe e mantenha o ritmo'
    }
  ]

  const getSpecialHours = () => {
    if (unit.comingSoon) return "Horários sujeitos a alteração após inauguração"
    if (unit.name === 'Alphaville') return "CrossFit: Consulte horários específicos"
    if (unit.hasPool) return "Área aquática: 30min antes do fechamento"
    return "Consulte horários especiais em feriados"
  }

  return (
    <section className="py-20 bg-flex-navy relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4 flex items-center justify-center gap-3">
            <HiClock className="text-flex-secondary" />
            Horários de Funcionamento
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Horários pensados para se adaptar perfeitamente à sua rotina
          </p>
        </motion.div>

        {/* Schedule card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10"
        >
          {/* Clock icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Schedule items */}
          <div className="space-y-4">
            {scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-flex-primary/15 rounded-lg flex items-center justify-center">
                    <item.icon className="text-lg text-flex-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{item.label}</h3>
                    <p className="text-white/50 text-sm">{item.description}</p>
                  </div>
                </div>
                <span className="font-display text-2xl md:text-3xl text-white">{item.hours}</span>
              </motion.div>
            ))}
          </div>

          {/* Special notice */}
          {(unit.comingSoon || unit.hasCrossfit || unit.hasPool) && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-5 py-2.5">
                <Info className="w-4 h-4 text-amber-400" />
                <p className="text-amber-300 text-sm font-medium">{getSpecialHours()}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="font-display text-2xl text-white mb-3">
              Venha fazer parte da nossa família
            </h3>
            <p className="text-white/60 mb-6">
              Nossa equipe está pronta para ajudar você a escolher o melhor horário
            </p>
            <a
              href={buildWhatsAppUrl('Olá! Gostaria de saber mais sobre os horários de funcionamento.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-flex-primary text-white px-8 py-3 rounded-full font-medium hover:bg-flex-secondary transition-colors duration-200"
            >
              Falar com Consultor
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
