import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, Oswald } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import CookieBanner from '@/components/CookieBanner'

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="pt-BR" className={`${playfairDisplay.variable} ${montserrat.variable} ${oswald.variable}`}>
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
            <Footer />
            {/* Cookie Banner - aparece automaticamente quando necessário */}
            <CookieBanner />
          </AnimationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}