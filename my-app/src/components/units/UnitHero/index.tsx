'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/lib/constants/units-data'
import VideoBackground from '@/components/shared/VideoBackground'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import { FaWhatsapp, FaParking, FaWheelchair } from 'react-icons/fa'
import { MdPool } from 'react-icons/md'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { ChevronDown } from 'lucide-react'

interface UnitHeroProps {
  unit: Unit
}

export default function UnitHero({ unit }: UnitHeroProps) {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background */}
      {unit.heroVideo ? (
        <VideoBackground src={unit.heroVideo} />
      ) : (
        <div className="absolute inset-0">
          <Image
            src={unit.heroImage}
            alt={unit.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Title and badges */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight">
              {unit.name}
            </h1>

            <div className="flex flex-wrap gap-2 lg:mb-3">
              {unit.comingSoon && (
                <span className="bg-amber-500 text-black px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wider">
                  Em Breve
                </span>
              )}

              {unit.hasCrossfit && (
                <span className="bg-flex-primary text-white px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <GiWeightLiftingUp className="text-sm" />
                  CrossFit
                </span>
              )}

              {unit.hasPool && (
                <span className="bg-cyan-600 text-white px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MdPool className="text-sm" />
                  Piscina
                </span>
              )}
            </div>
          </div>

          <motion.p
            className="text-base md:text-lg text-white/70 mb-8 max-w-3xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {unit.description}
          </motion.p>

          {/* Info grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3">
              <HiLocationMarker className="text-xl text-flex-secondary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Endereco</p>
                <p className="text-white/90 text-sm truncate">{unit.address}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3">
              <HiPhone className="text-xl text-flex-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Telefone</p>
                <p className="text-white/90 text-sm">{unit.phone}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/15 transition-colors duration-200 group"
            >
              <FaWhatsapp className="text-xl text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">WhatsApp</p>
                <p className="text-white/90 text-sm">{unit.whatsapp}</p>
              </div>
            </a>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {unit.area && unit.area !== 'm' && (
              <span className="bg-white/8 border border-white/10 px-3 py-1.5 rounded-full text-white/70 text-xs font-medium">
                {unit.area}
              </span>
            )}

            <span className="bg-white/8 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white/70 text-xs font-medium">
              <FaParking className="text-white/50" />
              {unit.parking}
            </span>

            {unit.accessibility && (
              <span className="bg-white/8 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white/70 text-xs font-medium">
                <FaWheelchair className="text-white/50" />
                Acessivel
              </span>
            )}

            {unit.landmark && (
              <span className="bg-white/8 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white/70 text-xs font-medium">
                <HiLocationMarker className="text-white/50" />
                {unit.landmark}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-white/25 w-5 h-5" />
        </motion.div>
      </div>
    </section>
  )
}
