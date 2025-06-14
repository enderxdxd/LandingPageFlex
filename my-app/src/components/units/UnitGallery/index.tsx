'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/types/unit.types'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface UnitGalleryProps {
  unit: Unit
}

export default function UnitGallery({ unit }: UnitGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? unit.images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === unit.images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <section className="py-20 bg-flex-dark">
      <div className="section-padding">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl text-center mb-12">
            CONHEÇA NOSSO <span className="gradient-text">ESPAÇO</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {unit.images.map((image, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`${unit.name} - Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-flex-dark/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl"
              >
                <HiX />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-4 text-white/80 hover:text-white text-3xl"
              >
                <HiChevronLeft />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 text-white/80 hover:text-white text-3xl"
              >
                <HiChevronRight />
              </button>

              <motion.div
                key={selectedImage}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-5xl aspect-video"
              >
                <Image
                  src={unit.images[selectedImage]}
                  alt={`${unit.name} - Imagem ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
