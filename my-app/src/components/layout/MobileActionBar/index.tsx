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
        /* o recuo da esquerda abre a vaga do FAB (46px + 10px de respiro),
           para os dois dividirem a linha em vez de se sobreporem */
        padding: '10px var(--edge) calc(10px + env(safe-area-inset-bottom)) calc(var(--edge) + 56px)',
        background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      {/* Só a grade. O WhatsApp ancora à ESQUERDA desta mesma faixa (ver
          `.wa-fab` no compacto) e a vaga dele é o padding-left acima. Antes o
          recuo era à direita enquanto o glifo flutuava 78px acima da barra, por
          cima do conteúdo que rola — os dois nunca se encontravam. */}
      <Link
        className="btn btn-secondary btn-block"
        href={scheduleHref}
        style={{ minHeight: 46 }}
      >
        {isSchedulePage ? 'Outras grades' : 'Grade de aulas'}
      </Link>
    </div>
  )
}
