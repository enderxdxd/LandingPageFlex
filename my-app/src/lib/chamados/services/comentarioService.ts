import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { HistoricoChamado, ChamadoUsuario, Chamado } from '../types'
import { UNIDADES, CATEGORIAS } from '../constants'

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

  // Notificar a outra parte por email sobre o novo comentario
  try {
    const chamadoSnap = await getDoc(doc(db, COLLECTION, chamadoId))
    if (chamadoSnap.exists()) {
      const chamado = chamadoSnap.data() as Chamado
      // Determinar quem notificar: se quem comentou e o solicitante, notifica o tecnico e vice-versa
      const destinatarios: { email: string; nome: string }[] = []

      if (chamado.solicitante.email !== usuario.email) {
        destinatarios.push({ email: chamado.solicitante.email, nome: chamado.solicitante.nome })
      }
      if (chamado.atribuidoPara && chamado.atribuidoPara.email !== usuario.email) {
        destinatarios.push({ email: chamado.atribuidoPara.email, nome: chamado.atribuidoPara.nome })
      }

      if (destinatarios.length > 0) {
        await fetch('/api/chamados/notificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'comentario',
            chamadoId,
            protocolo: chamado.protocolo,
            titulo: chamado.titulo || chamado.descricao?.substring(0, 60),
            prioridade: chamado.prioridade,
            unidade: UNIDADES[chamado.unidade]?.label || chamado.unidade,
            categoria: chamado.categoria ? CATEGORIAS[chamado.categoria]?.label || chamado.categoria : 'Não categorizado',
            destinatarios,
            detalhes: `${usuario.nome}: "${comentario.substring(0, 100)}${comentario.length > 100 ? '...' : ''}"`,
          }),
        })
      }
    }
  } catch {
    // Erro na notificacao nao bloqueia o comentario
  }
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
