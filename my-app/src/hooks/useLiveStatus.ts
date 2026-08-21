'use client'

import { useEffect, useState } from 'react'
import { Unit } from '@/lib/constants/units-data'
import { UnitStatus, anyUnitOpen, unitStatus } from '@/lib/units/hours'

/**
 * Estado ao vivo de uma unidade, recalculado a cada 30s no horário de Brasília.
 *
 * Fica `null` no primeiro render: o servidor renderiza em UTC e o cliente em
 * Brasília, então imprimir o badge no HTML do servidor produz mismatch de
 * hidratação toda vez que os dois lados caem em janelas diferentes. Os
 * componentes mostram um traço até o primeiro efeito.
 */
export function useUnitStatus(unit: Unit): UnitStatus | null {
  const [status, setStatus] = useState<UnitStatus | null>(null)

  useEffect(() => {
    const tick = () => setStatus(unitStatus(unit))
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [unit])

  return status
}

/** `true` se qualquer unidade estiver aberta agora — a pill do header. */
export function useNetworkOpen(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const tick = () => setOpen(anyUnitOpen())
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return open
}
