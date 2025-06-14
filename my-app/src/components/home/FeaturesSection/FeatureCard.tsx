'use client'

import { motion } from 'framer-motion'
import { IconType } from 'react-icons'

interface FeatureCardProps {
  icon: IconType
  title: string
  description: string
  color: string
}

export default function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    red: 'bg-flex-red/10 border-flex-red/30 text-flex-red',
    blue: 'bg-flex-blue/10 border-flex-blue/30 text-flex-blue'
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <Icon className="text-3xl" />
      </motion.div>
      
      <h3 className="font-display text-2xl text-flex-dark mb-3">{title}</h3>
      <p className="text-flex-gray">{description}</p>
    </motion.div>
  )
}