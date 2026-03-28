'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { XCircle, CheckCircle, Clock, Play, Pause, Loader2 } from 'lucide-react'
import { Chamado, ChamadoUsuario, StatusType } from '@/lib/chamados/types'
import { atualizarStatus } from '@/lib/chamados/services/chamadoService'
import { podeCancelarChamado, podeAlterarStatus } from '@/lib/chamados/utils/permissions'
import ConfirmModal from '@/components/chamados/shared/ConfirmModal'

interface ChamadoAcoesProps {
  chamado: Chamado
  usuario: ChamadoUsuario
}

export default function ChamadoAcoes({ chamado, usuario }: ChamadoAcoesProps) {
  const [loading, setLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  const canCancel = podeCancelarChamado(usuario, chamado)
  const canChangeStatus = podeAlterarStatus(usuario, chamado)

  const alterarStatus = async (novoStatus: StatusType) => {
    setLoading(true)
    try {
      await atualizarStatus(chamado.id, novoStatus, usuario)
      toast.success(`Status alterado para "${novoStatus}"`)
    } catch (err) {
      toast.error('Erro ao alterar status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    await alterarStatus('cancelado')
    setShowCancel(false)
  }

  if (!canChangeStatus && !canCancel) return null

  const isFinal = ['fechado', 'cancelado'].includes(chamado.status)
  if (isFinal) return null

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Ações</p>
        <div className="space-y-2">
          {canChangeStatus && (
            <>
              {chamado.status === 'aberto' && (
                <button
                  onClick={() => alterarStatus('em_andamento')}
                  disabled={loading}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Iniciar Atendimento
                </button>
              )}

              {chamado.status === 'em_andamento' && (
                <>
                  <button
                    onClick={() => alterarStatus('aguardando')}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                    Aguardando Informação
                  </button>
                  <button
                    onClick={() => alterarStatus('resolvido')}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Marcar como Resolvido
                  </button>
                </>
              )}

              {chamado.status === 'aguardando' && (
                <button
                  onClick={() => alterarStatus('em_andamento')}
                  disabled={loading}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Retomar Atendimento
                </button>
              )}

              {chamado.status === 'resolvido' && (
                <button
                  onClick={() => alterarStatus('fechado')}
                  disabled={loading}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  Fechar Chamado
                </button>
              )}
            </>
          )}

          {canCancel && chamado.status === 'aberto' && (
            <button
              onClick={() => setShowCancel(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancelar Chamado
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        titulo="Cancelar Chamado"
        descricao="Tem certeza que deseja cancelar este chamado? Esta ação não pode ser desfeita."
        confirmLabel="Cancelar Chamado"
        variant="danger"
        loading={loading}
      />
    </>
  )
}
