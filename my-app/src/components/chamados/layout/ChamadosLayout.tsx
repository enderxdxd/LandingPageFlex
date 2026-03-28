'use client'

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import ChamadosSidebar from './ChamadosSidebar'
import ChamadosHeader from './ChamadosHeader'
import { ChamadoUsuario, ChamadoNotificacao } from '@/lib/chamados/types'

interface ChamadosLayoutProps {
  children: ReactNode
  usuario: ChamadoUsuario
  titulo: string
  notificacoes: ChamadoNotificacao[]
  naoLidas: number
  onLogout: () => void
  onMarcarLida: (id: string) => void
  onMarcarTodasLidas: () => void
  onBusca?: (termo: string) => void
}

export default function ChamadosLayout({
  children,
  usuario,
  titulo,
  notificacoes,
  naoLidas,
  onLogout,
  onMarcarLida,
  onMarcarTodasLidas,
  onBusca,
}: ChamadosLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />

      <ChamadosSidebar usuario={usuario} onLogout={onLogout} />

      <div className="lg:ml-60">
        <ChamadosHeader
          titulo={titulo}
          notificacoes={notificacoes}
          naoLidas={naoLidas}
          onMarcarLida={onMarcarLida}
          onMarcarTodasLidas={onMarcarTodasLidas}
          onBusca={onBusca}
        />

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
