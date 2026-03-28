'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import toast from 'react-hot-toast'
import { Chamado, ChamadoUsuario, StatusType } from '@/lib/chamados/types'
import { STATUS_CONFIG, KANBAN_COLUMNS } from '@/lib/chamados/constants'
import { atualizarStatus } from '@/lib/chamados/services/chamadoService'
import ChamadoStatusBadge from '../cards/ChamadoStatusBadge'
import ChamadoPrioridadeBadge from '../cards/ChamadoPrioridadeBadge'

interface DashboardKanbanProps {
  chamados: Chamado[]
  usuario: ChamadoUsuario
  onUpdate: () => void
}

function KanbanCard({ chamado }: { chamado: Chamado }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chamado.id,
    data: { chamado },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
        <ChamadoPrioridadeBadge prioridade={chamado.prioridade} />
        <span className="text-xs text-gray-400 font-mono ml-auto">{chamado.protocolo}</span>
      </div>
      <p className="text-sm font-medium text-gray-900 line-clamp-2">{chamado.titulo || chamado.descricao?.substring(0, 80)}</p>
      {chamado.atribuidoPara && (
        <p className="text-xs text-gray-500 mt-2">{chamado.atribuidoPara.nome.split(' ')[0]}</p>
      )}
    </div>
  )
}

export default function DashboardKanban({ chamados, usuario, onUpdate }: DashboardKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const columns: Record<StatusType, Chamado[]> = {} as Record<StatusType, Chamado[]>
  KANBAN_COLUMNS.forEach(status => {
    columns[status] = chamados.filter(c => c.status === status)
  })

  const activeChamado = activeId ? chamados.find(c => c.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const chamadoId = active.id as string
    const targetStatus = over.id as StatusType

    if (!KANBAN_COLUMNS.includes(targetStatus)) return

    const chamado = chamados.find(c => c.id === chamadoId)
    if (!chamado || chamado.status === targetStatus) return

    try {
      await atualizarStatus(chamadoId, targetStatus, usuario)
      toast.success(`Status alterado para "${STATUS_CONFIG[targetStatus].label}"`)
      onUpdate()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(status => {
          const config = STATUS_CONFIG[status]
          const items = columns[status]

          return (
            <div key={status} id={status} className="flex-shrink-0 w-72">
              <div className={`rounded-t-xl px-4 py-3 border-b-2 ${config.borderColor} ${config.bgColor}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                    {items.length}
                  </span>
                </div>
              </div>

              <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="bg-gray-50 rounded-b-xl p-3 space-y-3 min-h-[200px]">
                  {items.map(chamado => (
                    <KanbanCard key={chamado.id} chamado={chamado} />
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-400">
                      Nenhum chamado
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeChamado && (
          <div className="bg-white rounded-lg border-2 border-blue-300 p-3 shadow-lg w-72">
            <ChamadoPrioridadeBadge prioridade={activeChamado.prioridade} />
            <p className="text-sm font-medium text-gray-900 mt-2">{activeChamado.titulo || activeChamado.descricao?.substring(0, 80)}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
