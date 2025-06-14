import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import AnimationProvider from '@/components/providers/AnimationProvider'

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
  description: 'A maior e mais moderna academia de Goiânia. Unidades em Bueno Vista, Marista, Alphaville e em breve Palmas.',
  keywords: 'academia goiania, flex fitness, academia premium, crossfit, natação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="bg-flex-white text-flex-dark overflow-x-hidden">
        <AnimationProvider>
          <Navigation />
          <main>{children}</main>
        </AnimationProvider>
      </body>
    </html>
  )
}