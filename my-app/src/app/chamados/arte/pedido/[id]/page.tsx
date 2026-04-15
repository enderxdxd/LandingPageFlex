'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, Eye, AlertTriangle, FileText, MessageCircle, Send, Download, Clock, User, Palette, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast, { Toaster } from 'react-hot-toast'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { TIPOS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestType, DestinationType, Requester } from '@/lib/arte/types'
import StatusBadge from '@/components/arte/shared/StatusBadge'

interface Comment {
  id: string
  authorType: string
  authorName: string
  message: string
  createdAt: { seconds: number }
}

export default function PedidoDetalheProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const requestId = params.id as string
  const isSucesso = searchParams.get('sucesso') === '1'
  const numeroSucesso = searchParams.get('numero')

  const [loading, setLoading] = useState(true)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [request, setRequest] = useState<DesignRequest | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [sendingComment, setSendingComment] = useState(false)

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario) return

    async function load() {
      try {
        const unitId = usuario!.unidades?.[0] || 'alphaville'
        const reqRes = await fetch('/api/arte/requesters/by-uid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: usuario!.uid, name: usuario!.nome, phone: usuario!.telefone || '', role: 'outro', unitId }),
        })
        if (reqRes.ok) {
          const data = await reqRes.json()
          setRequester(data as Requester)
        }

        const pedidoRes = await fetch(`/api/arte/requests/${requestId}`)
        if (!pedidoRes.ok) {
          router.replace('/chamados/arte/meus-pedidos')
          return
        }
        const pedidoData = await pedidoRes.json()
        setRequest(pedidoData as DesignRequest)

        const commRes = await fetch(`/api/arte/requests/${requestId}/comments`)
        if (commRes.ok) {
          const commData = await commRes.json()
          setComments(commData.comments || [])
        }
      } catch {
        router.replace('/chamados/arte/meus-pedidos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [usuario, requestId, router])

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
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSendingComment(false)
    }
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo={request ? `PEDIDO #${request.requestNumber}` : 'PEDIDO DE ARTE'}
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => router.push('/chamados/arte/meus-pedidos')}
          className="inline-flex items-center gap-1.5 -ml-1 mb-4 px-2 min-h-9 text-sm font-medium text-gray-600 hover:text-blue-700 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Meus pedidos
        </button>

        {loading ? (
          <div className="space-y-4">
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : !request ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">Pedido não encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success banner */}
            {isSucesso && (
              <div
                role="status"
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-emerald-900 mb-1 tracking-tight">Pedido #{numeroSucesso} criado!</h2>
                <p className="text-sm text-emerald-700">O designer foi notificado e vai começar em breve.</p>
              </div>
            )}

            {/* Review CTA */}
            {(() => {
              const lastDelivery = request.deliveries?.length > 0 ? request.deliveries[request.deliveries.length - 1] : null
              const canReview = request.status === 'em-revisao' && lastDelivery?.reviewStatus === 'aguardando'
              if (!canReview) return null
              return (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-purple-900">Arte entregue!</p>
                      <p className="text-sm text-purple-700 mt-0.5">O designer enviou a arte. Revise e aprove ou peça ajustes.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/chamados/arte/pedido/${requestId}/revisar`)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 min-h-11 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 active:bg-purple-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                  >
                    <Eye className="w-4 h-4" />
                    Revisar entrega
                  </button>
                </div>
              )
            })()}

            {request.status === 'concluido' && !isSucesso && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-emerald-900">Pedido concluído!</p>
                  <p className="text-sm text-emerald-700">Sua arte está pronta.</p>
                </div>
              </div>
            )}

            {(request.isUrgent || (request.deadline && typeof request.deadline === 'object' && 'seconds' in request.deadline && new Date((request.deadline as { seconds: number }).seconds * 1000) < new Date())) && !['concluido', 'cancelado'].includes(request.status) && (
              <div role="alert" className="flex items-start gap-3 p-3.5 rounded-xl border bg-amber-50 border-amber-200 text-amber-800">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Prazo curto ou atrasado</p>
                  <p className="text-xs opacity-90 mt-0.5">Seu pedido está com prioridade.</p>
                </div>
              </div>
            )}

            {/* Info */}
            {(() => {
              const tipo = TIPOS_ARTE[request.type as DesignRequestType]
              const deadline = request.deadline && typeof request.deadline === 'object' && 'seconds' in request.deadline
                ? new Date((request.deadline as { seconds: number }).seconds * 1000) : null
              const createdAt = request.createdAt && typeof request.createdAt === 'object' && 'seconds' in request.createdAt
                ? new Date((request.createdAt as { seconds: number }).seconds * 1000) : null
              const isOverdue = deadline ? deadline < new Date() : false

              return (
                <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-3xl leading-none mt-0.5 shrink-0" aria-hidden>{tipo?.emoji || '📝'}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-400 tabular-nums">#{request.requestNumber}</span>
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{tipo?.label || request.type}</h1>
                        {createdAt && (
                          <p className="text-xs text-gray-500 mt-1 tabular-nums">
                            {format(createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={request.status} size="sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Prazo
                      </p>
                      <p className={`text-sm font-bold tabular-nums ${isOverdue ? 'text-rose-600' : 'text-gray-900'}`}>
                        {deadline ? format(deadline, 'dd/MM/yyyy') : '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        Designer
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {request.assignedToName || 'Aguardando...'}
                      </p>
                    </div>
                  </div>

                  {request.destinations?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Destinos</p>
                      <div className="flex flex-wrap gap-2">
                        {request.destinations.map(d => (
                          <span
                            key={d}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                          >
                            {DESTINOS[d as DestinationType]?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.description && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Observação</p>
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl border border-gray-100 p-4">
                        {request.description}
                      </p>
                    </div>
                  )}
                </section>
              )
            })()}

            {/* Deliveries */}
            {request.deliveries?.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Entregas</h2>
                <div className="space-y-3">
                  {request.deliveries.map((delivery, i) => {
                    const deliveredAt = delivery.deliveredAt && typeof delivery.deliveredAt === 'object' && 'seconds' in delivery.deliveredAt
                      ? new Date((delivery.deliveredAt as { seconds: number }).seconds * 1000) : null
                    const reviewConfig = {
                      aprovado: { label: 'Aprovado', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
                      'ajuste-solicitado': { label: 'Ajuste solicitado', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
                      aguardando: { label: 'Aguardando revisão', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Clock },
                    }[delivery.reviewStatus as 'aprovado' | 'ajuste-solicitado' | 'aguardando'] || { label: delivery.reviewStatus, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: Clock }
                    const ReviewIcon = reviewConfig.icon

                    return (
                      <article key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <span className="text-sm font-bold text-gray-900 tabular-nums">Versão {delivery.version}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${reviewConfig.bg} ${reviewConfig.text} ${reviewConfig.border}`}>
                            <ReviewIcon className="w-3 h-3" />
                            {reviewConfig.label}
                          </span>
                        </div>
                        {deliveredAt && (
                          <p className="text-xs text-gray-500 mb-3 tabular-nums">
                            Entregue em {format(deliveredAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                        <div className="space-y-3">
                          {delivery.files?.map((file, fi) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.fileName)

                            return isImage ? (
                              <div key={fi} className="space-y-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={file.url}
                                    alt={file.fileName}
                                    className="w-full object-contain max-h-[400px] bg-white hover:opacity-95 transition-opacity"
                                  />
                                </a>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-gray-500 truncate flex-1">{file.fileName}</span>
                                  <a
                                    href={file.url}
                                    download={file.fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 min-h-9 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    Baixar
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div key={fi} className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span className="text-sm text-gray-700 font-medium truncate">{file.fileName}</span>
                                </div>
                                <a
                                  href={file.url}
                                  download={file.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 min-h-9 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Baixar
                                </a>
                              </div>
                            )
                          })}
                        </div>
                        {delivery.feedback && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Seu feedback</p>
                            <p className="text-sm text-amber-900 leading-relaxed">{delivery.feedback}</p>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Comments */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Mensagens {comments.length > 0 && <span className="text-gray-400 tabular-nums">({comments.length})</span>}
                </h2>
              </div>

              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Nenhuma mensagem ainda. Envie uma mensagem para o designer.</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                  {comments.map(comment => {
                    const isMe = comment.authorType === 'requester'
                    const commentDate = comment.createdAt ? new Date(comment.createdAt.seconds * 1000) : null

                    return (
                      <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          {!isMe && (
                            <p className="text-xs font-semibold mb-0.5 text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {comment.authorName}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                          {commentDate && (
                            <p className={`text-xs mt-1 tabular-nums ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              {format(commentDate, 'HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {!['concluido', 'cancelado'].includes(request.status) && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendComment()}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 px-4 min-h-11 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors"
                  />
                  <button
                    onClick={handleSendComment}
                    disabled={!newComment.trim() || sendingComment}
                    className="inline-flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label="Enviar mensagem"
                  >
                    {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </ChamadosLayout>
  )
}
