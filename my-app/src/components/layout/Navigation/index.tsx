'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { HiChevronDown, HiClock, HiDocumentText } from 'react-icons/hi'
import { HiMapPin, HiBars3, HiXMark } from 'react-icons/hi2'
import { ClipboardList, Lightbulb, Users, Ticket, ChevronRight } from 'lucide-react'
import MobileMenu from './MobileMenu'
import { useIsMobile } from '@/components/ClientOnly'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'

// Dados das unidades
const unidadesData = [
  {
    name: 'Alphaville',
    href: '/unidades/alphaville',
    image: '/images/units/alphaville/alphaville1.jpeg',
    address: 'Res. Alphaville Flamboyant, Goiânia - GO',
  },
  {
    name: 'Buena Vista',
    href: '/unidades/buena-vista',
    image: '/images/units/buenavista/hero.jpeg',
    address: 'Shopping Buena Vista - St. Bueno, Goiânia - GO',
  },
  {
    name: 'Marista',
    href: '/unidades/marista',
    image: '/images/units/marista/hero.jpeg',
    address: 'Av. Portugal, 744 - St. Marista, Goiânia - GO',
  },
  {
    name: 'Palmas',
    href: '/unidades/palmas',
    image: '/images/units/palmas/hero-projeto.jpg',
    address: 'Q. 206 Sul Avenida Ns 4 - Palmas, TO',
    badge: '',
  }
]

// Dados dos horarios
const horariosData = [
  { name: 'Alphaville', href: '/horarios/alphaville', image: '/images/units/alphaville/alphaville1.jpeg' },
  { name: 'Buena Vista', href: '/horarios/buena-vista', image: '/images/units/buenavista/hero.jpeg' },
  { name: 'Marista', href: '/horarios/marista', image: '/images/units/marista/hero.jpeg' },
  { name: 'Palmas', href: '/horarios/palmas', image: '/images/units/palmas/hero-projeto.jpg' },
]

// Dados dos formularios
const formulariosData = [
  { name: 'Procedimentos', href: '/procedimentos', icon: ClipboardList, desc: 'Normas e procedimentos' },
  { name: 'Sugestões', href: '/sugestoes', icon: Lightbulb, desc: 'Envie seu feedback' },
  { name: 'Trabalhe Aqui', href: '/trabalhe-aqui', icon: Users, desc: 'Faça parte da equipe' },
  { name: 'Aula Experimental', href: '/freepass', icon: Ticket, desc: 'Agende uma aula grátis' },
]

// ---- Dropdown generico ----
function NavDropdown({
  label,
  isScrolled,
  children,
}: {
  label: string
  isScrolled: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }
  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <button
        type="button"
        className={`flex items-center gap-1 text-[15px] font-medium tracking-wide transition-colors duration-200 ${
          isScrolled
            ? 'text-flex-dark hover:text-flex-primary'
            : 'text-white/90 hover:text-white'
        }`}
      >
        {label}
        <HiChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[300px]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Dropdown Unidades ----
function UnidadesDropdown({ isScrolled }: { isScrolled: boolean }) {
  return (
    <NavDropdown label="Unidades" isScrolled={isScrolled}>
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-flex-slate uppercase tracking-wider">Nossas Unidades</p>
      </div>
      <div className="py-1">
        {unidadesData.map((u) => (
          <Link
            key={u.name}
            href={u.href}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-flex-light transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image src={u.image} alt={u.name} width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-flex-dark">{u.name}</span>
                {u.badge && (
                  <span className="text-[10px] font-semibold bg-flex-primary/10 text-flex-primary px-1.5 py-0.5 rounded">
                    {u.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-flex-slate truncate">{u.address}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>
      
    </NavDropdown>
  )
}

// ---- Dropdown Horarios ----
function HorariosDropdown({ isScrolled }: { isScrolled: boolean }) {
  return (
    <NavDropdown label="Horários" isScrolled={isScrolled}>
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <HiClock className="w-4 h-4 text-flex-slate" />
        <p className="text-xs font-semibold text-flex-slate uppercase tracking-wider">Horários por Unidade</p>
      </div>
      <div className="py-1">
        {horariosData.map((h) => (
          <Link
            key={h.name}
            href={h.href}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-flex-light transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image src={h.image} alt={h.name} width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-flex-dark flex-1">{h.name}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </NavDropdown>
  )
}

// ---- Dropdown Formularios ----
function FormulariosDropdown({ isScrolled }: { isScrolled: boolean }) {
  return (
    <NavDropdown label="Formulários" isScrolled={isScrolled}>
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <HiDocumentText className="w-4 h-4 text-flex-slate" />
        <p className="text-xs font-semibold text-flex-slate uppercase tracking-wider">Formulários</p>
      </div>
      <div className="py-1">
        {formulariosData.map((f) => (
          <Link
            key={f.name}
            href={f.href}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-flex-light transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-lg bg-flex-light flex items-center justify-center flex-shrink-0">
              <f.icon className="w-5 h-5 text-flex-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-flex-dark block">{f.name}</span>
              <p className="text-xs text-flex-slate">{f.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </NavDropdown>
  )
}

// ---- Componente principal ----
function NavigationContent() {
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Skeleton enquanto nao monta
  if (!hasMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="section-padding flex items-center justify-between">
          <div className="h-10 w-28 bg-gray-200/50 rounded" />
          <div className="hidden lg:flex items-center gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-16 h-4 bg-gray-200/50 rounded" />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-gradient-to-b from-black/30 to-transparent py-5'
        }`}
      >
        <div className="section-padding flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <Image
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt="FLEX FITNESS"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className={`text-[15px] font-medium tracking-wide transition-colors duration-200 ${
                isScrolled
                  ? 'text-flex-dark hover:text-flex-primary'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/#modalidades"
              className={`text-[15px] font-medium tracking-wide transition-colors duration-200 ${
                isScrolled
                  ? 'text-flex-dark hover:text-flex-primary'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Modalidades
            </Link>

            <UnidadesDropdown isScrolled={isScrolled} />
            <HorariosDropdown isScrolled={isScrolled} />
            <FormulariosDropdown isScrolled={isScrolled} />

            

            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isScrolled
                  ? 'bg-flex-primary text-white hover:bg-flex-blue-700 shadow-sm'
                  : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              Entre em Contato
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled
                ? 'text-flex-dark hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <HiBars3 className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function Navigation() {
  return (
    <Suspense
      fallback={
        <nav className="fixed top-0 left-0 right-0 z-50 py-4">
          <div className="section-padding flex items-center justify-between">
            <div className="h-10 w-28 bg-gray-200/50 rounded" />
          </div>
        </nav>
      }
    >
      <NavigationContent />
    </Suspense>
  )
}
