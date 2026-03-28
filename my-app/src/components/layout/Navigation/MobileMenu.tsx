'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { HiChevronDown } from 'react-icons/hi'
import { HiXMark } from 'react-icons/hi2'
import { useState, useEffect } from 'react'

interface MobileMenuProps {
  onClose: () => void
}

const sections = [
  {
    title: 'Unidades',
    links: [
      { href: '/unidades/alphaville', label: 'Alphaville' },
      { href: '/unidades/buena-vista', label: 'Buena Vista' },
      { href: '/unidades/marista', label: 'Marista' },
      { href: '/unidades/palmas', label: 'Palmas' },
    ],
  },
  {
    title: 'Horarios',
    links: [
      { href: '/horarios/alphaville', label: 'Alphaville' },
      { href: '/horarios/buena-vista', label: 'Buena Vista' },
      { href: '/horarios/marista', label: 'Marista' },
      { href: '/horarios/palmas', label: 'Palmas' },
    ],
  },
  {
    title: 'Formularios',
    links: [
      { href: '/procedimentos', label: 'Procedimentos' },
      { href: '/sugestoes', label: 'Sugestoes' },
      { href: '/trabalhe-aqui', label: 'Trabalhe Aqui' },
      { href: '/freepass', label: 'Aula Experimental' },
    ],
  },
]

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Image
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt="FLEX FITNESS"
              width={100}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg text-flex-dark hover:bg-gray-100 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4">
            {/* Direct links */}
            <div className="px-6 space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className="block py-3 text-lg font-display text-flex-dark hover:text-flex-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/eventos"
                onClick={onClose}
                className="block py-3 text-lg font-display text-flex-dark hover:text-flex-primary transition-colors"
              >
                Eventos
              </Link>
            </div>

            <div className="mx-6 my-3 border-t border-gray-100" />

            {/* Expandable sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-6 py-3 text-lg font-display text-flex-dark hover:text-flex-primary transition-colors"
                >
                  <span>{section.title}</span>
                  <HiChevronDown
                    className={`w-5 h-5 text-flex-slate transition-transform duration-200 ${
                      expandedSection === section.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === section.title ? 'auto' : 0,
                    opacity: expandedSection === section.title ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="block py-2.5 pl-4 text-base text-flex-slate hover:text-flex-primary transition-colors border-l-2 border-gray-100 hover:border-flex-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="px-6 py-5 border-t border-gray-100">
            <Link
              href="/freepass"
              onClick={onClose}
              className="block w-full text-center bg-flex-primary text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-flex-blue-700 transition-colors"
            >
              Agende sua Aula Experimental
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
