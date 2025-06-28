'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Unit } from '@/lib/constants/units-data'
import { GiWeightLiftingUp, GiStrongMan, GiMuscleUp } from 'react-icons/gi'
import { FaClock, FaFire, FaTrophy, FaUsers } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

interface UnitCrossFitProps {
  unit: Unit
}

const crossfitFeatures = [
  {
    icon: GiWeightLiftingUp,
    title: 'Equipamentos ELEIKO',
    description: 'Equipamentos oficiais Rogue Fitness, padrão mundial de CrossFit',
    color: 'primary'
  },
  {
    icon: FaFire,
    title: 'WODs Diários',
    description: 'Treinos do dia variados e desafiadores para todos os níveis',
    color: 'secondary'
  },
  {
    icon: FaUsers,
    title: 'Treinadores Certificados',
    description: 'Coaches com certificação oficial CrossFit Level 1 e 2',
    color: 'primary'
  },
  {
    icon: FaTrophy,
    title: 'Competições',
    description: 'Eventos internos e preparação para competições oficiais',
    color: 'secondary'
  },
  {
    icon: HiLightningBolt,
    title: 'Alta Intensidade',
    description: 'Treinos funcionais que combinam força, cardio e agilidade',
    color: 'primary'
  },
  {
    icon: GiMuscleUp,
    title: 'Progressão Individual',
    description: 'Acompanhamento personalizado do seu desenvolvimento',
    color: 'secondary'
  }
]


export default function UnitCrossFit({ unit }: UnitCrossFitProps) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-flex-dark to-flex-navy relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* CrossFit themed background elements */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-flex-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-flex-secondary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(30, 64, 175, 0.3) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(59, 130, 246, 0.3) 25%, transparent 25%)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </motion.div>

      <div className="section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          style={{ y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center"
            >
              <GiWeightLiftingUp className="text-3xl text-white" />
            </motion.div>
            <h2 className="font-display text-5xl md:text-6xl gradient-text">
              CROSSFIT BOX
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-xl text-flex-light/80 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Experimente o CrossFit na sua forma mais autêntica. Nossa box exclusiva oferece 
            tudo que você precisa para superar seus limites e alcançar o melhor shape da sua vida.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {crossfitFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: feature.color === 'primary' 
                  ? "0 20px 40px rgba(30, 64, 175, 0.3)"
                  : "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="glass-effect p-8 rounded-2xl backdrop-blur-lg border border-white/10 group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  feature.color === 'primary' 
                    ? 'bg-flex-primary/20 border border-flex-primary/30' 
                    : 'bg-flex-secondary/20 border border-flex-secondary/30'
                }`}
              >
                <feature.icon className={`text-3xl ${
                  feature.color === 'primary' ? 'text-flex-primary' : 'text-flex-secondary'
                }`} />
              </motion.div>
              
              <h3 className="font-display text-2xl text-flex-light mb-3 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-flex-light/70 group-hover:text-flex-light/90 transition-colors">
                {feature.description}
              </p>

              {/* Floating particles */}
              <motion.div
                className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  feature.color === 'primary' ? 'bg-flex-primary' : 'bg-flex-secondary'
                } opacity-50`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              />
            </motion.div>
          ))}
        </div>


        

        {/* CTA Banner */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10 max-w-4xl mx-auto"
          >
            <motion.h3 
              className="font-display text-3xl md:text-4xl gradient-text mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 30px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(30, 64, 175, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🔥 PRIMEIRA AULA GRÁTIS
            </motion.h3>
            <p className="text-flex-light/80 text-lg mb-6">
              Venha conhecer o CrossFit mais autêntico de Alphaville. 
              Sua primeira aula é por nossa conta!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(30, 64, 175, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-flex-primary text-white px-8 py-3 rounded-full font-medium hover:bg-flex-secondary transition-all duration-300"
              >
                Agendar Aula Grátis
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-flex-primary text-flex-primary px-8 py-3 rounded-full font-medium hover:text-white hover:bg-flex-primary transition-all duration-300"
              >
                Conhecer o Espaço
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating CrossFit elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5 text-flex-primary"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.02, 0.08, 0.02]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 0.8
            }}
          >
            {i % 4 === 0 ? '🏋️' : i % 4 === 1 ? '💪' : i % 4 === 2 ? '⚡' : '🔥'}
          </motion.div>
        ))}
      </div>
    </section>
  )
}