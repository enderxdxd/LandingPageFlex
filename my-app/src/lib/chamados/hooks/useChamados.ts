'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, query, where, orderBy, limit, startAfter, getDocs, onSnapshot, DocumentSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Chamado, ChamadoFilters, StatusType, CategoriaType, PrioridadeType, UnidadeType } from '../types'

const PAGE_SIZE = 20
const COLLECTION = 'chamados'

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
  const unsubRef = useRef<(() => void) | null>(null)

  const buildConstraints = useCallback(() => {
    const constraints: ReturnType<typeof where>[] = []
    if (filtros.status !== 'todos') constraints.push(where('status', '==', filtros.status))
    if (filtros.categoria !== 'todos') constraints.push(where('categoria', '==', filtros.categoria))
    if (filtros.prioridade !== 'todos') constraints.push(where('prioridade', '==', filtros.prioridade))
    if (filtros.unidade !== 'todos') constraints.push(where('unidade', '==', filtros.unidade))
    if (emailUsuario) constraints.push(where('solicitante.email', '==', emailUsuario))
    if (tecnicoUid) constraints.push(where('atribuidoPara.uid', '==', tecnicoUid))
    return constraints
  }, [filtros, emailUsuario, tecnicoUid])

  // Listener em tempo real para a primeira página
  useEffect(() => {
    // Limpar listener anterior
    if (unsubRef.current) {
      unsubRef.current()
      unsubRef.current = null
    }

    setLoading(true)
    setError(null)
    setUltimoDoc(null)

    const constraints = buildConstraints()
    const q = query(
      collection(db, COLLECTION),
      ...constraints,
      orderBy('criadoEm', 'desc'),
      limit(PAGE_SIZE)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chamado))
      setChamados(lista)
      setUltimoDoc(snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null)
      setHasMore(snapshot.docs.length >= PAGE_SIZE)
      setLoading(false)
    }, (err) => {
      console.error('Erro ao escutar chamados:', err)
      setError('Erro ao carregar chamados')
      setLoading(false)
    })

    unsubRef.current = unsub
    return () => unsub()
  }, [buildConstraints]) // eslint-disable-line react-hooks/exhaustive-deps

  // Carregar mais usa getDocs (paginação manual)
  const carregarMais = useCallback(async () => {
    if (!hasMore || loading || !ultimoDoc) return
    setLoading(true)
    try {
      const constraints = buildConstraints()
      const q = query(
        collection(db, COLLECTION),
        ...constraints,
        orderBy('criadoEm', 'desc'),
        startAfter(ultimoDoc),
        limit(PAGE_SIZE)
      )
      const snapshot = await getDocs(q)
      const novos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chamado))
      setChamados(prev => [...prev, ...novos])
      setUltimoDoc(snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null)
      setHasMore(snapshot.docs.length >= PAGE_SIZE)
    } catch (err) {
      console.error('Erro ao carregar mais chamados:', err)
      setError('Erro ao carregar chamados')
    } finally {
      setLoading(false)
    }
  }, [hasMore, loading, ultimoDoc, buildConstraints])

  const recarregar = useCallback(async () => {
    // O onSnapshot já mantém atualizado, mas forçar refresh mudando filtros
    setFiltros(prev => ({ ...prev }))
  }, [])

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
