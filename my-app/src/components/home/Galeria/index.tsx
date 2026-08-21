import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/shared/Reveal'
import { getUnitBySlug } from '@/lib/constants/units-data'

type Shape = 'wide' | 'tall' | 'portrait'
type GalleryPhoto = { src: string; unit: string; slug: string; room: string; shape: Shape }

const ASPECT: Record<Shape, string> = {
  wide: '16 / 10',
  tall: '3 / 4',
  portrait: '4 / 5',
}

function galleryPhoto(
  slug: string,
  imageIndex: number,
  room: string,
  shape: Shape
): GalleryPhoto {
  const unit = getUnitBySlug(slug)
  if (!unit) throw new Error(`Unidade da galeria não encontrada: ${slug}`)

  return {
    src: unit.featuredImages[imageIndex] ?? unit.wideImage,
    unit: unit.name,
    slug: unit.slug,
    room,
    shape,
  }
}

/**
 * Curadoria alternada das quatro unidades. Os caminhos vêm de `units-data`,
 * então a galeria acompanha as fotos selecionadas para cada unidade.
 */
const PHOTOS: GalleryPhoto[] = [
  galleryPhoto('buena-vista', 0, 'Área de treino', 'portrait'),
  galleryPhoto('alphaville', 0, 'CrossFit Box', 'wide'),
  galleryPhoto('marista', 0, 'Musculação', 'tall'),
  galleryPhoto('palmas', 0, 'Cardio e força', 'wide'),
  galleryPhoto('alphaville', 2, 'Recepção', 'tall'),
  galleryPhoto('buena-vista', 1, 'Coletivas', 'wide'),
  galleryPhoto('marista', 1, 'Área de treino', 'portrait'),
  galleryPhoto('alphaville', 1, 'Área de musculação', 'wide'),
  galleryPhoto('palmas', 1, 'Área de força', 'tall'),
  galleryPhoto('buena-vista', 2, 'Cardio', 'wide'),
]

export default function Galeria() {
  return (
    <section
      id="galeria"
      className="section-seam"
      style={{ padding: 'var(--band) 0', overflow: 'hidden' }}
    >
      <Reveal
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '0 var(--edge) clamp(28px,3vw,44px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.6vw,52px)', lineHeight: 0.98 }}>
          Por dentro
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          }}
        >
          Cada foto abre a página da unidade
        </p>
      </Reveal>

      <div className="gallery-rail">
        <ul
          className="gallery-scroller"
          aria-label="Fotos das unidades Flex"
          style={{ margin: 0, padding: '0 var(--edge)', listStyle: 'none' }}
        >
          {PHOTOS.map((photo, index) => (
            <li
              key={`${photo.slug}-${photo.room}-${index}`}
              className="gallery-item"
              data-shape={photo.shape}
            >
              <Link
                href={`/unidades/${photo.slug}`}
                aria-label={`Abrir a página da unidade ${photo.unit}: ${photo.room}`}
                style={{ display: 'block' }}
              >
                <div className="gallery-frame" style={{ aspectRatio: ASPECT[photo.shape] }}>
                  <Image
                    src={photo.src}
                    alt={`${photo.room} — unidade ${photo.unit}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 78vw, (max-width: 1100px) 44vw, 520px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingTop: 10,
                  }}
                >
                  <span className="gallery-caption" style={{ fontSize: 14 }}>
                    {photo.room} — {photo.unit}
                  </span>
                  <span
                    className="gallery-arrow"
                    aria-hidden="true"
                    style={{
                      fontSize: 13,
                      color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <span className="gallery-edge" data-side="end" aria-hidden="true" />
      </div>
    </section>
  )
}
