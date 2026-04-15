import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { Timestamp } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'

/**
 * GET /api/arte/requests/all
 * Lista todas as solicitações (admin)
 * Query params: unitId, type, status, from, to
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get('unitId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let ref: FirebaseFirestore.Query = adminDb.collection(COLLECTION)
      .orderBy('createdAt', 'desc')

    if (unitId) ref = ref.where('unitId', '==', unitId)
    if (type) ref = ref.where('type', '==', type)
    if (status) ref = ref.where('status', '==', status)

    if (from) {
      ref = ref.where('createdAt', '>=', Timestamp.fromDate(new Date(from)))
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(23, 59, 59, 999)
      ref = ref.where('createdAt', '<=', Timestamp.fromDate(toDate))
    }

    const snapshot = await ref.get()

    const requests = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))

    return NextResponse.json({ requests, total: requests.length })
  } catch (error) {
    console.error('Erro ao listar todos os requests:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
