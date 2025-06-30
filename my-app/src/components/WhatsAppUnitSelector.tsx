'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPhone } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { unitsData } from '@/lib/constants/units-data'

interface WhatsAppUnitSelectorProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function WhatsAppUnitSelector({ 
  isOpen, 
  onClose, 
  message = "Olá! Gostaria de agendar uma visita para conhecer a unidade." 
}: WhatsAppUnitSelectorProps) {
  
  // Mapeamento dos números fixos por unidade
  const landlineNumbers = {
    'Alphaville': '62 3414-7330',
    'Buena Vista': '62 3515-0588',
    'Marista': '62 99383-0661'
  }
  
  const handleUnitSelect = (whatsappNumber: string, unitName: string) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const fullNumber = `55${cleanNumber}`
    const encodedMessage = encodeURIComponent(`${message}\n\nUnidade: ${unitName}`)
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const handlePhoneCall = (unitName: string) => {
    const phoneNumber = landlineNumbers[unitName as keyof typeof landlineNumbers]
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      window.open(`tel:+55${cleanNumber}`, '_self')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            {/* Header - Mais compacto */}
            <div className="text-center mb-6 relative">
              <motion.button 
                onClick={onClose} 
                className="absolute -top-1 -right-1 text-gray-400 hover:text-gray-600 transition-colors p-1.5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiX className="text-lg" />
              </motion.button>
              
              <h3 className="font-display text-xl text-flex-primary font-bold mb-1">
                ESCOLHA SUA UNIDADE
              </h3>
              <p className="text-gray-500 text-xs">
                Selecione para falar no WhatsApp ou ligar
              </p>
            </div>

            {/* Units List - Mais compacto */}
            <div className="space-y-3">
              {unitsData.map((unit, index) => {
                const isDisabled = unit.comingSoon || !unit.whatsapp || unit.whatsapp === '----'
                const hasLandline = landlineNumbers[unit.name as keyof typeof landlineNumbers]
                
                return (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                      isDisabled
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:bg-green-50/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        {/* Unit Info */}
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-display text-base font-bold text-gray-800">
                              {unit.name.toUpperCase()}
                            </h4>
                            {isDisabled && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                EM BREVE
                              </span>
                            )}
                          </div>
                          
                          {/* Números de contato */}
                          <div className="space-y-1">
                            {!isDisabled && (
                              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                <FaWhatsapp className="text-xs" />
                                {unit.whatsapp}
                              </div>
                            )}
                            
                            {hasLandline && (
                              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                <HiPhone className="text-xs" />
                                {hasLandline}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-3 flex gap-2">
                          {/* WhatsApp Button */}
                          {!isDisabled ? (
                            <motion.button
                              onClick={() => handleUnitSelect(unit.whatsapp || '', unit.name)}
                              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                              whileHover={{ 
                                scale: 1.1, 
                                backgroundColor: "#22c55e",
                                rotate: 5
                              }}
                              whileTap={{ 
                                scale: 0.95,
                                rotate: -5
                              }}
                            >
                              <FaWhatsapp className="text-white text-lg" />
                            </motion.button>
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs">⏳</span>
                            </div>
                          )}

                          {/* Phone Button */}
                          {hasLandline && (
                            <motion.button
                              onClick={() => handlePhoneCall(unit.name)}
                              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
                              whileHover={{ 
                                scale: 1.1, 
                                backgroundColor: "#3b82f6",
                                rotate: -5
                              }}
                              whileTap={{ 
                                scale: 0.95,
                                rotate: 5
                              }}
                            >
                              <HiPhone className="text-white text-lg" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer - Mais compacto */}
            <motion.div
              className="mt-5 text-center p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs text-gray-600 mb-0.5">
                📱 <span className="font-medium">Instagram:</span> @flexfitnesscenter
              </div>
              <div className="text-xs text-gray-400">
                WhatsApp ou ligação direta
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}