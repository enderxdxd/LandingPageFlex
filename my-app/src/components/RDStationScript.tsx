'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function RDStationScript() {
  const pathname = usePathname()

  if (!pathname.startsWith('/freepass')) return null

  return (
    <Script
      src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/eda04c60-bc7f-47a9-8ab5-825b07e5355e-loader.js"
      strategy="afterInteractive"
    />
  )
}
