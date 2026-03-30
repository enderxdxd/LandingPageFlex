import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { email, senha, nome } = await req.json()

    if (!email || !senha || !nome) {
      return NextResponse.json({ error: 'Email, senha e nome são obrigatórios' }, { status: 400 })
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const userRecord = await adminAuth.createUser({
      email,
      password: senha,
      displayName: nome,
    })

    return NextResponse.json({ uid: userRecord.uid })
  } catch (err: any) {
    console.error('Erro ao criar usuario:', err)

    if (err?.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Este email ja esta em uso' }, { status: 400 })
    }
    if (err?.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 })
    }

    return NextResponse.json(
      { error: err.message || 'Erro ao criar usuario' },
      { status: 500 }
    )
  }
}
