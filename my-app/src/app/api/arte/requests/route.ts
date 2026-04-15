import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'
const COUNTER_DOC = 'designRequests'

/**
 * POST /api/arte/requests
 * Cria uma nova solicitação de arte
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      requesterId,
      requesterName,
      requesterPhone,
      requesterRole,
      unitId,
      type,
      destinations,
      dynamicFields,
      description,
      referenceImages, // já são URLs (upload feito antes via /api/arte/upload)
      deadline,
    } = body

    // Validação básica
    if (!requesterId || !unitId || !type || !destinations?.length || !deadline) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Gerar requestNumber via transação atômica
    const counterRef = adminDb.collection('counters').doc(COUNTER_DOC)
    const requestNumber = await adminDb.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef)

      if (!counterSnap.exists) {
        transaction.set(counterRef, { currentValue: 1 })
        return 1
      }

      const current = counterSnap.data()?.currentValue || 0
      const next = current + 1
      transaction.update(counterRef, { currentValue: next })
      return next
    })

    const deadlineDate = new Date(deadline)
    const horasAteDeadline = (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60)

    const requestData = {
      requestNumber,
      unitId,
      type,
      destinations,
      dynamicFields: dynamicFields || {},
      description: description || '',
      referenceImages: referenceImages || [],
      deadline: Timestamp.fromDate(deadlineDate),

      requesterId,
      requesterName,
      requesterPhone,
      requesterRole,

      status: 'novo',
      assignedTo: null,
      assignedToName: null,

      deliveries: [],

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      assignedAt: null,
      firstDeliveryAt: null,
      completedAt: null,

      isUrgent: horasAteDeadline < 24,
      roundsOfRevision: 0,
    }

    const docRef = await adminDb.collection(COLLECTION).add(requestData)

    // Incrementar totalRequests do solicitante
    try {
      await adminDb.collection('requesters').doc(requesterId).update({
        totalRequests: (body.totalRequests || 0) + 1,
        lastActiveAt: FieldValue.serverTimestamp(),
      })
    } catch {
      // Não bloquear criação se incremento falhar
    }

    // TODO: Notificar designer(s) por email via Resend

    return NextResponse.json({
      id: docRef.id,
      requestNumber,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar design request:', error)
    return NextResponse.json(
      { error: 'Erro interno ao criar solicitação' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/arte/requests?requesterId=xxx
 * Lista solicitações do requester
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requesterId = searchParams.get('requesterId')

    if (!requesterId) {
      return NextResponse.json(
        { error: 'requesterId é obrigatório' },
        { status: 400 }
      )
    }

    const snapshot = await adminDb.collection(COLLECTION)
      .where('requesterId', '==', requesterId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const requests = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Erro ao listar requests:', error)
    return NextResponse.json(
      { error: 'Erro interno ao listar solicitações' },
      { status: 500 }
    )
  }
}
