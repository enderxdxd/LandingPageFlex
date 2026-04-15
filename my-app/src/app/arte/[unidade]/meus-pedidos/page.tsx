'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, Palette, ArrowLeft, Clock, CheckCircle, AlertTriangle, XCircle, Cog, Eye, LogOut } from 'lucide-react'
import { ARTE_UNIDADES, STATUS_ARTE, TIPOS_ARTE } from '@/lib/arte/constants'
import type { ArteUnidadeType, DesignRequest, DesignRequestType, Requester } from '@/lib/arte/types'
import { getOrCreateDeviceId, clearDeviceId } from '@/lib/arte/utils/deviceId'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'novo': <Clock className="w-4 h-4" />,
  'em-producao': <Cog className="w-4 h-4" />,
  'em-revisao': <Eye className="w-4 h-4" />,
  'concluido': <CheckCircle className="w-4 h-4" />,
  'cancelado': <XCircle className="w-4 h-4" />,
}

export default function MeusPedidosPage() {
  const router = useRouter()
  const params = useParams()
  const unidade = params.unidade as ArteUnidadeType
  const unidadeInfo = ARTE_UNIDADES[unidade]

  const [loading, setLoading] = useState(true)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [requests, setRequests] = useState<DesignRequest[]>([])

  useEffect(() => {
    async function load() {
      try {
        const deviceId = getOrCreateDeviceId()
        const res = await fetch(`/api/arte/requesters?deviceId=${encodeURIComponent(deviceId)}`)
        const data = await res.json()

        if (!data.requester || data.requester.isBlocked) {
          router.replace(`/arte/${unidade}`)
          return
        }

        setRequester(data.requester as Requester)

        // Buscar pedidos
        const reqRes = await fetch(`/api/arte/requests?requesterId=${data.requester.id}`)
        const reqData = await reqRes.json()
        setRequests(reqData.requests || [])
      } catch {
        router.replace(`/arte/${unidade}`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, unidade])

  const handleLogout = () => {
    clearDeviceId()
    router.replace(`/arte/${unidade}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!requester) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/arte/${unidade}`)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">Meus pedidos</p>
              <p className="text-xs text-gray-500">{unidadeInfo.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              {requester.name?.split(' ')[0]}
            </p>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              title="Não é você?"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido ainda</h2>
            <p className="text-sm text-gray-500 mb-6">Você ainda não fez nenhuma solicitação de arte</p>
            <button
              onClick={() => router.push(`/arte/${unidade}/novo`)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <Palette className="w-4 h-4" />
              Fazer primeiro pedido
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{requests.length} pedido{requests.length !== 1 ? 's' : ''}</p>
              <button
                onClick={() => router.push(`/arte/${unidade}/novo`)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                <Palette className="w-3.5 h-3.5" />
                Novo pedido
              </button>
            </div>

            <div className="space-y-3">
              {requests.map((req) => {
                const tipo = TIPOS_ARTE[req.type as DesignRequestType]
                const status = STATUS_ARTE[req.status]
                const createdAt = req.createdAt && typeof req.createdAt === 'object' && 'seconds' in req.createdAt
                  ? new Date((req.createdAt as { seconds: number }).seconds * 1000)
                  : null
                const deadline = req.deadline && typeof req.deadline === 'object' && 'seconds' in req.deadline
                  ? new Date((req.deadline as { seconds: number }).seconds * 1000)
                  : null

                return (
                  <div
                    key={req.id}
                    onClick={() => router.push(`/arte/${unidade}/pedido/${req.id}`)}
                    className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{tipo?.emoji || '📝'}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            #{req.requestNumber} — {tipo?.label || req.type}
                          </p>
                          {createdAt && (
                            <p className="text-xs text-gray-400">
                              {format(createdAt, "dd 'de' MMM, HH:mm", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${status?.bgColor} ${status?.color} border ${status?.borderColor}`}>
                        {STATUS_ICONS[req.status]}
                        {status?.label || req.status}
                      </span>
                    </div>

                    {/* Resumo */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {req.destinations?.length > 0 && (
                        <span>{req.destinations.length} destino{req.destinations.length !== 1 ? 's' : ''}</span>
                      )}
                      {deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Prazo: {format(deadline, 'dd/MM')}
                        </span>
                      )}
                      {req.deliveries?.length > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {req.deliveries.length} entrega{req.deliveries.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {req.isUrgent && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          Urgente
                        </span>
                      )}
                    </div>

                    {/* Última entrega pendente de revisão */}
                    {req.status === 'em-revisao' && req.deliveries?.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                        <p className="text-xs font-medium text-purple-700 mb-1">
                          🎨 Arte entregue — aguardando sua aprovação
                        </p>
                        <p className="text-xs text-purple-600">
                          Clique para revisar e aprovar ou pedir ajustes
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
