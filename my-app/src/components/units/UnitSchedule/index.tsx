'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/lib/constants/units-data'
import { HiClock, HiCalendar } from 'react-icons/hi'
import { FaSun, FaRegMoon } from 'react-icons/fa'

interface UnitScheduleProps {
  unit: Unit
}

export default function UnitSchedule({ unit }: UnitScheduleProps) {
  const scheduleItems = [
    { 
      label: 'Segunda a Sexta', 
      hours: unit.hours.weekdays, 
      icon: FaSun,
      color: 'primary',
      description: 'Horário completo para sua rotina'
    },
    { 
      label: 'Sábado', 
      hours: unit.hours.saturday, 
      icon: HiCalendar,
      color: 'secondary',
      description: 'Treino de fim de semana'
    },
    { 
      label: 'Domingo', 
      hours: unit.hours.sunday, 
      icon: FaRegMoon,
      color: 'primary',
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
    <section className="py-20 bg-gradient-to-br from-flex-navy to-flex-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Clock-themed animations */}
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 border border-flex-primary/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1 h-24 bg-flex-primary/30 origin-bottom transform -translate-x-1/2 -translate-y-full" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-flex-secondary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating time elements */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-flex-primary/20 font-display text-2xl"
            style={{
              left: `${20 + (i * 6)}%`,
              top: `${15 + Math.sin(i) * 30}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            {String(i === 0 ? 12 : i).padStart(2, '0')}:00
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
            className="font-display text-5xl md:text-6xl mb-6 flex items-center justify-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <HiClock className="text-flex-primary" />
            </motion.div>
            HORÁRIOS DE{' '}
            <motion.span 
              className="gradient-text relative"
              whileHover={{ 
                textShadow: "0 0 30px rgba(30, 64, 175, 0.5)"
              }}
            >
              FUNCIONAMENTO
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-flex-primary to-flex-secondary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-flex-light/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Horários pensados para se adaptar perfeitamente à sua rotina
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Main schedule card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="glass-effect rounded-3xl p-8 md:p-12 backdrop-blur-lg border border-white/10 relative overflow-hidden"
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-flex-primary/10 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />

            {/* Clock icon centerpiece */}
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity }
                }}
                className="w-20 h-20 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center relative"
              >
                <HiClock className="text-4xl text-white" />
                
                {/* Clock hands */}
                <motion.div
                  className="absolute w-0.5 h-6 bg-white/80 origin-bottom"
                  style={{ top: '20%', left: '50%', transformOrigin: 'bottom center' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-0.5 h-4 bg-white/60 origin-bottom"
                  style={{ top: '30%', left: '50%', transformOrigin: 'bottom center' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* Schedule items */}
            <div className="space-y-6">
              {scheduleItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-flex-primary/30 transition-all group relative overflow-hidden"
                >
                  {/* Background hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-flex-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.color === 'primary' 
                          ? 'bg-flex-primary/20 text-flex-primary' 
                          : 'bg-flex-secondary/20 text-flex-secondary'
                      }`}
                    >
                      <item.icon className="text-xl" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-xl font-medium text-flex-light group-hover:text-white transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-flex-light/60 text-sm group-hover:text-flex-light/80 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10"
                  >
                    <span className="font-display text-3xl gradient-text group-hover:text-white transition-colors">
                      {item.hours}
                    </span>
                  </motion.div>

                  {/* Floating time indicator */}
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 bg-flex-accent rounded-full opacity-50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Special notice */}
            {(unit.comingSoon || unit.hasCrossfit || unit.hasPool) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-8 text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-block bg-gradient-to-r from-flex-accent/20 to-flex-primary/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-flex-accent/30"
                >
                  <motion.p 
                    className="text-flex-accent font-medium flex items-center gap-2"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(251, 191, 36, 0.3)",
                        "0 0 20px rgba(251, 191, 36, 0.5)",
                        "0 0 10px rgba(251, 191, 36, 0.3)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-lg">ℹ️</span>
                    {getSpecialHours()}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Additional info cards */}
          <motion.div
            className="mt-12 grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 backdrop-blur-lg border border-white/10 text-center group"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl mb-3 text-flex-primary"
              >
                🎯
              </motion.div>
              <h3 className="font-display text-xl gradient-text mb-2">Horário de Pico</h3>
              <p className="text-flex-light/70 text-sm group-hover:text-flex-light/90 transition-colors">
                18h às 21h - Horário mais movimentado
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 backdrop-blur-lg border border-white/10 text-center group"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="text-4xl mb-3 text-flex-secondary"
              >
                😌
              </motion.div>
              <h3 className="font-display text-xl gradient-text mb-2">Horário Tranquilo</h3>
              <p className="text-flex-light/70 text-sm group-hover:text-flex-light/90 transition-colors">
                10h às 16h - Ideal para treino focado
              </p>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10"
            >
              <motion.h3 
                className="font-display text-3xl gradient-text mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(30, 64, 175, 0.3)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 20px rgba(30, 64, 175, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ⏰ ENCONTRE SEU HORÁRIO IDEAL
              </motion.h3>
              <p className="text-flex-light/80 text-lg mb-6">
                Nossa equipe está pronta para ajudar você a escolher o melhor horário
              </p>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(30, 64, 175, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Falar com Consultor</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}