import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'

/**
 * POST /api/arte/requests/[id]/review
 * Solicitante aprova ou solicita ajuste na última entrega
 * Body: { action: 'aprovado' | 'ajuste-solicitado', feedback?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, feedback } = body

    if (!action || !['aprovado', 'ajuste-solicitado'].includes(action)) {
      return NextResponse.json(
        { error: 'action deve ser "aprovado" ou "ajuste-solicitado"' },
        { status: 400 }
      )
    }

    if (action === 'ajuste-solicitado' && !feedback?.trim()) {
      return NextResponse.json(
        { error: 'Informe o que precisa ser ajustado' },
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

    if (deliveries.length === 0) {
      return NextResponse.json({ error: 'Nenhuma entrega para revisar' }, { status: 400 })
    }

    // Atualizar última entrega
    const lastIndex = deliveries.length - 1
    deliveries[lastIndex] = {
      ...deliveries[lastIndex],
      reviewStatus: action,
      reviewedAt: new Date().toISOString(),
      feedback: action === 'ajuste-solicitado' ? feedback.trim() : null,
    }

    const updates: Record<string, any> = {
      deliveries,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (action === 'aprovado') {
      updates.status = 'concluido'
      updates.completedAt = FieldValue.serverTimestamp()
    } else {
      // Volta para em-producao para o designer ajustar
      updates.status = 'em-producao'
      updates.roundsOfRevision = (data.roundsOfRevision || 0) + 1
    }

    await docRef.update(updates)

    return NextResponse.json({
      success: true,
      action,
      newStatus: updates.status,
    })
  } catch (error) {
    console.error('Erro ao registrar review:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
