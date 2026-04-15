'use client'

import { useState, useCallback, useEffect } from 'react'
import { X, Clock, User, MapPin, Upload, Send, Loader2, AlertTriangle, CheckCircle, FileText, Image as ImageIcon, ExternalLink, Download, Palette, Package, MessageCircle, Check } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { TIPOS_ARTE, ARTE_UNIDADES, STATUS_ARTE, DESTINOS } from '@/lib/arte/constants'
import type { DesignRequest, DesignRequestType, ArteUnidadeType, DestinationType } from '@/lib/arte/types'
import StatusBadge from '@/components/arte/shared/StatusBadge'

type SerializedTimestamp =
  | Date
  | string
  | number
  | {
      seconds?: number
      _seconds?: number
      toDate?: () => Date
    }

function parseDate(value: SerializedTimestamp | null | undefined): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'number' || typeof value === 'string') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value.toDate === 'function') {
    const date = value.toDate()
    return Number.isNaN(date.getTime()) ? null : date
  }

  const seconds = value.seconds ?? value._seconds
  if (typeof seconds !== 'number') return null

  const date = new Date(seconds * 1000)
  return Number.isNaN(date.getTime()) ? null : date
}

interface RequestDrawerProps {
  request: DesignRequest | null
  onClose: () => void
  currentUserId: string
  currentUserName: string
  currentUserRole?: string
  onRefresh: () => void
}

export default function RequestDrawer({ request, onClose, currentUserId, currentUserName, currentUserRole, onRefresh }: RequestDrawerProps) {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'entrega' | 'historico' | 'chat'>('detalhes')
  const [uploading, setUploading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([])
  const [reviewing, setReviewing] = useState(false)
  const [reviewFeedback, setReviewFeedback] = useState('')
  const [comments, setComments] = useState<{ id: string; authorId: string; authorType: string; authorName: string; message: string; createdAt?: SerializedTimestamp }[]>([])
  const [newComment, setNewComment] = useState('')
  const [sendingComment, setSendingComment] = useState(false)

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (!request || activeTab !== 'chat') return
    async function loadComments() {
      try {
        const res = await fetch(`/api/arte/requests/${request!.id}/comments`)
        if (res.ok) {
          const data = await res.json()
          setComments(data.comments || [])
        }
      } catch { /* ignore */ }
    }
    loadComments()
  }, [request, activeTab])

  const handleSendComment = async () => {
    if (!newComment.trim() || !request) return
    setSendingComment(true)
    try {
      const res = await fetch(`/api/arte/requests/${request.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorType: 'designer',
          authorId: currentUserId,
          authorName: currentUserName,
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

  const onDrop = useCallback((files: File[]) => {
    setDeliveryFiles(prev => [...prev, ...files].slice(0, 10))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 10,
  })

  if (!request) return null

  const tipo = TIPOS_ARTE[request.type as DesignRequestType]
  const unidadeLabel = ARTE_UNIDADES[request.unitId as ArteUnidadeType]?.label

  const deadline = parseDate(request.deadline as SerializedTimestamp)
  const createdAt = parseDate(request.createdAt as SerializedTimestamp)

  const isOverdue = deadline ? deadline < new Date() : false

  const handleAssignToMe = async () => {
    setAssigning(true)
    try {
      const res = await fetch(`/api/arte/requests/${request.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedTo: currentUserId,
          assignedToName: currentUserName,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Pedido atribuído a você!')
      onRefresh()
    } catch {
      toast.error('Erro ao atribuir pedido')
    } finally {
      setAssigning(false)
    }
  }

  const handleDeliver = async () => {
    if (deliveryFiles.length === 0) {
      toast.error('Adicione pelo menos um arquivo')
      return
    }

    setUploading(true)
    try {
      const uploadData = new FormData()
      deliveryFiles.forEach(file => uploadData.append('files', file))
      uploadData.append('folder', `deliveries/v${(request.deliveries?.length || 0) + 1}`)
      uploadData.append('requestId', request.id)

      const uploadRes = await fetch('/api/arte/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (!uploadRes.ok) throw new Error('Erro no upload')
      const uploadResult = await uploadRes.json()

      const res = await fetch(`/api/arte/requests/${request.id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: uploadResult.files.map((f: { url: string; storagePath: string; fileName: string; sizeBytes: number }) => ({
            ...f,
            dimension: 'outro',
          })),
          deliveredBy: currentUserId,
        }),
      })

      if (!res.ok) throw new Error('Erro ao registrar entrega')

      toast.success('Entrega registrada! Solicitante será notificado.')
      setDeliveryFiles([])
      onRefresh()
    } catch {
      toast.error('Erro ao enviar entrega')
    } finally {
      setUploading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/arte/requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Status alterado para "${STATUS_ARTE[newStatus as keyof typeof STATUS_ARTE]?.label}"`)
      onRefresh()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  const waPhone = request.requesterPhone?.replace(/\D/g, '')
  const waLink = waPhone ? `https://wa.me/${waPhone}` : null

  const TABS = [
    { id: 'detalhes' as const, label: 'Detalhes', icon: FileText, count: 0 },
    { id: 'entrega' as const, label: 'Entrega', icon: Package, count: request.deliveries?.length || 0 },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle, count: comments.length },
    { id: 'historico' as const, label: 'Histórico', icon: Clock, count: 0 },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 lg:px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <span className="text-2xl leading-none mt-0.5 shrink-0" aria-hidden>{tipo?.emoji || '📝'}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-gray-400 tabular-nums">#{request.requestNumber}</span>
                  <StatusBadge status={request.status} size="sm" />
                </div>
                <h2 id="drawer-title" className="text-lg font-bold text-gray-900 tracking-tight leading-tight truncate">
                  {tipo?.label}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {unidadeLabel}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          className="flex border-b border-gray-200 px-5 lg:px-6 shrink-0 overflow-x-auto"
        >
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3 min-h-11 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                  isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold tabular-nums ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'detalhes' && (
            <div className="p-5 lg:p-6 space-y-5">
              {/* Urgency banner */}
              {(request.isUrgent || isOverdue) && (
                <div
                  role="alert"
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                    isOverdue
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {isOverdue ? 'Pedido atrasado' : 'Pedido urgente'}
                    </p>
                    <p className="text-xs mt-0.5 opacity-90">
                      {isOverdue ? 'O prazo de entrega já expirou.' : 'Prazo curto — priorize este pedido.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={<User className="w-4 h-4" />} label="Solicitante" value={request.requesterName} />
                <InfoCard icon={<MapPin className="w-4 h-4" />} label="Unidade" value={unidadeLabel || ''} />
                <InfoCard
                  icon={<Clock className="w-4 h-4" />}
                  label="Criado em"
                  value={createdAt ? format(createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR }) : '—'}
                />
                <InfoCard
                  icon={<Clock className="w-4 h-4" />}
                  label="Prazo"
                  value={deadline ? format(deadline, "dd/MM/yyyy", { locale: ptBR }) : '—'}
                  valueClassName={isOverdue ? 'text-rose-600 font-bold' : ''}
                />
              </div>

              {/* WhatsApp */}
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 w-full px-4 min-h-11 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp do solicitante
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </a>
              )}

              {/* Destinations */}
              {request.destinations?.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Destinos</h3>
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
                </section>
              )}

              {/* Dynamic fields */}
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Detalhes do pedido</h3>
                <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                  {Object.entries(request.dynamicFields || {}).map(([key, value]) => {
                    if (!value) return null
                    const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
                    return (
                      <div key={key} className="flex items-start gap-3 px-4 py-2.5">
                        <span className="text-xs font-medium text-gray-500 min-w-[110px] capitalize shrink-0">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-900 flex-1 break-words">{displayValue}</span>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Description */}
              {request.description && (
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Observação</h3>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl border border-gray-100 p-4">
                    {request.description}
                  </p>
                </section>
              )}

              {/* References */}
              {request.referenceImages?.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Referências</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {request.referenceImages.map((img, i) => (
                      <a
                        key={i}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      >
                        <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-sm text-gray-700 truncate flex-1">{img.fileName}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Assigned info */}
              {request.assignedToName && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <Palette className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-blue-600 font-semibold">Designer responsável</p>
                    <p className="text-sm text-blue-900 font-semibold truncate">{request.assignedToName}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {request.status === 'novo' && !request.assignedTo && (
                  <button
                    onClick={handleAssignToMe}
                    disabled={assigning}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 min-h-11 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                    Pegar este pedido
                  </button>
                )}

                {request.status === 'em-producao' && (
                  <button
                    onClick={() => setActiveTab('entrega')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 min-h-11 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <Upload className="w-4 h-4" />
                    Enviar entrega
                  </button>
                )}

                {!['concluido', 'cancelado'].includes(request.status) && (
                  <button
                    onClick={() => handleStatusChange('cancelado')}
                    className="w-full px-4 min-h-10 text-sm font-semibold text-rose-700 rounded-xl hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1"
                  >
                    Cancelar pedido
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'entrega' && (
            <div className="p-5 lg:p-6 space-y-5">
              {/* Previous deliveries */}
              {request.deliveries?.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Entregas anteriores</h3>
                  <div className="space-y-3">
                    {request.deliveries.map((delivery, i) => {
                      const deliveredAt = parseDate(delivery.deliveredAt as SerializedTimestamp)
                      const reviewConfig = {
                        aprovado: { label: 'Aprovado', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
                        'ajuste-solicitado': { label: 'Ajuste solicitado', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
                        aguardando: { label: 'Aguardando revisão', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Clock },
                      }[delivery.reviewStatus as 'aprovado' | 'ajuste-solicitado' | 'aguardando'] || { label: delivery.reviewStatus, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: Clock }
                      const ReviewIcon = reviewConfig.icon

                      return (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
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
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={file.url}
                                      alt={file.fileName}
                                      className="w-full object-contain max-h-[320px] bg-gray-50 hover:opacity-95 transition-opacity"
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
                                <div key={fi} className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
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
                              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Feedback</p>
                              <p className="text-sm text-amber-900 leading-relaxed">{delivery.feedback}</p>
                            </div>
                          )}

                          {/* Admin approve/adjust buttons */}
                          {currentUserRole === 'admin' && delivery.reviewStatus === 'aguardando' && i === (request.deliveries?.length || 0) - 1 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Revisão do admin</p>
                              <textarea
                                value={reviewFeedback}
                                onChange={(e) => setReviewFeedback(e.target.value)}
                                placeholder="Descreva o ajuste necessário (obrigatório para pedir ajuste)..."
                                rows={3}
                                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-colors resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    setReviewing(true)
                                    try {
                                      const res = await fetch(`/api/arte/requests/${request.id}/review`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ action: 'aprovado' }),
                                      })
                                      if (!res.ok) throw new Error()
                                      toast.success('Arte aprovada!')
                                      onRefresh()
                                    } catch {
                                      toast.error('Erro ao aprovar')
                                    } finally {
                                      setReviewing(false)
                                    }
                                  }}
                                  disabled={reviewing}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 min-h-10 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                                >
                                  {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                  Aprovar
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!reviewFeedback.trim()) {
                                      toast.error('Descreva o que precisa ser ajustado')
                                      return
                                    }
                                    setReviewing(true)
                                    try {
                                      const res = await fetch(`/api/arte/requests/${request.id}/review`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ action: 'ajuste-solicitado', feedback: reviewFeedback.trim() }),
                                      })
                                      if (!res.ok) throw new Error()
                                      toast.success('Ajuste solicitado')
                                      setReviewFeedback('')
                                      onRefresh()
                                    } catch {
                                      toast.error('Erro ao solicitar ajuste')
                                    } finally {
                                      setReviewing(false)
                                    }
                                  }}
                                  disabled={reviewing}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 min-h-10 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 active:bg-amber-800 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                                >
                                  {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                                  Pedir ajuste
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* New delivery */}
              {!['concluido', 'cancelado'].includes(request.status) && (
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Nova entrega <span className="text-gray-400 font-semibold">{request.deliveries?.length > 0 ? `(v${request.deliveries.length + 1})` : '(v1)'}</span>
                  </h3>

                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Upload className={`w-6 h-6 ${isDragActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isDragActive ? 'Solte os arquivos aqui' : 'Arraste ou clique para selecionar'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP ou PDF — até 10MB cada</p>
                  </div>

                  {deliveryFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {deliveryFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                          <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-gray-400 tabular-nums">{(file.size / 1024).toFixed(0)} KB</span>
                          <button
                            onClick={() => setDeliveryFiles(prev => prev.filter((_, fi) => fi !== i))}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label={`Remover ${file.name}`}
                          >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={handleDeliver}
                        disabled={uploading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 min-h-11 mt-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar entrega
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-3">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                      <MessageCircle className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Nenhuma mensagem ainda</p>
                    <p className="text-xs text-gray-500 mt-1">Envie a primeira mensagem para o solicitante.</p>
                  </div>
                ) : (
                  comments.map(comment => {
                    const isMe = comment.authorId === currentUserId
                    const commentDate = parseDate(comment.createdAt)
                    return (
                      <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          {!isMe && (
                            <p className="text-xs font-semibold mb-0.5 text-gray-500">
                              {comment.authorName} · {comment.authorType === 'requester' ? 'Solicitante' : 'Designer'}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                          {commentDate && (
                            <p className={`text-xs mt-1 tabular-nums ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              {format(commentDate, "dd/MM HH:mm")}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Input */}
              <div className="px-5 lg:px-6 py-3 border-t border-gray-200 shrink-0 bg-white">
                <div className="flex items-center gap-2">
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
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="p-5 lg:p-6">
              <ol className="relative border-l-2 border-gray-200 ml-3 space-y-5">
                {createdAt && (
                  <TimelineItem
                    icon={<FileText className="w-3.5 h-3.5" />}
                    color="blue"
                    title="Pedido criado"
                    subtitle={`por ${request.requesterName}`}
                    date={format(createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  />
                )}

                {parseDate(request.assignedAt as SerializedTimestamp) && (
                  <TimelineItem
                    icon={<Palette className="w-3.5 h-3.5" />}
                    color="purple"
                    title={`Atribuído para ${request.assignedToName}`}
                    date={format(parseDate(request.assignedAt as SerializedTimestamp)!, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  />
                )}

                {request.deliveries?.map((delivery, i) => {
                  const deliveredAt = parseDate(delivery.deliveredAt as SerializedTimestamp)
                  return (
                    <TimelineItem
                      key={i}
                      icon={<Package className="w-3.5 h-3.5" />}
                      color="amber"
                      title={`Entrega v${delivery.version}`}
                      subtitle={`${delivery.files?.length || 0} arquivo${(delivery.files?.length || 0) !== 1 ? 's' : ''} · ${delivery.reviewStatus}`}
                      date={deliveredAt ? format(deliveredAt, "dd/MM/yyyy HH:mm", { locale: ptBR }) : ''}
                    />
                  )
                })}

                {parseDate(request.completedAt as SerializedTimestamp) && (
                  <TimelineItem
                    icon={<CheckCircle className="w-3.5 h-3.5" />}
                    color="emerald"
                    title="Pedido concluído"
                    date={format(parseDate(request.completedAt as SerializedTimestamp)!, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  />
                )}
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function InfoCard({ icon, label, value, valueClassName }: { icon: React.ReactNode; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-sm font-semibold text-gray-900 tabular-nums ${valueClassName || ''}`}>{value || '—'}</p>
    </div>
  )
}

function TimelineItem({ icon, color, title, subtitle, date }: { icon: React.ReactNode; color: 'blue' | 'purple' | 'amber' | 'emerald'; title: string; subtitle?: string; date: string }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 ring-blue-50',
    purple: 'bg-purple-100 text-purple-700 ring-purple-50',
    amber: 'bg-amber-100 text-amber-700 ring-amber-50',
    emerald: 'bg-emerald-100 text-emerald-700 ring-emerald-50',
  }
  return (
    <li className="ml-4">
      <span className={`absolute -left-[13px] inline-flex items-center justify-center w-6 h-6 rounded-full ring-4 ${colors[color]}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        <p className="text-xs text-gray-400 mt-1 tabular-nums">{date}</p>
      </div>
    </li>
  )
}
