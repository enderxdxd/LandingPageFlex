import { PrioridadeType } from '@/lib/chamados/types'
import { PRIORIDADE_CONFIG } from '@/lib/chamados/constants'

interface ChamadoPrioridadeBadgeProps {
  prioridade: PrioridadeType
  size?: 'sm' | 'md'
}

export default function ChamadoPrioridadeBadge({ prioridade, size = 'sm' }: ChamadoPrioridadeBadgeProps) {
  const config = PRIORIDADE_CONFIG[prioridade]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.color} ${config.bgColor} ${config.borderColor} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${prioridade === 'critica' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  )
}
