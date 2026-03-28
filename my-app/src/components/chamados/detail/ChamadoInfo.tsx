'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Tag, Clock, User, Paperclip, Building2, Download } from 'lucide-react'
import { Chamado } from '@/lib/chamados/types'
import { UNIDADES, CATEGORIAS } from '@/lib/chamados/constants'
import { calcularPorcentagemSLA, corSLA } from '@/lib/chamados/utils/sla'
import ChamadoStatusBadge from '../cards/ChamadoStatusBadge'
import ChamadoPrioridadeBadge from '../cards/ChamadoPrioridadeBadge'

interface ChamadoInfoProps {
  chamado: Chamado
}

function InfoRow({ icon: Icon, label, children }: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}

export default function ChamadoInfo({ chamado }: ChamadoInfoProps) {
  const slaPercent = calcularPorcentagemSLA(chamado.criadoEm, chamado.sla.prazoResolucao)
  const slaInfo = corSLA(slaPercent)
  const showSLA = !['fechado', 'cancelado', 'resolvido'].includes(chamado.status)

  const categoriaLabel = chamado.categoria
    ? `${CATEGORIAS[chamado.categoria]?.label || chamado.categoria}${chamado.subcategoria ? ` — ${chamado.subcategoria}` : ''}`
    : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500" />

      <div className="p-5">
        {/* Status & Priority */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <ChamadoStatusBadge status={chamado.status} size="md" />
          <ChamadoPrioridadeBadge prioridade={chamado.prioridade} size="md" />
        </div>
      </div>

      {/* Info Rows */}
      <div className="px-5 pb-2 -mt-1">
        <div className="divide-y divide-gray-100">
          <InfoRow icon={Building2} label="Unidade">
            <p className="text-sm font-medium text-gray-900">{UNIDADES[chamado.unidade]?.label}</p>
          </InfoRow>

          <InfoRow icon={Tag} label="Categoria">
            {categoriaLabel ? (
              <p className="text-sm font-medium text-gray-900">{categoriaLabel}</p>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm font-medium text-amber-600">Aguardando categorização</p>
              </div>
            )}
          </InfoRow>

          {chamado.local && (
            <InfoRow icon={MapPin} label="Local">
              <p className="text-sm font-medium text-gray-900">{chamado.local}</p>
            </InfoRow>
          )}

          <InfoRow icon={Clock} label="Aberto em">
            <p className="text-sm font-medium text-gray-900">
              {chamado.criadoEm && format(chamado.criadoEm.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </InfoRow>

          {chamado.atribuidoPara && (
            <InfoRow icon={User} label="Técnico Responsável">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-600">
                    {chamado.atribuidoPara.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{chamado.atribuidoPara.nome}</p>
              </div>
            </InfoRow>
          )}
        </div>
      </div>

      {/* SLA */}
      {showSLA && (
        <div className="mx-5 mb-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SLA</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              slaPercent >= 90 ? 'bg-red-50 text-red-600' :
              slaPercent >= 70 ? 'bg-amber-50 text-amber-600' :
              'bg-green-50 text-green-600'
            }`}>
              {slaInfo.label} · {Math.round(slaPercent)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                slaPercent >= 90 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                slaPercent >= 70 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                'bg-gradient-to-r from-green-400 to-emerald-500'
              }`}
              style={{ width: `${Math.min(slaPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5">
            <span className="text-[11px] text-gray-400">
              Resposta: {chamado.sla.prazoResposta && format(chamado.sla.prazoResposta.toDate(), 'dd/MM HH:mm')}
            </span>
            <span className="text-[11px] text-gray-400">
              Resolução: {chamado.sla.prazoResolucao && format(chamado.sla.prazoResolucao.toDate(), 'dd/MM HH:mm')}
            </span>
          </div>
        </div>
      )}

      {/* Anexos */}
      {chamado.anexos.length > 0 && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Anexos ({chamado.anexos.length})
          </p>
          <div className="space-y-1.5">
            {chamado.anexos.map((anexo, i) => (
              <a
                key={i}
                href={anexo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-blue-50/60 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  {anexo.tipo.startsWith('image/') ? (
                    <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <Paperclip className="w-3.5 h-3.5 text-red-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors">{anexo.nome}</p>
                  <p className="text-[11px] text-gray-400">{(anexo.tamanho / 1024).toFixed(0)} KB</p>
                </div>
                <Download className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
