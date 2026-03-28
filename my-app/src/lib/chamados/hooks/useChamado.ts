'use client'

import { useState, useEffect } from 'react'
import { Chamado, HistoricoChamado } from '../types'
import { escutarChamado } from '../services/chamadoService'
import { escutarHistorico } from '../services/comentarioService'

interface UseChamadoReturn {
  chamado: Chamado | null
  historico: HistoricoChamado[]
  loading: boolean
  error: string | null
}

export function useChamado(chamadoId: string): UseChamadoReturn {
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [historico, setHistorico] = useState<HistoricoChamado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chamadoId) return

    setLoading(true)

    const unsubChamado = escutarChamado(chamadoId, (data) => {
      setChamado(data)
      if (!data) setError('Chamado não encontrado')
      setLoading(false)
    })

    const unsubHistorico = escutarHistorico(chamadoId, (data) => {
      setHistorico(data)
    })

    return () => {
      unsubChamado()
      unsubHistorico()
    }
  }, [chamadoId])

  return { chamado, historico, loading, error }
}
