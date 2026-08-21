/**
 * Se o header está sólido ou transparente.
 *
 * Os capítulos fixados escrevem isto a cada frame do scroll, então não pode ser
 * state do React — seriam ~60 renders por segundo. Uma store externa mínima
 * notifica só quando o booleano de fato muda, e o Header lê via
 * useSyncExternalStore.
 */

let solid = false
const listeners = new Set<() => void>()

export const setHeaderSolid = (value: boolean): void => {
  if (value === solid) return
  solid = value
  listeners.forEach(listener => listener())
}

export const subscribeHeaderSolid = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getHeaderSolid = (): boolean => solid

/** O HTML do servidor é sempre renderizado transparente. */
export const getHeaderSolidServer = (): boolean => false
