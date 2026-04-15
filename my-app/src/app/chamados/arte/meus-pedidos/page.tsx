'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Palette, Clock, CheckCircle, AlertTriangle, Send, ChevronRight, Package } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { TIPOS_ARTE } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestType, Requester } from '@/lib/arte/types'
import StatusBadge from '@/components/arte/shared/StatusBadge'
import EmptyState from '@/components/arte/shared/EmptyState'

export default function MeusPedidosArtePage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [, setRequester] = useState<Requester | null>(null)
  const [requests, setRequests] = useState<DesignRequest[]>([])

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario) return

    async function load() {
      try {
        const unitId = usuario!.unidades?.[0] || 'alphaville'
        const roleMap: Record<string, string> = {
          'admin': 'gerente', 'gestor': 'gerente',
          'tecnico': 'coordenador', 'solicitante': 'recepcionista',
        }

        const reqRes = await fetch('/api/arte/requesters/by-uid', {
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

        if (reqRes.ok) {
          const data = await reqRes.json()
          setRequester(data as Requester)

          const pedidosRes = await fetch(`/api/arte/requests?requesterId=${data.id}`)
          if (pedidosRes.ok) {
            const pedidosData = await pedidosRes.json()
            setRequests(pedidosData.requests || [])
          }
        }
      } catch {
        // Silencioso
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [usuario])

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="MEUS PEDIDOS DE ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                  </div>
                  <div className="w-20 h-6 bg-gray-100 rounded-lg animate-pulse shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={Palette}
            title="Nenhum pedido ainda"
            description="Você ainda não fez nenhuma solicitação de arte. Crie seu primeiro pedido agora!"
            action={{
              label: 'Fazer primeiro pedido',
              icon: Palette,
              onClick: () => router.push('/chamados/arte/novo'),
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-sm text-gray-500 tabular-nums">
                <span className="font-semibold text-gray-900">{requests.length}</span> pedido{requests.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => router.push('/chamados/arte/novo')}
                className="inline-flex items-center gap-2 px-4 min-h-10 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Palette className="w-4 h-4" />
                Novo pedido
              </button>
            </div>

            <div className="space-y-3">
              {requests.map((req) => {
                const tipo = TIPOS_ARTE[req.type as DesignRequestType]
                const createdAt = req.createdAt && typeof req.createdAt === 'object' && 'seconds' in req.createdAt
                  ? new Date((req.createdAt as { seconds: number }).seconds * 1000) : null
                const deadline = req.deadline && typeof req.deadline === 'object' && 'seconds' in req.deadline
                  ? new Date((req.deadline as { seconds: number }).seconds * 1000) : null
                const needsReview = req.status === 'em-revisao' && req.deliveries?.length > 0

                return (
                  <button
                    key={req.id}
                    onClick={() => router.push(`/chamados/arte/pedido/${req.id}`)}
                    className={`w-full bg-white rounded-2xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      needsReview ? 'border-purple-200 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="text-2xl leading-none mt-0.5 shrink-0" aria-hidden>{tipo?.emoji || '📝'}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-gray-400 tabular-nums">#{req.requestNumber}</span>
                            </div>
                            <p className="text-base font-bold text-gray-900 truncate leading-tight">
                              {tipo?.label || req.type}
                            </p>
                            {createdAt && (
                              <p className="text-xs text-gray-500 mt-1 tabular-nums">
                                {format(createdAt, "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <StatusBadge status={req.status} size="sm" />
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        {req.destinations?.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Send className="w-3 h-3 text-gray-400" />
                            {req.destinations.length} destino{req.destinations.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {deadline && (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3 text-gray-400" />
                            Prazo {format(deadline, 'dd/MM')}
                          </span>
                        )}
                        {req.deliveries?.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <Package className="w-3 h-3" />
                            {req.deliveries.length} entrega{req.deliveries.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {req.isUrgent && (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            Urgente
                          </span>
                        )}
                      </div>

                      {needsReview && (
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                          <p className="text-sm font-semibold text-purple-900 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            Arte entregue — aguardando sua aprovação
                          </p>
                          <p className="text-xs text-purple-700 mt-0.5">
                            Toque para revisar e aprovar ou pedir ajustes.
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </ChamadosLayout>
  )
}
