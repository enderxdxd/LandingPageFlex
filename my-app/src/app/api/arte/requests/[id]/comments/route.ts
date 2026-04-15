import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'designRequestComments'

/**
 * GET /api/arte/requests/[id]/comments
 * Lista comentários de uma solicitação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const snapshot = await adminDb.collection(COLLECTION)
      .where('requestId', '==', params.id)
      .orderBy('createdAt', 'asc')
      .get()

    const comments = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Erro ao listar comentários:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

/**
 * POST /api/arte/requests/[id]/comments
 * Adiciona um comentário
 * Body: { authorType, authorId, authorName, message }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { authorType, authorId, authorName, message } = body

    if (!authorType || !authorId || !authorName || !message?.trim()) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: authorType, authorId, authorName, message' },
        { status: 400 }
      )
    }

    const validTypes = ['requester', 'designer', 'admin']
    if (!validTypes.includes(authorType)) {
      return NextResponse.json({ error: 'authorType inválido' }, { status: 400 })
    }

    const comment = {
      requestId: params.id,
      authorType,
      authorId,
      authorName,
      message: message.trim(),
      createdAt: FieldValue.serverTimestamp(),
      readBy: [authorId],
    }

    const docRef = await adminDb.collection(COLLECTION).add(comment)
    const savedComment = await docRef.get()

    return NextResponse.json({
      id: docRef.id,
      ...savedComment.data(),
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
