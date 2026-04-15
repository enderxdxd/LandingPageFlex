'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Archive, Search, Clock, CheckCircle, MapPin, User as UserIcon, FileText, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { ARTE_UNIDADES, TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, ArteUnidadeType, DesignRequestType, DestinationType } from '@/lib/arte/types'

export default function ArquivoArteProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<DesignRequest[]>([])
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null)

  useEffect(() => {
    if (!authLoading && !usuario) router.push('/chamados')
    if (!authLoading && usuario && !['admin', 'gestor', 'designer'].includes(usuario.role)) router.push('/chamados/arte')
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario || !['admin', 'gestor', 'designer'].includes(usuario.role)) return
    loadData()
  }, [usuario, filterUnidade]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('status', 'concluido')
      if (filterUnidade) params.set('unitId', filterUnidade)

      const res = await fetch(`/api/arte/requests/all?${params}`)
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
      }
    } catch {
      toast.error('Erro ao carregar arquivo')
    } finally {
      setLoading(false)
    }
  }

  const filtered = requests.filter(r => {
    if (!searchTerm) return true
    const s = searchTerm.toLowerCase()
    return (
      r.requesterName?.toLowerCase().includes(s) ||
      String(r.requestNumber).includes(s) ||
      r.type?.toLowerCase().includes(s) ||
      JSON.stringify(r.dynamicFields || {}).toLowerCase().includes(s)
    )
  })

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />
  if (!['admin', 'gestor', 'designer'].includes(usuario.role)) return null

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="ARQUIVO DE ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-right" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número, tipo ou solicitante..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <select
          value={filterUnidade}
          onChange={(e) => setFilterUnidade(e.target.value as ArteUnidadeType | '')}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Todas as unidades</option>
          {(Object.entries(ARTE_UNIDADES) as [ArteUnidadeType, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 ml-auto">
          {filtered.length} concluído{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Archive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhum pedido concluído encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const tipo = TIPOS_ARTE[req.type as DesignRequestType]
            const unidadeLabel = ARTE_UNIDADES[req.unitId as ArteUnidadeType]?.label
            const createdAt = req.createdAt && typeof req.createdAt === 'object' && 'seconds' in req.createdAt
              ? new Date((req.createdAt as { seconds: number }).seconds * 1000) : null
            const completedAt = req.completedAt && typeof req.completedAt === 'object' && 'seconds' in req.completedAt
              ? new Date((req.completedAt as { seconds: number }).seconds * 1000) : null

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(selectedRequest?.id === req.id ? null : req)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{tipo?.emoji || '📝'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          #{req.requestNumber} — {tipo?.label || req.type}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            {req.requesterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {unidadeLabel}
                          </span>
                          {createdAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(createdAt, "dd/MM/yy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-semibold border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        Concluído
                      </span>
                      {completedAt && (
                        <span className="text-[10px] text-gray-400">
                          {format(completedAt, "dd/MM/yy")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {selectedRequest?.id === req.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 space-y-3">
                    {/* Destinations */}
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {req.destinations?.map(d => (
                        <span key={d} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                          {DESTINOS[d as DestinationType]?.emoji} {DESTINOS[d as DestinationType]?.label}
                        </span>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Designer</p>
                        <p className="text-gray-900 font-medium">{req.assignedToName || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Entregas</p>
                        <p className="text-gray-900 font-medium">{req.deliveries?.length || 0} versão(ões)</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Revisões</p>
                        <p className="text-gray-900 font-medium">{req.roundsOfRevision || 0}</p>
                      </div>
                    </div>

                    {/* Delivery files */}
                    {req.deliveries?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Arquivos entregues</p>
                        <div className="space-y-1">
                          {req.deliveries[req.deliveries.length - 1].files?.map((file, fi) => (
                            <a
                              key={fi}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-xs text-blue-600 font-medium flex-1 truncate">{file.fileName}</span>
                              <Eye className="w-3 h-3 text-gray-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </ChamadosLayout>
  )
}
