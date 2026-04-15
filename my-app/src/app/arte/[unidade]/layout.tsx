import { notFound } from 'next/navigation'
import { ARTE_UNIDADES_VALIDAS } from '@/lib/arte/constants'
import type { ArteUnidadeType } from '@/lib/arte/types'

interface ArteUnidadeLayoutProps {
  children: React.ReactNode
  params: { unidade: string }
}

export default function ArteUnidadeLayout({ children, params }: ArteUnidadeLayoutProps) {
  // Validar slug da unidade
  if (!ARTE_UNIDADES_VALIDAS.includes(params.unidade as ArteUnidadeType)) {
    notFound()
  }

  return <>{children}</>
}
