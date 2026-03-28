import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { HistoricoChamado, ChamadoUsuario } from '../types'

const COLLECTION = 'chamados'

/**
 * Adiciona um comentário ao chamado
 */
export async function adicionarComentario(
  chamadoId: string,
  comentario: string,
  usuario: ChamadoUsuario,
  anexo?: File
): Promise<void> {
  const agora = Timestamp.now()

  let anexoData: { nome: string; url: string } | undefined
  if (anexo) {
    const storageRef = ref(storage, `chamados/${chamadoId}/comentarios/${Date.now()}_${anexo.name}`)
    await uploadBytes(storageRef, anexo)
    const url = await getDownloadURL(storageRef)
    anexoData = { nome: anexo.name, url }
  }

  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'comentario',
    descricao: comentario,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: usuario.role === 'admin' ? 'admin' : usuario.role === 'tecnico' ? 'tecnico' : 'solicitante',
    },
    dados: {
      comentario,
      ...(anexoData ? { anexo: anexoData } : {}),
    },
    criadoEm: agora,
  })
}

/**
 * Busca todo o histórico/timeline de um chamado
 */
export async function buscarHistorico(chamadoId: string): Promise<HistoricoChamado[]> {
  const q = query(
    collection(db, COLLECTION, chamadoId, 'historico'),
    orderBy('criadoEm', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoricoChamado))
}

/**
 * Listener em tempo real para o histórico
 */
export function escutarHistorico(
  chamadoId: string,
  callback: (historico: HistoricoChamado[]) => void
) {
  const q = query(
    collection(db, COLLECTION, chamadoId, 'historico'),
    orderBy('criadoEm', 'asc')
  )
  return onSnapshot(q, (snapshot) => {
    const historico = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoricoChamado))
    callback(historico)
  })
}
