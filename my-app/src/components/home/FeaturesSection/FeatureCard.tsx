'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export default function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const isPrimary = color === 'primary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 p-7 rounded-xl hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
          isPrimary
            ? 'bg-flex-primary/8 text-flex-primary'
            : 'bg-flex-secondary/8 text-flex-secondary'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-display text-xl text-flex-dark mb-2">
        {title}
      </h3>

      <p className="text-flex-slate text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
