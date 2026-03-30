import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'
import { getFirestore } from 'firebase-admin/firestore'
import { getApps } from 'firebase-admin/app'

/**
 * Verifica se a requisição vem de um usuario autenticado com role admin.
 * Retorna o uid do usuario ou uma NextResponse de erro.
 */
export async function verificarAdmin(req: NextRequest): Promise<{ uid: string } | NextResponse> {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token de autenticação não fornecido' }, { status: 401 })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    // Verificar se o usuario é admin no Firestore
    const db = getFirestore(getApps()[0])
    const userDoc = await db.collection('chamados_usuarios').doc(uid).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuario não encontrado' }, { status: 403 })
    }

    const userData = userDoc.data()
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })
    }

    return { uid }
  } catch (err: any) {
    console.error('Erro ao verificar token:', err)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
  }
}
