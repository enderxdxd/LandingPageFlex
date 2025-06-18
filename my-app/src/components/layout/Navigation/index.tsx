'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { HiMenuAlt4, HiChevronDown, HiClock } from 'react-icons/hi'
import { HiMapPin } from 'react-icons/hi2'
import MobileMenu from './MobileMenu'
import { useIsMobile } from '@/components/ClientOnly'

// Dados das unidades
const unidadesData = [
  {
    name: 'Alphaville',
    href: '/unidades/alphaville',
    image: '/images/units/alphaville/alphaville1.jpeg',
    address: 'Av. Alphaville Flamboyant - S/N - Quadra 05 - Lote 05 e 06 - Res. Alphaville Flamboyant, Goiânia - GO',
    description: 'Unidade premium com vista panorâmica'
  },
  {
    name: 'Buena Vista',
    href: '/unidades/buena-vista',
    image: '/images/units/buenavista/hero.jpeg',
    address: 'Shopping Buena Vista - Av. T-4, 466 - St. Bueno, Goiânia - GO, 74230-030, Brazil',
    description: 'Unidade com vista panorâmica da cidade'
  },
  {
    name: 'Marista',
    href: '/unidades/marista',
    image: '/images/units/marista/hero.jpeg',
    address: 'Av. Portugal, 744 - St. Marista, Goiânia - GO, 74150-030, Brazil',
    description: 'Unidade Ultra Moderna, Situada no ASSAÍ'
  },
  {
    name: 'Palmas',
    href: '/unidades/palmas',
    image: '/images/units/palmas/hero-projeto.jpg',
    address: 'Q. 206 Sul Avenida Ns 4, 469 - Arse, Palmas - TO',
    description: 'Em breve - Primeira Flex em Palmas'
  }
]

// Dados dos horários (mesmas unidades, mas com links diferentes)
const horariosData = [
  {
    name: 'Alphaville',
    href: '/horarios/alphaville',
    unitId: 'alphaville',
    image: '/images/units/alphaville/alphaville1.jpeg',
    description: 'Horários de funcionamento e aulas'
  },
  {
    name: 'Buena Vista',
    href: '/horarios/buena-vista',
    unitId: 'buena-vista',
    image: '/images/units/buenavista/hero.jpeg',
    description: 'Horários de funcionamento e aulas'
  },
  {
    name: 'Marista',
    href: '/horarios/marista',
    unitId: 'marista',
    image: '/images/units/marista/hero.jpeg',
    description: 'Horários de funcionamento e aulas'
  },
  {
    name: 'Palmas',
    href: '/horarios/palmas',
    unitId: 'palmas',
    image: '/images/units/palmas/hero-projeto.jpg',
    description: 'Horários de funcionamento e aulas'
  }
]

// Componente do Dropdown Unidades
function UnidadesDropdown({ isScrolled, hasMounted }: { isScrolled: boolean, hasMounted: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.div
        className={`relative flex items-center gap-1 cursor-pointer ${
          hasMounted && isScrolled
            ? 'text-flex-dark hover:text-flex-primary' 
            : 'text-white hover:text-flex-primary'
        } transition-colors duration-300 font-medium`}
      >
        <motion.span
          whileHover={{ y: -2 }}
          className="relative z-10"
        >
          Unidades
        </motion.span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <HiChevronDown className="text-sm" />
        </motion.div>
        
        {hasMounted && (
          <>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 rounded-lg opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
              initial={{ width: 0 }}
              animate={{ width: isOpen ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 border-b border-gray-100">
              <h3 className="font-semibold text-flex-dark text-sm">Nossas Unidades</h3>
              <p className="text-flex-gray text-xs">Escolha a mais próxima de você</p>
            </div>

            <div className="p-2">
              {unidadesData.map((unidade, index) => (
                <motion.div
                  key={unidade.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={unidade.href}
                    className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-flex-primary/5 hover:to-flex-secondary/5 transition-all duration-200"
                  >
                    <motion.div 
                      className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={unidade.image}
                        alt={unidade.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-flex-primary/20 to-flex-secondary/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h4 
                        className="font-semibold text-flex-dark text-sm group-hover/item:text-flex-primary transition-colors duration-200"
                        whileHover={{ x: 2 }}
                      >
                        {unidade.name}
                      </motion.h4>
                      <div className="flex items-center gap-1 text-flex-gray text-xs mb-1">
                        <HiMapPin className="w-3 h-3" />
                        <span className="truncate">{unidade.address}</span>
                      </div>
                      <p className="text-flex-gray text-xs truncate">{unidade.description}</p>
                    </div>

                    <motion.div
                      className="text-flex-gray group-hover/item:text-flex-primary transition-colors duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="p-3 bg-gray-50/50 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/unidades"
                className="group/footer flex items-center justify-center gap-2 text-flex-primary hover:text-flex-secondary font-medium text-sm transition-colors duration-200"
              >
                <span>Ver todas as unidades</span>
                <motion.svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente do Dropdown Horários
function HorariosDropdown({ isScrolled, hasMounted }: { isScrolled: boolean, hasMounted: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.div
        className={`relative flex items-center gap-1 cursor-pointer ${
          hasMounted && isScrolled
            ? 'text-flex-dark hover:text-flex-primary' 
            : 'text-white hover:text-flex-primary'
        } transition-colors duration-300 font-medium`}
      >
        <motion.span
          whileHover={{ y: -2 }}
          className="relative z-10"
        >
          Horários
        </motion.span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <HiChevronDown className="text-sm" />
        </motion.div>
        
        {hasMounted && (
          <>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 rounded-lg opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
              initial={{ width: 0 }}
              animate={{ width: isOpen ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HiClock className="text-orange-500 text-lg" />
                <div>
                  <h3 className="font-semibold text-flex-dark text-sm">Horários de Funcionamento</h3>
                  <p className="text-flex-gray text-xs">Consulte os horários por unidade</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {horariosData.map((horario, index) => (
                <motion.div
                  key={horario.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={horario.href}
                    className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-amber-500/5 transition-all duration-200"
                  >
                    <motion.div 
                      className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={horario.image}
                        alt={horario.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                      
                      {/* Ícone de relógio sobreposto */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <HiClock className="text-white text-lg drop-shadow-lg opacity-80" />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h4 
                        className="font-semibold text-flex-dark text-sm group-hover/item:text-orange-600 transition-colors duration-200"
                        whileHover={{ x: 2 }}
                      >
                        {horario.name}
                      </motion.h4>
                      <p className="text-flex-gray text-xs truncate">{horario.description}</p>
                      <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        <span>Horários atualizados</span>
                      </div>
                    </div>

                    <motion.div
                      className="text-flex-gray group-hover/item:text-orange-600 transition-colors duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="p-3 bg-gray-50/50 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/admin"
                className="group/footer flex items-center justify-center gap-2 text-orange-600 hover:text-amber-600 font-medium text-sm transition-colors duration-200"
              >
                <span>Administrar horários</span>
                <motion.svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente separado que usa usePathname de forma segura
function NavigationContent() {
  const isMobile = useIsMobile();
  const isTablet = typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false;
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [pathname, setPathname] = useState('/')
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
    { href: '#contato', label: 'Contato' }
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hasMounted ? 0 : -100 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hasMounted && isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-lg py-4 border-b border-gray-200/50' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {hasMounted && isScrolled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-flex-primary/5 to-flex-secondary/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          
          {hasMounted && !isTablet && !isMobile && Array.from({ length: 3 }).map((_, i) => (
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
                filter: hasMounted && isScrolled
                  ? "drop-shadow(0 0 20px rgba(30, 64, 175, 0.3))"
                  : "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <img 
                src="/images/units/alphaville/flex-logo-navbar.png"
                alt="FLEX FITNESS"
                className="h-10 w-auto object-contain"
              />
              
              {hasMounted && (
                <>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <Link
                href="/"
                className={`relative group ${
                  hasMounted && isScrolled
                    ? 'text-flex-dark hover:text-flex-primary' 
                    : 'text-white hover:text-flex-primary'
                } transition-colors duration-300 font-medium`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="relative z-10"
                >
                  Home
                </motion.span>
                
                {hasMounted && (
                  <>
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 rounded-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </>
                )}
              </Link>
            </motion.div>
            {/* Dropdown Unidades */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <UnidadesDropdown isScrolled={isScrolled} hasMounted={hasMounted} />
            </motion.div>

            {/* Dropdown Horários */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <HorariosDropdown isScrolled={isScrolled} hasMounted={hasMounted} />
            </motion.div>

            {/* Contato */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                href="#contato"
                className={`relative group ${
                  hasMounted && isScrolled
                    ? 'text-flex-dark hover:text-flex-primary' 
                    : 'text-white hover:text-flex-primary'
                } transition-colors duration-300 font-medium`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="relative z-10"
                >
                  Contato
                </motion.span>
                
                {hasMounted && (
                  <>
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-flex-primary/10 to-flex-secondary/10 rounded-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-flex-primary to-flex-secondary"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </>
                )}
              </Link>
            </motion.div>
            
           
            
            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={hasMounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative gradient-bg text-white px-6 py-2 rounded-full font-medium transition-all duration-300 overflow-hidden"
            >
              {hasMounted && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-white/30 rounded-full"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
              <span className="relative z-10">Agendar Visita</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9, rotate: 90 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: hasMounted && isScrolled
                ? "0 5px 15px rgba(0,0,0,0.2)"
                : "0 5px 15px rgba(255,255,255,0.3)"
            }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className={`lg:hidden text-2xl relative p-2 rounded-full transition-all duration-300 ${
              hasMounted && isScrolled ? 'text-flex-dark bg-white/80' : 'text-white bg-white/10'
            }`}
          >
            {hasMounted && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-flex-primary/20 to-flex-secondary/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <HiMenuAlt4 className="relative z-10" />
          </motion.button>
        </div>

        {/* Animated border */}
        {hasMounted && isScrolled && (
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

      {/* Side Navigation Dots */}
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
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
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