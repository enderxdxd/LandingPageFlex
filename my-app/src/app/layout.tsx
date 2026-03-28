import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Analytics } from '@vercel/analytics/next'

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
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L2DB2KJKF9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-L2DB2KJKF9');
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
      </head>
      <body className="bg-flex-white text-flex-dark overflow-x-hidden">
        <ErrorBoundary>
          <AnimationProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AnimationProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
