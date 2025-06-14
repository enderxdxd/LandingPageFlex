'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiX } from 'react-icons/hi'

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const menuVariants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/unidades/alphaville', label: 'Alphaville' },
    { href: '/unidades/bueno-vista', label: 'Bueno Vista' },
    { href: '/unidades/marista', label: 'Marista' },
    { href: '/unidades/palmas', label: 'Palmas (Em breve)' }
  ]

  return (
    <motion.div
      variants={menuVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-0 bg-white z-50"
    >
      <div className="flex flex-col h-full p-8">
        <div className="flex justify-between items-center mb-12">
          <div className="font-display text-3xl gradient-text">FLEX FITNESS</div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-flex-dark text-3xl"
          >
            <HiX />
          </motion.button>
        </div>

        <nav className="flex-1 flex flex-col justify-center space-y-8">
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="text-4xl font-display text-flex-dark hover:text-flex-red transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-bg text-white py-4 rounded-full font-medium w-full"
        >
          Agendar Visita
        </motion.button>
      </div>
    </motion.div>
  )
}