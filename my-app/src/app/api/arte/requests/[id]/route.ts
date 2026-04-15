import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'designRequests'

/**
 * GET /api/arte/requests/[id]
 * Busca uma solicitação por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docSnap = await adminDb.collection(COLLECTION).doc(params.id).get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    })
  } catch (error) {
    console.error('Erro ao buscar request:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

/**
 * PATCH /api/arte/requests/[id]
 * Atualiza campos de uma solicitação (status, assignedTo, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const docRef = adminDb.collection(COLLECTION).doc(params.id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    // Campos permitidos para atualização
    if (body.status !== undefined) {
      const statusValidos = ['novo', 'em-producao', 'em-revisao', 'concluido', 'cancelado']
      if (!statusValidos.includes(body.status)) {
        return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
      }
      updates.status = body.status

      if (body.status === 'concluido') {
        updates.completedAt = FieldValue.serverTimestamp()
      }
    }

    if (body.assignedTo !== undefined) {
      updates.assignedTo = body.assignedTo
      updates.assignedToName = body.assignedToName || null
      if (body.assignedTo && !docSnap.data()?.assignedAt) {
        updates.assignedAt = FieldValue.serverTimestamp()
      }
    }

    if (body.isUrgent !== undefined) {
      updates.isUrgent = body.isUrgent
    }

    await docRef.update(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar request:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
