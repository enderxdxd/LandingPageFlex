'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiX, HiChevronDown } from 'react-icons/hi'
import { useState } from 'react'

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const menuVariants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  }
  
  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '#contato', label: 'Contato' }
  ]

  const unidadeLinks = [
    { href: '/unidades/alphaville', label: 'Alphaville' },
    { href: '/unidades/buena-vista', label: 'Buena Vista' },
    { href: '/unidades/marista', label: 'Marista' },
    { href: '/unidades/palmas', label: 'Palmas (Em breve)' }
  ]

  const horarioLinks = [
    { href: '/horarios/alphaville', label: 'Horários Alphaville' },
    { href: '/horarios/buena-vista', label: 'Horários Buena Vista' },
    { href: '/horarios/marista', label: 'Horários Marista' },
    { href: '/horarios/palmas', label: 'Horários Palmas' }
  ]

  const formularioLinks = [
    { href: '/procedimentos', label: 'Procedimentos' },
    { href: '/sugestoes', label: 'Sugestões' },
    { href: '/trabalhe-aqui', label: 'Trabalhe Aqui' }
  ]

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <motion.div
      variants={menuVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
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
   
        <nav className="flex-1 flex flex-col justify-center space-y-6">
          {/* Links principais */}
          {mainLinks.map((link, index) => (
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
   
          {/* Seção Unidades */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-t border-gray-200 pt-6"
          >
            <button
              onClick={() => toggleSection('unidades')}
              className="flex items-center justify-between w-full text-3xl font-display text-flex-dark hover:text-flex-red transition-colors py-2"
            >
              <span>Unidades</span>
              <motion.div
                animate={{ rotate: expandedSection === 'unidades' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown />
              </motion.div>
            </button>
            
            {expandedSection === 'unidades' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-4 space-y-3 mt-4">
                  {unidadeLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block text-xl font-display text-flex-gray hover:text-flex-red transition-colors py-1"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
   
          {/* Seção Horários */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => toggleSection('horarios')}
              className="flex items-center justify-between w-full text-3xl font-display text-flex-dark hover:text-flex-red transition-colors py-2"
            >
              <span>Horários</span>
              <motion.div
                animate={{ rotate: expandedSection === 'horarios' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown />
              </motion.div>
            </button>
            
            {expandedSection === 'horarios' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-4 space-y-3 mt-4">
                  {horarioLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block text-xl font-display text-flex-gray hover:text-flex-red transition-colors py-1"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
   
          {/* Seção Formulários */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => toggleSection('formularios')}
              className="flex items-center justify-between w-full text-3xl font-display text-flex-dark hover:text-flex-red transition-colors py-2"
            >
              <span>Formulários</span>
              <motion.div
                animate={{ rotate: expandedSection === 'formularios' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown />
              </motion.div>
            </button>
            
            {expandedSection === 'formularios' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-4 space-y-3 mt-4">
                  {formularioLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block text-xl font-display text-flex-gray hover:text-flex-red transition-colors py-1"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
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