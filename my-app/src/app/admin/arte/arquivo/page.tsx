'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, ArrowLeft, Archive, Search, Clock, MapPin, User as UserIcon, FileText, Eye, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { ARTE_UNIDADES, TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, ArteUnidadeType, DesignRequestType, DestinationType } from '@/lib/arte/types'
import StatusBadge from '@/components/arte/shared/StatusBadge'
import EmptyState from '@/components/arte/shared/EmptyState'

export default function ArquivoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<DesignRequest[]>([])
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
      if (!u) router.replace('/admin/arte')
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user, filterUnidade]) // eslint-disable-line react-hooks/exhaustive-deps

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/admin/arte')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Arquivo</h1>
              <p className="text-sm text-gray-500 leading-tight">
                {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} concluído{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número, tipo ou solicitante..."
              className="w-full pl-9 pr-4 min-h-10 text-sm border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
            />
          </div>
          <select
            value={filterUnidade}
            onChange={(e) => setFilterUnidade(e.target.value as ArteUnidadeType | '')}
            className="px-3 min-h-10 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
          >
            <option value="">Todas as unidades</option>
            {(Object.entries(ARTE_UNIDADES) as [ArteUnidadeType, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-5">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/5" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/5" />
                  </div>
                  <div className="w-24 h-7 bg-gray-100 rounded-lg animate-pulse shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="Nenhum pedido arquivado"
            description="Os pedidos concluídos aparecerão aqui conforme forem finalizados."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const tipo = TIPOS_ARTE[req.type as DesignRequestType]
              const unidadeLabel = ARTE_UNIDADES[req.unitId as ArteUnidadeType]?.label
              const createdAt = req.createdAt && typeof req.createdAt === 'object' && 'seconds' in req.createdAt
                ? new Date((req.createdAt as { seconds: number }).seconds * 1000) : null
              const completedAt = req.completedAt && typeof req.completedAt === 'object' && 'seconds' in req.completedAt
                ? new Date((req.completedAt as { seconds: number }).seconds * 1000) : null
              const isExpanded = selectedRequest?.id === req.id

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <button
                    onClick={() => setSelectedRequest(isExpanded ? null : req)}
                    className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="text-2xl leading-none mt-0.5 shrink-0" aria-hidden>{tipo?.emoji || '📝'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-400 tabular-nums">#{req.requestNumber}</span>
                            <span className="text-gray-300">·</span>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {tipo?.label || req.type}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-gray-400" />
                              {req.requesterName}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {unidadeLabel}
                            </span>
                            {createdAt && (
                              <span className="inline-flex items-center gap-1 tabular-nums">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {format(createdAt, 'dd/MM/yy')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <StatusBadge status="concluido" size="sm" />
                        {completedAt && (
                          <span className="text-xs text-gray-400 tabular-nums">
                            {format(completedAt, 'dd/MM/yy')}
                          </span>
                        )}
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-100 space-y-4">
                      {/* Destinations */}
                      {req.destinations?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4">
                          {req.destinations.map(d => (
                            <span
                              key={d}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium"
                            >
                              {DESTINOS[d as DestinationType]?.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Info cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Designer</p>
                          <p className="text-sm text-gray-900 font-semibold truncate">{req.assignedToName || '—'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Entregas</p>
                          <p className="text-sm text-gray-900 font-semibold tabular-nums">{req.deliveries?.length || 0}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Revisões</p>
                          <p className="text-sm text-gray-900 font-semibold tabular-nums">{req.roundsOfRevision || 0}</p>
                        </div>
                      </div>

                      {/* Delivery files */}
                      {req.deliveries?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Arquivos entregues</p>
                          <div className="space-y-1.5">
                            {req.deliveries[req.deliveries.length - 1].files?.map((file, fi) => (
                              <a
                                key={fi}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                              >
                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="text-sm text-blue-700 font-medium flex-1 truncate">{file.fileName}</span>
                                <Eye className="w-4 h-4 text-gray-400 shrink-0" />
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
      </main>
    </div>
  )
}
