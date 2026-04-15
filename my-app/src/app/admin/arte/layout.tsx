import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel de Arte | Flex Fitness Center',
  description: 'Painel administrativo de solicitações de arte',
  robots: 'noindex, nofollow',
}

export default function AdminArteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
