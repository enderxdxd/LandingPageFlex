import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

const COLLECTION = 'requesters'

/**
 * GET /api/arte/requesters/list
 * Lista todos os solicitantes (admin only)
 * Query params: unitId, blocked
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get('unitId')
    const blocked = searchParams.get('blocked')

    let ref: FirebaseFirestore.Query = adminDb.collection(COLLECTION)
      .orderBy('lastActiveAt', 'desc')

    if (unitId) {
      ref = ref.where('unitId', '==', unitId)
    }

    if (blocked === 'true') {
      ref = ref.where('isBlocked', '==', true)
    } else if (blocked === 'false') {
      ref = ref.where('isBlocked', '==', false)
    }

    const snapshot = await ref.get()

    const requesters = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))

    return NextResponse.json({ requesters })
  } catch (error) {
    console.error('Erro ao listar requesters:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

/**
 * PATCH /api/arte/requesters/list
 * Bloqueia/desbloqueia solicitante
 * Body: { id, isBlocked }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isBlocked } = body

    if (!id || typeof isBlocked !== 'boolean') {
      return NextResponse.json({ error: 'id e isBlocked são obrigatórios' }, { status: 400 })
    }

    await adminDb.collection(COLLECTION).doc(id).update({ isBlocked })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar requester:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
