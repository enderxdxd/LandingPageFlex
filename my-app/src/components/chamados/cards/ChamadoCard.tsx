'use client'

import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Chamado } from '@/lib/chamados/types'
import { CATEGORIAS, UNIDADES } from '@/lib/chamados/constants'
import { calcularPorcentagemSLA, corSLA } from '@/lib/chamados/utils/sla'
import ChamadoStatusBadge from './ChamadoStatusBadge'
import ChamadoPrioridadeBadge from './ChamadoPrioridadeBadge'

interface ChamadoCardProps {
  chamado: Chamado
  basePath?: string
}

export default function ChamadoCard({ chamado, basePath = '/chamados/meus' }: ChamadoCardProps) {
  const slaPercent = calcularPorcentagemSLA(chamado.criadoEm, chamado.sla.prazoResolucao)
  const slaInfo = corSLA(slaPercent)
  const showSLA = chamado.status !== 'fechado' && chamado.status !== 'cancelado' && chamado.status !== 'resolvido'

  return (
    <Link href={`${basePath}/${chamado.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <ChamadoStatusBadge status={chamado.status} />
            <ChamadoPrioridadeBadge prioridade={chamado.prioridade} />
          </div>
          <span className="text-xs text-gray-400 font-mono shrink-0">{chamado.protocolo}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {chamado.titulo || chamado.descricao?.substring(0, 80)}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {UNIDADES[chamado.unidade]?.label}
          </span>
          {chamado.categoria ? (
            <span>{CATEGORIAS[chamado.categoria]?.label}</span>
          ) : (
            <span className="text-amber-600">Não categorizado</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">
              {chamado.criadoEm && formatDistanceToNow(chamado.criadoEm.toDate(), { addSuffix: true, locale: ptBR })}
            </span>
          </div>

          {chamado.atribuidoPara && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">{chamado.atribuidoPara.nome.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs text-gray-500">{chamado.atribuidoPara.nome.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* SLA Bar */}
        {showSLA && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium ${slaInfo.cor}`}>SLA: {slaInfo.label}</span>
              <span className="text-xs text-gray-400">{Math.round(slaPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${slaInfo.bgCor}`}
                style={{ width: `${Math.min(slaPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
