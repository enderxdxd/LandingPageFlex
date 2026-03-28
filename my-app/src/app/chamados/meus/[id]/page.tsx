'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamado } from '@/lib/chamados/hooks/useChamado'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import ChamadoTimeline from '@/components/chamados/detail/ChamadoTimeline'
import ChamadoInfo from '@/components/chamados/detail/ChamadoInfo'
import ChamadoAcoes from '@/components/chamados/detail/ChamadoAcoes'
import ComentarioForm from '@/components/chamados/forms/ComentarioForm'
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
      titulo={chamado ? `${chamado.protocolo}` : 'CHAMADO'}
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {loading ? (
        <LoadingState texto="Carregando chamado..." />
      ) : !chamado ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Chamado não encontrado</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{chamado.titulo}</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{chamado.descricao}</p>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Timeline</h3>
              <ChamadoTimeline historico={historico} />
            </div>

            {/* Comment Form */}
            {!['fechado', 'cancelado'].includes(chamado.status) && (
              <ComentarioForm chamadoId={chamadoId} usuario={usuario} />
            )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-4">
            <ChamadoInfo chamado={chamado} />
            <ChamadoAcoes chamado={chamado} usuario={usuario} />
          </div>
        </div>
      )}
    </ChamadosLayout>
  )
}
