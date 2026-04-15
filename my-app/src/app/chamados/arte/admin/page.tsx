'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, orderBy, onSnapshot, QueryConstraint } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Search, Filter, RefreshCw, X, Users, BarChart3, Archive } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { STATUS_ARTE, ARTE_UNIDADES, TIPOS_ARTE, KANBAN_ARTE_COLUMNS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestStatus, ArteUnidadeType, DesignRequestType } from '@/lib/arte/types'
import KanbanCard from '@/components/arte/admin/KanbanCard'
import RequestDrawer from '@/components/arte/admin/RequestDrawer'

export default function PainelArteProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  // Kanban state
  const [requests, setRequests] = useState<DesignRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState<DesignRequest | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null)

  // Filters
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [filterTipo, setFilterTipo] = useState<DesignRequestType | ''>('')
  const [filterUrgente, setFilterUrgente] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Auth guard — only admin/gestor
  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
    if (!authLoading && usuario && !['admin', 'gestor', 'designer'].includes(usuario.role)) {
      router.push('/chamados/arte')
    }
  }, [authLoading, usuario, router])

  // Real-time listener
  useEffect(() => {
    if (!usuario || !['admin', 'gestor', 'designer'].includes(usuario.role)) return

    setLoading(true)

    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

    if (filterUnidade) {
      constraints.unshift(where('unitId', '==', filterUnidade))
    }

    if (filterTipo) {
      constraints.unshift(where('type', '==', filterTipo))
    }

    const q = query(collection(db, 'designRequests'), ...constraints)

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DesignRequest))
      setRequests(data)
      setLoading(false)
    }, (error) => {
      console.error('Erro no listener:', error)
      setLoading(false)
    })

    return () => unsub()
  }, [usuario, filterUnidade, filterTipo])

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const req = requests.find(r => r.id === event.active.id)
    setActiveCard(req || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    const req = requests.find(r => r.id === active.id)
    if (!req) return

    const newStatus = over.id as string

    if (KANBAN_ARTE_COLUMNS.includes(newStatus as DesignRequestStatus) && newStatus !== req.status) {
      try {
        const body: Record<string, unknown> = { status: newStatus }

        // Auto-assign when moving to em-producao
        if (newStatus === 'em-producao' && !req.assignedTo && usuario) {
          body.assignedTo = usuario.uid
          body.assignedToName = usuario.nome
        }

        const res = await fetch(`/api/arte/requests/${req.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) throw new Error()
        toast.success(`Movido para "${STATUS_ARTE[newStatus as DesignRequestStatus]?.label}"`)
      } catch {
        toast.error('Erro ao mover pedido')
      }
    }
  }

  const handleRefresh = useCallback(() => {
    toast.success('Dados atualizados em tempo real')
  }, [])

  const handleDrawerRefresh = useCallback(() => {
    if (selectedRequest) {
      const updated = requests.find(r => r.id === selectedRequest.id)
      if (updated) setSelectedRequest(updated)
    }
  }, [selectedRequest, requests])

  // Update selectedRequest when requests change
  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find(r => r.id === selectedRequest.id)
      if (updated) setSelectedRequest(updated)
    }
  }, [requests]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter logic
  const filteredRequests = requests.filter(r => {
    if (filterUrgente && !r.isUrgent) return false
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      const match = (
        r.requesterName?.toLowerCase().includes(s) ||
        String(r.requestNumber).includes(s) ||
        r.type?.toLowerCase().includes(s) ||
        JSON.stringify(r.dynamicFields || {}).toLowerCase().includes(s)
      )
      if (!match) return false
    }
    return true
  })

  const getColumnRequests = (status: DesignRequestStatus) =>
    filteredRequests.filter(r => r.status === status)

  const totalActive = filteredRequests.filter(r => !['concluido', 'cancelado'].includes(r.status)).length

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  if (!['admin', 'gestor', 'designer'].includes(usuario.role)) return null

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="PAINEL DE ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-right" />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pedido..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
            showFilters || filterUnidade || filterTipo || filterUrgente
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filtros
        </button>

        <button
          onClick={() => router.push('/chamados/arte/admin/solicitantes')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Solicitantes</span>
        </button>

        <button
          onClick={() => router.push('/chamados/arte/admin/relatorios')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Relatórios</span>
        </button>

        <button
          onClick={() => router.push('/chamados/arte/admin/arquivo')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Archive className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Arquivo</span>
        </button>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-500 ml-auto">
          {totalActive} ativo{totalActive !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
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

          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as DesignRequestType | '')}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
          >
            <option value="">Todos os tipos</option>
            {(Object.entries(TIPOS_ARTE) as [DesignRequestType, { label: string; emoji: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.emoji} {v.label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUrgente}
              onChange={(e) => setFilterUrgente(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Apenas urgentes
          </label>

          {(filterUnidade || filterTipo || filterUrgente) && (
            <button
              onClick={() => { setFilterUnidade(''); setFilterTipo(''); setFilterUrgente(false) }}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Kanban */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {KANBAN_ARTE_COLUMNS.map(status => {
              const columnRequests = getColumnRequests(status)
              const statusInfo = STATUS_ARTE[status]

              return (
                <KanbanColumn
                  key={status}
                  status={status}
                  label={statusInfo.label}
                  color={statusInfo.color}
                  bgColor={statusInfo.bgColor}
                  borderColor={statusInfo.borderColor}
                  count={columnRequests.length}
                  requests={columnRequests}
                  onCardClick={(req) => setSelectedRequest(req)}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="opacity-90 rotate-2 scale-105">
                <KanbanCard request={activeCard} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Drawer */}
      {selectedRequest && usuario && (
        <RequestDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          currentUserId={usuario.uid}
          currentUserName={usuario.nome}
          currentUserRole={usuario.role}
          onRefresh={handleDrawerRefresh}
        />
      )}
    </ChamadosLayout>
  )
}

// ==================== Kanban Column ====================

function KanbanColumn({
  status,
  label,
  color,
  bgColor,
  borderColor,
  count,
  requests,
  onCardClick,
}: {
  status: DesignRequestStatus
  label: string
  color: string
  bgColor: string
  borderColor: string
  count: number
  requests: DesignRequest[]
  onCardClick: (req: DesignRequest) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border ${isOver ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 bg-gray-50/80'} transition-colors`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${bgColor} border ${borderColor}`} />
          <p className={`text-xs font-bold ${color} uppercase tracking-wider`}>{label}</p>
        </div>
        <span className={`text-xs font-bold ${color} ${bgColor} px-2 py-0.5 rounded-lg border ${borderColor}`}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto">
        <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {requests.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-xs text-gray-400">Nenhum pedido</p>
            </div>
          ) : (
            requests.map(req => (
              <KanbanCard
                key={req.id}
                request={req}
                onClick={() => onCardClick(req)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
