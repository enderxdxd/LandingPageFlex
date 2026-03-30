import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'
import { verificarAdmin } from '@/lib/apiAuth'

export async function POST(req: NextRequest) {
  const authResult = await verificarAdmin(req)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { uid, novaSenha } = await req.json()

    if (!uid || !novaSenha) {
      return NextResponse.json({ error: 'UID e nova senha são obrigatórios' }, { status: 400 })
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    await adminAuth.updateUser(uid, { password: novaSenha })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Erro ao alterar senha:', err)
    return NextResponse.json(
      { error: err.message || 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}
