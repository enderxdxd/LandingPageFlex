'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Calendar } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import Papa from 'papaparse'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamados } from '@/lib/chamados/hooks/useChamados'
import { podeVerRelatorios } from '@/lib/chamados/utils/permissions'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { UNIDADES, CATEGORIAS, STATUS_CONFIG } from '@/lib/chamados/constants'
import { CategoriaType, StatusType, UnidadeType } from '@/lib/chamados/types'

const CORES = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#6B7280']

export default function RelatoriosPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const { chamados, loading } = useChamados()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
      return
    }
    if (usuario && !podeVerRelatorios(usuario)) {
      router.push('/chamados/meus')
    }
  }, [authLoading, usuario, router])

  const exportCSV = () => {
    const data = chamados.map(c => ({
      Protocolo: c.protocolo,
      Titulo: c.titulo || c.descricao?.substring(0, 80) || '-',
      Status: STATUS_CONFIG[c.status]?.label,
      Prioridade: c.prioridade,
      Unidade: UNIDADES[c.unidade]?.label,
      Categoria: c.categoria ? CATEGORIAS[c.categoria]?.label : 'Não categorizado',
      Solicitante: c.solicitante.nome,
      Tecnico: c.atribuidoPara?.nome || '-',
      CriadoEm: c.criadoEm?.toDate().toLocaleDateString('pt-BR'),
    }))
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-chamados-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  // Dados para gráficos
  const porStatus = Object.entries(STATUS_CONFIG).map(([key, val]) => ({
    name: val.label,
    value: chamados.filter(c => c.status === key).length,
  })).filter(d => d.value > 0)

  const porCategoria = Object.entries(CATEGORIAS).map(([key, val]) => ({
    name: val.label,
    chamados: chamados.filter(c => c.categoria === key).length,
  }))

  const porUnidade = Object.entries(UNIDADES).map(([key, val]) => ({
    name: val.label,
    chamados: chamados.filter(c => c.unidade === key).length,
  }))

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="RELATÓRIOS"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{chamados.length} chamados encontrados</span>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {loading ? (
          <LoadingState texto="Carregando dados..." />
        ) : (
          <>
            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Por Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Distribuição por Status</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={porStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {porStatus.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Por Categoria */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Por Categoria</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={porCategoria}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                    <Bar dataKey="chamados" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Por Unidade */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Por Unidade</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={porUnidade}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                    <Bar dataKey="chamados" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </ChamadosLayout>
  )
}
