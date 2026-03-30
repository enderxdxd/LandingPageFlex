'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamados } from '@/lib/chamados/hooks/useChamados'
import { podeVerDashboard } from '@/lib/chamados/utils/permissions'
import { buscarEstatisticas } from '@/lib/chamados/services/chamadoService'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import DashboardStats from '@/components/chamados/dashboard/DashboardStats'
import DashboardCharts from '@/components/chamados/dashboard/DashboardCharts'
import DashboardRecentes from '@/components/chamados/dashboard/DashboardRecentes'
import DashboardPeriodFilter, { PeriodType, getDateFromPeriod } from '@/components/chamados/dashboard/DashboardPeriodFilter'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { CategoriaType } from '@/lib/chamados/types'

export default function PainelPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const { chamados } = useChamados()
  const router = useRouter()
  const [periodo, setPeriodo] = useState<PeriodType>('30d')

  const [stats, setStats] = useState<{
    totalAbertos: number
    totalEmAndamento: number
    resolvidosHoje: number
    slaEstourado: number
    porCategoria: Record<CategoriaType, number>
    porUnidade: Record<string, number>
  } | null>(null)

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
      return
    }
    if (usuario && !podeVerDashboard(usuario)) {
      router.push('/chamados/meus')
    }
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (usuario) {
      buscarEstatisticas().then(setStats).catch(console.error)
    }
  }, [usuario])

  // Filter chamados by period for the recent list
  const chamadosFiltrados = useMemo(() => {
    const dataLimite = getDateFromPeriod(periodo)
    if (!dataLimite) return chamados
    return chamados.filter(c => {
      try {
        return c.criadoEm && c.criadoEm.toDate() >= dataLimite
      } catch {
        return true
      }
    })
  }, [chamados, periodo])

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="PAINEL DE CONTROLE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <DashboardPeriodFilter periodo={periodo} onChange={setPeriodo} />
        </div>

        {stats ? (
          <>
            <DashboardStats stats={stats} />
            <DashboardCharts
              porCategoria={stats.porCategoria}
              porUnidade={stats.porUnidade}
            />
          </>
        ) : (
          <LoadingState texto="Carregando estatísticas..." />
        )}

        <DashboardRecentes chamados={chamadosFiltrados} />
      </div>
    </ChamadosLayout>
  )
}
