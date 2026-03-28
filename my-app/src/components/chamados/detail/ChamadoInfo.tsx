'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Tag, Clock, User, Paperclip } from 'lucide-react'
import { Chamado } from '@/lib/chamados/types'
import { UNIDADES, CATEGORIAS } from '@/lib/chamados/constants'
import { calcularPorcentagemSLA, corSLA } from '@/lib/chamados/utils/sla'
import ChamadoStatusBadge from '../cards/ChamadoStatusBadge'
import ChamadoPrioridadeBadge from '../cards/ChamadoPrioridadeBadge'

interface ChamadoInfoProps {
  chamado: Chamado
}

export default function ChamadoInfo({ chamado }: ChamadoInfoProps) {
  const slaPercent = calcularPorcentagemSLA(chamado.criadoEm, chamado.sla.prazoResolucao)
  const slaInfo = corSLA(slaPercent)
  const showSLA = !['fechado', 'cancelado', 'resolvido'].includes(chamado.status)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      {/* Status & Priority */}
      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Status</p>
        <div className="flex flex-wrap gap-2">
          <ChamadoStatusBadge status={chamado.status} size="md" />
          <ChamadoPrioridadeBadge prioridade={chamado.prioridade} size="md" />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Unidade</p>
            <p className="text-sm font-medium text-gray-900">{UNIDADES[chamado.unidade]?.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Categoria</p>
            <p className="text-sm font-medium text-gray-900">{CATEGORIAS[chamado.categoria]?.label} - {chamado.subcategoria}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Local</p>
            <p className="text-sm font-medium text-gray-900">{chamado.local}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Aberto em</p>
            <p className="text-sm font-medium text-gray-900">
              {chamado.criadoEm && format(chamado.criadoEm.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        {chamado.atribuidoPara && (
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Técnico Responsável</p>
              <p className="text-sm font-medium text-gray-900">{chamado.atribuidoPara.nome}</p>
            </div>
          </div>
        )}
      </div>

      {/* SLA */}
      {showSLA && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">SLA</p>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-sm font-medium ${slaInfo.cor}`}>{slaInfo.label}</span>
            <span className="text-xs text-gray-400">{Math.round(slaPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${slaInfo.bgCor}`}
              style={{ width: `${Math.min(slaPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Resposta: {chamado.sla.prazoResposta && format(chamado.sla.prazoResposta.toDate(), 'dd/MM HH:mm')}</span>
            <span>Resolução: {chamado.sla.prazoResolucao && format(chamado.sla.prazoResolucao.toDate(), 'dd/MM HH:mm')}</span>
          </div>
        </div>
      )}

      {/* Anexos */}
      {chamado.anexos.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Anexos</p>
          <div className="space-y-2">
            {chamado.anexos.map((anexo, i) => (
              <a
                key={i}
                href={anexo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{anexo.nome}</span>
                <span className="text-xs text-gray-400 shrink-0">{(anexo.tamanho / 1024).toFixed(0)}KB</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
