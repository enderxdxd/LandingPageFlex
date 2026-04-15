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
      className="relative bg-white border border-gray-100 p-8 rounded-2xl hover:border-flex-primary/20 hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* Subtle gradient accent on hover */}
      <div
        className={`absolute top-0 left-0 w-full h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
          isPrimary
            ? 'bg-gradient-to-r from-flex-primary to-flex-secondary'
            : 'bg-gradient-to-r from-flex-secondary to-flex-accent'
        }`}
      />

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
          isPrimary
            ? 'bg-flex-primary/10 text-flex-primary group-hover:bg-flex-primary/15'
            : 'bg-flex-secondary/10 text-flex-secondary group-hover:bg-flex-secondary/15'
        }`}
      >
        <Icon className="w-7 h-7" strokeWidth={1.8} />
      </div>

      <h3 className="font-display text-xl text-flex-dark mb-3">
        {title}
      </h3>

      <p className="text-flex-slate text-[15px] leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
