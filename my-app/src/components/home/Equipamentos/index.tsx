/**
 * Equipamentos.
 *
 * As quatro etiquetas sobre a foto grande são QUALITATIVAS de propósito.
 * Não inventar especificações — nada de pesos, contagens ou números de modelo.
 *
 * Só estas três marcas, e cada uma tem evidência: Eleiko vem da copy do próprio
 * cliente. Não acrescentar marcas não verificadas. Os três SVGs abaixo foram
 * fornecidos pelo cliente.
 */

import Image from 'next/image'
import Reveal from '@/components/shared/Reveal'

const CROSSFIT = '/images/optimized/alphaville-crossfit.webp'
const PALMAS_CARDIO = '/images/optimized/palmas-01.webp'
const PALMAS_FORCA = '/images/optimized/palmas-wide.webp'

const CRITERIA = ['Biomecânica', 'Amplitude', 'Estabilidade', 'Performance']

const BRANDS = [
  {
    name: 'Eleiko',
    qualifier: 'Peso livre · padrão olímpico',
    copy: 'Equipamentos voltados ao treinamento com pesos livres e à preparação de força.',
    image: CROSSFIT,
    logo: '/images/brands/eleiko.svg',
    squareLogoCanvas: true,
    alt: 'Anilhas e barras no CrossFit Box da unidade Alphaville',
    photoFirst: true,
  },
  {
    name: 'Life Fitness',
    qualifier: 'Cardio e força',
    copy: 'Soluções para treinamento cardiovascular e exercícios de força.',
    image: PALMAS_CARDIO,
    logo: '/images/brands/life-fitness.svg',
    squareLogoCanvas: false,
    alt: 'Estações Life Fitness na unidade Palmas',
    photoFirst: false,
  },
  {
    name: 'Hammer Strength',
    qualifier: 'Força · plate loaded',
    copy: 'Equipamentos voltados ao treinamento de força com carga em anilhas.',
    image: PALMAS_FORCA,
    logo: '/images/brands/hammer-strength.svg',
    squareLogoCanvas: true,
    alt: 'Área de força com máquinas Hammer Strength',
    photoFirst: true,
  },
]

function BrandPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 820px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
    </div>
  )
}

/**
 * Logo do fabricante direto sobre o fundo escuro.
 *
 * Antes cada marca vinha numa caixa branca — sobre a página escura elas liam
 * como adesivos colados por cima do design. O tratamento padrão para marca de
 * parceiro em fundo escuro é monocromático: o filtro achata o SVG para branco e
 * a opacidade o coloca abaixo do nome da marca na hierarquia, sem descaracterizá-lo.
 */
function BrandLogo({ src, name, square }: { src: string; name: string; square: boolean }) {
  return (
    /* os SVGs de canvas quadrado trazem a marca pequena no meio de muito ar;
       casá-los por altura de caixa deixaria o Eleiko com 8px de letra. A altura
       aqui é ÓPTICA — o que importa é as três marcas pesarem igual na página. */
    <div style={{ marginTop: 22, height: square ? 74 : 34, display: 'flex', alignItems: 'center' }}>
      <Image
        src={src}
        alt={`Logotipo ${name}`}
        width={square ? 200 : 190}
        height={square ? 200 : 34}
        unoptimized
        style={{
          height: square ? 74 : 22,
          width: 'auto',
          maxWidth: 220,
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
          opacity: 0.72,
        }}
      />
    </div>
  )
}

export default function Equipamentos() {
  return (
    <section
      id="equipamento"
      className="section-seam"
      style={{ padding: 'var(--band) var(--edge)' }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Reveal
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))',
            gap: 'clamp(28px,4vw,72px)',
            alignItems: 'end',
            marginBottom: 'clamp(28px,4vw,52px)',
          }}
        >
          <div>
            <h2 className="h-section">
              Performance começa
              <br />
              no equipamento
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: '46ch',
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            }}
          >
            Marcas que fazem parte da estrutura apresentada pela FLEX. A disponibilidade de linhas e
            equipamentos pode variar entre as unidades.
          </p>
        </Reveal>

        {/* a leitura técnica: uma moldura grande, etiquetas anotando o que a
            máquina é julgada por */}
        <Reveal
          as="div"
          delay={90}
          style={{
            position: 'relative',
            margin: '0 0 clamp(28px,4vw,56px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '21 / 9' }}>
            <Image
              src={PALMAS_FORCA}
              alt="Área de força com máquinas plate-loaded"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(11,12,20,.28) 0%, rgba(11,12,20,.62) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              alignContent: 'end',
              gap: 12,
              padding: 'clamp(16px,3vw,34px)',
            }}
          >
            {CRITERIA.map(criterion => (
              <div key={criterion} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    width: 18,
                    height: 1,
                    background: 'var(--color-accent-600)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(12px,.9vw,13px)',
                    letterSpacing: '.16em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 82%, transparent)',
                  }}
                >
                  {criterion}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'grid', gap: 0 }}>
          {BRANDS.map((brand, i) => {
            const text = (
              <div key="text">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <span style={{ width: 34, height: 2, background: 'var(--color-accent-600)' }} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'clamp(24px,2.6vw,36px)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {brand.name}
                  </h3>
                </div>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: 13,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                  }}
                >
                  {brand.qualifier}
                </p>
                <p
                  style={{
                    margin: '0 0 14px',
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
                  }}
                >
                  {brand.copy}
                </p>
                <BrandLogo
                  src={brand.logo}
                  name={brand.name}
                  square={brand.squareLogoCanvas}
                />
              </div>
            )
            const photo = <BrandPhoto key="photo" src={brand.image} alt={brand.alt} />

            return (
              <Reveal
                as="article"
                key={brand.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))',
                  gap: 'clamp(20px,3vw,48px)',
                  alignItems: 'center',
                  padding: 'clamp(24px,3vw,40px) 0',
                  borderTop: '1px solid var(--color-divider)',
                  borderBottom:
                    i === BRANDS.length - 1 ? '1px solid var(--color-divider)' : undefined,
                }}
              >
                {brand.photoFirst ? [photo, text] : [text, photo]}
              </Reveal>
            )
          })}
        </div>

        <p
          style={{
            margin: '18px 0 0',
            fontSize: 12,
            color: 'color-mix(in srgb, var(--color-text) 42%, transparent)',
          }}
        >
          Consulte a unidade para confirmar a disponibilidade de cada linha de equipamentos.
        </p>
      </div>
    </section>
  )
}
