'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { ChamadoFilters as FilterType, StatusType, CategoriaType, PrioridadeType } from '@/lib/chamados/types'
import { STATUS_CONFIG, CATEGORIAS, PRIORIDADE_CONFIG } from '@/lib/chamados/constants'

interface ChamadoFiltersProps {
  filtros: FilterType
  onChange: (filtros: FilterType) => void
}

export default function ChamadoFilters({ filtros, onChange }: ChamadoFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const update = (key: keyof FilterType, value: string) => {
    onChange({ ...filtros, [key]: value })
  }

  const hasFilters = filtros.status !== 'todos' || filtros.categoria !== 'todos' || filtros.prioridade !== 'todos'
  const activeCount = [filtros.status, filtros.categoria, filtros.prioridade].filter(v => v !== 'todos').length

  const limpar = () => {
    onChange({ status: 'todos', categoria: 'todos', prioridade: 'todos', unidade: 'todos' })
  }

  const filterContent = (
    <>
      {/* Status Pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => update('status', 'todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filtros.status === 'todos' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {(Object.entries(STATUS_CONFIG) as [StatusType, typeof STATUS_CONFIG[StatusType]][])
          .filter(([key]) => key !== 'cancelado')
          .map(([key, val]) => (
          <button
            key={key}
            onClick={() => update('status', key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtros.status === key
                ? `${val.bgColor} ${val.color} border ${val.borderColor}`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Selects */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filtros.categoria || 'todos'}
          onChange={(e) => update('categoria', e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-300"
        >
          <option value="todos">Categoria</option>
          {(Object.entries(CATEGORIAS) as [CategoriaType, { label: string }][]).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        <select
          value={filtros.prioridade || 'todos'}
          onChange={(e) => update('prioridade', e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-300"
        >
          <option value="todos">Prioridade</option>
          {(Object.entries(PRIORIDADE_CONFIG) as [PrioridadeType, { label: string }][]).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={limpar}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>
    </>
  )

  return (
    <div className="w-full">
      {/* Mobile: collapsible toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sm:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="font-medium">Filtros</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile: expanded filters */}
      {mobileOpen && (
        <div className="sm:hidden mt-3 p-4 rounded-xl bg-white border border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {filterContent}
        </div>
      )}

      {/* Desktop: always visible inline */}
      <div className="hidden sm:flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          Filtros:
        </div>
        {filterContent}
      </div>
    </div>
  )
}
