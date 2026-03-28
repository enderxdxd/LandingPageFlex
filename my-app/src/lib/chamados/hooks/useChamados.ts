'use client'

import { useState, useEffect, useCallback } from 'react'
import { DocumentSnapshot } from 'firebase/firestore'
import { Chamado, ChamadoFilters, StatusType, CategoriaType, PrioridadeType, UnidadeType } from '../types'
import { listarChamados } from '../services/chamadoService'

interface UseChamadosReturn {
  chamados: Chamado[]
  loading: boolean
  error: string | null
  hasMore: boolean
  filtros: ChamadoFilters
  setFiltros: (filtros: ChamadoFilters) => void
  carregarMais: () => Promise<void>
  recarregar: () => Promise<void>
}

export function useChamados(
  emailUsuario?: string,
  tecnicoUid?: string,
  filtrosIniciais?: Partial<ChamadoFilters>
): UseChamadosReturn {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [ultimoDoc, setUltimoDoc] = useState<DocumentSnapshot | null>(null)
  const [filtros, setFiltros] = useState<ChamadoFilters>({
    status: 'todos',
    categoria: 'todos',
    prioridade: 'todos',
    unidade: 'todos',
    ...filtrosIniciais,
  })

  const carregar = useCallback(async (resetar: boolean = true) => {
    setLoading(true)
    setError(null)
    try {
      const result = await listarChamados({
        status: filtros.status !== 'todos' ? filtros.status as StatusType : undefined,
        categoria: filtros.categoria !== 'todos' ? filtros.categoria as CategoriaType : undefined,
        prioridade: filtros.prioridade !== 'todos' ? filtros.prioridade as PrioridadeType : undefined,
        unidade: filtros.unidade !== 'todos' ? filtros.unidade as UnidadeType : undefined,
        email: emailUsuario,
        tecnicoUid,
        ultimoDoc: resetar ? undefined : ultimoDoc || undefined,
      })

      if (resetar) {
        setChamados(result.chamados)
      } else {
        setChamados(prev => [...prev, ...result.chamados])
      }
      setUltimoDoc(result.ultimoDoc)
      setHasMore(result.chamados.length >= 20)
    } catch (err) {
      console.error('Erro ao carregar chamados:', err)
      setError('Erro ao carregar chamados')
    } finally {
      setLoading(false)
    }
  }, [filtros, emailUsuario, tecnicoUid, ultimoDoc])

  useEffect(() => {
    carregar(true)
  }, [filtros, emailUsuario, tecnicoUid]) // eslint-disable-line react-hooks/exhaustive-deps

  const carregarMais = useCallback(async () => {
    if (!hasMore || loading) return
    await carregar(false)
  }, [hasMore, loading, carregar])

  const recarregar = useCallback(async () => {
    setUltimoDoc(null)
    await carregar(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    chamados,
    loading,
    error,
    hasMore,
    filtros,
    setFiltros,
    carregarMais,
    recarregar,
  }
}
