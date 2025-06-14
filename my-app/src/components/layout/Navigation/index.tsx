'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import MobileMenu from './MobileMenu'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#unidades', label: 'Unidades' },
    { href: '#modalidades', label: 'Modalidades' },
    { href: '#contato', label: 'Contato' }
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="section-padding flex items-center justify-between">
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`font-display text-3xl ${isScrolled ? 'gradient-text' : 'text-flex-red'}`}
            >
              FLEX FITNESS
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  isScrolled ? 'text-flex-dark hover:text-flex-red' : 'text-white hover:text-flex-red'
                } transition-colors duration-300 font-medium`}
              >
                {link.label}
              </Link>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Agendar Visita
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className={`lg:hidden text-2xl ${isScrolled ? 'text-flex-dark' : 'text-white'}`}
          >
            <HiMenuAlt4 />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Side Navigation Dots */}
      {pathname === '/' && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col space-y-4">
            {['hero', 'concept', 'units', 'features', 'cta'].map((section, index) => (
              <motion.a
                key={section}
                href={`#${section}`}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index % 2 === 0 ? 'bg-flex-red hover:bg-flex-blue' : 'bg-flex-blue hover:bg-flex-red'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}