'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function ConceptSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <section 
      ref={sectionRef}
      className="scroll-section min-h-screen bg-flex-dark text-white py-20 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-flex-primary/20 to-flex-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-flex-secondary/15 to-flex-accent/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Circuit-like pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <motion.path
              d="M100,100 Q300,50 500,100 T900,100"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path
              d="M100,300 Q500,250 900,300"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            <defs>
              <linearGradient id="gradient1">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="gradient2">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div style={{ y: textY }}>
            <motion.h2 
              className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="text-flex-red relative inline-block"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(220, 38, 38, 0.5)"
                }}
              >
                REDEFINA
                <motion.div
                  className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-red to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.span>
              <br />
              <motion.span 
                className="text-flex-blue relative inline-block"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(37, 99, 235, 0.5)"
                }}
              >
                SEUS LIMITES
                <motion.div
                  className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-blue to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </motion.span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="text-lg text-flex-gray mb-6 animate-on-scroll relative">
                Na Flex Fitness Center, acreditamos que o verdadeiro luxo está na 
                excelência. Nossos espaços foram projetados para proporcionar uma 
                experiência única de treino, onde tecnologia, conforto e resultados 
                se encontram.
                
                {/* Text highlight effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-flex-red/10 to-flex-blue/10 -z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1.5 }}
                />
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-lg text-flex-gray mb-8 animate-on-scroll">
                Com equipamentos de última geração, profissionais altamente 
                qualificados e ambientes exclusivos, transformamos cada visita 
                em uma jornada de superação pessoal.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-6 animate-on-scroll"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(220, 38, 38, 0.3)"
                }}
                className="group text-center bg-flex-red/10 border border-flex-red/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-flex-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-4xl font-display text-flex-red mb-2 relative z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  4
                </motion.div>
                <p className="text-flex-gray relative z-10">Unidades Premium</p>
                
                {/* Floating particles */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-flex-red rounded-full opacity-50"
                  animate={{ y: [-10, 10], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)"
                }}
                className="group text-center bg-flex-blue/10 border border-flex-blue/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-flex-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-4xl font-display text-flex-blue mb-2 relative z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  50+
                </motion.div>
                <p className="text-flex-gray relative z-10">Modalidades</p>
                
                {/* Floating particles */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-flex-blue rounded-full opacity-50"
                  animate={{ y: [10, -10], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative animate-on-scroll"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.div 
              className="relative h-[500px] rounded-2xl overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main visual element with image */}
              <Image
                src="/images/units/alphaville/alphaville1.jpeg"
                alt="Flex Fitness Alphaville"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Overlay gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-flex-red/30 to-flex-blue/30"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgba(220, 38, 38, 0.3), rgba(37, 99, 235, 0.3))",
                    "linear-gradient(to bottom right, rgba(37, 99, 235, 0.3), rgba(220, 38, 38, 0.3))",
                    "linear-gradient(to bottom right, rgba(220, 38, 38, 0.3), rgba(37, 99, 235, 0.3))"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              {/* Geometric elements */}
              <motion.div
                className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Premium badge with enhanced animations */}
            <motion.div
              whileHover={{ 
                scale: 1.15, 
                rotate: 10,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.4)"
              }}
              className="absolute -bottom-6 -right-6 w-32 h-32 gradient-bg rounded-full flex items-center justify-center shadow-2xl group cursor-pointer"
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(220, 38, 38, 0.3)",
                  "0 10px 30px rgba(37, 99, 235, 0.3)",
                  "0 10px 30px rgba(220, 38, 38, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.span 
                className="font-display text-2xl text-white relative z-10"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PREMIUM
              </motion.span>
              
              {/* Orbiting elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2" />
              </motion.div>
            </motion.div>

            {/* Additional decorative elements */}
            <motion.div
              className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-flex-red to-flex-blue rounded-full opacity-60"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-br from-flex-blue to-flex-red rounded-full opacity-60"
              animate={{
                scale: [1.5, 1, 1.5],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Floating text elements */}
      <motion.div
        className="absolute top-20 left-20 text-flex-red/20 font-display text-8xl opacity-30 pointer-events-none"
        animate={{ 
          rotate: [0, 5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        FLEX
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-20 text-flex-blue/20 font-display text-6xl opacity-30 pointer-events-none"
        animate={{ 
          rotate: [0, -5, 0],
          scale: [1.05, 1, 1.05]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        FITNESS
      </motion.div>
    </section>
  )
}