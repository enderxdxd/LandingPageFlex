'use client'

import { motion } from 'framer-motion'
import { HiCog } from 'react-icons/hi'
import { FaCookieBite } from 'react-icons/fa'
import { useCookieManager } from '@/hooks/useCookieManager'

export default function CookieSettingsButton() {
  const { resetConsent, hasConsent } = useCookieManager()

  // Só mostrar se já tiver dado consentimento
  if (!hasConsent) return null

  return (
    <motion.button
      onClick={resetConsent}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 left-4 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:border-flex-primary/30 transition-all z-40 group"
      title="Configurações de Cookies"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaCookieBite className="text-flex-primary text-lg" />
        </motion.div>
        <span className="text-sm font-medium text-flex-dark group-hover:text-flex-primary transition-colors hidden sm:inline">
          Cookies
        </span>
        <HiCog className="text-flex-gray text-sm group-hover:text-flex-primary transition-colors" />
      </div>
    </motion.button>
  )
}
