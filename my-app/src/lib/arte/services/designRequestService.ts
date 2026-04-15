import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  runTransaction,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import {
  DesignRequest,
  DesignRequestStatus,
  NovoDesignRequestFormData,
  Requester,
  ReferenceImage,
  ArteUnidadeType,
} from '../types'
import { incrementarTotalRequests } from './requesterService'

const COLLECTION = 'designRequests'
const COUNTER_COLLECTION = 'counters'
const COUNTER_DOC = 'designRequests'
const PAGE_SIZE = 20

/**
 * Gera o próximo requestNumber via transação atômica
 */
async function gerarRequestNumber(): Promise<number> {
  const counterRef = doc(db, COUNTER_COLLECTION, COUNTER_DOC)

  const newNumber = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef)

    if (!counterSnap.exists()) {
      // Criar counter doc se não existir
      transaction.set(counterRef, { currentValue: 1 })
      return 1
    }

    const current = counterSnap.data().currentValue || 0
    const next = current + 1
    transaction.update(counterRef, { currentValue: next })
    return next
  })

  return newNumber
}

/**
 * Upload de imagens de referência para Firebase Storage
 */
async function uploadReferenceImages(
  requestId: string,
  files: File[]
): Promise<ReferenceImage[]> {
  const references: ReferenceImage[] = []

  for (const file of files) {
    const fileName = `ref-${crypto.randomUUID()}.${file.name.split('.').pop()}`
    const storagePath = `design-requests/${requestId}/references/${fileName}`
    const storageRef = ref(storage, storagePath)

    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)

    references.push({
      url,
      storagePath,
      fileName: file.name,
      uploadedAt: Timestamp.now(),
    })
  }

  return references
}

/**
 * Cria uma nova solicitação de arte
 */
export async function criarDesignRequest(
  dados: NovoDesignRequestFormData,
  requester: Requester
): Promise<{ id: string; requestNumber: number }> {
  const requestNumber = await gerarRequestNumber()
  const agora = Timestamp.now()

  // Calcular se é urgente (deadline < 24h)
  const deadlineDate = new Date(dados.deadline)
  const horasAteDeadline = (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60)
  const isUrgent = horasAteDeadline < 24

  // Criar documento primeiro (sem referências) para ter o ID
  const requestData: Omit<DesignRequest, 'id'> = {
    requestNumber,
    unitId: requester.unitId,
    type: dados.type as DesignRequest['type'],
    destinations: dados.destinations,
    dynamicFields: dados.dynamicFields,
    description: dados.description,
    referenceImages: [],
    deadline: Timestamp.fromDate(deadlineDate),

    // Solicitante
    requesterId: requester.id,
    requesterName: requester.name,
    requesterPhone: requester.phone,
    requesterRole: requester.role,

    // Status
    status: 'novo',
    assignedTo: null,
    assignedToName: null,

    // Entregas
    deliveries: [],

    // Timeline
    createdAt: agora,
    updatedAt: agora,
    assignedAt: null,
    firstDeliveryAt: null,
    completedAt: null,

    // Flags
    isUrgent,
    roundsOfRevision: 0,
  }

  const docRef = await addDoc(collection(db, COLLECTION), requestData)

  // Upload de referências se houver
  if (dados.referenceImages.length > 0) {
    const references = await uploadReferenceImages(docRef.id, dados.referenceImages)
    await updateDoc(doc(db, COLLECTION, docRef.id), {
      referenceImages: references,
    })
  }

  // Incrementar total de pedidos do solicitante
  await incrementarTotalRequests(requester.id)

  return { id: docRef.id, requestNumber }
}

/**
 * Busca uma solicitação por ID
 */
export async function buscarDesignRequest(id: string): Promise<DesignRequest | null> {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as DesignRequest
}

/**
 * Lista solicitações por requesterId com paginação
 */
export async function listarPorRequester(
  requesterId: string,
  ultimoDoc?: DocumentSnapshot
): Promise<{ requests: DesignRequest[]; ultimoDoc: DocumentSnapshot | null }> {
  const q = query(
    collection(db, COLLECTION),
    where('requesterId', '==', requesterId),
    orderBy('createdAt', 'desc'),
    ...(ultimoDoc ? [startAfter(ultimoDoc)] : []),
    limit(PAGE_SIZE)
  )

  const snapshot = await getDocs(q)
  const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DesignRequest))
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  return { requests, ultimoDoc: lastDoc }
}

/**
 * Lista solicitações por status (para Kanban admin)
 */
export async function listarPorStatus(
  status?: DesignRequestStatus,
  unitId?: ArteUnidadeType,
  ultimoDoc?: DocumentSnapshot
): Promise<{ requests: DesignRequest[]; ultimoDoc: DocumentSnapshot | null }> {
  const constraints = []

  if (status) constraints.push(where('status', '==', status))
  if (unitId) constraints.push(where('unitId', '==', unitId))

  const q = query(
    collection(db, COLLECTION),
    ...constraints,
    orderBy('createdAt', 'desc'),
    ...(ultimoDoc ? [startAfter(ultimoDoc)] : []),
    limit(PAGE_SIZE)
  )

  const snapshot = await getDocs(q)
  const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DesignRequest))
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  return { requests, ultimoDoc: lastDoc }
}

/**
 * Atualiza o status de uma solicitação
 */
export async function atualizarStatusRequest(
  requestId: string,
  novoStatus: DesignRequestStatus,
  assignedTo?: string,
  assignedToName?: string
): Promise<void> {
  const docRef = doc(db, COLLECTION, requestId)
  const agora = Timestamp.now()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {
    status: novoStatus,
    updatedAt: agora,
  }

  if (novoStatus === 'em-producao' && assignedTo) {
    updates.assignedTo = assignedTo
    updates.assignedToName = assignedToName || null
    updates.assignedAt = agora
  }

  if (novoStatus === 'concluido') {
    updates.completedAt = agora
  }

  await updateDoc(docRef, updates)
}
