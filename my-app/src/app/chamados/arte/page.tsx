'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Palette, ArrowRight, User, List } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import type { Requester } from '@/lib/arte/types'

export default function ChamadosArtePage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [requester, setRequester] = useState<Requester | null>(null)
  const [loadingRequester, setLoadingRequester] = useState(true)

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  // Auto-criar/buscar requester vinculado ao uid do chamados
  useEffect(() => {
    if (!usuario) return

    async function ensureRequester() {
      try {
        // Determinar unidade principal do usuário
        const unitId = usuario!.unidades?.[0] || 'alphaville'

        // Mapear role do chamados para role da arte
        const roleMap: Record<string, string> = {
          'admin': 'gerente',
          'gestor': 'gerente',
          'tecnico': 'coordenador',
          'solicitante': 'recepcionista',
        }

        const res = await fetch('/api/arte/requesters/by-uid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: usuario!.uid,
            name: usuario!.nome,
            phone: usuario!.telefone || '',
            role: roleMap[usuario!.role] || 'outro',
            unitId,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setRequester(data as Requester)
        }
      } catch {
        // Falha silenciosa — o requester será criado na próxima tentativa
      } finally {
        setLoadingRequester(false)
      }
    }

    ensureRequester()
  }, [usuario])

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="SOLICITAR ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="max-w-2xl mx-auto">
        {loadingRequester ? (
          <div className="space-y-3 mt-8">
            <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Welcome */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Solicitar arte
              </h1>
              <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                Peça uma arte para o designer da Flex. Preencha o formulário e a equipe produz para você.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/chamados/arte/novo')}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10 hover:-translate-y-0.5 active:translate-y-0 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform shrink-0">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 leading-tight">Novo pedido de arte</p>
                  <p className="text-sm text-gray-500 leading-tight mt-0.5">Criar uma nova solicitação</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              <button
                onClick={() => router.push('/chamados/arte/meus-pedidos')}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors shrink-0">
                  <List className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 leading-tight">Meus pedidos</p>
                  <p className="text-sm text-gray-500 leading-tight mt-0.5">Acompanhe o status dos seus pedidos</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>

            {requester && (
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                <User className="w-3.5 h-3.5" />
                <span>
                  Identificado como <span className="font-semibold text-gray-600">{requester.name}</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </ChamadosLayout>
  )
}
