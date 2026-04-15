import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Requester, RequesterFormData, ArteUnidadeType } from '../types'

const COLLECTION = 'requesters'

/**
 * Busca solicitante pelo deviceId
 */
export async function buscarRequesterPorDeviceId(deviceId: string): Promise<Requester | null> {
  const q = query(
    collection(db, COLLECTION),
    where('deviceId', '==', deviceId)
  )
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Requester
}

/**
 * Cria um novo solicitante
 */
export async function criarRequester(
  dados: RequesterFormData,
  deviceId: string,
  unitId: ArteUnidadeType
): Promise<string> {
  const agora = Timestamp.now()

  // Formatar telefone para E.164
  const phoneClean = dados.phone.replace(/\D/g, '')
  const phoneE164 = `+55${phoneClean}`

  const requester: Omit<Requester, 'id'> = {
    deviceId,
    name: dados.name.trim(),
    phone: phoneE164,
    phoneDisplay: dados.phone,
    unitId,
    role: dados.role as Requester['role'],
    createdAt: agora,
    lastActiveAt: agora,
    isBlocked: false,
    totalRequests: 0,
  }

  const docRef = await addDoc(collection(db, COLLECTION), requester)
  return docRef.id
}

/**
 * Atualiza lastActiveAt do solicitante
 */
export async function atualizarUltimaAtividade(requesterId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, requesterId)
  await updateDoc(docRef, {
    lastActiveAt: Timestamp.now(),
  })
}

/**
 * Incrementa totalRequests do solicitante
 */
export async function incrementarTotalRequests(requesterId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, requesterId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return

  const current = snap.data().totalRequests || 0
  await updateDoc(docRef, {
    totalRequests: current + 1,
    lastActiveAt: Timestamp.now(),
  })
}

/**
 * Limpa identificação (para "Não é você?")
 * Não deleta o documento, apenas desvincula
 */
export async function desvincularDispositivo(requesterId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, requesterId)
  await updateDoc(docRef, {
    deviceId: '', // Desvincula o dispositivo
  })
}
