import Link from 'next/link'
import type { Unit } from '@/lib/constants/units-data'
import { modalidadeCategories, modalidadesData } from '@/lib/constants/modalidades-data'

interface UnitClassesProps {
  unit: Unit
}

export default function UnitClasses({ unit }: UnitClassesProps) {
  return (
    <section className="unit-classes-section section-seam" aria-labelledby="unit-classes-title">
      <div className="unit-classes-heading">
        <div>
          <p className="kicker">Catálogo FLEX</p>
          <h2 id="unit-classes-title" className="h-section">
            Aulas e modalidades
          </h2>
        </div>
        <div className="unit-classes-intro">
          <p>
            Conheça as modalidades que podem fazer parte da programação de aulas da FLEX. Para
            confirmar a oferta na unidade {unit.name}, consulte a grade vigente.
          </p>
          <Link className="btn btn-primary" href={`/horarios/${unit.slug}`}>
            Ver grade atualizada
          </Link>
        </div>
      </div>

      <div className="unit-class-groups">
        {modalidadeCategories.map((category, categoryIndex) => {
          const classes = modalidadesData.filter(item => item.category === category)

          return (
            <details className="unit-class-group" key={category} open={categoryIndex === 0}>
              <summary>
                <span>{category}</span>
                <span className="unit-class-total">{classes.length}</span>
              </summary>
              <div className="unit-class-grid">
                {classes.map(item => (
                  <article className="unit-class-card" key={item.name}>
                    <h3>
                      {item.name}
                      <sup aria-hidden="true">*</sup>
                    </h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </details>
          )
        })}
      </div>

      <p className="unit-classes-note">
        <strong>* Disponibilidade por unidade:</strong> esta modalidade pode não fazer parte da
        programação de todas as unidades. Consulte a grade atualizada de {unit.name} para confirmar
        a disponibilidade, os dias e os horários antes de se deslocar.
      </p>
    </section>
  )
}
