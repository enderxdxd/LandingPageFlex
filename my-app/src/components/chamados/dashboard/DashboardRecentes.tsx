'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight } from 'lucide-react'
import { Chamado } from '@/lib/chamados/types'
import { UNIDADES, CATEGORIAS } from '@/lib/chamados/constants'
import ChamadoStatusBadge from '../cards/ChamadoStatusBadge'
import ChamadoPrioridadeBadge from '../cards/ChamadoPrioridadeBadge'

interface DashboardRecentesProps {
  chamados: Chamado[]
}

export default function DashboardRecentes({ chamados }: DashboardRecentesProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Chamados Recentes</h3>
        <Link href="/chamados/painel" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {chamados.slice(0, 10).map((chamado) => (
          <Link
            key={chamado.id}
            href={`/chamados/painel/${chamado.id}`}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 font-mono">{chamado.protocolo}</span>
                <ChamadoStatusBadge status={chamado.status} />
                <ChamadoPrioridadeBadge prioridade={chamado.prioridade} />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">{chamado.titulo || chamado.descricao?.substring(0, 80)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {UNIDADES[chamado.unidade]?.label}{chamado.categoria ? ` | ${CATEGORIAS[chamado.categoria]?.label}` : ''}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">
                {chamado.criadoEm && formatDistanceToNow(chamado.criadoEm.toDate(), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </Link>
        ))}

        {chamados.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-500">
            Nenhum chamado encontrado
          </div>
        )}
      </div>
    </div>
  )
}
