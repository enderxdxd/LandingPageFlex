'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Plus,
  List,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Ticket,
} from 'lucide-react'
import { ChamadoUsuario } from '@/lib/chamados/types'
import { getNavItems } from '@/lib/chamados/utils/permissions'

interface ChamadosSidebarProps {
  usuario: ChamadoUsuario
  onLogout: () => void
}

const ICON_MAP: Record<string, React.ElementType> = {
  '/chamados/novo': Plus,
  '/chamados/meus': List,
  '/chamados/painel': LayoutDashboard,
  '/chamados/painel/relatorios': BarChart3,
  '/chamados/painel/configuracoes': Settings,
}

export default function ChamadosSidebar({ usuario, onLogout }: ChamadosSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = getNavItems(usuario.role)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 tracking-tight">CHAMADOS</h2>
            <p className="text-xs text-gray-500">Flex Fitness</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.href] || List
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
            usuario.role === 'admin' ? 'bg-blue-100 text-blue-700' :
            usuario.role === 'gestor' ? 'bg-purple-100 text-purple-700' :
            usuario.role === 'tecnico' ? 'bg-green-100 text-green-700' :
            'bg-gray-200 text-gray-600'
          }`}>
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{usuario.nome}</p>
            <p className="text-xs text-gray-500 capitalize">{usuario.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-white z-50 shadow-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
