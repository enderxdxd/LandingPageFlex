import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed, Archivo, Space_Mono } from 'next/font/google'
import './globals.css'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Analytics } from '@vercel/analytics/next'
import RDStationScript from '@/components/RDStationScript'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'
import { SITE_URL, homeGraph } from '@/lib/seo/structured-data'

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

/*
 * As duas faces do redesenho.
 *
 * Saíram Barlow Condensed (títulos) e Inter (corpo). Condensada em caixa alta é
 * o default de academia, e Inter é a fonte mais usada da internet: juntas, elas
 * dizem "página de template" antes de qualquer palavra ser lida.
 *
 * Archivo é um grotesco de eixo variável: dá para pedir 800 bem apertado no
 * título e 400 confortável no corpo com a MESMA família, então a página tem uma
 * voz só em vez de duas emprestadas.
 *
 * Space Mono entra só onde há medida — hora, m², quilo, telefone, CEP. Não é
 * fantasia de "técnico": academia é medição, e número em monoespaçada alinha em
 * coluna, que é o que uma ficha precisa.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
})

const DESCRIPTION = `No mercado fitness desde ${FOUNDED_YEAR}, são ${yearsInBusiness()} anos de história. Conheça as unidades Flex Alphaville, Buena Vista, Marista e Palmas.`

export const metadata: Metadata = {
  /**
   * `metadataBase` é pré-requisito: sem ele o Next não consegue transformar
   * `/og-image.jpg` na URL absoluta que as redes exigem, e o card de
   * compartilhamento simplesmente não aparece.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Flex Fitness Center — Academias em Goiânia e Palmas',
    template: '%s | Flex Fitness Center',
  },
  // o número de anos sai de lib/home/brand para não divergir da copy da home
  description: DESCRIPTION,
  applicationName: 'Flex Fitness Center',
  alternates: { canonical: '/' },
  /**
   * O funil inteiro do site termina no WhatsApp, e link compartilhado lá sem
   * Open Graph chega como URL pelada — sem foto, sem título, sem contexto.
   * Este bloco é o que transforma um link encaminhado em anúncio.
   */
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Flex Fitness Center',
    title: 'Flex Fitness Center — Academias em Goiânia e Palmas',
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Área de treino da Flex Fitness Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flex Fitness Center — Academias em Goiânia e Palmas',
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: true, address: true, email: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

/**
 * `themeColor` acompanha a rota em `LayoutWrapper` (metade do site é clara e
 * metade escura), então aqui fica só o que é estável. `colorScheme: 'light'`
 * evita que o navegador em modo escuro repinte controles nativos — `<select>`,
 * campos de data — por cima do tema do site.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable} ${archivo.variable} ${spaceMono.variable}`}>
      <head>
        {/* Quatro academias físicas: sem LocalBusiness o Google adivinha
            endereço, telefone e horário a partir do texto, e não mostra o
            resultado enriquecido que decide a busca por proximidade. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeGraph()) }}
        />
      </head>
      <body className="bg-flex-white text-flex-dark">
        {/* Primeiro tab da página: pula o header e o menu, que são dezenas de
            links antes do conteúdo. Só aparece quando recebe foco. */}
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
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
