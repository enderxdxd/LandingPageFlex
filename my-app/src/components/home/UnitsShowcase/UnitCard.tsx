'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Unit } from '@/types/unit.types'
import { HiLocationMarker, HiArrowRight } from 'react-icons/hi'

interface UnitCardProps {
  unit: Unit
}

export default function UnitCard({ unit }: UnitCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group cursor-pointer"
    >
      <Link href={`/unidades/${unit.slug}`}>
        <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-flex-red to-flex-blue">
          {/* Placeholder image com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-flex-red/80 to-flex-blue/80" />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-flex-dark via-flex-dark/50 to-transparent" />
          
          {/* Coming Soon Badge */}
          {unit.comingSoon && (
            <div className="absolute top-4 right-4 bg-flex-accent text-flex-dark px-4 py-2 rounded-full font-medium text-sm">
              EM BREVE
            </div>
          )}
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-display text-3xl text-white mb-2">{unit.name}</h3>
            
            <div className="flex items-center text-white/70 text-sm mb-4">
              <HiLocationMarker className="mr-2" />
              <span className="line-clamp-1">{unit.address}</span>
            </div>
            
            {unit.specialFeatures && (
              <div className="flex flex-wrap gap-2 mb-4">
                {unit.specialFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center text-white font-medium"
            >
              Conhecer unidade
              <HiArrowRight className="ml-2" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}