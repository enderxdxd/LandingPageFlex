// src/components/ClientOnly.tsx
'use client'

import { useEffect, useState } from 'react'

export function useIsClient() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  return isClient
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return isMobile
}

export default function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return <>{children}</>
}