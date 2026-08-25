'use client'

/**
 * Horários — quatro painéis num grid de fio de 1px, com estado ao vivo.
 *
 * As janelas vêm de `units-data.ts` via `lib/units/hours` e o estado é
 * recalculado a cada 30s no horário de Brasília, então nenhum horário é
 * reescrito aqui.
 *
 * Cada painel também aponta para a página de horários de aulas da unidade
 * (`/horarios/[slug]`), que é o sistema de PDFs no Firebase que o site já usa —
 * a grade abaixo é o funcionamento da porta, não a grade de coletivas.
 */

import Link from 'next/link'
import Reveal from '@/components/shared/Reveal'
import { Unit, unitsData } from '@/lib/constants/units-data'
import { useUnitStatus } from '@/hooks/useLiveStatus'

function HoursRow({ day, range, last }: { day: string; range: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '9px 0',
        borderBottom: last ? 'none' : '1px solid var(--color-divider)',
        fontSize: 14,
      }}
    >
      <span style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{day}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{range}</span>
    </div>
  )
}

function UnitPanel({ unit }: { unit: Unit }) {
  const status = useUnitStatus(unit)

  const badgeText = !status
    ? '—'
    : status.open
      ? `Aberto até ${status.closesAt}`
      : `Abre ${status.opensAt}`

  return (
    <div style={{ background: 'var(--color-bg)', padding: '26px 22px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 22 }}>{unit.name}</h3>
        <span
          style={{
            fontSize: 12,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            border: `1px solid ${
              status?.open
                ? 'color-mix(in srgb, var(--color-open-text) 40%, transparent)'
                : 'var(--color-divider)'
            }`,
            color: status?.open
              ? 'var(--color-open-text)'
              : 'color-mix(in srgb, var(--color-text) 55%, transparent)',
          }}
        >
          {badgeText}
        </span>
      </div>

      <HoursRow day="Seg — Sex" range={unit.hours.weekdays} />
      <HoursRow day="Sábado" range={unit.hours.saturday} />
      <HoursRow day="Domingo" range={unit.hours.sunday} last />

      <Link
        className="btn btn-ghost"
        href={`/horarios/${unit.slug}`}
        style={{
          marginTop: 16,
          padding: '8px 0',
        }}
      >
        Grade de coletivas →
      </Link>
    </div>
  )
}

export default function Horarios() {
  return (
    <section id="horarios" className="section-seam" style={{ padding: 'var(--band) var(--edge)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Reveal
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            marginBottom: 'clamp(28px,3vw,48px)',
          }}
        >
          <h2 className="h-section">Quando a porta abre</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            <Link
              className="btn btn-primary"
              href="/horarios#grades-coletivas"
              style={{ padding: '10px 16px' }}
            >
              Grade de coletivas
            </Link>
            <Link className="btn btn-secondary" href="/horarios" style={{ padding: '10px 16px' }}>
              Funcionamento semanal
            </Link>
          </div>
        </Reveal>

        {/* grid de fio: o gap de 1px sobre o divider desenha as linhas */}
        <Reveal
          delay={90}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
            gap: 1,
            background: 'var(--color-divider)',
            border: '1px solid var(--color-divider)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {unitsData.map(unit => (
            <UnitPanel key={unit.slug} unit={unit} />
          ))}
        </Reveal>

        <p
          style={{
            margin: '16px 0 0',
            fontSize: 12,
            color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          }}
        >
          Horário de Brasília. Feriados podem ter funcionamento reduzido — confirme no WhatsApp da
          unidade.
        </p>
      </div>
    </section>
  )
}
