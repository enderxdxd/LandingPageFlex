import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from 'firebase-admin/storage'
import '@/lib/firebaseAdmin'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

/**
 * POST /api/arte/upload
 * Upload de arquivos para Firebase Storage
 * Usado para referências e planilhas
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'references'
    const requestId = formData.get('requestId') as string || 'temp'

    if (!files.length) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Máximo de 5 arquivos por vez' },
        { status: 400 }
      )
    }

    const bucket = getStorage().bucket()
    const uploaded = []

    for (const file of files) {
      // Validar tamanho
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Arquivo "${file.name}" excede 10MB` },
          { status: 400 }
        )
      }

      // Validar tipo
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo não permitido: ${file.type}` },
          { status: 400 }
        )
      }

      const ext = file.name.split('.').pop() || 'bin'
      const fileName = `ref-${crypto.randomUUID()}.${ext}`
      const storagePath = `design-requests/${requestId}/${folder}/${fileName}`

      const fileRef = bucket.file(storagePath)
      const bytes = await file.arrayBuffer()

      await fileRef.save(Buffer.from(bytes), {
        metadata: {
          contentType: file.type,
          metadata: {
            originalName: file.name,
            requestId,
          },
        },
      })

      // Gerar URL assinada (válida por 7 dias) ou URL pública
      await fileRef.makePublic()
      const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

      uploaded.push({
        url,
        storagePath,
        fileName: file.name,
        type: file.type,
        sizeBytes: file.size,
      })
    }

    return NextResponse.json({ files: uploaded }, { status: 201 })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno no upload' },
      { status: 500 }
    )
  }
}
