import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'

/**
 * POST /api/arte/requests/[id]/assign
 * Atribui um designer à solicitação e muda status para em-producao
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { assignedTo, assignedToName } = body

    if (!assignedTo || !assignedToName) {
      return NextResponse.json(
        { error: 'assignedTo e assignedToName são obrigatórios' },
        { status: 400 }
      )
    }

    const docRef = adminDb.collection(COLLECTION).doc(params.id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    await docRef.update({
      assignedTo,
      assignedToName,
      assignedAt: FieldValue.serverTimestamp(),
      status: 'em-producao',
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atribuir designer:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
