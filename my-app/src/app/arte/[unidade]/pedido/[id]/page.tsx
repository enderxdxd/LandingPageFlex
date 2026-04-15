'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, ArrowLeft, Clock, CheckCircle, Cog, Eye, XCircle, MapPin, User, AlertTriangle, FileText, MessageSquare, Send } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ARTE_UNIDADES, STATUS_ARTE, TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { ArteUnidadeType, DesignRequest, DesignRequestType, DestinationType, Requester } from '@/lib/arte/types'
import { getOrCreateDeviceId } from '@/lib/arte/utils/deviceId'

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'novo': <Clock className="w-5 h-5" />,
  'em-producao': <Cog className="w-5 h-5" />,
  'em-revisao': <Eye className="w-5 h-5" />,
  'concluido': <CheckCircle className="w-5 h-5" />,
  'cancelado': <XCircle className="w-5 h-5" />,
}

interface Comment {
  id: string
  authorType: string
  authorName: string
  message: string
  createdAt: { seconds: number }
}

export default function PedidoDetalhePage() {
  const router = useRouter()
  const params = useParams()
  const unidade = params.unidade as ArteUnidadeType
  const requestId = params.id as string

  const [loading, setLoading] = useState(true)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [request, setRequest] = useState<DesignRequest | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [sendingComment, setSendingComment] = useState(false)

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

        // Buscar pedido
        const pedidoRes = await fetch(`/api/arte/requests/${requestId}`)
        if (!pedidoRes.ok) {
          router.replace(`/arte/${unidade}/meus-pedidos`)
          return
        }
        const pedidoData = await pedidoRes.json()

        // Verificar se pertence ao solicitante
        if (pedidoData.requesterId !== reqData.requester.id) {
          router.replace(`/arte/${unidade}/meus-pedidos`)
          return
        }

        setRequest(pedidoData as DesignRequest)

        // Buscar comentários
        const commRes = await fetch(`/api/arte/requests/${requestId}/comments`)
        if (commRes.ok) {
          const commData = await commRes.json()
          setComments(commData.comments || [])
        }
      } catch {
        router.replace(`/arte/${unidade}/meus-pedidos`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, unidade, requestId])

  const handleSendComment = async () => {
    if (!newComment.trim() || !requester) return

    setSendingComment(true)
    try {
      const res = await fetch(`/api/arte/requests/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorType: 'requester',
          authorId: requester.id,
          authorName: requester.name,
          message: newComment.trim(),
        }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()
      setComments(prev => [...prev, data])
      setNewComment('')
    } catch {
      // Erro silencioso
    } finally {
      setSendingComment(false)
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
  const status = STATUS_ARTE[request.status]
  const unidadeLabel = ARTE_UNIDADES[request.unitId as ArteUnidadeType]?.label

  const deadline = request.deadline && typeof request.deadline === 'object' && 'seconds' in request.deadline
    ? new Date((request.deadline as { seconds: number }).seconds * 1000)
    : null
  const createdAt = request.createdAt && typeof request.createdAt === 'object' && 'seconds' in request.createdAt
    ? new Date((request.createdAt as { seconds: number }).seconds * 1000)
    : null

  const isOverdue = deadline ? deadline < new Date() : false
  const lastDelivery = request.deliveries?.length > 0 ? request.deliveries[request.deliveries.length - 1] : null
  const canReview = request.status === 'em-revisao' && lastDelivery?.reviewStatus === 'aguardando'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/arte/${unidade}/meus-pedidos`)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">Pedido #{request.requestNumber}</p>
              <p className="text-xs text-gray-500">{unidadeLabel}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status?.bgColor} ${status?.color} border ${status?.borderColor}`}>
            {STATUS_ICONS[request.status]}
            {status?.label}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Status banner */}
        {canReview && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-purple-800 mb-1">🎨 Arte entregue!</p>
            <p className="text-xs text-purple-600 mb-3">O designer enviou a arte. Revise e aprove ou peça ajustes.</p>
            <button
              onClick={() => router.push(`/arte/${unidade}/pedido/${requestId}/revisar`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              Revisar entrega
            </button>
          </div>
        )}

        {request.status === 'concluido' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-800">Pedido concluído!</p>
            <p className="text-xs text-green-600">Sua arte foi entregue e aprovada.</p>
          </div>
        )}

        {(request.isUrgent || isOverdue) && !['concluido', 'cancelado'].includes(request.status) && (
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${
            isOverdue ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-xs font-medium">
              {isOverdue ? 'O prazo deste pedido já passou' : 'Pedido com prazo curto'}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{tipo?.emoji || '📝'}</span>
            <div>
              <p className="text-base font-bold text-gray-900">{tipo?.label || request.type}</p>
              <p className="text-xs text-gray-500">
                {createdAt && format(createdAt, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Prazo</p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {deadline ? format(deadline, "dd/MM/yyyy") : '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Designer</p>
              <p className="text-sm font-medium text-gray-900">
                {request.assignedToName || 'Aguardando...'}
              </p>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Destinos</p>
            <div className="flex flex-wrap gap-1.5">
              {request.destinations?.map(d => (
                <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  {DESTINOS[d as DestinationType]?.emoji} {DESTINOS[d as DestinationType]?.label}
                </span>
              ))}
            </div>
          </div>

          {request.description && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Observação</p>
              <p className="text-sm text-gray-700">{request.description}</p>
            </div>
          )}
        </div>

        {/* Deliveries */}
        {request.deliveries?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Entregas</p>
            <div className="space-y-3">
              {request.deliveries.map((delivery, i) => {
                const deliveredAt = delivery.deliveredAt && typeof delivery.deliveredAt === 'object' && 'seconds' in delivery.deliveredAt
                  ? new Date((delivery.deliveredAt as { seconds: number }).seconds * 1000)
                  : null

                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700">Versão {delivery.version}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        delivery.reviewStatus === 'aprovado' ? 'bg-green-100 text-green-700' :
                        delivery.reviewStatus === 'ajuste-solicitado' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {delivery.reviewStatus === 'aprovado' ? '✅ Aprovado' :
                         delivery.reviewStatus === 'ajuste-solicitado' ? '🔄 Ajuste solicitado' :
                         '⏳ Aguardando revisão'}
                      </span>
                    </div>
                    {deliveredAt && (
                      <p className="text-[11px] text-gray-400 mb-2">
                        {format(deliveredAt, "dd/MM/yyyy HH:mm")}
                      </p>
                    )}
                    <div className="space-y-1">
                      {delivery.files?.map((file, fi) => (
                        <a
                          key={fi}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {file.fileName}
                        </a>
                      ))}
                    </div>
                    {delivery.feedback && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-800"><strong>Seu feedback:</strong> {delivery.feedback}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mensagens</p>
          </div>

          {comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Nenhuma mensagem ainda</p>
          )}

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments.map(comment => {
              const isMe = comment.authorType === 'requester'
              const commentDate = comment.createdAt
                ? new Date(comment.createdAt.seconds * 1000)
                : null

              return (
                <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    {!isMe && (
                      <p className={`text-[10px] font-semibold mb-0.5 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                        {comment.authorName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{comment.message}</p>
                    {commentDate && (
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {format(commentDate, "HH:mm")}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input */}
          {!['concluido', 'cancelado'].includes(request.status) && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendComment()}
                placeholder="Escreva uma mensagem..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim() || sendingComment}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40"
              >
                {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
