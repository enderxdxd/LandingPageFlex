'use client'

import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MessageSquare, ArrowRightLeft, UserPlus, AlertTriangle,
  Paperclip, Star, PlusCircle,
} from 'lucide-react'
import { HistoricoChamado, HistoricoTipo } from '@/lib/chamados/types'

interface ChamadoTimelineProps {
  historico: HistoricoChamado[]
}

const TIPO_CONFIG: Record<HistoricoTipo, { icon: React.ElementType; color: string; bg: string }> = {
  criacao: { icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  comentario: { icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' },
  mudanca_status: { icon: ArrowRightLeft, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  atribuicao: { icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-100' },
  mudanca_prioridade: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  anexo: { icon: Paperclip, color: 'text-green-600', bg: 'bg-green-100' },
  avaliacao: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
}

export default function ChamadoTimeline({ historico }: ChamadoTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />

      <div className="space-y-6">
        {historico.map((item) => {
          const config = TIPO_CONFIG[item.tipo]
          const Icon = config.icon

          return (
            <div key={item.id} className="relative flex gap-4 pl-0">
              {/* Icon */}
              <div className={`relative z-10 w-10 h-10 ${config.bg} rounded-full flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">{item.autor.nome}</span>
                  <span className="text-xs text-gray-400 capitalize">({item.autor.role})</span>
                  <span className="text-xs text-gray-400">
                    {item.criadoEm && format(item.criadoEm.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>

                {item.tipo === 'comentario' ? (
                  <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.dados?.comentario || item.descricao}</p>
                    {item.dados?.anexo && (
                      <a
                        href={item.dados.anexo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Paperclip className="w-3 h-3" />
                        {item.dados.anexo.nome}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{item.descricao}</p>
                )}

                {item.tipo === 'mudanca_status' && item.dados?.de && item.dados?.para && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{item.dados.de}</span>
                    <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">{item.dados.para}</span>
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
