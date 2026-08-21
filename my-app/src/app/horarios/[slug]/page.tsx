'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ScheduleService } from '@/utils/scheduleService'
import type { Schedule } from '@/types/schedule'
import { getUnitBySlug, unitWhatsAppUrl, unitsData } from '@/lib/constants/units-data'

type ScheduleKind = 'musculacao' | 'crossfit'
type ScheduleState = Record<ScheduleKind, Schedule | null>

const EMPTY_SCHEDULES: ScheduleState = { musculacao: null, crossfit: null }

function formatUpdated(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function LoadingState() {
  return (
    <div className="schedule-state" role="status" aria-live="polite">
      <span className="schedule-spinner" aria-hidden="true" />
      <h2>Carregando a grade</h2>
      <p>Buscando o arquivo mais recente desta unidade.</p>
    </div>
  )
}

export default function SchedulePage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const unit = getUnitBySlug(slug)

  const [schedules, setSchedules] = useState<ScheduleState>(EMPTY_SCHEDULES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ScheduleKind>('musculacao')

  const loadSchedules = useCallback(async () => {
    if (!unit) {
      setError('Unidade não encontrada.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      setSchedules(await ScheduleService.getAllSchedules(unit.id))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar a grade.')
    } finally {
      setLoading(false)
    }
  }, [unit])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  if (!unit) {
    return (
      <article className="schedule-page">
        <div className="schedule-state">
          <p className="kicker">Grade de aulas</p>
          <h1>Unidade não encontrada</h1>
          <p>Escolha uma das unidades disponíveis para continuar.</p>
          <Link className="btn btn-primary" href="/horarios#grades-coletivas">
            Ver unidades
          </Link>
        </div>
      </article>
    )
  }

  const showCrossfit = unit.hasCrossfit || Boolean(schedules.crossfit)
  const activeSchedule = schedules[activeTab]
  const activeLabel = activeTab === 'crossfit' ? 'CrossFit' : 'Aulas coletivas'

  return (
    <article className="schedule-page">
      <div className="schedule-page-inner">
        <Link className="btn btn-ghost schedule-back" href="/horarios#grades-coletivas">
          ← Todas as grades
        </Link>

        <nav className="schedule-unit-tabs" aria-label="Escolher unidade">
          {unitsData.map(item => (
            <Link
              key={item.slug}
              href={`/horarios/${item.slug}`}
              aria-current={item.slug === unit.slug ? 'page' : undefined}
              className={item.slug === unit.slug ? 'btn btn-primary' : 'btn btn-secondary'}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <header className="schedule-hero">
          <div>
            <p className="kicker">{unit.city} · Grade atualizada</p>
            <h1>Grade de aulas<br />{unit.name}</h1>
            <p>
              Consulte a programação atual da unidade. Para confirmar vagas ou alterações do dia,
              fale diretamente com a recepção.
            </p>
          </div>

          <div className="schedule-hero-meta">
            <div>
              <span>Funcionamento</span>
              <strong>Seg–Sex&nbsp;&nbsp;{unit.hours.weekdays}</strong>
            </div>
            <div>
              <span>Contato</span>
              <strong>{unit.phone}</strong>
            </div>
            <button className="btn btn-secondary" type="button" onClick={loadSchedules} disabled={loading}>
              {loading ? 'Atualizando…' : 'Atualizar grade'}
            </button>
          </div>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="schedule-state" role="alert">
            <p className="kicker">Falha de conexão</p>
            <h2>Não foi possível carregar a grade</h2>
            <p>{error}</p>
            <button className="btn btn-primary" type="button" onClick={loadSchedules}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {showCrossfit && (
              <div className="schedule-type-tabs" role="tablist" aria-label="Tipo de grade">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'musculacao'}
                  onClick={() => setActiveTab('musculacao')}
                >
                  Aulas coletivas
                  <small>{schedules.musculacao ? 'Disponível' : 'Não publicada'}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'crossfit'}
                  onClick={() => setActiveTab('crossfit')}
                >
                  CrossFit
                  <small>{schedules.crossfit ? 'Disponível' : 'Não publicada'}</small>
                </button>
              </div>
            )}

            {activeSchedule ? (
              <section className="schedule-viewer" aria-labelledby="schedule-viewer-title">
                <div className="schedule-viewer-header">
                  <div>
                    <p className="label-sm">Documento oficial</p>
                    <h2 id="schedule-viewer-title">{activeLabel}</h2>
                    <p>Atualizado em {formatUpdated(activeSchedule.updatedAt)}</p>
                  </div>
                  <div className="schedule-viewer-actions">
                    <a
                      className="btn btn-primary"
                      href={activeSchedule.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir em tela cheia ↗
                    </a>
                    <a
                      className="btn btn-secondary"
                      href={activeSchedule.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Baixar PDF
                    </a>
                  </div>
                </div>

                <div className="schedule-pdf-shell">
                  <iframe
                    key={activeSchedule.imageUrl}
                    src={`${activeSchedule.imageUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="schedule-pdf-frame"
                    title={`Grade de ${activeLabel} — Flex ${unit.name}`}
                    loading="lazy"
                  />
                </div>
              </section>
            ) : (
              <section className="schedule-state">
                <p className="kicker">{activeLabel}</p>
                <h2>Grade ainda não publicada</h2>
                <p>A programação desta modalidade não está disponível no momento.</p>
                <a
                  className="btn btn-primary"
                  href={unitWhatsAppUrl(
                    unit,
                    `Olá! Gostaria de consultar a grade de ${activeLabel.toLowerCase()} da unidade ${unit.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar no WhatsApp
                </a>
              </section>
            )}
          </>
        )}

        <aside className="schedule-notice">
          <div>
            <p className="label-sm">Antes de ir</p>
            <h2>Informações importantes</h2>
          </div>
          <ul>
            <li>Horários podem sofrer alterações em feriados.</li>
            <li>Para agendamento e disponibilidade, consulte a recepção.</li>
            <li>A programação exibida é a versão mais recente cadastrada pela unidade.</li>
          </ul>
        </aside>
      </div>
    </article>
  )
}
