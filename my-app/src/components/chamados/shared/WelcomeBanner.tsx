'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, PlusCircle, ListChecks, BarChart3, HelpCircle, Lightbulb } from 'lucide-react'

interface WelcomeBannerProps {
  nomeUsuario: string
  role: string
  totalChamados: number
}

export default function WelcomeBanner({ nomeUsuario, role, totalChamados }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const key = `chamados_welcome_dismissed_${nomeUsuario}`
    if (localStorage.getItem(key) === 'true') {
      setDismissed(true)
    } else {
      setVisible(true)
    }
  }, [nomeUsuario])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => {
      setDismissed(true)
      localStorage.setItem(`chamados_welcome_dismissed_${nomeUsuario}`, 'true')
    }, 300)
  }

  if (dismissed || totalChamados > 3) return null

  const primeiroNome = nomeUsuario.split(' ')[0]

  const steps = [
    {
      icon: PlusCircle,
      title: 'Abra um chamado',
      desc: 'Descreva o problema com detalhes e anexe fotos se necessário.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: ListChecks,
      title: 'Acompanhe o progresso',
      desc: 'Veja o status em tempo real e receba notificações por email.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: BarChart3,
      title: 'Interaja e resolva',
      desc: 'Adicione comentários e acompanhe até a resolução.',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 shadow-sm transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500" />

      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-colors z-10"
        title="Fechar guia"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Bem-vindo ao Sistema de Chamados, {primeiroNome}!
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Veja como funciona em 3 passos simples:
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-100/80"
            >
              <div className={`w-9 h-9 rounded-lg ${step.bg} flex items-center justify-center shrink-0`}>
                <step.icon className={`w-4.5 h-4.5 ${step.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push('/chamados/novo')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm hover:shadow"
          >
            <PlusCircle className="w-4 h-4" />
            Criar Meu Primeiro Chamado
          </button>
          <button
            onClick={handleDismiss}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Entendi, dispensar
          </button>
        </div>
      </div>

      {/* Tooltip hint */}
      <div className="px-5 sm:px-6 py-3 bg-gray-50/50 border-t border-gray-100/80">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          Dica: Passe o mouse sobre os campos do formulário para ver explicações detalhadas.
        </p>
      </div>
    </div>
  )
}
