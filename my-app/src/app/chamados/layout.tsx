import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chamados | Flex Fitness Center',
  description: 'Sistema de Chamados Internos - Flex Fitness Center',
  robots: 'noindex, nofollow',
}

export default function ChamadosRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {children}
    </div>
  )
}
