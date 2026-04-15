'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, AlertTriangle, User, MapPin, Palette } from 'lucide-react'
import { format } from 'date-fns'
import { TIPOS_ARTE, ARTE_UNIDADES, COR_UNIDADE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestType, ArteUnidadeType, DestinationType } from '@/lib/arte/types'

interface KanbanCardProps {
  request: DesignRequest
  onClick: () => void
}

export default function KanbanCard({ request, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const tipo = TIPOS_ARTE[request.type as DesignRequestType]
  const unidadeCor = COR_UNIDADE[request.unitId as ArteUnidadeType]
  const unidadeLabel = ARTE_UNIDADES[request.unitId as ArteUnidadeType]?.label

  const deadline = request.deadline && typeof request.deadline === 'object' && 'seconds' in request.deadline
    ? new Date((request.deadline as { seconds: number }).seconds * 1000)
    : null

  const isOverdue = deadline ? deadline < new Date() : false
  const isUrgent = request.isUrgent || isOverdue

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`group bg-white rounded-xl border cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        unidadeCor?.border || 'border-gray-200'
      } border-l-4 ${isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'border-t-gray-200 border-r-gray-200 border-b-gray-200'}`}
    >
      <div className="p-4">
        {/* Top row: number + urgency */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-gray-400 tabular-nums">#{request.requestNumber}</span>
          {isUrgent && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {isOverdue ? 'Atrasado' : 'Urgente'}
            </span>
          )}
        </div>

        {/* Type — primary content */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg leading-none mt-0.5" aria-hidden>{tipo?.emoji || '📝'}</span>
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
            {tipo?.label || request.type}
          </p>
        </div>

        {/* Dynamic summary */}
        {getSummary(request) && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {getSummary(request)}
          </p>
        )}

        {/* Destinations chips */}
        {request.destinations?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {request.destinations.map(d => (
              <span
                key={d}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
              >
                {DESTINOS[d as DestinationType]?.label}
              </span>
            ))}
          </div>
        )}

        {/* Footer: requester, unit */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 gap-2">
          <div className="flex items-center gap-2.5 text-xs text-gray-500 min-w-0">
            <span className="flex items-center gap-1 truncate" title={request.requesterName}>
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{request.requesterName?.split(' ')[0]}</span>
            </span>
            <span className={`flex items-center gap-1 font-medium ${unidadeCor?.text || 'text-gray-500'}`}>
              <MapPin className="w-3 h-3 shrink-0" />
              {unidadeLabel}
            </span>
          </div>
          {deadline && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold shrink-0 tabular-nums ${
                isOverdue ? 'text-rose-600' : 'text-gray-500'
              }`}
            >
              <Clock className="w-3 h-3" />
              {format(deadline, 'dd/MM')}
            </span>
          )}
        </div>

        {/* Assigned indicator */}
        {request.assignedToName && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium truncate">
              {request.assignedToName}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function getSummary(request: DesignRequest): string {
  const f = request.dynamicFields || {}
  switch (request.type) {
    case 'aula-experimental':
      return (f.nomeAula as string) || ''
    case 'escala':
      return (f.periodoVigencia as string) || ''
    case 'evento':
      return (f.nomeEvento as string) || ''
    case 'comunicado':
      return (f.titulo as string) || ''
    case 'promocao':
      return (f.nomePromocao as string) || ''
    case 'aniversariantes':
      return `Mês ${f.mesReferencia || ''}`
    case 'outro':
      return (f.titulo as string) || ''
    default:
      return request.description?.substring(0, 60) || ''
  }
}
