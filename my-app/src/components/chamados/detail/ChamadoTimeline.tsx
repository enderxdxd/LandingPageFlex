'use client'

import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MessageSquare, ArrowRightLeft, UserPlus, AlertTriangle,
  Paperclip, Star, PlusCircle, Tag,
} from 'lucide-react'
import { HistoricoChamado, HistoricoTipo } from '@/lib/chamados/types'

interface ChamadoTimelineProps {
  historico: HistoricoChamado[]
}

const TIPO_CONFIG: Record<HistoricoTipo, { icon: React.ElementType; color: string; bg: string; ring: string }> = {
  criacao: { icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  comentario: { icon: MessageSquare, color: 'text-slate-600', bg: 'bg-slate-50', ring: 'ring-slate-100' },
  mudanca_status: { icon: ArrowRightLeft, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' },
  atribuicao: { icon: UserPlus, color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-100' },
  mudanca_prioridade: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-100' },
  categorizacao: { icon: Tag, color: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-100' },
  anexo: { icon: Paperclip, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
  avaliacao: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', ring: 'ring-yellow-100' },
}

export default function ChamadoTimeline({ historico }: ChamadoTimelineProps) {
  if (historico.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">Nenhuma atividade registrada</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-3 bottom-3 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />

      <div className="space-y-1">
        {historico.map((item, index) => {
          const config = TIPO_CONFIG[item.tipo]
          const Icon = config.icon
          const isComment = item.tipo === 'comentario'
          const isLast = index === historico.length - 1

          return (
            <div key={item.id} className={`relative flex gap-3.5 ${isComment ? 'py-2' : 'py-2'}`}>
              {/* Icon */}
              <div className={`
                relative z-10 w-[35px] h-[35px] ${config.bg} rounded-full
                flex items-center justify-center shrink-0
                ring-[3px] ${config.ring} ring-offset-0
              `}>
                <Icon className={`w-[15px] h-[15px] ${config.color}`} />
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-1'}`}>
                {/* Header line */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-gray-900">{item.autor.nome}</span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {item.autor.role === 'admin' ? 'Admin' : item.autor.role === 'tecnico' ? 'Técnico' : 'Solicitante'}
                  </span>
                  <span className="text-[11px] text-gray-300">·</span>
                  <span className="text-[11px] text-gray-400" title={
                    item.criadoEm ? format(item.criadoEm.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : ''
                  }>
                    {item.criadoEm && formatDistanceToNow(item.criadoEm.toDate(), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>

                {/* Body */}
                {isComment ? (
                  <div className="mt-2 bg-gray-50/80 rounded-xl rounded-tl-sm p-3.5 border border-gray-100/80 max-w-[90%]">
                    <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {item.dados?.comentario || item.descricao}
                    </p>
                    {item.dados?.anexo && (
                      <a
                        href={item.dados.anexo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Paperclip className="w-3 h-3" />
                        {item.dados.anexo.nome}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{item.descricao}</p>
                )}

                {/* Status change badges */}
                {item.tipo === 'mudanca_status' && item.dados?.de && item.dados?.para && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[11px] rounded-md font-medium">
                      {item.dados.de}
                    </span>
                    <ArrowRightLeft className="w-3 h-3 text-gray-300" />
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] rounded-md font-semibold">
                      {item.dados.para}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
