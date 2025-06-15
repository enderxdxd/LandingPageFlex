'use client'

import { motion } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi'
import { useState } from 'react'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section 
      className="hero-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full blur-xl"
          animate={{
            x: mousePosition.x * 50,
            y: mousePosition.y * 30,
            rotate: 360,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-flex-secondary/10 to-flex-accent/10 rounded-full blur-xl"
          animate={{
            x: -mousePosition.x * 30,
            y: -mousePosition.y * 40,
            rotate: -360,
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-flex-primary/5 to-flex-accent/5 rounded-full blur-lg"
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(30, 64, 175, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="hero-content w-full max-w-6xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="animate-on-scroll"
        >
          {/* Main Title with Enhanced Effects */}
          <motion.h1 
            className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 leading-none relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span 
              className="gradient-text relative inline-block"
              animate={{
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 40px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(30, 64, 175, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              FLEX FITNESS
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 gradient-text blur-sm opacity-50"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                FLEX FITNESS
              </motion.div>
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-flex-gray mb-12 animate-on-scroll relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A EVOLUÇÃO DO SEU TREINO
            {/* Underline animation */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-flex-red to-flex-blue transform -translate-x-1/2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
            />
          </motion.p>

          {/* Enhanced Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-on-scroll"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(30, 64, 175, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative gradient-bg text-white px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Conheça Nossas Unidades</span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(37, 99, 235, 1)",
                color: "white"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-white text-flex-blue border-2 border-flex-blue px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-flex-blue scale-x-0 group-hover:scale-x-100 origin-left"
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Agendar Visita</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              { number: "4", label: "Unidades" },
              { number: "5K+", label: "Alunos" },
              { number: "10+", label: "Anos" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 10
                }}
                className="relative group bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <div className="font-display text-3xl gradient-text mb-1">{stat.number}</div>
                  <div className="text-sm text-flex-gray">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-on-scroll"
        >
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 text-flex-primary text-4xl blur-sm opacity-50"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HiChevronDown />
            </motion.div>
            <HiChevronDown className="text-flex-primary text-4xl relative z-10" />
          </motion.div>
          <motion.div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-flex-primary to-transparent"
            animate={{ height: [0, 32, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${i % 2 === 0 ? 'bg-flex-primary' : 'bg-flex-secondary'} rounded-full opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  )
}