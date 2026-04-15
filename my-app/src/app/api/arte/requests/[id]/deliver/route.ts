import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'

/**
 * POST /api/arte/requests/[id]/deliver
 * Registra uma entrega (versão) na solicitação
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { files, deliveredBy } = body

    if (!files || !files.length || !deliveredBy) {
      return NextResponse.json(
        { error: 'files e deliveredBy são obrigatórios' },
        { status: 400 }
      )
    }

    const docRef = adminDb.collection(COLLECTION).doc(params.id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    const data = docSnap.data() || {}
    const deliveries = data.deliveries || []
    const nextVersion = deliveries.length + 1

    const newDelivery = {
      version: nextVersion,
      files,
      deliveredAt: new Date().toISOString(),
      deliveredBy,
      reviewStatus: 'aguardando',
      reviewedAt: null,
      feedback: null,
    }

    const updates: Record<string, any> = {
      deliveries: [...deliveries, newDelivery],
      status: 'em-revisao',
      updatedAt: FieldValue.serverTimestamp(),
    }

    // Marcar primeira entrega
    if (!data.firstDeliveryAt) {
      updates.firstDeliveryAt = FieldValue.serverTimestamp()
    }

    await docRef.update(updates)

    return NextResponse.json({
      success: true,
      version: nextVersion,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao registrar entrega:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
