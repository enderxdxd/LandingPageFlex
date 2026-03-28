'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, UserPlus, AlertTriangle } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamado } from '@/lib/chamados/hooks/useChamado'
import { atribuirTecnico, atualizarPrioridade } from '@/lib/chamados/services/chamadoService'
import { ChamadoUsuario, PrioridadeType } from '@/lib/chamados/types'
import { PRIORIDADE_CONFIG } from '@/lib/chamados/constants'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import ChamadoTimeline from '@/components/chamados/detail/ChamadoTimeline'
import ChamadoInfo from '@/components/chamados/detail/ChamadoInfo'
import ChamadoAcoes from '@/components/chamados/detail/ChamadoAcoes'
import ComentarioForm from '@/components/chamados/forms/ComentarioForm'
import LoadingState from '@/components/chamados/shared/LoadingState'

export default function AdminChamadoDetalhePage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const params = useParams()
  const chamadoId = params.id as string
  const { chamado, historico, loading } = useChamado(chamadoId)
  const router = useRouter()

  const [tecnicos, setTecnicos] = useState<ChamadoUsuario[]>([])
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState('')
  const [novaPrioridade, setNovaPrioridade] = useState<PrioridadeType | ''>('')

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  // Carregar lista de técnicos
  useEffect(() => {
    async function carregarTecnicos() {
      const q = query(
        collection(db, 'chamados_usuarios'),
        where('role', 'in', ['tecnico', 'admin', 'gestor']),
        where('ativo', '==', true)
      )
      const snap = await getDocs(q)
      setTecnicos(snap.docs.map(d => ({ ...d.data(), uid: d.id } as ChamadoUsuario)))
    }
    if (usuario) carregarTecnicos()
  }, [usuario])

  const handleAtribuir = async () => {
    if (!tecnicoSelecionado || !usuario || !chamado) return
    const tecnico = tecnicos.find(t => t.uid === tecnicoSelecionado)
    if (!tecnico) return

    try {
      await atribuirTecnico(chamadoId, { uid: tecnico.uid, nome: tecnico.nome, email: tecnico.email }, usuario)
      toast.success(`Atribuído a ${tecnico.nome}`)
      setTecnicoSelecionado('')
    } catch {
      toast.error('Erro ao atribuir técnico')
    }
  }

  const handlePrioridade = async () => {
    if (!novaPrioridade || !usuario) return
    try {
      await atualizarPrioridade(chamadoId, novaPrioridade, usuario)
      toast.success('Prioridade atualizada')
      setNovaPrioridade('')
    } catch {
      toast.error('Erro ao alterar prioridade')
    }
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo={chamado ? `${chamado.protocolo} (Admin)` : 'CHAMADO'}
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{chamado.titulo}</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{chamado.descricao}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Timeline</h3>
              <ChamadoTimeline historico={historico} />
            </div>

            {!['fechado', 'cancelado'].includes(chamado.status) && (
              <ComentarioForm chamadoId={chamadoId} usuario={usuario} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ChamadoInfo chamado={chamado} />

            {/* Atribuir Técnico */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-3.5 h-3.5" />
                Atribuir Técnico
              </p>
              <div className="flex gap-2">
                <select
                  value={tecnicoSelecionado}
                  onChange={(e) => setTecnicoSelecionado(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300"
                >
                  <option value="">Selecionar...</option>
                  {tecnicos.map(t => (
                    <option key={t.uid} value={t.uid}>{t.nome}</option>
                  ))}
                </select>
                <button
                  onClick={handleAtribuir}
                  disabled={!tecnicoSelecionado}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Atribuir
                </button>
              </div>
            </div>

            {/* Alterar Prioridade */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Alterar Prioridade
              </p>
              <div className="flex gap-2">
                <select
                  value={novaPrioridade}
                  onChange={(e) => setNovaPrioridade(e.target.value as PrioridadeType)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300"
                >
                  <option value="">Selecionar...</option>
                  {(Object.entries(PRIORIDADE_CONFIG) as [PrioridadeType, { label: string }][]).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                <button
                  onClick={handlePrioridade}
                  disabled={!novaPrioridade}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  Alterar
                </button>
              </div>
            </div>

            <ChamadoAcoes chamado={chamado} usuario={usuario} />
          </div>
        </div>
      )}
    </ChamadosLayout>
  )
}
