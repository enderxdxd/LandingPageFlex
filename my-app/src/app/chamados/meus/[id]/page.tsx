'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, MapPin, User, Calendar, Hash } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamado } from '@/lib/chamados/hooks/useChamado'
import { UNIDADES } from '@/lib/chamados/constants'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import ChamadoTimeline from '@/components/chamados/detail/ChamadoTimeline'
import ChamadoInfo from '@/components/chamados/detail/ChamadoInfo'
import ChamadoAcoes from '@/components/chamados/detail/ChamadoAcoes'
import ChamadoStatusStepper from '@/components/chamados/detail/ChamadoStatusStepper'
import ComentarioForm from '@/components/chamados/forms/ComentarioForm'
import ChamadoStatusBadge from '@/components/chamados/cards/ChamadoStatusBadge'
import ChamadoPrioridadeBadge from '@/components/chamados/cards/ChamadoPrioridadeBadge'
import LoadingState from '@/components/chamados/shared/LoadingState'

export default function ChamadoDetalhePage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const params = useParams()
  const chamadoId = params.id as string
  const { chamado, historico, loading } = useChamado(chamadoId)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo={chamado ? chamado.protocolo : 'CHAMADO'}
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Voltar</span>
      </button>

      {loading ? (
        <LoadingState texto="Carregando chamado..." />
      ) : !chamado ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Hash className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Chamado não encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Verifique o link e tente novamente</p>
        </div>
      ) : (
        <>
          {/* Hero Header */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500" />
            <div className="p-5 sm:p-6">
              {/* Protocol + badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Hash className="w-3.5 h-3.5" />
                  {chamado.protocolo}
                </span>
                <ChamadoStatusBadge status={chamado.status} size="md" />
                <ChamadoPrioridadeBadge prioridade={chamado.prioridade} size="md" />
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">
                {chamado.titulo || chamado.descricao.substring(0, 80).trim() + (chamado.descricao.length > 80 ? '...' : '')}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3.5 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {UNIDADES[chamado.unidade]?.label}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {chamado.solicitante.nome}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {chamado.criadoEm && format(chamado.criadoEm.toDate(), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>

          {/* Two-panel layout */}
          <div className="grid xl:grid-cols-[1fr_340px] gap-6">
            {/* Main Content */}
            <div className="space-y-6 min-w-0">
              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Descrição</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{chamado.descricao}</p>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">Histórico</h3>
                <ChamadoTimeline historico={historico} />
              </div>

              {/* Comment Form */}
              {!['fechado', 'cancelado'].includes(chamado.status) && (
                <ComentarioForm chamadoId={chamadoId} usuario={usuario} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <ChamadoStatusStepper status={chamado.status} />
              <ChamadoInfo chamado={chamado} />
              <ChamadoAcoes chamado={chamado} usuario={usuario} />
            </div>
          </div>
        </>
      )}
    </ChamadosLayout>
  )
}
