'use client'

/**
 * Barra de ação fixa — só abaixo de 1000px.
 *
 * Ela é dona dos ~67px de baixo da tela (10 + 46 + 10), e três elementos da
 * abertura cede a esse espaço: o herói ganha padding-bottom extra abaixo de
 * 1000px, lendo a MESMA flag `useCompact` que esta barra.
 *
 * O rodapé reserva 120px de padding-bottom para não terminar atrás dela.
 */

import { useCompact } from '@/hooks/useCompact'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function MobileActionBar() {
  const compact = useCompact()
  const pathname = usePathname()
  const currentUnitSlug = pathname.match(/^\/unidades\/([^/]+)/)?.[1]
  const isSchedulePage = /^\/horarios\/[^/]+/.test(pathname)
  const scheduleHref = currentUnitSlug
    ? `/horarios/${currentUnitSlug}`
    : '/horarios#grades-coletivas'

  if (!compact) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 70,
        padding: '10px var(--edge) calc(10px + env(safe-area-inset-bottom))',
        background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      {/* só a grade: o WhatsApp mudou para o botão flutuante, e o espaço da
          direita fica livre para ele não cobrir nada */}
      <Link
        className="btn btn-secondary btn-block"
        href={scheduleHref}
        style={{ minHeight: 46, paddingRight: 76 }}
      >
        {isSchedulePage ? 'Outras grades' : 'Grade de aulas'}
      </Link>
    </div>
  )
}
