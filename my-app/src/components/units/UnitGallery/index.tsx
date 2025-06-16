'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Unit } from '@/lib/constants/units-data'
import { HiX, HiChevronLeft, HiChevronRight, HiPhotograph } from 'react-icons/hi'

interface UnitGalleryProps {
  unit: Unit
}

const galleryCategories = [
  { id: 'all', label: 'Todas', icon: '🏢' },
  { id: 'musculacao', label: 'Musculação', icon: '💪' },
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'vestiarios', label: 'Vestiários', icon: '🚿' },
  { id: 'recepcao', label: 'Recepção', icon: '🏬' },
  { id: 'crossfit', label: 'CrossFit', icon: '🏋️' },
  { id: 'piscina', label: 'Piscina', icon: '🏊' }
]

export default function UnitGallery({ unit }: UnitGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMobile, setIsMobile] = useState(false)

  // Fix para detecção de mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fix para eventos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setSelectedImage(null)
    }

    // Só adiciona listener se não for mobile
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
    <section className="py-20 bg-flex-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-flex-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-flex-secondary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-display text-4xl md:text-6xl mb-6 flex flex-col md:flex-row items-center justify-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <HiPhotograph className="text-flex-primary" />
            </motion.div>
            <span>CONHEÇA NOSSO</span>
            <motion.span 
              className="gradient-text relative"
              whileHover={{ 
                textShadow: "0 0 30px rgba(30, 64, 175, 0.5)"
              }}
            >
              ESPAÇO
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-flex-primary to-flex-secondary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-flex-light/80 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore cada detalhe da nossa unidade {unit.name} através de nossa galeria
          </motion.p>

          {/* Category Filter - Mobile Friendly */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {availableCategories.map((category, index) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                  selectedCategory === category.id
                    ? 'bg-flex-primary text-white shadow-lg'
                    : 'bg-white/10 text-flex-light hover:bg-white/20 border border-white/20'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <span className="text-base md:text-lg">{category.icon}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Images Grid - Responsive */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image}-${selectedCategory}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  scale: isMobile ? 1.02 : 1.05,
                  zIndex: 10
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer group"
                transition={{ 
                  layout: { duration: 0.4 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
              >
                <Image
                  src={image}
                  alt={`${unit.name} - Imagem ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-flex-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Zoom icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <HiPhotograph className="text-lg md:text-2xl text-white" />
                  </div>
                </motion.div>

                {/* Number indicator */}
                <motion.div 
                  className="absolute top-1 left-1 md:top-2 md:left-2 w-6 h-6 md:w-8 md:h-8 bg-flex-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Results counter */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-flex-light/60 text-sm md:text-base">
            Exibindo {filteredImages.length} de {unit.images.length} imagens
          </p>
        </motion.div>
      </div>

      {/* Lightbox - Mobile Optimized */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 md:p-4"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <HiX className="text-xl md:text-2xl" />
            </motion.button>

            {/* Navigation buttons - Only on desktop */}
            {!isMobile && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                >
                  <HiChevronLeft className="text-2xl" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                >
                  <HiChevronRight className="text-2xl" />
                </motion.button>
              </>
            )}

            {/* Image counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-2 text-white text-sm z-10"
            >
              {selectedImage + 1} / {filteredImages.length}
            </motion.div>

            {/* Main image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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

            {/* Mobile swipe navigation */}
            {isMobile && (
              <div className="absolute inset-0 flex">
                <div 
                  className="w-1/2 h-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                />
                <div 
                  className="w-1/2 h-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to action */}
      <motion.div
        className="section-padding mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-block glass-effect rounded-2xl p-6 md:p-8 backdrop-blur-lg border border-white/10"
        >
          <motion.h3 
            className="font-display text-2xl md:text-3xl gradient-text mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(30, 64, 175, 0.3)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 20px rgba(30, 64, 175, 0.3)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            📸 GOSTOU DO QUE VIU?
          </motion.h3>
          <p className="text-flex-light/80 text-base md:text-lg mb-6">
            Agende uma visita e conheça cada detalhe pessoalmente
          </p>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(30, 64, 175, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="gradient-bg text-white px-6 md:px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Agendar Visita</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}