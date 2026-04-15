'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, ArrowLeft, Download, BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts'
import { format, subDays, differenceInHours } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Papa from 'papaparse'
import { ARTE_UNIDADES, TIPOS_ARTE, STATUS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, ArteUnidadeType, DesignRequestType, DestinationType } from '@/lib/arte/types'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function RelatoriosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<DesignRequest[]>([])
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | 'all'>('30')
  const [filterUnidade, setFilterUnidade] = useState<ArteUnidadeType | ''>('')
  const [filterTipo, setFilterTipo] = useState<DesignRequestType | ''>('')

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
  }, [user, periodo, filterUnidade, filterTipo]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // ==================== METRICS ====================
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

  const topSolicitantes = useMemo(() => {
    const map: Record<string, { nome: string; unidade: string; total: number }> = {}
    requests.forEach(r => {
      if (!map[r.requesterId]) {
        map[r.requesterId] = {
          nome: r.requesterName,
          unidade: ARTE_UNIDADES[r.unitId as ArteUnidadeType]?.label || r.unitId,
          total: 0,
        }
      }
      map[r.requesterId].total++
    })
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10)
  }, [requests])

  const foraDoPrazo = useMemo(() => {
    return requests.filter(r => {
      if (['concluido', 'cancelado'].includes(r.status)) return false
      const deadline = r.deadline && typeof r.deadline === 'object' && 'seconds' in r.deadline
        ? new Date((r.deadline as { seconds: number }).seconds * 1000) : null
      return deadline ? deadline < new Date() : false
    })
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
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/admin/arte')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Relatórios</h1>
              <p className="text-sm text-gray-500 leading-tight tabular-nums">
                {requests.length} pedido{requests.length !== 1 ? 's' : ''} no período
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={requests.length === 0}
            className="inline-flex items-center gap-2 px-4 min-h-10 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex gap-1 bg-gray-100 rounded-xl p-1" role="tablist" aria-label="Período">
            {([['7', '7 dias'], ['30', '30 dias'], ['90', '90 dias'], ['all', 'Tudo']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPeriodo(val)}
                role="tab"
                aria-selected={periodo === val}
                className={`px-3 min-h-9 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  periodo === val
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={filterUnidade}
            onChange={(e) => setFilterUnidade(e.target.value as ArteUnidadeType | '')}
            className="px-3 min-h-10 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
          >
            <option value="">Todas unidades</option>
            {(Object.entries(ARTE_UNIDADES) as [ArteUnidadeType, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as DesignRequestType | '')}
            className="px-3 min-h-10 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
          >
            <option value="">Todos tipos</option>
            {(Object.entries(TIPOS_ARTE) as [DesignRequestType, { label: string; emoji: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 h-24 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-[320px] animate-pulse" />
            ))}
          </div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KpiCard label="Total" value={metrics.total} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
            <KpiCard label="Pendentes" value={metrics.pendentes} icon={<Clock className="w-5 h-5" />} color="amber" />
            <KpiCard label="Concluídos" value={metrics.concluidos} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            <KpiCard label="Cancelados" value={metrics.cancelados} icon={<AlertTriangle className="w-5 h-5" />} color="rose" />
            <KpiCard label="Tempo médio" value={`${metrics.tempoMedio}h`} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Volume por unidade" subtitle="Pedidos abertos por unidade no período">
              {volumePorUnidade.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={volumePorUnidade} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="value" name="Pedidos" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>

            <ChartCard title="Volume por tipo" subtitle="Distribuição dos tipos de arte solicitados">
              {volumePorTipo.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={volumePorTipo}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {volumePorTipo.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Destinos mais pedidos" subtitle="Canais de publicação priorizados">
              {destinosPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={destinosPie}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {destinosPie.map((_, i) => (
                        <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>

            <ChartCard title="Taxa de ajuste por tipo" subtitle="% de pedidos concluídos que sofreram revisão">
              {taxaAjuste.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taxaAjuste} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} unit="%" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={120} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="taxa" name="Taxa ajuste" fill="#f59e0b" radius={[0, 8, 8, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </ChartCard>
          </div>

          {/* Evolução mensal */}
          <ChartCard title="Evolução mensal" subtitle="Volume total de pedidos ao longo do tempo">
            {evolucaoMensal.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={evolucaoMensal} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Pedidos"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>

          {/* Top solicitantes */}
          <ChartCard title="Top solicitantes" subtitle="Quem mais solicita arte no período">
            {topSolicitantes.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/60">
                      <th className="px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidade</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Pedidos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topSolicitantes.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-400 font-semibold tabular-nums">{i + 1}</td>
                        <td className="px-3 py-3 text-sm font-semibold text-gray-900">{s.nome}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{s.unidade}</td>
                        <td className="px-5 py-3 text-sm font-bold text-blue-600 text-right tabular-nums">{s.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyChart />}
          </ChartCard>

          {/* Pedidos fora do prazo */}
          {foraDoPrazo.length > 0 && (
            <ChartCard
              title={`Pedidos fora do prazo`}
              subtitle={`${foraDoPrazo.length} pedido${foraDoPrazo.length !== 1 ? 's' : ''} com prazo expirado`}
            >
              <div className="space-y-2">
                {foraDoPrazo.slice(0, 10).map(r => {
                  const deadline = r.deadline && typeof r.deadline === 'object' && 'seconds' in r.deadline
                    ? new Date((r.deadline as { seconds: number }).seconds * 1000) : null

                  return (
                    <div key={r.id} className="flex items-center justify-between gap-3 py-2.5 px-3.5 bg-rose-50 rounded-xl border border-rose-200">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-sm font-bold text-rose-700 tabular-nums shrink-0">#{r.requestNumber}</span>
                        <span className="text-sm text-rose-700 font-medium truncate">{TIPOS_ARTE[r.type as DesignRequestType]?.label}</span>
                        <span className="text-xs text-rose-500 truncate hidden sm:inline">— {r.requesterName}</span>
                      </div>
                      <span className="text-sm font-semibold text-rose-700 tabular-nums shrink-0">
                        {deadline ? format(deadline, 'dd/MM') : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ChartCard>
          )}
        </main>
      )}
    </div>
  )
}

// ==================== Helpers ====================

function KpiCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, { text: string; iconBg: string }> = {
    blue: { text: 'text-blue-700', iconBg: 'bg-blue-50' },
    amber: { text: 'text-amber-700', iconBg: 'bg-amber-50' },
    emerald: { text: 'text-emerald-700', iconBg: 'bg-emerald-50' },
    rose: { text: 'text-rose-700', iconBg: 'bg-rose-50' },
    purple: { text: 'text-purple-700', iconBg: 'bg-purple-50' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums tracking-tight">{value}</p>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-gray-400">Sem dados para exibir</p>
    </div>
  )
}
