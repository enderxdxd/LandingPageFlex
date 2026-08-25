'use client'

/**
 * Botão flutuante de WhatsApp, canto inferior esquerdo.
 *
 * Aparece em toda largura. No compacto ele SUBSTITUI o botão de WhatsApp da
 * barra fixa (que ficou só com a grade de aulas): a mesma ação impressa duas
 * vezes na mesma tela só roubava espaço de conteúdo.
 *
 * No toque não existe hover, então o rótulo nunca abriria — lá ele fica só com
 * o glifo, que é dos ícones mais reconhecidos do país. No desktop o rótulo
 * cresce na aproximação.
 *
 * Verde do WhatsApp, e não o azul da marca, de propósito: aqui o que importa é
 * o reconhecimento imediato do canal. É o único lugar do site onde uma cor de
 * fora da paleta se justifica.
 */

import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'

export default function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={CONTACT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a FLEX no WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.04 3.2c-7.1 0-12.87 5.77-12.87 12.87 0 2.27.6 4.49 1.73 6.44L3.07 29.2l6.86-1.8a12.82 12.82 0 0 0 6.1 1.55h.01c7.1 0 12.87-5.77 12.87-12.87 0-3.44-1.34-6.67-3.77-9.1a12.78 12.78 0 0 0-9.1-3.78Zm0 23.55h-.01c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.07 1.07 1.09-3.97-.25-.41a10.67 10.67 0 0 1-1.64-5.69c0-5.9 4.8-10.7 10.7-10.7 2.86 0 5.55 1.11 7.57 3.14a10.63 10.63 0 0 1 3.13 7.57c0 5.9-4.8 10.7-10.7 10.7Zm5.87-8.01c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.17-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.32 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z"
        />
      </svg>
      <span className="wa-fab-label">
        <span>Fale no WhatsApp</span>
      </span>
    </a>
  )
}
