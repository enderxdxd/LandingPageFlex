import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, Inter } from 'next/font/google'
import './globals.css'
import AnimationProvider from '@/components/providers/AnimationProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Analytics } from '@vercel/analytics/next'
import RDStationScript from '@/components/RDStationScript'
import { FOUNDED_YEAR, yearsInBusiness } from '@/lib/home/brand'

/** Meta Pixel da FLEX. Um lugar só — o script e o fallback noscript leem daqui. */
const META_PIXEL_ID = '1847247459581252'

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
        {/* Meta Pixel — precisa existir antes da hidratação para não perder o
            PageView da primeira navegação */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
      </head>
      <body className="bg-flex-white text-flex-dark">
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
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
