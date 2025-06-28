'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/lib/constants/units-data'
import VideoBackground from '@/components/shared/VideoBackground'
import { HiLocationMarker, HiPhone, HiClock, HiOfficeBuilding } from 'react-icons/hi'
import { FaWhatsapp, FaParking, FaWheelchair } from 'react-icons/fa'
import { MdPool } from 'react-icons/md'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface UnitHeroProps {
  unit: Unit
}

export default function UnitHero({ unit }: UnitHeroProps) {
  const { isMobile } = useMobileOptimization();

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
      
      {/* Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-flex-dark via-flex-dark/70 to-transparent" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: isMobile ? 3 : 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-flex-primary' : 'bg-flex-secondary'} rounded-full opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 section-padding w-full pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title and badges */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <motion.h1 
              className="font-display text-6xl md:text-8xl gradient-text"
              whileHover={{ scale: 1.02 }}
            >
              {unit.name}
            </motion.h1>
            
            <div className="flex flex-wrap gap-3">
              {unit.comingSoon && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-flex-accent text-flex-dark px-4 py-2 rounded-full font-medium text-sm"
                >
                  EM BREVE
                </motion.span>
              )}
              
              {unit.hasCrossfit && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-flex-primary text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                >
                  <GiWeightLiftingUp />
                  CROSSFIT
                </motion.span>
              )}
              
              {unit.hasPool && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-flex-secondary text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                >
                  <MdPool />
                  PISCINA
                </motion.span>
              )}
            </div>
          </div>
          
          <motion.p 
            className="text-xl text-flex-light/80 mb-8 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {unit.description}
          </motion.p>
          
          {/* Info grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-3 backdrop-blur-md"
            >
              <HiLocationMarker className="text-2xl text-flex-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-flex-light/60">Endereço</p>
                <p className="text-flex-light text-sm">{unit.address}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-3 backdrop-blur-md"
            >
              <HiPhone className="text-2xl text-flex-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-flex-light/60">Telefone</p>
                <p className="text-flex-light">{unit.phone}</p>
              </div>
            </motion.div>
            
            <motion.a
              href={`https://wa.me/55${unit.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-3 cursor-pointer backdrop-blur-md group"
            >
              <FaWhatsapp className="text-2xl text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm text-flex-light/60">WhatsApp</p>
                <p className="text-flex-light">{unit.whatsapp}</p>
              </div>
            </motion.a>
            
            
          </div>

          {/* Additional info */}
          <motion.div 
            className="mt-6 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            >
              <FaParking className="text-flex-accent" />
              <span className="text-flex-light">{unit.parking}</span>
            </motion.div>
            
            {unit.accessibility && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 text-sm"
              >
                <FaWheelchair className="text-flex-secondary" />
                <span className="text-flex-light">Acessível</span>
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            >
              <HiLocationMarker className="text-flex-primary" />
              <span className="text-flex-light">{unit.landmark}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}