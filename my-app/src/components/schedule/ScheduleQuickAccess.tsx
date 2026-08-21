import Link from 'next/link'
import { unitsData } from '@/lib/constants/units-data'

export default function ScheduleQuickAccess() {
  return (
    <section
      id="grades-coletivas"
      aria-labelledby="grades-coletivas-title"
      style={{
        marginBottom: 'clamp(42px,6vw,72px)',
        padding: 'clamp(22px,3vw,34px)',
        border: '1px solid var(--color-divider)',
        borderRadius: 'var(--radius-lg)',
        background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
        scrollMarginTop: 88,
      }}
    >
      <p className="kicker" style={{ marginBottom: 10 }}>
        Acesso rápido
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 22,
        }}
      >
        <h2 id="grades-coletivas-title" style={{ margin: 0, fontSize: 'clamp(28px,3.6vw,48px)' }}>
          Grade de aulas coletivas
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '42ch',
            fontSize: 14,
            color: 'color-mix(in srgb, var(--color-text) 58%, transparent)',
          }}
        >
          Escolha sua unidade para abrir a grade atualizada.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px),1fr))',
          gap: 10,
        }}
      >
        {unitsData.map(unit => (
          <Link
            key={unit.slug}
            href={`/horarios/${unit.slug}`}
            className="schedule-unit-link"
            aria-label={`Abrir grade de aulas coletivas da unidade ${unit.name}`}
          >
            <span>
              <strong>{unit.name}</strong>
              <small>{unit.city}</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
