'use client'

import { Check } from 'lucide-react'
import { TIPOS_ARTE } from '@/lib/arte/constants'
import type { DesignRequestType } from '@/lib/arte/types'

interface WizardStep1TipoProps {
  selected: DesignRequestType | ''
  onSelect: (type: DesignRequestType) => void
}

export default function WizardStep1Tipo({ selected, onSelect }: WizardStep1TipoProps) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Que tipo de arte você precisa?</h2>
        <p className="text-sm text-gray-500 mt-1">Escolha a opção que melhor descreve o que você precisa.</p>
      </div>

      <div
        role="radiogroup"
        aria-label="Tipo de arte"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {(Object.entries(TIPOS_ARTE) as [DesignRequestType, typeof TIPOS_ARTE[DesignRequestType]][]).map(([key, val]) => {
          const isSelected = selected === key
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(key)}
              className={`relative flex items-start gap-3 p-4 rounded-2xl border text-left transition-all min-h-[108px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <span className="text-2xl leading-none mt-0.5 shrink-0" aria-hidden>{val.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold leading-tight mb-1 ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {val.label}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{val.descricao}</p>
              </div>
              {isSelected && (
                <span className="absolute top-3 right-3 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
