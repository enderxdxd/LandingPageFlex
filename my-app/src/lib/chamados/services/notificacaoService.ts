import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ChamadoNotificacao, NotificacaoTipo } from '../types'

const COLLECTION = 'chamados_notificacoes'

/**
 * Cria uma nova notificação
 */
export async function criarNotificacao(dados: {
  usuarioId: string
  chamadoId: string
  protocolo: string
  tipo: NotificacaoTipo
  titulo: string
  mensagem: string
}): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...dados,
    lida: false,
    emailEnviado: false,
    criadoEm: Timestamp.now(),
  })
}

/**
 * Busca notificações de um usuário
 */
export async function buscarNotificacoes(
  usuarioId: string,
  apenasNaoLidas: boolean = false,
  maxResults: number = 20
): Promise<ChamadoNotificacao[]> {
  const constraints = [
    where('usuarioId', '==', usuarioId),
    ...(apenasNaoLidas ? [where('lida', '==', false)] : []),
    orderBy('criadoEm', 'desc'),
    limit(maxResults),
  ]

  const q = query(collection(db, COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChamadoNotificacao))
}

/**
 * Conta notificações não lidas
 */
export async function contarNaoLidas(usuarioId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTION),
    where('usuarioId', '==', usuarioId),
    where('lida', '==', false)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

/**
 * Marca uma notificação como lida
 */
export async function marcarComoLida(notificacaoId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, notificacaoId), { lida: true })
}

/**
 * Marca todas as notificações como lidas
 */
export async function marcarTodasComoLidas(usuarioId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTION),
    where('usuarioId', '==', usuarioId),
    where('lida', '==', false)
  )
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)
  snapshot.docs.forEach(d => batch.update(d.ref, { lida: true }))
  await batch.commit()
}

/**
 * Listener em tempo real para notificações
 */
export function escutarNotificacoes(
  usuarioId: string,
  callback: (notificacoes: ChamadoNotificacao[]) => void
) {
  const q = query(
    collection(db, COLLECTION),
    where('usuarioId', '==', usuarioId),
    orderBy('criadoEm', 'desc'),
    limit(20)
  )
  return onSnapshot(q, (snapshot) => {
    const notificacoes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChamadoNotificacao))
    callback(notificacoes)
  })
}
