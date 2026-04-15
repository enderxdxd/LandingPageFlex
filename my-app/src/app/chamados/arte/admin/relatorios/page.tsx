'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Download, BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts'
import { format, subDays, differenceInHours } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Papa from 'papaparse'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { ARTE_UNIDADES, TIPOS_ARTE, STATUS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, ArteUnidadeType, DesignRequestType, DestinationType } from '@/lib/arte/types'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function RelatoriosArteProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<DesignRequest[]>([])
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | 'all'>('30')
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [filterTipo, setFilterTipo] = useState<DesignRequestType | ''>('')

  useEffect(() => {
    if (!authLoading && !usuario) router.push('/chamados')
    if (!authLoading && usuario && !['admin', 'gestor', 'designer'].includes(usuario.role)) router.push('/chamados/arte')
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario || !['admin', 'gestor', 'designer'].includes(usuario.role)) return
    loadData()
  }, [usuario, periodo, filterUnidade, filterTipo]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterUnidade) params.set('unitId', filterUnidade)
      if (filterTipo) params.set('type', filterTipo)
      if (periodo !== 'all') {
        const from = subDays(new Date(), parseInt(periodo))
        params.set('from', from.toISOString())
      }

      const res = await fetch(`/api/arte/requests/all?${params}`)
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
      }
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const metrics = useMemo(() => {
    const total = requests.length
    const pendentes = requests.filter(r => !['concluido', 'cancelado'].includes(r.status)).length
    const concluidos = requests.filter(r => r.status === 'concluido').length
    const cancelados = requests.filter(r => r.status === 'cancelado').length

    const temposEntrega: number[] = []
    requests.forEach(r => {
      if (r.firstDeliveryAt && r.createdAt) {
        const created = typeof r.createdAt === 'object' && 'seconds' in r.createdAt
          ? (r.createdAt as { seconds: number }).seconds * 1000 : 0
        const delivered = typeof r.firstDeliveryAt === 'object' && 'seconds' in r.firstDeliveryAt
          ? (r.firstDeliveryAt as { seconds: number }).seconds * 1000 : 0
        if (created && delivered) {
          temposEntrega.push(differenceInHours(delivered, created))
        }
      }
    })
    const tempoMedio = temposEntrega.length > 0
      ? Math.round(temposEntrega.reduce((a, b) => a + b, 0) / temposEntrega.length)
      : 0

    return { total, pendentes, concluidos, cancelados, tempoMedio }
  }, [requests])

  const volumePorUnidade = useMemo(() => {
    const map: Record<string, number> = {}
    requests.forEach(r => {
      const label = ARTE_UNIDADES[r.unitId as ArteUnidadeType]?.label || r.unitId
      map[label] = (map[label] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [requests])

  const volumePorTipo = useMemo(() => {
    const map: Record<string, number> = {}
    requests.forEach(r => {
      const label = TIPOS_ARTE[r.type as DesignRequestType]?.label || r.type
      map[label] = (map[label] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [requests])

  const destinosPie = useMemo(() => {
    const map: Record<string, number> = {}
    requests.forEach(r => {
      r.destinations?.forEach(d => {
        const label = DESTINOS[d as DestinationType]?.label || d
        map[label] = (map[label] || 0) + 1
      })
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [requests])

  const taxaAjuste = useMemo(() => {
    const tipoMap: Record<string, { total: number; comAjuste: number }> = {}
    requests.filter(r => r.status === 'concluido').forEach(r => {
      const label = TIPOS_ARTE[r.type as DesignRequestType]?.label || r.type
      if (!tipoMap[label]) tipoMap[label] = { total: 0, comAjuste: 0 }
      tipoMap[label].total++
      if (r.roundsOfRevision > 0) tipoMap[label].comAjuste++
    })
    return Object.entries(tipoMap).map(([name, data]) => ({
      name,
      taxa: data.total > 0 ? Math.round((data.comAjuste / data.total) * 100) : 0,
    }))
  }, [requests])

  const evolucaoMensal = useMemo(() => {
    const map: Record<string, number> = {}
    requests.forEach(r => {
      const created = r.createdAt && typeof r.createdAt === 'object' && 'seconds' in r.createdAt
        ? new Date((r.createdAt as { seconds: number }).seconds * 1000) : null
      if (created) {
        const key = format(created, 'MMM/yy', { locale: ptBR })
        map[key] = (map[key] || 0) + 1
      }
    })
    return Object.entries(map).reverse().slice(0, 12).reverse().map(([name, value]) => ({ name, value }))
  }, [requests])

  const foraDoPrazo = useMemo(() => {
    return requests.filter(r => {
      if (['concluido', 'cancelado'].includes(r.status)) return false
      const deadline = r.deadline && typeof r.deadline === 'object' && 'seconds' in r.deadline
        ? new Date((r.deadline as { seconds: number }).seconds * 1000) : null
      return deadline ? deadline < new Date() : false
    })
  }, [requests])

  const handleExportCSV = () => {
    const rows = requests.map(r => {
      const created = r.createdAt && typeof r.createdAt === 'object' && 'seconds' in r.createdAt
        ? new Date((r.createdAt as { seconds: number }).seconds * 1000) : null
      const deadline = r.deadline && typeof r.deadline === 'object' && 'seconds' in r.deadline
        ? new Date((r.deadline as { seconds: number }).seconds * 1000) : null

      return {
        Numero: r.requestNumber,
        Tipo: TIPOS_ARTE[r.type as DesignRequestType]?.label || r.type,
        Unidade: ARTE_UNIDADES[r.unitId as ArteUnidadeType]?.label || r.unitId,
        Solicitante: r.requesterName,
        Status: STATUS_ARTE[r.status]?.label || r.status,
        CriadoEm: created ? format(created, 'dd/MM/yyyy HH:mm') : '',
        Prazo: deadline ? format(deadline, 'dd/MM/yyyy') : '',
        Designer: r.assignedToName || '',
        Entregas: r.deliveries?.length || 0,
        Revisoes: r.roundsOfRevision || 0,
      }
    })

    const csv = Papa.unparse(rows)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-arte-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exportado!')
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />
  if (!['admin', 'gestor', 'designer'].includes(usuario.role)) return null

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="RELATÓRIOS DE ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-right" />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {([['7', '7 dias'], ['30', '30 dias'], ['90', '90 dias'], ['all', 'Tudo']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPeriodo(val)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                periodo === val ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={filterUnidade}
          onChange={(e) => setFilterUnidade(e.target.value as ArteUnidadeType | '')}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Todas unidades</option>
          {(Object.entries(ARTE_UNIDADES) as [ArteUnidadeType, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value as DesignRequestType | '')}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Todos tipos</option>
          {(Object.entries(TIPOS_ARTE) as [DesignRequestType, { label: string; emoji: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.emoji} {v.label}</option>
          ))}
        </select>

        <button
          onClick={handleExportCSV}
          disabled={requests.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-40 shadow-sm ml-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KpiCard label="Total" value={metrics.total} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
            <KpiCard label="Pendentes" value={metrics.pendentes} icon={<Clock className="w-5 h-5" />} color="yellow" />
            <KpiCard label="Concluídos" value={metrics.concluidos} icon={<CheckCircle className="w-5 h-5" />} color="green" />
            <KpiCard label="Cancelados" value={metrics.cancelados} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
            <KpiCard label="Tempo médio" value={`${metrics.tempoMedio}h`} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Volume por unidade">
              {volumePorUnidade.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={volumePorUnidade}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Pedidos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>

            <ChartCard title="Volume por tipo">
              {volumePorTipo.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={volumePorTipo} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false}>
                      {volumePorTipo.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Destinos mais pedidos">
              {destinosPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={destinosPie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false}>
                      {destinosPie.map((_, i) => (
                        <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>

            <ChartCard title="Taxa de ajuste por tipo (%)">
              {taxaAjuste.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taxaAjuste} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="taxa" name="Taxa ajuste" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>
          </div>

          {/* Evolução mensal */}
          <ChartCard title="Evolução mensal">
            {evolucaoMensal.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" name="Pedidos" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>

          {/* Pedidos fora do prazo */}
          {foraDoPrazo.length > 0 && (
            <ChartCard title={`Pedidos fora do prazo (${foraDoPrazo.length})`}>
              <div className="space-y-2">
                {foraDoPrazo.slice(0, 10).map(r => {
                  const deadline = r.deadline && typeof r.deadline === 'object' && 'seconds' in r.deadline
                    ? new Date((r.deadline as { seconds: number }).seconds * 1000) : null

                  return (
                    <div key={r.id} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-700">#{r.requestNumber}</span>
                        <span className="text-xs text-red-600">{TIPOS_ARTE[r.type as DesignRequestType]?.label}</span>
                        <span className="text-[10px] text-red-500">— {r.requesterName}</span>
                      </div>
                      <span className="text-xs font-medium text-red-700">
                        Prazo: {deadline ? format(deadline, 'dd/MM') : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ChartCard>
          )}
        </div>
      )}
    </ChamadosLayout>
  )
}

function KpiCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`${c.bg} rounded-2xl border border-gray-200 p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{title}</p>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-xs text-gray-400">Sem dados para exibir</p>
    </div>
  )
}
