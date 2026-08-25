'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import FooterNocturne from '@/components/layout/FooterNocturne'
import MobileActionBar from '@/components/layout/MobileActionBar'
import WhatsAppFab from '@/components/layout/WhatsAppFab'
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
    /**
     * `theme-color` pinta a barra do navegador no mobile. As rotas nocturne são
     * escuras e as legadas são claras, então uma meta estática estaria errada
     * para metade do site — ela acompanha o tema aqui, junto do data-attribute.
     */
    const meta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      document.head.appendChild(
        Object.assign(document.createElement('meta'), { name: 'theme-color' })
      )

    if (isNocturneRoute) {
      document.documentElement.dataset.theme = 'nocturne'
      meta.content = '#161826'
      return () => {
        delete document.documentElement.dataset.theme
      }
    }

    delete document.documentElement.dataset.theme
    meta.content = '#ffffff'
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
          <WhatsAppFab />
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
