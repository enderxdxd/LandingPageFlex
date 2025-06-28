'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, Suspense, lazy } from 'react'
import { unitsData } from '@/lib/constants/units-data'
import { UnitCard } from './UnitCard'
import ClientOnly, { useIsMobile, useIsClient } from '@/components/ClientOnly'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import dynamic from 'next/dynamic'

// Lazy load do Swiper para melhor performance
const MobileSwiper = dynamic(() => import('@/components/MobileSwiper'), { ssr: false })

export default function UnitsShowcase() {
  const sectionRef = useRef(null)
  const isClient = useIsClient()
  const isMobile = useIsMobile()
  const { networkSpeed, prefersReducedMotion } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  // Se for mobile, renderiza versão simplificada sem animações
  if (isMobile) {
    return (
      <section 
        id="units"
        ref={sectionRef}
        className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 relative overflow-hidden"
      >
        {/* Background simples para mobile */}
        <div className="absolute inset-0">
          {/* Grid pattern simples */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(30, 64, 175, 0.3) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(59, 130, 246, 0.3) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(30, 64, 175, 0.3) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(59, 130, 246, 0.3) 75%)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
            }} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Title section simplificado */}
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll relative">
              <span className="relative inline-block">
                NOSSAS{' '}
                <span className="gradient-text relative">
                  UNIDADES
                  
                  {/* Underline simples */}
                  <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-primary to-flex-secondary" />
                </span>
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra a unidade Flex Fitness mais próxima de você e comece sua transformação hoje mesmo.
            </p>
          </div>

          {/* Units grid simplificado */}
          <MobileSwiper>
            {unitsData.map((unit, idx) => (
              <UnitCard key={unit.id} unit={unit} priority={idx === 0} />
            ))}
          </MobileSwiper>
        </div>
      </section>
    )
  }

  // Versão desktop com todas as animações originais
  return (
    <section 
      id="units"
      ref={sectionRef}
      className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 relative overflow-hidden"
    >
      {/* Enhanced Background Animation */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: isClient ? backgroundY : 0 }}
      >
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full blur-3xl"
          animate={isClient ? {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          } : {}}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-flex-secondary/10 to-flex-accent/10 rounded-full blur-3xl"
          animate={isClient ? {
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.6, 0.4]
          } : {}}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Animated grid pattern */}
        {isClient && (
          <div className="absolute inset-0 opacity-5">
            <motion.div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(30, 64, 175, 0.3) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(59, 130, 246, 0.3) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(30, 64, 175, 0.3) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(59, 130, 246, 0.3) 75%)
                `,
                backgroundSize: '60px 60px',
                backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
              }}
              animate={{
                backgroundPosition: [
                  '0 0, 0 30px, 30px -30px, -30px 0px',
                  '30px 30px, 30px 60px, 60px 0px, 0px 30px',
                  '0 0, 0 30px, 30px -30px, -30px 0px'
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>
        )}

        {/* Floating abstract shapes */}
        {isClient && (
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
            <motion.path
              d="M100,400 Q300,200 500,400 T900,400"
              stroke="url(#path-gradient1)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path
              d="M100,600 Q500,300 900,600"
              stroke="url(#path-gradient2)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            <defs>
              <linearGradient id="path-gradient1">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="path-gradient2">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Particle system */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: isMobile ? 3 : 15 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-flex-primary' : 'bg-flex-secondary'} rounded-full opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={isClient ? {
                y: [-30, 30, -30],
                x: [-20, 20, -20],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Enhanced title section */}
        <motion.div 
          className="text-center mb-16"
          style={{ scale: isClient ? titleScale : 1 }}
        >
          <motion.h2 
            className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="relative inline-block"
              whileHover={isClient ? { scale: 1.05 } : {}}
            >
              NOSSAS{' '}
              <motion.span 
                className="gradient-text relative"
                animate={isClient ? {
                  textShadow: [
                    "0 0 20px rgba(30, 64, 175, 0.3)",
                    "0 0 30px rgba(59, 130, 246, 0.3)",
                    "0 0 20px rgba(30, 64, 175, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 4, repeat: Infinity }}
              >
                UNIDADES
                
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-primary to-flex-secondary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />
                
                {/* Floating decorative elements */}
                {isClient && (
                  <>
                    <motion.div
                      className="absolute -top-4 -right-4 w-4 h-4 bg-flex-primary rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                      className="absolute -bottom-2 -left-2 w-3 h-3 bg-flex-secondary rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [360, 180, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    />
                  </>
                )}
              </motion.span>
            </motion.span>
          </motion.h2>
          
          <motion.div 
            className="text-xl text-flex-gray animate-on-scroll relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* FIXED: Changed from <p> to <div> to allow nested motion.div */}
            <div className="relative">
              Escolha a unidade mais próxima e comece sua transformação
              
              {/* Text highlight effect - Só no desktop */}
              {isClient && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-flex-primary/5 to-flex-secondary/5 -z-10 blur-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 1 }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Desktop View - Enhanced Grid */}
        <div className="hidden lg:block">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {unitsData.map((unit, idx) => (
              <motion.div
                key={unit.id}
                className="animate-on-scroll"
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 60,
                    rotateY: -15,
                    scale: 0.9
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    rotateY: 0,
                    scale: 1
                  }
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  delay: idx * 0.1
                }}
                whileHover={isClient ? { 
                  y: -10,
                  rotateY: 5,
                  scale: 1.02,
                  zIndex: 10
                } : {}}
                style={{ 
                  transformStyle: 'preserve-3d'
                }}
              >
                <UnitCard unit={unit} priority={idx === 0} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional interactive elements */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg"
            whileHover={isClient ? { 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              backgroundColor: "rgba(255,255,255,0.9)"
            } : {}}
          >
            <motion.h3 
              className="font-display text-3xl gradient-text mb-4"
              animate={isClient ? {
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(30, 64, 175, 0.3)"
                ]
              } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🏢 MAIS UNIDADES EM BREVE
            </motion.h3>
            <div className="text-flex-gray mb-6">
              Estamos expandindo para atender você ainda melhor
            </div>
            
            <motion.button
              whileHover={isClient ? { 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)"
              } : {}}
              whileTap={isClient ? { scale: 0.95 } : {}}
              className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Cadastrar Interesse</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements - Só no desktop */}
      {isClient && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 opacity-10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 30, repeat: Infinity }}
          >
            <div className="text-8xl text-flex-primary font-display">
            <img 
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt="FLEX FITNESS"
              className="h-20 w-auto object-contain"
            />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 opacity-10"
            animate={{
              rotate: [360, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ duration: 25, repeat: Infinity }}
          >
            <div className="text-6xl text-flex-secondary font-display">
            <img 
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt="FLEX FITNESS"
              className="h-8 w-auto object-contain"
            />
            </div>
          </motion.div>

          {/* Floating location pins */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: isMobile ? 2 : unitsData.length }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-3xl opacity-10"
                style={{
                  left: `${15 + (index * 20)}%`,
                  top: `${20 + (index * 15)}%`,
                }}
                animate={isClient ? {
                  y: [-15, 15, -15],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.05, 0.15, 0.05]
                } : {}}
                transition={{
                  duration: 6 + index,
                  repeat: Infinity,
                  delay: index * 0.8
                }}
              >
                📍
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}