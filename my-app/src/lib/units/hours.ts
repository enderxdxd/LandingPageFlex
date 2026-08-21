/**
 * Estado "aberto agora" por unidade, no horário de Brasília.
 *
 * As janelas são DERIVADAS de `units-data.ts` (`unit.hours.weekdays` etc.) em
 * vez de reescritas aqui: os horários já existiam no repositório e continuam
 * sendo a fonte única. Trocar "04:30 - 23:00" naquele arquivo muda o badge,
 * a pill do header e a página /horarios de uma vez só.
 */

import { Unit, unitsData } from '@/lib/constants/units-data'

/** Janela em horas decimais: 04:30 → 4.5 */
export interface Window {
  opens: number
  closes: number
}

export interface UnitHours {
  weekdays: Window
  saturday: Window
  sunday: Window
}

export interface UnitStatus {
  open: boolean
  /** abertura de hoje, formatada (05:00) */
  opensAt: string
  /** fechamento de hoje, formatado (22:00) */
  closesAt: string
}

const parseTime = (value: string): number => {
  const [h, m] = value.trim().split(':')
  return Number(h) + Number(m ?? 0) / 60
}

/** "04:30 - 23:00" → { opens: 4.5, closes: 23 } */
const parseWindow = (range: string): Window => {
  const [opens, closes] = range.split(/\s*[-—–]\s*/)
  return { opens: parseTime(opens), closes: parseTime(closes) }
}

export const unitHours = (unit: Unit): UnitHours => ({
  weekdays: parseWindow(unit.hours.weekdays),
  saturday: parseWindow(unit.hours.saturday),
  sunday: parseWindow(unit.hours.sunday),
})

export const formatHour = (value: number): string => {
  const h = Math.floor(value)
  const m = Math.round((value % 1) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Agora em Brasília — o servidor (Vercel) roda em UTC e o visitante pode estar
 * em qualquer fuso, então a hora vem sempre de `America/Sao_Paulo`.
 */
export const nowInBrasilia = (): { day: number; hour: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0'
  const days: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  }

  // 24:00 aparece como "24" em alguns runtimes, à meia-noite
  const hour = parseInt(get('hour'), 10) % 24

  return { day: days[get('weekday')] ?? 0, hour: hour + parseInt(get('minute'), 10) / 60 }
}

/** Janela do dia da semana (0 = domingo, 6 = sábado). */
export const windowForDay = (hours: UnitHours, day: number): Window =>
  day === 0 ? hours.sunday : day === 6 ? hours.saturday : hours.weekdays

export const unitStatus = (unit: Unit): UnitStatus => {
  const now = nowInBrasilia()
  const win = windowForDay(unitHours(unit), now.day)
  return {
    open: now.hour >= win.opens && now.hour < win.closes,
    opensAt: formatHour(win.opens),
    closesAt: formatHour(win.closes),
  }
}

/** A pill do header: aberta se QUALQUER unidade estiver aberta agora. */
export const anyUnitOpen = (): boolean => unitsData.some(u => unitStatus(u).open)

export const WEEKDAY_NAMES = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

/** Todos os sete dias de uma unidade, para a página /horarios. */
export const weekRows = (unit: Unit): { day: string; range: string; index: number }[] => {
  const hours = unitHours(unit)
  return WEEKDAY_NAMES.map((day, index) => {
    const win = windowForDay(hours, index)
    return { day, index, range: `${formatHour(win.opens)} — ${formatHour(win.closes)}` }
  })
}

/** Índice do dia de hoje em Brasília — usado para destacar a linha. */
export const todayIndex = (): number => nowInBrasilia().day
