'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Unit } from '@/lib/constants/units-data'
import { HiCheckCircle, HiStar } from 'react-icons/hi'
import { FaDumbbell, FaSwimmingPool, FaChild, FaEye } from 'react-icons/fa'
import { MdAccessibility, MdLocalParking } from 'react-icons/md'

interface UnitFeaturesProps {
  unit: Unit
}

export default function UnitFeatures({ unit }: UnitFeaturesProps) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('piscina')) return FaSwimmingPool
    if (feature.toLowerCase().includes('kids') || feature.toLowerCase().includes('criança')) return FaChild
    if (feature.toLowerCase().includes('vista') || feature.toLowerCase().includes('terraço')) return FaEye
    if (feature.toLowerCase().includes('estacionamento') || feature.toLowerCase().includes('parking')) return MdLocalParking
    if (feature.toLowerCase().includes('acessib')) return MdAccessibility
    return FaDumbbell
  }

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-flex-primary/5 to-flex-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-flex-secondary/5 to-flex-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(30, 64, 175, 0.3) 1px, transparent 0),
              radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} />
        </div>
      </motion.div>

      <div className="section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-5xl md:text-6xl mb-6">
            O QUE OFERECEMOS EM{' '}
            <motion.span 
              className="gradient-text relative inline-block"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 30px rgba(30, 64, 175, 0.5)"
              }}
            >
              {unit.name.toUpperCase()}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-flex-primary to-flex-secondary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-xl text-flex-gray max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Infraestrutura completa e serviços premium para sua melhor experiência de treino
          </motion.p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {unit.features.map((feature, index) => {
            const FeatureIcon = getFeatureIcon(feature)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 15px 30px rgba(30, 64, 175, 0.15)"
                }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-flex-primary/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-flex-primary/20 group-hover:to-flex-secondary/20 transition-all"
                  >
                    <FeatureIcon className="text-xl text-flex-primary group-hover:text-flex-secondary transition-colors" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-flex-dark mb-1 group-hover:text-flex-primary transition-colors">
                      {feature}
                    </h3>
                    <HiCheckCircle className="text-green-500 text-xl" />
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-flex-primary/5 to-flex-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Special Features Section */}
        {unit.specialFeatures && unit.specialFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="text-center mb-12">
              <motion.h3 
                className="font-display text-4xl gradient-text mb-4 inline-flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <HiStar className="text-flex-accent" />
                DIFERENCIAIS EXCLUSIVOS
                <HiStar className="text-flex-accent" />
              </motion.h3>
              <p className="text-flex-gray">
                Recursos únicos que fazem desta unidade especial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {unit.specialFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(30, 64, 175, 0.2)"
                  }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-flex-primary to-flex-secondary p-6 rounded-2xl text-white relative overflow-hidden">
                    {/* Background animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    {/* Floating icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                      className="text-4xl mb-3 opacity-80"
                    >
                      ⭐
                    </motion.div>
                    
                    <h4 className="font-display text-xl mb-2 relative z-10">{feature}</h4>
                    <div className="w-12 h-1 bg-white/50 rounded-full relative z-10" />
                    
                    {/* Sparkle effects */}
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Info Cards */}
        <motion.div
          className="mt-16 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📐</span>
            </div>
            <h3 className="font-display text-2xl gradient-text mb-2">{unit.area}</h3>
            <p className="text-flex-gray">Área Total</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdLocalParking className="text-2xl text-flex-primary" />
            </div>
            <h3 className="font-display text-2xl gradient-text mb-2">{unit.parking}</h3>
            <p className="text-flex-gray">Estacionamento</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdAccessibility className="text-2xl text-flex-secondary" />
            </div>
            <h3 className="font-display text-2xl gradient-text mb-2">100%</h3>
            <p className="text-flex-gray">Acessível</p>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50"
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
              PRONTO PARA COMEÇAR?
            </motion.h3>
            <p className="text-flex-gray mb-6">
              Venha conhecer todos os nossos diferenciais pessoalmente
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Agendar Visita</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}