'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, ArrowLeft, CheckCircle, RotateCcw, FileText, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ARTE_UNIDADES, TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { ArteUnidadeType, DesignRequest, DesignRequestType, DestinationType, Requester } from '@/lib/arte/types'
import { getOrCreateDeviceId } from '@/lib/arte/utils/deviceId'

export default function RevisarEntregaPage() {
  const router = useRouter()
  const params = useParams()
  const unidade = params.unidade as ArteUnidadeType
  const requestId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [request, setRequest] = useState<DesignRequest | null>(null)
  const [action, setAction] = useState<'aprovado' | 'ajuste-solicitado' | ''>('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const deviceId = getOrCreateDeviceId()
        const reqRes = await fetch(`/api/arte/requesters?deviceId=${encodeURIComponent(deviceId)}`)
        const reqData = await reqRes.json()

        if (!reqData.requester || reqData.requester.isBlocked) {
          router.replace(`/arte/${unidade}`)
          return
        }
        setRequester(reqData.requester as Requester)

        const pedidoRes = await fetch(`/api/arte/requests/${requestId}`)
        if (!pedidoRes.ok) {
          router.replace(`/arte/${unidade}/meus-pedidos`)
          return
        }
        const pedidoData = await pedidoRes.json()

        if (pedidoData.requesterId !== reqData.requester.id) {
          router.replace(`/arte/${unidade}/meus-pedidos`)
          return
        }

        setRequest(pedidoData as DesignRequest)
      } catch {
        router.replace(`/arte/${unidade}/meus-pedidos`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, unidade, requestId])

  const handleSubmit = async () => {
    if (!action) {
      toast.error('Escolha aprovar ou pedir ajuste')
      return
    }

    if (action === 'ajuste-solicitado' && !feedback.trim()) {
      toast.error('Descreva o que precisa ser ajustado')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/arte/requests/${requestId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          feedback: action === 'ajuste-solicitado' ? feedback.trim() : undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao enviar revisão')
      }

      if (action === 'aprovado') {
        toast.success('Arte aprovada! Obrigado!')
      } else {
        toast.success('Ajuste solicitado. O designer será notificado.')
      }

      router.push(`/arte/${unidade}/pedido/${requestId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar revisão')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!request || !requester) return null

  const tipo = TIPOS_ARTE[request.type as DesignRequestType]
  const lastDelivery = request.deliveries?.length > 0 ? request.deliveries[request.deliveries.length - 1] : null

  if (!lastDelivery || lastDelivery.reviewStatus !== 'aguardando') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Não há entrega pendente de revisão</p>
          <button
            onClick={() => router.push(`/arte/${unidade}/pedido/${requestId}`)}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Ver pedido
          </button>
        </div>
      </div>
    )
  }

  const deliveredAt = lastDelivery.deliveredAt && typeof lastDelivery.deliveredAt === 'object' && 'seconds' in lastDelivery.deliveredAt
    ? new Date((lastDelivery.deliveredAt as { seconds: number }).seconds * 1000)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push(`/arte/${unidade}/pedido/${requestId}`)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900">Revisar entrega</p>
            <p className="text-xs text-gray-500">Pedido #{request.requestNumber} — {tipo?.label}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <p className="text-sm font-bold text-gray-900">Versão {lastDelivery.version}</p>
            </div>
            {deliveredAt && (
              <p className="text-xs text-gray-400">
                Entregue em {format(deliveredAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>

          {/* Destinos solicitados */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Destinos solicitados</p>
            <div className="flex flex-wrap gap-1.5">
              {request.destinations?.map(d => (
                <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  {DESTINOS[d as DestinationType]?.emoji} {DESTINOS[d as DestinationType]?.label}
                </span>
              ))}
            </div>
          </div>

          {/* Files */}
          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Arquivos entregues</p>
          <div className="space-y-2">
            {lastDelivery.files?.map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                  {file.sizeBytes && (
                    <p className="text-xs text-gray-400">{(file.sizeBytes / 1024).toFixed(0)} KB</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  Ver
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Previous versions */}
        {request.deliveries && request.deliveries.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Versões anteriores
            </p>
            <div className="space-y-2">
              {request.deliveries.slice(0, -1).reverse().map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-xs text-gray-600">Versão {d.version}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    d.reviewStatus === 'aprovado' ? 'bg-green-100 text-green-700' :
                    d.reviewStatus === 'ajuste-solicitado' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {d.reviewStatus === 'aprovado' ? 'Aprovado' :
                     d.reviewStatus === 'ajuste-solicitado' ? 'Ajuste solicitado' : 'Aguardando'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm font-bold text-gray-900 mb-1">O que achou da arte?</p>
          <p className="text-xs text-gray-500 mb-5">Escolha uma das opções abaixo</p>

          <div className="space-y-3 mb-5">
            <button
              type="button"
              onClick={() => setAction('aprovado')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                action === 'aprovado'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-150 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                action === 'aprovado' ? 'bg-green-200' : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-5 h-5 ${action === 'aprovado' ? 'text-green-700' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${action === 'aprovado' ? 'text-green-900' : 'text-gray-900'}`}>
                  Aprovar arte
                </p>
                <p className="text-xs text-gray-400">Está perfeita, pode publicar!</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAction('ajuste-solicitado')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                action === 'ajuste-solicitado'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-150 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                action === 'ajuste-solicitado' ? 'bg-amber-200' : 'bg-gray-100'
              }`}>
                <RotateCcw className={`w-5 h-5 ${action === 'ajuste-solicitado' ? 'text-amber-700' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${action === 'ajuste-solicitado' ? 'text-amber-900' : 'text-gray-900'}`}>
                  Pedir ajuste
                </p>
                <p className="text-xs text-gray-400">Precisa de alguma mudança</p>
              </div>
            </button>
          </div>

          {/* Feedback textarea */}
          {action === 'ajuste-solicitado' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que precisa ser ajustado? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Descreva detalhadamente o que precisa mudar. Ex: trocar a cor de fundo para azul, diminuir a logo..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1">Quanto mais detalhado, melhor!</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!action || submitting || (action === 'ajuste-solicitado' && !feedback.trim())}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${
              action === 'aprovado'
                ? 'bg-green-600 hover:bg-green-700'
                : action === 'ajuste-solicitado'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : action === 'aprovado' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirmar aprovação
              </>
            ) : action === 'ajuste-solicitado' ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Enviar pedido de ajuste
              </>
            ) : (
              'Selecione uma opção acima'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
