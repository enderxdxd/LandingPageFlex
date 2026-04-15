import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solicitação de Arte | Flex Fitness Center',
  description: 'Sistema de Solicitações de Arte - Flex Fitness Center',
  robots: 'noindex, nofollow',
}

export default function ArteRootLayout({
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
