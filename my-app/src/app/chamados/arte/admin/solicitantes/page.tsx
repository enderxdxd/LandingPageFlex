'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Users, Search, Shield, ShieldOff, MapPin, Phone, Briefcase, Hash } from 'lucide-react'
import { format } from 'date-fns'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { ARTE_UNIDADES, CARGOS } from '@/lib/arte/constants'
import type { ArteUnidadeType, Requester } from '@/lib/arte/types'

export default function SolicitantesProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [requesters, setRequesters] = useState<Requester[]>([])
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [filterBlocked, setFilterBlocked] = useState<'' | 'true' | 'false'>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !usuario) router.push('/chamados')
    if (!authLoading && usuario && !['admin', 'gestor', 'designer'].includes(usuario.role)) router.push('/chamados/arte')
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario || !['admin', 'gestor', 'designer'].includes(usuario.role)) return
    loadRequesters()
  }, [usuario, filterUnidade, filterBlocked]) // eslint-disable-line react-hooks/exhaustive-deps

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

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />
  if (!['admin', 'gestor', 'designer'].includes(usuario.role)) return null

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="SOLICITANTES DE ARTE"
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
            placeholder="Buscar por nome ou telefone..."
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
        <select
          value={filterBlocked}
          onChange={(e) => setFilterBlocked(e.target.value as '' | 'true' | 'false')}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Todos</option>
          <option value="false">Ativos</option>
          <option value="true">Bloqueados</option>
        </select>
        <p className="text-xs text-gray-500 ml-auto">{filtered.length} encontrado{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhum solicitante encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unidade</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pedidos</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Último acesso</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ações</th>
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
                    <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${r.isBlocked ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                            {r.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.name}</p>
                            {r.isBlocked && (
                              <span className="text-[10px] text-red-600 font-semibold">Bloqueado</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {unidadeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Briefcase className="w-3 h-3" />
                          {cargoLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="w-3 h-3" />
                          {r.phoneDisplay || r.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                          <Hash className="w-3 h-3" />
                          {r.totalRequests || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">
                          {lastActive ? format(lastActive, "dd/MM/yy HH:mm") : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleBlock(r.id, r.isBlocked)}
                          disabled={toggling === r.id}
                          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                            r.isBlocked
                              ? 'text-green-700 border-green-200 bg-green-50 hover:bg-green-100'
                              : 'text-red-700 border-red-200 bg-red-50 hover:bg-red-100'
                          } disabled:opacity-50`}
                        >
                          {toggling === r.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : r.isBlocked ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <ShieldOff className="w-3 h-3" />
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
    </ChamadosLayout>
  )
}
