// WhatsApp de contato direto (consultor / atendimento central)
export const CONTACT_WHATSAPP_PHONE = '556293833713'
export const CONTACT_WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Flex Fitness e gostaria de mais informações.'

// Monta o link do WhatsApp para o número de contato, com mensagem opcional
export function buildWhatsAppUrl(message: string = CONTACT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${CONTACT_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export const CONTACT_WHATSAPP_URL = buildWhatsAppUrl()
