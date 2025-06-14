'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="relative h-[400px] rounded-2xl overflow-hidden">
          <Image
            src={unit.heroImage}
            alt={unit.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-flex-dark via-flex-dark/50 to-transparent" />
          
          {unit.comingSoon && (
            <div className="absolute top-4 right-4 bg-flex-accent text-flex-dark px-4 py-2 rounded-full font-medium text-sm">
              EM BREVE
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-display text-3xl text-white mb-2">{unit.name}</h3>
            
            <div className="flex items-center text-flex-light/70 text-sm mb-4">
              <HiLocationMarker className="mr-2" />
              <span className="line-clamp-1">{unit.address}</span>
            </div>
            
            {unit.specialFeatures && (
              <div className="flex flex-wrap gap-2 mb-4">
                {unit.specialFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-flex-primary/20 text-flex-primary px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center text-flex-primary font-medium"
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