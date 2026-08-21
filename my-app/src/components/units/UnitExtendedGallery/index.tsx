'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Unit } from '@/lib/constants/units-data'

// O restante só entra no DOM sob demanda; isso evita baixar dezenas de fotos
// grandes na primeira visita à página da unidade.
const INITIAL_PHOTOS = 8

interface UnitExtendedGalleryProps {
  unit: Unit
}

export default function UnitExtendedGallery({ unit }: UnitExtendedGalleryProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const visibleImages = expanded ? unit.images : unit.images.slice(0, INITIAL_PHOTOS)

  useEffect(() => {
    if (selectedIndex === null) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowLeft') {
        setSelectedIndex(current =>
          current === null ? null : (current - 1 + unit.images.length) % unit.images.length
        )
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex(current =>
          current === null ? null : (current + 1) % unit.images.length
        )
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedIndex, unit.images.length])

  const move = (direction: -1 | 1) => {
    setSelectedIndex(current =>
      current === null ? null : (current + direction + unit.images.length) % unit.images.length
    )
  }

  return (
    <section className="unit-gallery-section" aria-labelledby="unit-gallery-title">
      <div className="unit-gallery-heading">
        <div>
          <p className="kicker">Conheça os espaços</p>
          <h2 id="unit-gallery-title" className="h-section">
            Galeria da unidade
          </h2>
        </div>
        <p className="unit-gallery-count">
          {unit.images.length} {unit.images.length === 1 ? 'foto' : 'fotos'}
        </p>
      </div>

      <div className="unit-gallery-grid">
        {visibleImages.map((src, index) => (
          <button
            className="unit-gallery-photo"
            data-wide={index % 7 === 0 ? 'true' : undefined}
            key={`${src}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Abrir foto ${index + 1} da unidade ${unit.name}`}
          >
            <Image
              src={src}
              alt={`Unidade ${unit.name}, foto ${index + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      {unit.images.length > INITIAL_PHOTOS && (
        <button
          className="btn btn-secondary unit-gallery-more"
          type="button"
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? 'Mostrar menos' : `Ver todas as ${unit.images.length} fotos`}
        </button>
      )}

      {selectedIndex !== null && (
        <div
          className="unit-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria da unidade ${unit.name}`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="unit-lightbox-close"
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Fechar galeria"
          >
            ×
          </button>
          <button
            className="unit-lightbox-nav"
            data-direction="previous"
            type="button"
            onClick={event => {
              event.stopPropagation()
              move(-1)
            }}
            aria-label="Foto anterior"
          >
            ←
          </button>
          <div className="unit-lightbox-image" onClick={event => event.stopPropagation()}>
            <Image
              src={unit.images[selectedIndex]}
              alt={`Unidade ${unit.name}, foto ${selectedIndex + 1}`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button
            className="unit-lightbox-nav"
            data-direction="next"
            type="button"
            onClick={event => {
              event.stopPropagation()
              move(1)
            }}
            aria-label="Próxima foto"
          >
            →
          </button>
          <p className="unit-lightbox-counter">
            {selectedIndex + 1} / {unit.images.length}
          </p>
        </div>
      )}
    </section>
  )
}
