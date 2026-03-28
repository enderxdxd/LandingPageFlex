import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook endpoint para integrações futuras
 * Pode ser usado para:
 * - Integração com WhatsApp Business API
 * - Integração com Slack/Discord
 * - Webhooks de pagamento
 * - Automações externas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar token de autenticação
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CHAMADOS_WEBHOOK_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Log do webhook recebido
    console.log('Webhook recebido:', {
      tipo: body.tipo,
      timestamp: new Date().toISOString(),
    })

    // Processar baseado no tipo
    switch (body.tipo) {
      case 'ping':
        return NextResponse.json({ status: 'pong', timestamp: new Date().toISOString() })
      default:
        return NextResponse.json({ status: 'received', tipo: body.tipo })
    }
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'chamados-webhook' })
}
