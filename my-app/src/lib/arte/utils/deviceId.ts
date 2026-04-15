const DEVICE_ID_KEY = 'flex_arte_device_id'
const COOKIE_MAX_AGE = 180 * 24 * 60 * 60 // 180 dias em segundos

/**
 * Gera um UUID v4 usando crypto
 */
function generateDeviceId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback manual
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Obtém o deviceId do localStorage (client-side)
 */
export function getDeviceIdFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(DEVICE_ID_KEY)
  } catch {
    return null
  }
}

/**
 * Salva o deviceId no localStorage
 */
export function saveDeviceIdToStorage(deviceId: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  } catch {
    // localStorage indisponivel
  }
}

/**
 * Remove o deviceId do localStorage
 */
export function clearDeviceIdFromStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(DEVICE_ID_KEY)
  } catch {
    // localStorage indisponivel
  }
}

/**
 * Obtém ou gera um deviceId (client-side)
 * Tenta cookie primeiro, depois localStorage, depois gera novo
 */
export function getOrCreateDeviceId(): string {
  // Tentar localStorage primeiro
  const stored = getDeviceIdFromStorage()
  if (stored) return stored

  // Tentar cookie
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(?:^|; )${DEVICE_ID_KEY}=([^;]*)`))
    if (match) {
      const fromCookie = decodeURIComponent(match[1])
      saveDeviceIdToStorage(fromCookie) // sync
      return fromCookie
    }
  }

  // Gerar novo
  const newId = generateDeviceId()
  saveDeviceIdToStorage(newId)
  setDeviceIdCookie(newId)
  return newId
}

/**
 * Salva deviceId como cookie (client-side)
 */
export function setDeviceIdCookie(deviceId: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${DEVICE_ID_KEY}=${encodeURIComponent(deviceId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

/**
 * Limpa deviceId do cookie e localStorage
 */
export function clearDeviceId(): void {
  clearDeviceIdFromStorage()
  if (typeof document !== 'undefined') {
    document.cookie = `${DEVICE_ID_KEY}=; path=/; max-age=0`
  }
}

/**
 * Extrai deviceId do cookie header (server-side, API routes)
 */
export function getDeviceIdFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|; )${DEVICE_ID_KEY}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
