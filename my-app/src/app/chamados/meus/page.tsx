'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { useChamados } from '@/lib/chamados/hooks/useChamados'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import ChamadoCard from '@/components/chamados/cards/ChamadoCard'
import ChamadoFiltersComponent from '@/components/chamados/forms/ChamadoFilters'
import LoadingState from '@/components/chamados/shared/LoadingState'
import EmptyState from '@/components/chamados/shared/EmptyState'
import WelcomeBanner from '@/components/chamados/shared/WelcomeBanner'

export default function MeusChamadosPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const { chamados, loading, hasMore, filtros, setFiltros, carregarMais } = useChamados(usuario?.email)
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
          totalChamados={chamados.length}
        />

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
            titulo="Nenhum chamado encontrado"
            descricao="Você ainda não abriu nenhum chamado. Clique no botão acima para abrir um novo."
            acao={{ label: 'Abrir Chamado', onClick: () => router.push('/chamados/novo') }}
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
