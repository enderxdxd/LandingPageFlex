'use client'

import { Check, Circle, XCircle } from 'lucide-react'
import { StatusType } from '@/lib/chamados/types'

interface ChamadoStatusStepperProps {
  status: StatusType
}

const STEPS: { key: StatusType; label: string }[] = [
  { key: 'aberto', label: 'Aberto' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'resolvido', label: 'Resolvido' },
  { key: 'fechado', label: 'Fechado' },
]

const STATUS_ORDER: Record<StatusType, number> = {
  aberto: 0,
  em_andamento: 1,
  aguardando: 1,
  resolvido: 2,
  fechado: 3,
  cancelado: -1,
}

export default function ChamadoStatusStepper({ status }: ChamadoStatusStepperProps) {
  const isCancelled = status === 'cancelado'
  const currentIndex = STATUS_ORDER[status] ?? 0

  if (isCancelled) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
        <div className="p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Progresso</p>
          <div className="flex items-center gap-3 p-3 bg-red-50/80 rounded-xl border border-red-200/60">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">Chamado Cancelado</p>
              <p className="text-xs text-red-500 mt-0.5">Este chamado foi cancelado e não está mais ativo.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500" />
      <div className="p-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Progresso</p>

        {/* Desktop stepper (horizontal) */}
        <div className="hidden sm:flex items-center">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isWaiting = status === 'aguardando' && index === 1

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center gap-1.5 relative">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
                    ${isCompleted
                      ? 'bg-green-500 text-white shadow-sm'
                      : isCurrent
                        ? isWaiting
                          ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200 ring-offset-1'
                          : 'bg-blue-100 text-blue-600 ring-2 ring-blue-200 ring-offset-1'
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ${
                    isCompleted ? 'text-green-600' :
                    isCurrent ? (isWaiting ? 'text-amber-600' : 'text-blue-600') :
                    'text-gray-400'
                  }`}>
                    {isWaiting ? 'Aguardando' : step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mt-[-18px]">
                    <div className={`h-0.5 rounded-full transition-all ${
                      index < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile stepper (vertical compact) */}
        <div className="sm:hidden space-y-0">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isWaiting = status === 'aguardando' && index === 1

            return (
              <div key={step.key} className="flex items-start gap-3">
                {/* Line + Circle */}
                <div className="flex flex-col items-center">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? isWaiting
                          ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200'
                          : 'bg-blue-100 text-blue-600 ring-2 ring-blue-200'
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Circle className="w-2 h-2" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-0.5 h-5 ${
                      index < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs font-medium pt-0.5 ${
                  isCompleted ? 'text-green-600' :
                  isCurrent ? (isWaiting ? 'text-amber-600' : 'text-blue-600') :
                  'text-gray-400'
                }`}>
                  {isWaiting ? 'Aguardando' : step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
