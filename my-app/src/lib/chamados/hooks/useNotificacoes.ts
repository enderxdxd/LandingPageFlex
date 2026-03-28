'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChamadoNotificacao } from '../types'
import { escutarNotificacoes, marcarComoLida, marcarTodasComoLidas } from '../services/notificacaoService'

interface UseNotificacoesReturn {
  notificacoes: ChamadoNotificacao[]
  naoLidas: number
  loading: boolean
  marcarLida: (id: string) => Promise<void>
  marcarTodasLidas: () => Promise<void>
}

export function useNotificacoes(usuarioId: string | undefined): UseNotificacoesReturn {
  const [notificacoes, setNotificacoes] = useState<ChamadoNotificacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false)
      return
    }

    const unsub = escutarNotificacoes(usuarioId, (data) => {
      setNotificacoes(data)
      setLoading(false)
    })

    return () => unsub()
  }, [usuarioId])

  const naoLidas = notificacoes.filter(n => !n.lida).length

  const marcarLida = useCallback(async (id: string) => {
    await marcarComoLida(id)
  }, [])

  const marcarTodasLidas = useCallback(async () => {
    if (!usuarioId) return
    await marcarTodasComoLidas(usuarioId)
  }, [usuarioId])

  return { notificacoes, naoLidas, loading, marcarLida, marcarTodasLidas }
}
