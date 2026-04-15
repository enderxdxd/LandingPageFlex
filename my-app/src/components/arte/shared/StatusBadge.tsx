'use client'

import { Clock, Cog, Eye, CheckCircle2, XCircle } from 'lucide-react'
import type { DesignRequestStatus } from '@/lib/arte/types'

interface StatusBadgeProps {
  status: DesignRequestStatus
  size?: 'sm' | 'md'
  withIcon?: boolean
  className?: string
}

const CONFIG: Record<
  DesignRequestStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    text: string
    bg: string
    border: string
    ring: string
  }
> = {
  novo: {
    label: 'Novo',
    icon: Clock,
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    ring: 'ring-blue-500/20',
  },
  'em-producao': {
    label: 'Em produção',
    icon: Cog,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-500/20',
  },
  'em-revisao': {
    label: 'Em revisão',
    icon: Eye,
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    ring: 'ring-purple-500/20',
  },
  concluido: {
    label: 'Concluído',
    icon: CheckCircle2,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-500/20',
  },
  cancelado: {
    label: 'Cancelado',
    icon: XCircle,
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-500/20',
  },
}

export default function StatusBadge({
  status,
  size = 'md',
  withIcon = true,
  className = '',
}: StatusBadgeProps) {
  const config = CONFIG[status]
  if (!config) return null

  const Icon = config.icon
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5'
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'

  return (
    <span
      className={`inline-flex items-center rounded-lg font-semibold border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {withIcon && <Icon className={iconSize} />}
      {config.label}
    </span>
  )
}

export function getStatusColor(status: DesignRequestStatus) {
  return CONFIG[status]
}
