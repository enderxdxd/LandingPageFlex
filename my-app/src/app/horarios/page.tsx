'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { unitsData } from '@/lib/constants/units-data'
import { todayIndex, weekRows } from '@/lib/units/hours'
import { useUnitStatus } from '@/hooks/useLiveStatus'
import type { Unit } from '@/lib/constants/units-data'
import ScheduleQuickAccess from '@/components/schedule/ScheduleQuickAccess'

function WeekPanel({ unit, today }: { unit: Unit; today: number | null }) {
  const status = useUnitStatus(unit)

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        padding: 'clamp(22px,3vw,34px)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 22,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 'clamp(25px,3vw,36px)' }}>{unit.name}</h2>
        <span
          style={{
            padding: '4px 9px',
            borderRadius: 999,
            border: `1px solid ${
              status?.open
                ? 'color-mix(in srgb, var(--color-open-text) 40%, transparent)'
                : 'var(--color-divider)'
            }`,
            color: status?.open
              ? 'var(--color-open-text)'
              : 'color-mix(in srgb, var(--color-text) 55%, transparent)',
            fontSize: 10,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {!status ? '—' : status.open ? `Aberto até ${status.closesAt}` : `Abre ${status.opensAt}`}
        </span>
      </div>

      <div>
        {weekRows(unit).map(row => {
          const current = today === row.index
          return (
            <div
              key={row.day}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                marginInline: -10,
                padding: '10px',
                borderBottom: '1px solid var(--color-divider)',
                background: current
                  ? 'color-mix(in srgb, var(--color-accent-600) 12%, transparent)'
                  : 'transparent',
                color: current ? 'var(--color-accent-300)' : 'inherit',
                fontSize: 14,
              }}
            >
              <span>{row.day}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {row.range}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 22 }}>
        <Link className="btn btn-secondary" href={`/horarios/${unit.slug}`}>
          Grade de coletivas
        </Link>
        <Link className="btn btn-ghost" href={`/unidades/${unit.slug}`}>
          Ver unidade →
        </Link>
      </div>
    </section>
  )
}

export default function CompleteHoursPage() {
  const [today, setToday] = useState<number | null>(null)

  useEffect(() => {
    setToday(todayIndex())
  }, [])

  return (
    <article style={{ padding: 'calc(66px + clamp(42px,7vw,92px)) var(--edge) var(--band)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Link className="btn btn-ghost" href="/#horarios" style={{ paddingLeft: 0 }}>
          ← Voltar para a página inicial
        </Link>
        <p className="kicker" style={{ marginTop: 'clamp(34px,5vw,64px)' }}>
          Horários
        </p>
        <h1
          style={{
            margin: '0 0 18px',
            fontSize: 'clamp(46px,8vw,112px)',
            lineHeight: 0.9,
          }}
        >
          Semana completa
        </h1>
        <p
          style={{
            maxWidth: '62ch',
            margin: '0 0 clamp(34px,5vw,64px)',
            color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
          }}
        >
          Funcionamento das quatro unidades no horário de Brasília. A grade de aulas coletivas
          continua disponível separadamente para cada unidade.
        </p>

        <ScheduleQuickAccess />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))',
            gap: 16,
          }}
        >
          {unitsData.map(unit => (
            <WeekPanel key={unit.slug} unit={unit} today={today} />
          ))}
        </div>

        <p
          style={{
            margin: '18px 0 0',
            fontSize: 12,
            color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          }}
        >
          Feriados podem ter funcionamento reduzido. Confirme no WhatsApp da unidade.
        </p>
      </div>
    </article>
  )
}
