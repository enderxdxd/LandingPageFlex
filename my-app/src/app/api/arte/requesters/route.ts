import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'requesters'

/**
 * POST /api/arte/requesters
 * Cria ou retorna solicitante existente por deviceId
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, name, phone, role, unitId } = body

    // Validação básica
    if (!deviceId || !name || !phone || !role || !unitId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: deviceId, name, phone, role, unitId' },
        { status: 400 }
      )
    }

    // Validar unidade
    const unidadesValidas = ['alphaville', 'buena-vista', 'goiania', 'palmas']
    if (!unidadesValidas.includes(unitId)) {
      return NextResponse.json({ error: 'Unidade inválida' }, { status: 400 })
    }

    // Validar cargo
    const cargosValidos = ['recepcionista', 'gerente', 'professor', 'personal', 'coordenador', 'outro']
    if (!cargosValidos.includes(role)) {
      return NextResponse.json({ error: 'Cargo inválido' }, { status: 400 })
    }

    // Verificar se já existe requester com esse deviceId
    const existing = await adminDb.collection(COLLECTION)
      .where('deviceId', '==', deviceId)
      .limit(1)
      .get()

    if (!existing.empty) {
      const existingDoc = existing.docs[0]
      return NextResponse.json({
        id: existingDoc.id,
        ...existingDoc.data(),
        isExisting: true,
      })
    }

    // Formatar telefone
    const phoneClean = phone.replace(/\D/g, '')
    const phoneE164 = `+55${phoneClean}`

    const requester = {
      deviceId,
      name: name.trim(),
      phone: phoneE164,
      phoneDisplay: phone,
      unitId,
      role,
      createdAt: FieldValue.serverTimestamp(),
      lastActiveAt: FieldValue.serverTimestamp(),
      isBlocked: false,
      totalRequests: 0,
    }

    const docRef = await adminDb.collection(COLLECTION).add(requester)

    return NextResponse.json({
      id: docRef.id,
      ...requester,
      isExisting: false,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar requester:', error)
    return NextResponse.json(
      { error: 'Erro interno ao criar solicitante' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/arte/requesters?deviceId=xxx
 * Busca solicitante pelo deviceId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'deviceId é obrigatório' },
        { status: 400 }
      )
    }

    const snapshot = await adminDb.collection(COLLECTION)
      .where('deviceId', '==', deviceId)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json({ requester: null })
    }

    const docSnap = snapshot.docs[0]
    return NextResponse.json({
      requester: { id: docSnap.id, ...docSnap.data() },
    })
  } catch (error) {
    console.error('Erro ao buscar requester:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar solicitante' },
      { status: 500 }
    )
  }
}
