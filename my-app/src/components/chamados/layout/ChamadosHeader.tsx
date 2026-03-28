'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, X } from 'lucide-react'
import { ChamadoNotificacao } from '@/lib/chamados/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChamadosHeaderProps {
  titulo: string
  notificacoes: ChamadoNotificacao[]
  naoLidas: number
  onMarcarLida: (id: string) => void
  onMarcarTodasLidas: () => void
  onBusca?: (termo: string) => void
}

export default function ChamadosHeader({
  titulo,
  notificacoes,
  naoLidas,
  onMarcarLida,
  onMarcarTodasLidas,
  onBusca,
}: ChamadosHeaderProps) {
  const [showNotif, setShowNotif] = useState(false)
  const [busca, setBusca] = useState('')
  const notifRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200/80 z-30 px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-lg font-bold text-gray-900 tracking-tight pl-14 lg:pl-0">
          {titulo}
        </h1>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          {onBusca && (
            <div className="hidden sm:flex items-center bg-gray-50/80 rounded-xl border border-gray-200/80 px-3.5 py-2 gap-2 w-64 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar protocolo ou título..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  onBusca(e.target.value)
                }}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {busca && (
                <button onClick={() => { setBusca(''); onBusca('') }} className="p-0.5 rounded hover:bg-gray-200 transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200/80"
            >
              <Bell className="w-[18px] h-[18px] text-gray-500" />
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                  {naoLidas > 0 && (
                    <button
                      onClick={onMarcarTodasLidas}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2.5">
                        <Bell className="w-4 h-4 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400">Nenhuma notificação</p>
                    </div>
                  ) : (
                    notificacoes.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          onMarcarLida(notif.id)
                          router.push(`/chamados/meus/${notif.chamadoId}`)
                          setShowNotif(false)
                        }}
                        className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${
                          !notif.lida ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{notif.titulo}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.mensagem}</p>
                            <p className="text-[11px] text-gray-400 mt-1.5">
                              {notif.criadoEm && formatDistanceToNow(notif.criadoEm.toDate(), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
