'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import FooterNocturne from '@/components/layout/FooterNocturne'
import MobileActionBar from '@/components/layout/MobileActionBar'
import CookieBanner from '@/components/CookieBanner'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAppRoute = pathname.startsWith('/chamados') || pathname.startsWith('/admin') || pathname.startsWith('/arte')
  const isNocturneRoute =
    pathname === '/' ||
    pathname === '/procedimentos' ||
    pathname === '/sugestoes' ||
    pathname === '/trabalhe-aqui' ||
    pathname === '/freepass' ||
    pathname.startsWith('/unidades/') ||
    pathname.startsWith('/horarios')

  useEffect(() => {
    if (isNocturneRoute) {
      document.documentElement.dataset.theme = 'nocturne'
      return () => {
        delete document.documentElement.dataset.theme
      }
    }

    delete document.documentElement.dataset.theme
  }, [isNocturneRoute])

  if (isAppRoute) {
    return <>{children}</>
  }

  if (isNocturneRoute) {
    return (
      <>
        <div className="nocturne">
          <Header />
          <main>{children}</main>
          <FooterNocturne />
          <MobileActionBar />
        </div>
        <CookieBanner />
      </>
    )
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
