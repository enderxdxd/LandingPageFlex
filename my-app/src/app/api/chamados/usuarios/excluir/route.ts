import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json()

    if (!uid) {
      return NextResponse.json({ error: 'UID é obrigatório' }, { status: 400 })
    }

    // Deletar usuario do Firebase Authentication
    await adminAuth.deleteUser(uid)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    // Se o usuario nao existe no Auth, considerar sucesso (ja foi deletado ou criado apenas no Firestore)
    if (err?.code === 'auth/user-not-found') {
      return NextResponse.json({ success: true })
    }

    console.error('Erro ao excluir usuario do Authentication:', err)
    return NextResponse.json(
      { error: err.message || 'Erro ao excluir usuario' },
      { status: 500 }
    )
  }
}
