'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot, QueryConstraint } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
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
import { Loader2, Palette, LogOut, Search, Filter, RefreshCw, X, Users, BarChart3, Archive } from 'lucide-react'
import { STATUS_ARTE, ARTE_UNIDADES, TIPOS_ARTE, KANBAN_ARTE_COLUMNS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestStatus, ArteUnidadeType, DesignRequestType } from '@/lib/arte/types'
import KanbanCard from '@/components/arte/admin/KanbanCard'
import RequestDrawer from '@/components/arte/admin/RequestDrawer'

export default function AdminArtePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

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

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return () => unsub()
  }, [])

  // Real-time listener
  useEffect(() => {
    if (!user) return

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
  }, [user, filterUnidade, filterTipo])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
    } catch {
      setLoginError('Email ou senha incorretos')
    } finally {
      setLoginLoading(false)
    }
  }

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

    // The over.id is the column status
    const newStatus = over.id as string

    if (KANBAN_ARTE_COLUMNS.includes(newStatus as DesignRequestStatus) && newStatus !== req.status) {
      try {
        const body: Record<string, unknown> = { status: newStatus }

        // Auto-assign when moving to em-producao
        if (newStatus === 'em-producao' && !req.assignedTo && user) {
          body.assignedTo = user.uid
          body.assignedToName = user.displayName || user.email
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

  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find(r => r.id === selectedRequest.id)
      if (updated) setSelectedRequest(updated)
    }
  }, [requests]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter logic (client-side for search + urgency)
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

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  // Login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Painel de Arte</h1>
            <p className="text-sm text-gray-500 mt-1">Faça login para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 min-h-11 border border-gray-200 rounded-xl text-sm text-gray-900 transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 min-h-11 border border-gray-200 rounded-xl text-sm text-gray-900 transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                required
              />
            </div>
            {loginError && (
              <p role="alert" className="text-sm text-rose-600 font-medium">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 px-4 min-h-11 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Kanban
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20 shrink-0">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-900 leading-tight truncate">Flex Arte — Painel</h1>
              <p className="text-xs text-gray-500 leading-tight">
                {totalActive} pedido{totalActive !== 1 ? 's' : ''} ativo{totalActive !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pedido..."
                className="pl-9 pr-8 min-h-10 text-sm border border-gray-200 rounded-xl w-56 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3 min-h-10 text-sm font-medium rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                showFilters || filterUnidade || filterTipo || filterUrgente
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {/* Nav links */}
            <button
              onClick={() => router.push('/admin/arte/solicitantes')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 min-h-10 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            >
              <Users className="w-4 h-4" />
              Solicitantes
            </button>

            <button
              onClick={() => router.push('/admin/arte/relatorios')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 min-h-10 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            >
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </button>

            <button
              onClick={() => router.push('/admin/arte/arquivo')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 min-h-10 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            >
              <Archive className="w-4 h-4" />
              Arquivo
            </button>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              aria-label="Atualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => signOut(auth)}
              className="inline-flex items-center gap-1.5 px-3 min-h-10 text-sm font-medium text-gray-500 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters bar */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3">
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

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as DesignRequestType | '')}
              className="px-3 min-h-10 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
            >
              <option value="">Todos os tipos</option>
              {(Object.entries(TIPOS_ARTE) as [DesignRequestType, { label: string; emoji: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none px-2 min-h-10">
              <input
                type="checkbox"
                checked={filterUrgente}
                onChange={(e) => setFilterUrgente(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              Apenas urgentes
            </label>

            {(filterUnidade || filterTipo || filterUrgente) && (
              <button
                onClick={() => { setFilterUnidade(''); setFilterTipo(''); setFilterUrgente(false) }}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 px-2 min-h-10"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Kanban */}
      {loading ? (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {KANBAN_ARTE_COLUMNS.map(status => (
              <div key={status} className="rounded-2xl border border-gray-200 bg-white/60 p-3 space-y-2">
                <div className="h-6 bg-gray-100 rounded animate-pulse mb-3" />
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
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
                <div className="opacity-95 rotate-1 scale-[1.02]">
                  <KanbanCard request={activeCard} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Drawer */}
      {selectedRequest && (
        <RequestDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          currentUserId={user.uid}
          currentUserName={user.displayName || user.email || 'Designer'}
          onRefresh={handleDrawerRefresh}
        />
      )}
    </div>
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
      className={`rounded-2xl border transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50/60' : 'border-gray-200 bg-white/70'
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${bgColor} border ${borderColor}`} />
          <p className={`text-sm font-bold ${color}`}>{label}</p>
        </div>
        <span className={`inline-flex items-center justify-center min-w-[28px] h-6 px-2 text-xs font-bold ${color} ${bgColor} rounded-lg border ${borderColor} tabular-nums`}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2.5 space-y-2.5 min-h-[200px] max-h-[calc(100vh-240px)] overflow-y-auto">
        <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {requests.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400">Nenhum pedido</p>
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
