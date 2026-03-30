'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Send, Inbox } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamados } from '@/lib/chamados/hooks/useChamados'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import ChamadoCard from '@/components/chamados/cards/ChamadoCard'
import ChamadoFiltersComponent from '@/components/chamados/forms/ChamadoFilters'
import LoadingState from '@/components/chamados/shared/LoadingState'
import EmptyState from '@/components/chamados/shared/EmptyState'
import WelcomeBanner from '@/components/chamados/shared/WelcomeBanner'

type AbaType = 'abertos' | 'atribuidos'

export default function MeusChamadosPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const [aba, setAba] = useState<AbaType>('abertos')

  // Chamados abertos por mim (solicitante)
  const {
    chamados: chamadosAbertos,
    loading: loadingAbertos,
    hasMore: hasMoreAbertos,
    filtros: filtrosAbertos,
    setFiltros: setFiltrosAbertos,
    carregarMais: carregarMaisAbertos,
  } = useChamados(usuario?.email)

  // Chamados atribuídos a mim (técnico/gestor)
  const {
    chamados: chamadosAtribuidos,
    loading: loadingAtribuidos,
    hasMore: hasMoreAtribuidos,
    filtros: filtrosAtribuidos,
    setFiltros: setFiltrosAtribuidos,
    carregarMais: carregarMaisAtribuidos,
  } = useChamados(undefined, usuario?.uid)

  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  const chamados = aba === 'abertos' ? chamadosAbertos : chamadosAtribuidos
  const loading = aba === 'abertos' ? loadingAbertos : loadingAtribuidos
  const hasMore = aba === 'abertos' ? hasMoreAbertos : hasMoreAtribuidos
  const filtros = aba === 'abertos' ? filtrosAbertos : filtrosAtribuidos
  const setFiltros = aba === 'abertos' ? setFiltrosAbertos : setFiltrosAtribuidos
  const carregarMais = aba === 'abertos' ? carregarMaisAbertos : carregarMaisAtribuidos

  const showAbas = usuario.role !== 'solicitante'

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="MEUS CHAMADOS"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="space-y-6">
        {/* Welcome Banner for new users */}
        <WelcomeBanner
          nomeUsuario={usuario.nome}
          role={usuario.role}
          totalChamados={chamadosAbertos.length + chamadosAtribuidos.length}
        />

        {/* Abas */}
        {showAbas && (
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
            <button
              onClick={() => setAba('abertos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === 'abertos'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Send className="w-4 h-4" />
              Abertos por mim
              {chamadosAbertos.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  aba === 'abertos' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {chamadosAbertos.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAba('atribuidos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === 'atribuidos'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Atribuidos a mim
              {chamadosAtribuidos.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  aba === 'atribuidos' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {chamadosAtribuidos.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <ChamadoFiltersComponent filtros={filtros} onChange={setFiltros} />
          <button
            onClick={() => router.push('/chamados/novo')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Chamado
          </button>
        </div>

        {/* List */}
        {loading && chamados.length === 0 ? (
          <LoadingState texto="Carregando chamados..." />
        ) : chamados.length === 0 ? (
          <EmptyState
            titulo={aba === 'abertos' ? 'Nenhum chamado aberto por voce' : 'Nenhum chamado atribuido a voce'}
            descricao={aba === 'abertos'
              ? 'Voce ainda nao abriu nenhum chamado. Clique no botao acima para abrir um novo.'
              : 'Nenhum chamado foi direcionado para voce ainda.'}
            acao={aba === 'abertos' ? { label: 'Abrir Chamado', onClick: () => router.push('/chamados/novo') } : undefined}
          />
        ) : (
          <>
            <div className="grid gap-4">
              {chamados.map(chamado => (
                <ChamadoCard key={chamado.id} chamado={chamado} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={carregarMais}
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Carregando...' : 'Carregar mais'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ChamadosLayout>
  )
}
