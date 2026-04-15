import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'requesters'

/**
 * POST /api/arte/requesters/by-uid
 * Busca ou cria um requester vinculado ao uid do chamados
 * Body: { uid, name, phone, role, unitId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, name, phone, role, unitId } = body

    if (!uid || !name || !unitId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: uid, name, unitId' },
        { status: 400 }
      )
    }

    // Buscar requester existente por chamadosUid
    const existing = await adminDb.collection(COLLECTION)
      .where('chamadosUid', '==', uid)
      .limit(1)
      .get()

    if (!existing.empty) {
      const docSnap = existing.docs[0]
      return NextResponse.json({
        id: docSnap.id,
        ...docSnap.data(),
      })
    }

    // Criar novo requester vinculado ao uid do chamados
    const phoneClean = (phone || '').replace(/\D/g, '')
    const phoneE164 = phoneClean ? `+55${phoneClean}` : ''

    const requester = {
      chamadosUid: uid,
      deviceId: `chamados-${uid}`,
      name: name.trim(),
      phone: phoneE164,
      phoneDisplay: phone || '',
      unitId,
      role: role || 'outro',
      createdAt: FieldValue.serverTimestamp(),
      lastActiveAt: FieldValue.serverTimestamp(),
      isBlocked: false,
      totalRequests: 0,
    }

    const docRef = await adminDb.collection(COLLECTION).add(requester)

    return NextResponse.json({
      id: docRef.id,
      ...requester,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao buscar/criar requester by uid:', error)
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
}
