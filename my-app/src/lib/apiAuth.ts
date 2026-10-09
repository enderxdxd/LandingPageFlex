import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

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

    /* Usa o `adminDb` preguiçoso em vez de `getFirestore(getApps()[0])`: com
       a inicialização adiada, `getApps()` está vazio até o primeiro acesso, e
       pegar o índice 0 de um array vazio passaria `undefined` adiante. */
    const userDoc = await adminDb.collection('chamados_usuarios').doc(uid).get()

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
