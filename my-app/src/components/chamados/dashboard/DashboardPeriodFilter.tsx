'use client'

import { CalendarDays } from 'lucide-react'

export type PeriodType = '7d' | '30d' | '90d' | 'all'

interface DashboardPeriodFilterProps {
  periodo: PeriodType
  onChange: (periodo: PeriodType) => void
}

const PERIODS: { key: PeriodType; label: string }[] = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
  { key: 'all', label: 'Todos' },
]

export default function DashboardPeriodFilter({ periodo, onChange }: DashboardPeriodFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <CalendarDays className="w-4 h-4" />
        <span className="hidden sm:inline">Período:</span>
      </div>
      <div className="flex gap-1.5">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              periodo === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function getDateFromPeriod(periodo: PeriodType): Date | null {
  if (periodo === 'all') return null
  const now = new Date()
  const days = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
  now.setDate(now.getDate() - days)
  now.setHours(0, 0, 0, 0)
  return now
}
