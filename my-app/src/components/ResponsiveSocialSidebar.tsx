'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { HiShare, HiX } from 'react-icons/hi'

// ===== DADOS DAS REDES SOCIAIS =====
const socialMediaData = {
  instagram: {
    url: 'https://www.instagram.com/flexfitnesscenter/',
    username: '@flexfitnesscenter',
    icon: FaInstagram,
    color: 'from-pink-500 to-purple-600',
    hoverShadow: '0 8px 25px rgba(236, 72, 153, 0.4)',
    bgSimple: 'bg-pink-500'
  },
  tiktok: {
    url: 'https://www.tiktok.com/@flexfitnessoficial', // SUBSTITUA PELO LINK REAL
    username: '@flexfitnesscenter',
    icon: FaTiktok,
    color: 'from-gray-800 to-black',
    hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    bgSimple: 'bg-gray-800'
  }
}

// Hook para detectar mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Removido hook de scroll - sempre visível

// ===== COMPONENTE PRINCIPAL =====
export default function ResponsiveSocialSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const isMobile = useIsMobile()
  // Sempre visível agora

  // Auto-expandir apenas no desktop após 4 segundos (uma vez)
  useEffect(() => {
    if (!isMobile && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsExpanded(true)
        setTimeout(() => setIsExpanded(false), 2500)
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [isMobile, hasInteracted])

  const handleSocialClick = useCallback((platform: keyof typeof socialMediaData) => {
    const social = socialMediaData[platform]
    
    window.open(social.url, '_blank', 'noopener,noreferrer')
    
    setHasInteracted(true)
  }, [])

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded)
    setHasInteracted(true)
  }, [isExpanded])

  if (typeof window !== 'undefined' && !isMobile && window.innerWidth < 1024) return null // Não mostrar em tablets

  return (
    <motion.div
      className={`fixed z-40 ${
        isMobile 
          ? 'bottom-6 left-4' 
          : 'left-6 top-1/2 -translate-y-1/2'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {isMobile ? (
        // ===== VERSÃO MOBILE: Design Mais Limpo =====
        <div className="relative">
          {/* Redes sociais - Mobile */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="absolute bottom-16 left-0 flex flex-col gap-1.5"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {Object.entries(socialMediaData).map(([platform, data], index) => {
                  const Icon = data.icon
                  return (
                    <motion.button
                      key={platform}
                      onClick={() => handleSocialClick(platform as keyof typeof socialMediaData)}
                      className={`w-12 h-12 rounded-full ${data.bgSimple} text-white shadow-lg flex items-center justify-center transition-all duration-200`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      style={{
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Icon className="text-lg" />
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão principal - Mobile */}
          <motion.button
            onClick={toggleExpanded}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)'
            }}
          >
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {isExpanded ? (
              <HiX className="text-xl relative z-10" />
            ) : (
              <HiShare className="text-xl relative z-10" />
            )}
          </motion.button>

          {/* Tooltip Mobile */}
          {!hasInteracted && (
            <motion.div
              className="absolute -right-28 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              Redes sociais
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </div>
      ) : (
        // ===== VERSÃO DESKTOP: Design Mais Elegante =====
        <motion.div
          className="flex flex-col gap-1.5"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Botão principal - Desktop */}
          <motion.button
            onClick={toggleExpanded}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg flex items-center justify-center relative group"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)'
            }}
          >
            <HiShare className="text-lg" />
            
            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
          </motion.button>

          {/* Redes sociais - Desktop */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-1.5"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {Object.entries(socialMediaData).map(([platform, data], index) => {
                  const Icon = data.icon
                  return (
                    <motion.div
                      key={platform}
                      className="flex items-center gap-3 group/item"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                    >
                      {/* Label elegante */}
                      <motion.div
                        className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg border border-gray-200/50 opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                        initial={{ x: -5 }}
                        whileHover={{ x: 0 }}
                      >
                        {platform === 'instagram' ? 'Instagram' : 'TikTok'}
                      </motion.div>

                      {/* Botão da rede social */}
                      <motion.button
                        onClick={() => handleSocialClick(platform as keyof typeof socialMediaData)}
                        className={`w-10 h-10 rounded-full ${data.bgSimple} text-white shadow-lg flex items-center justify-center transition-all duration-200`}
                        whileHover={{ 
                          scale: 1.15,
                          boxShadow: data.hoverShadow
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="text-sm" />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip Desktop */}
          {!hasInteracted && (
            <motion.div
              className="absolute left-14 top-0 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              Redes sociais
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}