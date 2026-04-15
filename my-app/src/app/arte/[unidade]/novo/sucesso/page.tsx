'use client'

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Palette } from 'lucide-react'
import type { ArteUnidadeType } from '@/lib/arte/types'

export default function SucessoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const unidade = params.unidade as ArteUnidadeType
  const numero = searchParams.get('numero')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Ícone de sucesso */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pedido #{numero} recebido!
        </h1>

        <p className="text-gray-500 mb-1">
          O designer foi notificado e vai começar em breve.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Você receberá a arte no WhatsApp assim que estiver pronta.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/arte/${unidade}/meus-pedidos`)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            Ver meus pedidos
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push(`/arte/${unidade}/novo`)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <Palette className="w-4 h-4" />
            Fazer outro pedido
          </button>
        </div>
      </div>
    </div>
  )
}
