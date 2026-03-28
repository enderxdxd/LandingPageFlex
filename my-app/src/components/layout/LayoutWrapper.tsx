'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/CookieBanner'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isChamados = pathname.startsWith('/chamados')

  if (isChamados) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
