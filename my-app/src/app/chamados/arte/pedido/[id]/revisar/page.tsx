'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, CheckCircle, RotateCcw, FileText, Eye, Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestType, DestinationType } from '@/lib/arte/types'

export default function RevisarEntregaProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [request, setRequest] = useState<DesignRequest | null>(null)
  const [action, setAction] = useState<'aprovado' | 'ajuste-solicitado' | ''>('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario) return

    async function load() {
      try {
        const res = await fetch(`/api/arte/requests/${requestId}`)
        if (!res.ok) {
          router.replace('/chamados/arte/meus-pedidos')
          return
        }
        setRequest(await res.json() as DesignRequest)
      } catch {
        router.replace('/chamados/arte/meus-pedidos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [usuario, requestId, router])

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

      toast.success(action === 'aprovado' ? 'Arte aprovada! Obrigado!' : 'Ajuste solicitado.')
      router.push(`/chamados/arte/pedido/${requestId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar revisão')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  const lastDelivery = request?.deliveries?.length ? request.deliveries[request.deliveries.length - 1] : null
  const tipo = request ? TIPOS_ARTE[request.type as DesignRequestType] : null

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="REVISAR ENTREGA"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : !request || !lastDelivery || lastDelivery.reviewStatus !== 'aguardando' ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Não há entrega pendente de revisão</p>
            <button onClick={() => router.push(`/chamados/arte/pedido/${requestId}`)}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">
              Ver pedido
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Delivery info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  <p className="text-sm font-bold text-gray-900">
                    #{request.requestNumber} — {tipo?.label} — Versão {lastDelivery.version}
                  </p>
                </div>
              </div>

              {/* Destinos */}
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
              <div className="space-y-3">
                {lastDelivery.files?.map((file, i) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.fileName)

                  return isImage ? (
                    <div key={i} className="space-y-2">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="w-full rounded-xl border border-gray-200 object-contain max-h-[400px] bg-white cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </a>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 truncate flex-1">{file.fileName}</span>
                        <a
                          href={file.url}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0 ml-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">{file.fileName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <a href={file.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800">
                          <Eye className="w-3.5 h-3.5" /> Ver
                        </a>
                        <a
                          href={file.url}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm font-bold text-gray-900 mb-1">O que achou da arte?</p>
              <p className="text-xs text-gray-500 mb-5">Escolha uma das opções abaixo</p>

              <div className="space-y-3 mb-5">
                <button type="button" onClick={() => setAction('aprovado')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    action === 'aprovado' ? 'border-green-500 bg-green-50' : 'border-gray-150 bg-white hover:border-gray-300'
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action === 'aprovado' ? 'bg-green-200' : 'bg-gray-100'}`}>
                    <CheckCircle className={`w-5 h-5 ${action === 'aprovado' ? 'text-green-700' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${action === 'aprovado' ? 'text-green-900' : 'text-gray-900'}`}>Aprovar arte</p>
                    <p className="text-xs text-gray-400">Está perfeita, pode publicar!</p>
                  </div>
                </button>

                <button type="button" onClick={() => setAction('ajuste-solicitado')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    action === 'ajuste-solicitado' ? 'border-amber-500 bg-amber-50' : 'border-gray-150 bg-white hover:border-gray-300'
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action === 'ajuste-solicitado' ? 'bg-amber-200' : 'bg-gray-100'}`}>
                    <RotateCcw className={`w-5 h-5 ${action === 'ajuste-solicitado' ? 'text-amber-700' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${action === 'ajuste-solicitado' ? 'text-amber-900' : 'text-gray-900'}`}>Pedir ajuste</p>
                    <p className="text-xs text-gray-400">Precisa de alguma mudança</p>
                  </div>
                </button>
              </div>

              {action === 'ajuste-solicitado' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que precisa ser ajustado? <span className="text-red-500">*</span>
                  </label>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Descreva detalhadamente o que precisa mudar..." rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed" />
                </div>
              )}

              <button onClick={handleSubmit}
                disabled={!action || submitting || (action === 'ajuste-solicitado' && !feedback.trim())}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${
                  action === 'aprovado' ? 'bg-green-600 hover:bg-green-700' :
                  action === 'ajuste-solicitado' ? 'bg-amber-600 hover:bg-amber-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}>
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : action === 'aprovado' ? (
                  <><CheckCircle className="w-4 h-4" /> Confirmar aprovação</>
                ) : action === 'ajuste-solicitado' ? (
                  <><RotateCcw className="w-4 h-4" /> Enviar pedido de ajuste</>
                ) : 'Selecione uma opção acima'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ChamadosLayout>
  )
}
