'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, ArrowLeft, Users, Search, Shield, ShieldOff, MapPin, Phone, Briefcase } from 'lucide-react'
import { format } from 'date-fns'
import { ARTE_UNIDADES, CARGOS } from '@/lib/arte/constants'
import type { ArteUnidadeType, Requester } from '@/lib/arte/types'
import EmptyState from '@/components/arte/shared/EmptyState'

export default function SolicitantesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [requesters, setRequesters] = useState<Requester[]>([])
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [filterBlocked, setFilterBlocked] = useState<'' | 'true' | 'false'>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

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
    loadRequesters()
  }, [user, filterUnidade, filterBlocked]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadRequesters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterUnidade) params.set('unitId', filterUnidade)
      if (filterBlocked) params.set('blocked', filterBlocked)

      const res = await fetch(`/api/arte/requesters/list?${params}`)
      if (res.ok) {
        const data = await res.json()
        setRequesters(data.requesters || [])
      }
    } catch {
      toast.error('Erro ao carregar solicitantes')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBlock = async (requesterId: string, currentBlocked: boolean) => {
    setToggling(requesterId)
    try {
      const res = await fetch('/api/arte/requesters/list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requesterId, isBlocked: !currentBlocked }),
      })
      if (!res.ok) throw new Error()
      toast.success(currentBlocked ? 'Solicitante desbloqueado' : 'Solicitante bloqueado')
      setRequesters(prev => prev.map(r =>
        r.id === requesterId ? { ...r, isBlocked: !currentBlocked } : r
      ))
    } catch {
      toast.error('Erro ao alterar status')
    } finally {
      setToggling(null)
    }
  }

  const filtered = requesters.filter(r => {
    if (!searchTerm) return true
    const s = searchTerm.toLowerCase()
    return (
      r.name?.toLowerCase().includes(s) ||
      r.phoneDisplay?.includes(s) ||
      r.phone?.includes(s)
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
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Solicitantes</h1>
              <p className="text-sm text-gray-500 leading-tight">
                {filtered.length} encontrado{filtered.length !== 1 ? 's' : ''}
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
              placeholder="Buscar por nome ou telefone..."
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
          <select
            value={filterBlocked}
            onChange={(e) => setFilterBlocked(e.target.value as '' | 'true' | 'false')}
            className="px-3 min-h-10 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
          >
            <option value="">Todos</option>
            <option value="false">Ativos</option>
            <option value="true">Bloqueados</option>
          </select>
        </div>
      </div>

      {/* List */}
      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-5">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum solicitante encontrado"
            description="Ajuste os filtros ou aguarde novos cadastros."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidade</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cargo</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">WhatsApp</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Pedidos</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Último acesso</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r) => {
                    const lastActive = r.lastActiveAt && typeof r.lastActiveAt === 'object' && 'seconds' in r.lastActiveAt
                      ? new Date((r.lastActiveAt as { seconds: number }).seconds * 1000)
                      : null
                    const unidadeLabel = ARTE_UNIDADES[r.unitId]?.label || r.unitId
                    const cargoLabel = CARGOS[r.role]?.label || r.role

                    return (
                      <tr key={r.id} className={`hover:bg-gray-50/60 transition-colors ${r.isBlocked ? 'opacity-70' : ''}`}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0">
                              {r.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                              {r.isBlocked && (
                                <span className="text-xs text-rose-600 font-semibold">Bloqueado</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {unidadeLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                            {cargoLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 tabular-nums">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {r.phoneDisplay || r.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-sm font-semibold text-gray-900 tabular-nums">
                            {r.totalRequests || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-500 tabular-nums">
                            {lastActive ? format(lastActive, 'dd/MM/yy HH:mm') : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleToggleBlock(r.id, r.isBlocked)}
                            disabled={toggling === r.id}
                            className={`inline-flex items-center gap-1.5 px-3 min-h-9 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                              r.isBlocked
                                ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 focus-visible:ring-emerald-500'
                                : 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100 focus-visible:ring-rose-500'
                            } disabled:opacity-50`}
                          >
                            {toggling === r.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : r.isBlocked ? (
                              <Shield className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldOff className="w-3.5 h-3.5" />
                            )}
                            {r.isBlocked ? 'Desbloquear' : 'Bloquear'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
