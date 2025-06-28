'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'
import ContactForm from './ContactForm'
import WhatsAppUnitSelector from '@/components/WhatsAppUnitSelector'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function CTASection() {
  const [showForm, setShowForm] = useState(false)
  const [showWhatsAppSelector, setShowWhatsAppSelector] = useState(false)
  const sectionRef = useRef(null)
  const { isMobile } = useMobileOptimization();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const starsRotation = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section 
      ref={sectionRef}
      className="scroll-section min-h-screen bg-gradient-to-br from-flex-dark via-slate-900 to-flex-navy text-white py-20 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Starfield effect */}
        <div className="absolute inset-0">
          {Array.from({ length: isMobile ? 5 : 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-flex-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-flex-secondary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Animated constellation lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <motion.path
            d="M200,200 L400,150 L600,300 L800,250 L700,400 L500,500 L300,400 Z"
            stroke="url(#constellation-gradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle cx="200" cy="200" r="3" fill="#1E40AF" opacity="0.8" 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle cx="400" cy="150" r="2" fill="#3B82F6" opacity="0.8"
            animate={{ scale: [1.5, 1, 1.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle cx="600" cy="300" r="3" fill="#1E40AF" opacity="0.8"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="constellation-gradient">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Rotating elements */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          style={{ rotate: starsRotation }}
        >
          <div className="w-32 h-32 border border-white/20 rounded-full">
            <div className="w-full h-full border border-white/10 rounded-full animate-pulse">
              <div className="w-full h-full border border-white/5 rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* Main heading with enhanced effects */}
        <motion.h2 
          className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
          >
            COMECE SUA{' '}
            <motion.span 
              className="text-flex-primary relative"
              animate={{
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.5)",
                  "0 0 30px rgba(30, 64, 175, 0.8)",
                  "0 0 20px rgba(30, 64, 175, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              TRANSFORMAÇÃO
              
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-flex-primary via-white to-flex-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1.5 }}
              />
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-4 left-1/4 w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute -top-2 right-1/4 w-1.5 h-1.5 bg-flex-primary rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
            </motion.span>
          </motion.span>
        </motion.h2>
        
        <motion.div 
          className="text-xl text-white/80 mb-12 max-w-3xl mx-auto animate-on-scroll relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative">
            Agende uma visita e descubra como podemos ajudar você a alcançar seus objetivos
            
            {/* Text glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -z-10 blur-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            />
          </div>
        </motion.div>

        {/* Enhanced action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-on-scroll"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* WhatsApp Button - Agora abre o seletor de unidades */}
          <motion.button
            onClick={() => setShowWhatsAppSelector(true)}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-white text-green-600 px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 inline-flex items-center justify-center shadow-lg overflow-hidden border-2 border-transparent hover:border-white/20"
          >
            {/* WhatsApp icon animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📱
              </motion.div>
              Falar no WhatsApp
            </span>
          </motion.button>
        </motion.div>

        {/* Modals */}
        {showForm && (
          <ContactForm onClose={() => setShowForm(false)} />
        )}

        {showWhatsAppSelector && (
          <WhatsAppUnitSelector 
            isOpen={showWhatsAppSelector}
            onClose={() => setShowWhatsAppSelector(false)}
            message="Olá! Gostaria de conhecer a academia e saber mais sobre os planos disponíveis."
          />
        )}

        {/* Enhanced stats section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-on-scroll"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {[
            { value: "5.000+", label: "Alunos Ativos", color: "primary", icon: "👥" },
            { value: "98%", label: "Satisfação", color: "white", icon: "⭐" },
            { value: "30+", label: "Anos de Excelência", color: "primary", icon: "🏆" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ 
                scale: 1.1,
                rotateY: 10,
                boxShadow: stat.color === 'primary' 
                  ? "0 20px 40px rgba(30, 64, 175, 0.3)"
                  : "0 20px 40px rgba(255, 255, 255, 0.2)"
              }}
              className="group text-center relative p-6 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating icon */}
              <motion.div
                className="text-4xl mb-2"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {stat.icon}
              </motion.div>
              
              <motion.div 
                className={`text-4xl font-display mb-2 relative ${
                  stat.color === 'primary' ? 'text-flex-primary' : 'text-white'
                }`}
                whileHover={{
                  textShadow: stat.color === 'primary' 
                    ? "0 0 20px rgba(30, 64, 175, 0.8)"
                    : "0 0 20px rgba(255, 255, 255, 0.8)"
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.2,
                    duration: 0.5
                  }}
                >
                  {stat.value}
                </motion.span>
                
                {/* Number animation effect */}
                <motion.div
                  className="absolute inset-0 text-white/30 blur-sm"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
              
              <div className="text-white/70 relative z-10">{stat.label}</div>
              
              {/* Corner decorations */}
              <motion.div
                className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  stat.color === 'primary' ? 'bg-flex-primary' : 'bg-white'
                } opacity-50`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Final call-to-action */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
            }}
          >
            <motion.h3 
              className="font-display text-2xl md:text-3xl gradient-text mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(30, 64, 175, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              💪 SUA JORNADA COMEÇA AGORA
            </motion.h3>
            <div className="text-white/80 text-lg">
              Junte-se à nossa família Flex e descubra o seu potencial máximo
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute text-6xl opacity-5 ${
              i % 2 === 0 ? 'text-flex-primary' : 'text-flex-secondary'
            }`}
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
            {i % 3 === 0 ? '💪' : i % 3 === 1 ? '🏋️' : '⚡'}
          </motion.div>
        ))}
      </div>
    </section>
  )
}