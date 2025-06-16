'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt4 } from 'react-icons/hi'
import MobileMenu from './MobileMenu'

// Componente separado que usa usePathname de forma segura
function NavigationContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [pathname, setPathname] = useState('/')

  // Inicialização segura do pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 50)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('mousemove', handleMouseMove)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
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
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-lg shadow-lg py-4 border-b border-gray-200/50' 
            : 'bg-transparent py-6'
        }`}
      >
        {/* Animated background elements - Simplificado para mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isScrolled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-flex-primary/5 to-flex-secondary/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          
          {/* Floating particles - Reduzido para performance mobile */}
          {typeof window !== 'undefined' && window.innerWidth > 768 && Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${i % 2 === 0 ? 'bg-flex-primary' : 'bg-flex-secondary'} rounded-full opacity-20`}
              style={{
                left: `${20 + i * 30}%`,
                top: '50%',
              }}
              animate={{
                y: [-10, 10, -10],
                x: [0, mousePosition.x * 0.01, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        <div className="section-padding flex items-center justify-between relative z-10">
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                textShadow: isScrolled 
                  ? "0 0 20px rgba(30, 64, 175, 0.3)"
                  : "0 0 20px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`font-display text-3xl relative group ${
                isScrolled ? 'gradient-text' : 'text-white'
              }`}
            >
              FLEX FITNESS
              
              {/* Logo animation effects - Simplificado */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm"
                transition={{ duration: 0.3 }}
              />
              
              {/* Underline animation */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  className={`relative group ${
                    isScrolled 
                      ? 'text-flex-dark hover:text-flex-primary' 
                      : 'text-white hover:text-flex-primary'
                  } transition-colors duration-300 font-medium`}
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="relative z-10"
                  >
                    {link.label}
                  </motion.span>
                  
                  {/* Hover background */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Underline animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative gradient-bg text-white px-6 py-2 rounded-full font-medium transition-all duration-300 overflow-hidden"
            >
              {/* Button animation background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              
              {/* Pulsing ring - Simplificado */}
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <span className="relative z-10">Agendar Visita</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9, rotate: 90 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: isScrolled 
                ? "0 5px 15px rgba(0,0,0,0.2)"
                : "0 5px 15px rgba(255,255,255,0.3)"
            }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className={`lg:hidden text-2xl relative p-2 rounded-full transition-all duration-300 ${
              isScrolled ? 'text-flex-dark bg-white/80' : 'text-white bg-white/10'
            }`}
          >
            {/* Background pulse - Simplificado */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <HiMenuAlt4 className="relative z-10" />
          </motion.button>
        </div>

        {/* Animated border */}
        {isScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary via-flex-secondary to-flex-primary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        )}
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait" initial={false}>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Side Navigation Dots - Só mostra na home e desktop */}
      {pathname === '/' && typeof window !== 'undefined' && window.innerWidth > 1024 && (
        <motion.div 
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex flex-col space-y-4">
            {['hero', 'concept', 'units', 'features', 'cta'].map((section, index) => (
              <motion.a
                key={section}
                href={`#${section}`}
                whileHover={{ 
                  scale: 1.5,
                  boxShadow: index % 2 === 0 
                    ? "0 0 20px rgba(30, 64, 175, 0.6)"
                    : "0 0 20px rgba(59, 130, 246, 0.6)"
                }}
                whileTap={{ scale: 0.8 }}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 group ${
                  index % 2 === 0 
                    ? 'bg-flex-primary hover:bg-flex-secondary' 
                    : 'bg-flex-secondary hover:bg-flex-primary'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Pulsing ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${
                    index % 2 === 0 ? 'border-flex-primary' : 'border-flex-secondary'
                  } opacity-0 group-hover:opacity-100`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Tooltip */}
                <motion.div
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-flex-dark text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.div>
              </motion.a>
            ))}
          </div>
          
          {/* Connecting line */}
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-flex-primary via-flex-secondary to-flex-primary opacity-30 -translate-x-1/2 -z-10"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 1.5, duration: 1 }}
          />
        </motion.div>
      )}
    </>
  )
}

// Componente principal com fallback
export default function Navigation() {
  return (
    <Suspense 
      fallback={
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg py-4 border-b border-gray-200/50">
          <div className="section-padding flex items-center justify-between">
            <div className="font-display text-3xl gradient-text">FLEX FITNESS</div>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              ))}
              <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </nav>
      }
    >
      <NavigationContent />
    </Suspense>
  )
}