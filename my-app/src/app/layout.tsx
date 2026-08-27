import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, Inter } from 'next/font/google'
import './globals.css'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Analytics } from '@vercel/analytics/next'
import RDStationScript from '@/components/RDStationScript'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

/*
 * NÃO adicione scripts de analytics/marketing aqui.
 *
 * Google Analytics e Meta Pixel são carregados por `useCookieManager`, DEPOIS
 * do aceite no banner de cookies, a partir de NEXT_PUBLIC_GA_ID e
 * NEXT_PUBLIC_FB_PIXEL_ID. Cravá-los no <head> dispara rastreamento antes do
 * consentimento e contradiz o que a Política de Cookies promete ao visitante —
 * que é exatamente o que cria exposição sob a LGPD.
 */

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// body face for the redesigned (nocturne) routes
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Flex Fitness Center — Academias em Goiânia e Palmas',
  // o número de anos sai de lib/home/brand para não divergir da copy da home
  description: `No mercado fitness desde ${FOUNDED_YEAR}, são ${yearsInBusiness()} anos de história. Conheça as unidades Flex Alphaville, Buena Vista, Marista e Palmas.`,
  keywords: 'Academia Goiânia, academia Palmas, Flex Fitness Center, academia premium, crossfit, natação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
      </head>
      <body className="bg-flex-white text-flex-dark">
        <ErrorBoundary>
          <AnimationProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AnimationProvider>
        </ErrorBoundary>
        <Analytics />
        <RDStationScript />
      </body>
    </html>
  )
}
