'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
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
    color: 'primary'
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Personal Trainers',
    description: 'Profissionais certificados para maximizar seus resultados',
    color: 'secondary'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Aulas Exclusivas',
    description: 'Modalidades variadas com turmas reduzidas para melhor experiência',
    color: 'primary'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Segurança Total',
    description: 'Protocolos rigorosos de higiene e segurança em todos os espaços',
    color: 'secondary'
  },
  {
    icon: HiOutlineClock,
    title: 'Horários Flexíveis',
    description: 'Funcionamento estendido para se adequar à sua rotina',
    color: 'primary'
  },
  {
    icon: HiOutlineLocationMarker,
    title: 'Localizações Prime',
    description: 'Unidades em pontos estratégicos com fácil acesso e estacionamento',
    color: 'secondary'
  }
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <section 
      ref={sectionRef}
      className="scroll-section min-h-screen bg-white py-20 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-flex-red/5 to-flex-blue/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-flex-blue/5 to-flex-red/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(220, 38, 38, 0.3) 1px, transparent 0),
              radial-gradient(circle at 2px 2px, rgba(37, 99, 235, 0.3) 1px, transparent 0)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} />
        </div>

        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <motion.path
            d="M0,500 Q250,300 500,500 T1000,500"
            stroke="url(#gradient-line1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M0,300 Q500,100 1000,300"
            stroke="url(#gradient-line2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.path
            d="M0,700 Q500,900 1000,700"
            stroke="url(#gradient-line3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          />
          <defs>
            <linearGradient id="gradient-line1">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="gradient-line2">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="gradient-line3">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          style={{ y: titleY }}
        >
          <motion.h2 
            className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            POR QUE ESCOLHER A{' '}
            <motion.span 
              className="gradient-text relative inline-block"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 30px rgba(220, 38, 38, 0.5)"
              }}
            >
              FLEX
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-red to-flex-blue"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-flex-red rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-flex-blue rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
            </motion.span>
          </motion.h2>
          
          <motion.div 
            className="text-xl text-flex-gray max-w-3xl mx-auto animate-on-scroll relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* FIXED: Changed from <p> to <div> to allow nested motion.div */}
            <div className="relative">
              Oferecemos uma experiência completa que vai além do treino tradicional
              
              {/* Text glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-flex-red/5 to-flex-blue/5 -z-10 blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="animate-on-scroll"
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              style={{ 
                transformStyle: 'preserve-3d'
              }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        {/* Additional decorative elements */}
        <motion.div
          className="absolute top-1/4 left-10 opacity-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <HiOutlineSparkles className="text-6xl text-flex-red" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/4 right-10 opacity-20"
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        >
          <HiOutlineLightningBolt className="text-5xl text-flex-blue" />
        </motion.div>

        {/* Floating feature icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`absolute text-2xl opacity-10 ${
                feature.color === 'primary' ? 'text-flex-red' : 'text-flex-blue'
              }`}
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 8 + index,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              <feature.icon />
            </motion.div>
          ))}
        </div>

        {/* Bottom call-to-action section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-flex-red/10 to-flex-blue/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            <motion.h3 
              className="font-display text-3xl gradient-text mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(220, 38, 38, 0.3)",
                  "0 0 20px rgba(37, 99, 235, 0.3)",
                  "0 0 20px rgba(220, 38, 38, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              PRONTO PARA COMEÇAR?
            </motion.h3>
            <div className="text-flex-gray mb-6">
              Descubra como podemos transformar sua rotina de exercícios
            </div>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Conhecer Unidades</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}