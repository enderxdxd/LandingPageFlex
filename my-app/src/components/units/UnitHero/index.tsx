'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/types/unit.types'
import VideoBackground from '@/components/shared/VideoBackground'
import { HiLocationMarker, HiPhone, HiClock } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

interface UnitHeroProps {
  unit: Unit
}

export default function UnitHero({ unit }: UnitHeroProps) {
  return (
    <section className="relative h-[70vh] flex items-end">
      {unit.heroVideo ? (
        <VideoBackground src={unit.heroVideo} />
      ) : (
        <Image
          src={unit.heroImage}
          alt={unit.name}
          fill
          className="object-cover"
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-flex-dark via-flex-dark/50 to-transparent" />
      
      <div className="relative z-10 section-padding w-full pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-display text-6xl md:text-8xl gradient-text">
              {unit.name}
            </h1>
            {unit.comingSoon && (
              <span className="bg-flex-accent text-flex-dark px-4 py-2 rounded-full font-medium">
                EM BREVE
              </span>
            )}
          </div>
          
          <p className="text-xl text-flex-light/80 mb-8 max-w-3xl">
            {unit.description}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-effect p-4 rounded-lg flex items-center gap-3"
            >
              <HiLocationMarker className="text-2xl text-flex-primary" />
              <div>
                <p className="text-sm text-flex-light/60">Endereço</p>
                <p className="text-flex-light">{unit.address}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-effect p-4 rounded-lg flex items-center gap-3"
            >
              <HiPhone className="text-2xl text-flex-primary" />
              <div>
                <p className="text-sm text-flex-light/60">Telefone</p>
                <p className="text-flex-light">{unit.phone}</p>
              </div>
            </motion.div>
            
            <motion.a
              href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="glass-effect p-4 rounded-lg flex items-center gap-3 cursor-pointer"
            >
              <FaWhatsapp className="text-2xl text-flex-primary" />
              <div>
                <p className="text-sm text-flex-light/60">WhatsApp</p>
                <p className="text-flex-light">{unit.whatsapp}</p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}