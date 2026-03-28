'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import NovoChamadoForm from '@/components/chamados/forms/NovoChamadoForm'
import LoadingState from '@/components/chamados/shared/LoadingState'

export default function NovoChamadoPage() {
  const { usuario, loading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !usuario) {
      router.push('/chamados')
    }
  }, [loading, usuario, router])

  if (loading || !usuario) return <LoadingState texto="Carregando..." />

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="NOVO CHAMADO"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <NovoChamadoForm usuario={usuario} />
    </ChamadosLayout>
  )
}
