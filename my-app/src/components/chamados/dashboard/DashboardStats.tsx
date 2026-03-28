'use client'

import { AlertCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import ChamadoStatCard from '../cards/ChamadoStatCard'

interface DashboardStatsProps {
  stats: {
    totalAbertos: number
    totalEmAndamento: number
    resolvidosHoje: number
    slaEstourado: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <ChamadoStatCard
        titulo="Abertos"
        valor={stats.totalAbertos}
        icon={AlertCircle}
        cor="blue"
      />
      <ChamadoStatCard
        titulo="Em Andamento"
        valor={stats.totalEmAndamento}
        icon={Clock}
        cor="yellow"
      />
      <ChamadoStatCard
        titulo="Resolvidos Hoje"
        valor={stats.resolvidosHoje}
        icon={CheckCircle}
        cor="green"
      />
      <ChamadoStatCard
        titulo="SLA Estourado"
        valor={stats.slaEstourado}
        icon={AlertTriangle}
        cor="red"
      />
    </div>
  )
}
