'use client'

/**
 * Loader do RD Station, só na página de aula experimental.
 *
 * Fica atrás do consentimento de marketing: é automação de marketing de
 * terceiro, que grava identificadores no navegador do visitante. Carregá-lo
 * antes do aceite contradiz o que a Política de Cookies promete e é
 * tratamento sem base legal sob a LGPD.
 */

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useCookiePermission } from '@/hooks/useCookieManager'

export default function RDStationScript() {
  const pathname = usePathname()
  const marketingAllowed = useCookiePermission('marketing')

  if (!pathname.startsWith('/freepass')) return null
  if (!marketingAllowed) return null

  return (
    <Script
      src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/eda04c60-bc7f-47a9-8ab5-825b07e5355e-loader.js"
      strategy="afterInteractive"
    />
  )
}
