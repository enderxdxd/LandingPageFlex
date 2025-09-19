import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: 'Flex Fitness Center - Academia Premium em Goiânia',
  description: 'A maior e mais moderna academia de Goiânia. Unidades em Buena Vista, Marista, Alphaville e em breve Palmas.',
  keywords: 'Academia Goiânia, FlexFitnessCenter, academia premium, crossfit, natação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
      </head>
      <body className="bg-flex-white text-flex-dark overflow-x-hidden">
        <ErrorBoundary>
          <AnimationProvider>
            <Navigation />
            <main>{children}</main>
            {/* Cookie Banner - aparece automaticamente quando necessário */}
            <CookieBanner />
          </AnimationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}