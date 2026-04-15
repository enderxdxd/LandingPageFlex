'use client'

import { Check } from 'lucide-react'
import { DESTINOS } from '@/lib/arte/constants'
import type { DestinationType } from '@/lib/arte/types'

interface WizardStep2DestinosProps {
  selected: DestinationType[]
  onChange: (destinations: DestinationType[]) => void
  onNext: () => void
  onBack: () => void
}

export default function WizardStep2Destinos({ selected, onChange, onNext, onBack }: WizardStep2DestinosProps) {
  const toggle = (dest: DestinationType) => {
    if (selected.includes(dest)) {
      onChange(selected.filter(d => d !== dest))
    } else {
      onChange([...selected, dest])
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Onde a arte vai ser usada?</h2>
        <p className="text-sm text-gray-500">Selecione todos os lugares onde vai precisar da arte (pelo menos 1)</p>
      </div>

      <div className="space-y-2.5 mb-8">
        {(Object.entries(DESTINOS) as [DestinationType, typeof DESTINOS[DestinationType]][]).map(([key, val]) => {
          const isSelected = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-150 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl shrink-0">{val.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                  {val.label}
                </p>
                <p className="text-xs text-gray-400">{val.proporcao} — {val.resolucao}</p>
              </div>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                isSelected
                  ? 'border-blue-500 bg-blue-600'
                  : 'border-gray-200 bg-white'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
