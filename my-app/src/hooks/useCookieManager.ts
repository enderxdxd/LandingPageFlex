// src/hooks/useCookieManager.ts
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export interface CookieConsent {
  preferences: CookiePreferences
  timestamp: string
  version: string
}

export function useCookieManager() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  })
  const [isLoading, setIsLoading] = useState(true)

  // Carregar preferências salvas
  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        const saved = localStorage.getItem('cookie_consent')
        if (saved) {
          const consent: CookieConsent = JSON.parse(saved)
          setPreferences(consent.preferences)
          setHasConsent(true)
          
          // Verificar se o consentimento é válido (não expirado)
          const consentDate = new Date(consent.timestamp)
          const now = new Date()
          const daysDiff = (now.getTime() - consentDate.getTime()) / (1000 * 3600 * 24)
          
          // Se passou mais de 1 ano, pedir consentimento novamente
          if (daysDiff > 365) {
            localStorage.removeItem('cookie_consent')
            setHasConsent(false)
          }
        } else {
          setHasConsent(false)
        }
      } catch (error) {
        console.error('Erro ao carregar preferências de cookies:', error)
        setHasConsent(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedPreferences()
  }, [])

  // Função para salvar preferências
  const savePreferences = useCallback((newPreferences: CookiePreferences) => {
    const consent: CookieConsent = {
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    try {
      localStorage.setItem('cookie_consent', JSON.stringify(consent))
      setPreferences(newPreferences)
      setHasConsent(true)
      
      // Aplicar preferências
      applyPreferences(newPreferences)
    } catch (error) {
      console.error('Erro ao salvar preferências de cookies:', error)
    }
  }, [])

  // Aplicar preferências carregando/removendo scripts
  const applyPreferences = useCallback((prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      loadGoogleAnalytics()
    } else {
      removeGoogleAnalytics()
    }

    // Marketing/Advertising
    if (prefs.marketing) {
      loadMarketingScripts()
    } else {
      removeMarketingScripts()
    }

    // Functional
    if (prefs.functional) {
      loadFunctionalScripts()
    } else {
      removeFunctionalScripts()
    }

    // Disparar evento customizado para outros componentes
    window.dispatchEvent(new CustomEvent('cookiePreferencesChanged', {
      detail: prefs
    }))
  }, [])

  // Carregar Google Analytics
  const loadGoogleAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return

    // Verificar se já está carregado
    if (typeof window.gtag === 'function') return

    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
    
    // Carregar script do GA
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    // Configurar GA
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer?.push(arguments)
      }
      window.gtag?.('js', new Date())
      window.gtag?.('config', GA_ID, {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=lax'
      })
    }
  }, [])

  // Remover Google Analytics
  const removeGoogleAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return

    // Remover scripts
    const scripts = document.querySelectorAll('script[src*="googletagmanager"]')
    scripts.forEach(script => script.remove())

    // Limpar cookies do GA
    const gaCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || cookie.trim().startsWith('_gid')
    )
    
    gaCookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })

    // Remover variáveis globais
    window.gtag = undefined
    window.dataLayer = undefined
  }, [])

  // Carregar scripts de marketing
  const loadMarketingScripts = useCallback(() => {
    if (typeof window === 'undefined') return

    // Facebook Pixel
    const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
    if (FB_PIXEL_ID && !window.fbq) {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)
    }
  }, [])

  // Remover scripts de marketing
  const removeMarketingScripts = useCallback(() => {
    if (typeof window === 'undefined') return

    // Remover Facebook Pixel
    const fbScripts = document.querySelectorAll('script[src*="facebook.net"]')
    fbScripts.forEach(script => script.remove())

    // Limpar cookies do Facebook
    const fbCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_fbp') || cookie.trim().startsWith('_fbc')
    )
    
    fbCookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })

    window.fbq = undefined
  }, [])

  // Carregar scripts funcionais
  const loadFunctionalScripts = useCallback(() => {
    if (typeof window === 'undefined') return

    // Hotjar
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID
    if (HOTJAR_ID && !window.hj) {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(script)
    }

    // Chat/Zendesk
    const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY
    if (ZENDESK_KEY && !window.zE) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`
      document.head.appendChild(script)
    }
  }, [])

  // Remover scripts funcionais
  const removeFunctionalScripts = useCallback(() => {
    if (typeof window === 'undefined') return

    // Remover Hotjar
    const hotjarScripts = document.querySelectorAll('script[src*="hotjar.com"]')
    hotjarScripts.forEach(script => script.remove())

    // Remover Zendesk
    const zendeskScripts = document.querySelectorAll('script[src*="zdassets.com"]')
    zendeskScripts.forEach(script => script.remove())

    // Limpar cookies funcionais
    const functionalCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_hj') || 
      cookie.trim().startsWith('ZD-') ||
      cookie.trim().startsWith('user_preferences')
    )
    
    functionalCookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })

    window.hj = undefined
    window.zE = undefined
  }, [])

  // Verificar se um tipo específico de cookie está permitido
  const isAllowed = useCallback((type: keyof CookiePreferences): boolean => {
    if (!hasConsent) return type === 'necessary'
    return preferences[type]
  }, [hasConsent, preferences])

  // Aceitar todos os cookies
  const acceptAll = useCallback(() => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    savePreferences(allPreferences)
  }, [savePreferences])

  // Rejeitar todos os cookies (exceto necessários)
  const rejectAll = useCallback(() => {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    savePreferences(minimalPreferences)
  }, [savePreferences])

  // Resetar consentimento (para teste ou reconfiguração)
  const resetConsent = useCallback(() => {
    localStorage.removeItem('cookie_consent')
    setHasConsent(false)
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    })
    
    // Remover todos os scripts não essenciais
    removeGoogleAnalytics()
    removeMarketingScripts()
    removeFunctionalScripts()
  }, [removeGoogleAnalytics, removeMarketingScripts, removeFunctionalScripts])

  // Aplicar preferências quando carregadas
  useEffect(() => {
    if (hasConsent && !isLoading) {
      applyPreferences(preferences)
    }
  }, [hasConsent, preferences, isLoading, applyPreferences])

  return {
    // Estado
    hasConsent,
    preferences,
    isLoading,
    
    // Funções
    savePreferences,
    acceptAll,
    rejectAll,
    resetConsent,
    isAllowed,
    
    // Utilitários
    shouldShowBanner: hasConsent === false && !isLoading
  }
}

// Hook para componentes que precisam verificar permissões específicas
export function useCookiePermission(type: keyof CookiePreferences) {
  const { isAllowed } = useCookieManager()
  return isAllowed(type)
}

// Hook para tracking condicionado
export function useConditionalTracking() {
  const { isAllowed } = useCookieManager()

  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (isAllowed('analytics') && window.gtag) {
      window.gtag('event', eventName, parameters)
    }
  }, [isAllowed])

  const trackPageView = useCallback((path: string) => {
    if (isAllowed('analytics') && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path
      })
    }
  }, [isAllowed])

  const trackConversion = useCallback((conversionId: string, value?: number) => {
    if (isAllowed('marketing')) {
      // Google Ads
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: conversionId,
          value: value
        })
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'Purchase', { value: value })
      }
    }
  }, [isAllowed])

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    canTrack: isAllowed('analytics'),
    canTrackConversions: isAllowed('marketing')
  }
}

// Tipos para o Window object
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    fbq?: (...args: any[]) => void
    hj?: (...args: any[]) => void
    zE?: (...args: any[]) => void
  }
}