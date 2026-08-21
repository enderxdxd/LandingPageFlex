import Image from 'next/image'
import Link from 'next/link'
import { Unit, unitMapUrl, unitWhatsAppUrl, unitsData } from '@/lib/constants/units-data'
import UnitClasses from '@/components/units/UnitClasses'
import UnitExtendedGallery from '@/components/units/UnitExtendedGallery'

interface UnitPageClientProps {
  unit: Unit
}

const detailCell = (label: string, value: string) => (
  <div style={{ padding: '20px clamp(16px,2vw,28px)', minWidth: 0 }}>
    <p className="label-sm">{label}</p>
    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45 }}>{value}</p>
  </div>
)

export default function UnitPageClient({ unit }: UnitPageClientProps) {
  return (
    <article style={{ paddingTop: 66 }}>
      <section style={{ padding: 'clamp(42px,7vw,92px) var(--edge) var(--band)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <Link className="btn btn-ghost" href="/#unidades" style={{ paddingLeft: 0 }}>
            ← Voltar para unidades
          </Link>

          <nav
            aria-label="Escolher unidade"
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              padding: '28px 0 clamp(42px,6vw,78px)',
              scrollbarWidth: 'none',
            }}
          >
            {unitsData.map(item => (
              <Link
                key={item.slug}
                href={`/unidades/${item.slug}`}
                aria-current={item.slug === unit.slug ? 'page' : undefined}
                className={item.slug === unit.slug ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ whiteSpace: 'nowrap' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <p className="kicker">{unit.city}</p>
          <h1
            style={{
              margin: '0 0 clamp(26px,4vw,48px)',
              fontSize: 'clamp(46px,8vw,120px)',
              lineHeight: 0.88,
            }}
          >
            {unit.name}
          </h1>

          <div
            style={{
              position: 'relative',
              aspectRatio: '21 / 9',
              minHeight: 260,
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Image
              src={unit.wideImage}
              alt={`Vista da unidade Flex ${unit.name}`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 48%, rgba(11,12,20,.52))',
              }}
            />
          </div>

          <div
            className="unit-facts"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 1,
              marginTop: 1,
              overflow: 'hidden',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-divider)',
            }}
          >
            {detailCell('Área', unit.area)}
            {detailCell('Estacionamento', unit.parking)}
            {detailCell('Referência', unit.landmark)}
            {detailCell('Telefone', unit.phone)}
          </div>
        </div>
      </section>

      <section className="section-seam" style={{ padding: 'var(--band) var(--edge)' }}>
        <div
          style={{
            maxWidth: 'var(--content-max)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
            gap: 'clamp(28px,4vw,64px)',
          }}
        >
          <div>
            <p className="label-sm">Estrutura e serviços</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 9 }}>
              {unit.features.map(feature => (
                <li key={feature} style={{ fontSize: 15 }}>
                  {feature}
                </li>
              ))}
            </ul>

            {!!unit.specialFeatures?.length && (
              <>
                <p className="label-sm" style={{ marginTop: 28 }}>
                  Informações da unidade
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 9 }}>
                  {unit.specialFeatures.map(feature => (
                    <li key={feature} style={{ fontSize: 15 }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <p className="label-sm">Horário</p>
            <p style={{ margin: '0 0 7px' }}>Seg a Sex&nbsp;&nbsp;{unit.hours.weekdays}</p>
            <p style={{ margin: '0 0 7px' }}>Sábado&nbsp;&nbsp;{unit.hours.saturday}</p>
            <p style={{ margin: '0 0 20px' }}>Domingo&nbsp;&nbsp;{unit.hours.sunday}</p>
            <Link className="btn btn-secondary" href={`/horarios/${unit.slug}`}>
              Grade de coletivas
            </Link>
          </div>

          <div>
            <p className="label-sm">Endereço</p>
            <p style={{ margin: '0 0 22px', lineHeight: 1.6 }}>{unit.addressShort}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a
                className="btn btn-primary"
                href={unitWhatsAppUrl(unit)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a
                className="btn btn-secondary"
                href={unitMapUrl(unit)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Como chegar
              </a>
            </div>
          </div>
        </div>
      </section>

      <UnitClasses unit={unit} />
      <UnitExtendedGallery unit={unit} />
    </article>
  )
}
