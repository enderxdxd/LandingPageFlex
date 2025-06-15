'use client'

import { motion } from 'framer-motion'
import { IconType } from 'react-icons'
import { useState } from 'react'

interface FeatureCardProps {
  icon: IconType
  title: string
  description: string
  color: string
}

export default function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    primary: {
      bg: 'bg-flex-primary/10',
      border: 'border-flex-primary/30',
      text: 'text-flex-primary',
      glow: 'rgba(30, 64, 175, 0.3)',
      gradient: 'from-flex-primary/20 to-flex-primary/5'
    },
    secondary: {
      bg: 'bg-flex-secondary/10',
      border: 'border-flex-secondary/30', 
      text: 'text-flex-secondary',
      glow: 'rgba(59, 130, 246, 0.3)',
      gradient: 'from-flex-secondary/20 to-flex-secondary/5'
    }
  }

  const currentColor = colorClasses[color as keyof typeof colorClasses]

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: `0 20px 40px ${currentColor.glow}`,
        rotateY: 5
      }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentColor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ 
          scale: isHovered ? 1 : 0, 
          rotate: isHovered ? 0 : 180 
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${currentColor.text.replace('text-', 'bg-')} rounded-full opacity-30`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: isHovered ? [-10, 10, -10] : [0],
              x: isHovered ? [-5, 5, -5] : [0],
              opacity: isHovered ? [0.2, 0.6, 0.2] : [0]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Icon container with enhanced animations */}
      <motion.div
        whileHover={{ 
          rotate: 360,
          scale: 1.1
        }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 200
        }}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-6 ${currentColor.bg} ${currentColor.border} ${currentColor.text} overflow-hidden`}
      >
        {/* Icon glow effect */}
        <motion.div
          className={`absolute inset-0 ${currentColor.bg} blur-md opacity-0 group-hover:opacity-70`}
          animate={{
            scale: isHovered ? [1, 1.5, 1] : [1],
            opacity: isHovered ? [0, 0.7, 0] : [0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Orbiting ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${currentColor.border} opacity-0 group-hover:opacity-100`}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <Icon className="text-3xl relative z-10" />
        
        {/* Sparkle effect */}
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 ${currentColor.text.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-100`}
          animate={{
            scale: isHovered ? [0, 1, 0] : [0],
            rotate: isHovered ? [0, 180, 360] : [0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.h3 
          className="font-display text-2xl text-flex-dark mb-3 relative"
          whileHover={{ 
            textShadow: `0 0 10px ${currentColor.glow}`
          }}
        >
          {title}
          
          {/* Animated underline */}
          <motion.div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${currentColor.text.replace('text-', 'from-')} to-transparent`}
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.h3>
        
        <motion.p 
          className="text-flex-gray relative"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
          
          {/* Text highlight effect */}
          <motion.span
            className={`absolute inset-0 bg-gradient-to-r ${currentColor.gradient} -z-10 opacity-0 group-hover:opacity-30`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.p>
      </div>

      {/* Corner decorations */}
      <motion.div
        className={`absolute top-4 right-4 w-2 h-2 ${currentColor.text.replace('text-', 'bg-')} rounded-full opacity-30`}
        animate={{
          scale: isHovered ? [1, 1.5, 1] : [1],
          opacity: isHovered ? [0.3, 0.8, 0.3] : [0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <motion.div
        className={`absolute bottom-4 left-4 w-3 h-3 border-2 ${currentColor.border} rounded-full opacity-30`}
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? [1, 1.2, 1] : [1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Hover overlay effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered 
            ? "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
            : "transparent"
        }}
      />

      {/* Interactive border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: isHovered ? `inset 0 0 20px ${currentColor.glow}` : "none"
        }}
      />
    </motion.div>
  )
}