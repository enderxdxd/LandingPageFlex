'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/lib/constants/units-data'
import { HiX, HiChevronLeft, HiChevronRight, HiPhotograph } from 'react-icons/hi'
import { Building2, Camera } from 'lucide-react'

interface UnitGalleryProps {
  unit: Unit
}

const galleryCategories = [
  { id: 'all', label: 'Todas', icon: 'building' },
]

export default function UnitGallery({ unit }: UnitGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setSelectedImage(null)
    }

    if (!isMobile) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [selectedImage, isMobile])

  const filterImages = () => {
    if (selectedCategory === 'all') return unit.images
    return unit.images.filter(image =>
      image.toLowerCase().includes(selectedCategory.toLowerCase())
    )
  }

  const filteredImages = filterImages()

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const availableCategories = galleryCategories.filter(category => {
    if (category.id === 'all') return true
    if (category.id === 'crossfit' && !unit.hasCrossfit) return false
    if (category.id === 'piscina' && !unit.hasPool) return false
    return unit.images.some(image =>
      image.toLowerCase().includes(category.id.toLowerCase())
    )
  })

  return (
    <section className="py-20 bg-flex-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-flex-secondary" />
            Conheca nosso espaco
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Explore cada detalhe da nossa unidade {unit.name} atraves da galeria
          </p>

          {/* Category Filter */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                    selectedCategory === category.id
                      ? 'bg-flex-primary text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/10'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Images Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image}-${selectedCategory}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <Image
                  src={image}
                  alt={`${unit.name} - Imagem ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <HiPhotograph className="text-white text-lg" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Results counter */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-sm">
            {filteredImages.length} de {unit.images.length} imagens
          </p>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="font-display text-2xl text-white mb-3">
              Gostou do que viu?
            </h3>
            <p className="text-white/60 mb-6">
              Agende uma visita e conheca cada detalhe pessoalmente
            </p>
            <button
              onClick={() => window.location.assign('/freepass')}
              className="bg-flex-primary text-white px-8 py-3 rounded-full font-medium hover:bg-flex-secondary transition-colors duration-200"
            >
              Agendar Visita
            </button>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 md:p-4"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null) }}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <HiX className="text-xl" />
            </button>

            {!isMobile && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious() }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                >
                  <HiChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext() }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                >
                  <HiChevronRight className="text-2xl" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm z-10">
              {selectedImage + 1} / {filteredImages.length}
            </div>

            <motion.div
              key={selectedImage}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl aspect-video"
            >
              <Image
                src={filteredImages[selectedImage]}
                alt={`${unit.name} - Imagem ${selectedImage + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </motion.div>

            {isMobile && (
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); handlePrevious() }} />
                <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); handleNext() }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
