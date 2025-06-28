'use client'

import { motion } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi'
import { useState } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function HeroClean() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isMobile, isTablet, networkSpeed, prefersReducedMotion } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return // Desabilita no mobile
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX - innerWidth / 2) / innerWidth;
    const y = (clientY - innerHeight / 2) / innerHeight;
    
    e.currentTarget.style.setProperty('--mouse-x', x.toString());
    e.currentTarget.style.setProperty('--mouse-y', y.toString());
  };

  const scrollToUnits = () => {
    const unitsSection = document.getElementById('units');
    if (unitsSection) {
      unitsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Se for mobile, renderiza versão simplificada sem animações
  if (isMobile) {
    return (
      <section 
        className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B37B1 25%, #4F46E5 50%, #3B82F6 75%, #2563EB 100%)'
        }}
      >
        {/* Background simples para mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.01]">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
        </div>

        <div className="hero-content w-full max-w-6xl mx-auto px-4 text-center relative z-10">
          {/* Logo principal - SEM animações */}
          <div className="relative inline-block mb-10">
            <div className="relative p-4 md:p-6 lg:p-8">
              <img
                src="/images/units/alphaville/flex-logo-outline.png"
                alt="FLEX FITNESS"
                className="relative z-10 w-full max-w-xs md:max-w-sm h-auto object-contain mx-auto"
              />
            </div>
          </div>
          
          {/* Tagline - SEM animações */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-light tracking-wide relative">
              A EVOLUÇÃO DO SEU TREINO
            </p>
          </div>

          {/* Botões - SEM animações */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={scrollToUnits}
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 shadow-xl"
            >
              <span className="relative z-10">Conheça Nossas Unidades</span>
            </button>
          </div>

          {/* Stats - SEM animações */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
            {[
              { number: "4", label: "Unidades" },
              { number: "5K+", label: "Alunos" },
              { number: "30+", label: "Anos" }
            ].map((stat, index) => (
              <div
                key={index}
                className="relative group bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="relative z-10 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator simples */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <HiChevronDown className="text-white/60 text-2xl animate-bounce" />
          </div>
        </div>
      </section>
    )
  }

  // Versão desktop com todas as animações originais
  return (
    <section 
    className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    style={{
      background: 'linear-gradient(135deg, #1E40AF 0%, #3B37B1 25%, #4F46E5 50%, #3B82F6 75%, #2563EB 100%)'
    }}
    onMouseMove={handleMouseMove}
  >
    {/* Background mais sutil */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/5 to-blue-200/10 rounded-full blur-xl"
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 15,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-40 h-40 bg-gradient-to-br from-blue-200/8 to-white/5 rounded-full blur-xl"
        animate={{
          x: -mousePosition.x * 15,
          y: -mousePosition.y * 20,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid muito sutil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>
    </div>

    <div className="hero-content w-full max-w-6xl mx-auto px-4 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Logo principal - tamanho reduzido */}
        <motion.div 
          className="relative inline-block mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            className="relative p-4 md:p-6 lg:p-8"
            whileHover={{ 
              scale: 1.02,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo menor */}
            <motion.img
              src="/images/units/alphaville/flex-logo-outline.png"
              alt="FLEX FITNESS"
              className="relative z-10 w-full max-w-xs md:max-w-sm h-auto object-contain mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{ 
                scale: 1.03,
              }}
              style={{
                filter: "drop-shadow(0 8px 20px rgba(0, 0, 0, 0.1))"
              }}
            />
          </motion.div>

          {/* Glow sutil */}
          <motion.div
            className="absolute inset-0 rounded-3xl -z-10"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        {/* Tagline menor */}
        <motion.div className="mb-12">
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white font-light tracking-wide relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            A EVOLUÇÃO DO SEU TREINO
            
            {/* Underline sutil */}
            <motion.div
              className="absolute -bottom-2 left-1/2 h-0.5 bg-gradient-to-r from-white/60 to-blue-200/60 transform -translate-x-1/2 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80%", opacity: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            />
          </motion.p>
        </motion.div>

        {/* Botões menores */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            onClick={scrollToUnits}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 shadow-xl"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left"
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Conheça Nossas Unidades</span>
          </motion.button>
          
          
        </motion.div>

        {/* Stats menores */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[
            { number: "4", label: "Unidades" },
            { number: "5K+", label: "Alunos" },
            { number: "30+", label: "Anos" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              className="relative group bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
            >
              <div className="relative z-10 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HiChevronDown className="text-white/60 text-2xl" />
        </motion.div>
      </motion.div>
    </div>
  </section>
  )
}