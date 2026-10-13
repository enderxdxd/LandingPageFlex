'use client'

/**
 * Header da home redesenhada.
 *
 * Três coisas que não são óbvias:
 *
 *   1. O estado sólido/transparente NÃO é state do React. Os capítulos fixados
 *      escrevem em `lib/home/header-state` a cada frame; ler isso com useState
 *      seriam ~60 renders por segundo. `useSyncExternalStore` só re-renderiza
 *      quando o booleano vira.
 *
 *   2. A seção ativa vem de um IntersectionObserver com rootMargin
 *      -45%/-45%: marca a seção que está na faixa central da viewport, que é o
 *      que o olho considera "onde eu estou".
 *
 *   3. Abaixo de 1000px os links viram drawer — o mesmo limite que liga a barra
 *      de ação fixa, vindo da MESMA flag (useCompact), para que não divirjam.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ClipboardList, Lightbulb, Ticket, Users } from 'lucide-react'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'
import { unitsData } from '@/lib/constants/units-data'
import { useCompact } from '@/hooks/useCompact'
import { useNetworkOpen } from '@/hooks/useLiveStatus'
import {
  getHeaderSolid,
  getHeaderSolidServer,
  subscribeHeaderSolid,
} from '@/lib/home/header-state'
import SocialLinks from '@/components/shared/SocialLinks'

/**
 * `desktop: false` só aparece no drawer, onde há altura de sobra. A linha do
 * desktop já estava no limite com seis itens; "Aulas" abre a seção de
 * modalidades da home, e a grade em si tem um botão próprio lá dentro.
 */
const LINKS = [
  { id: 'unidades', label: 'Unidades', direct: false, desktop: true },
  { id: 'estrutura', label: 'Estrutura', direct: false, desktop: true },
  { id: 'modalidades', label: 'Aulas', drawerLabel: 'Modalidades', direct: false, desktop: true },
  { id: 'equipamento', label: 'Equipamentos', direct: false, desktop: true },
  { id: 'galeria', label: 'Galeria', direct: false, desktop: true },
  { id: 'horarios', label: 'Horários', direct: false, desktop: true },
  { id: 'grades-coletivas', label: 'Grade de aulas', direct: true, desktop: false },
] as const

const FORMS = [
  {
    href: '/procedimentos',
    label: 'Procedimentos',
    description: 'Normas e procedimentos',
    icon: ClipboardList,
  },
  {
    href: '/sugestoes',
    label: 'Sugestões',
    description: 'Envie seu feedback',
    icon: Lightbulb,
  },
  {
    href: '/trabalhe-aqui',
    label: 'Trabalhe Aqui',
    description: 'Faça parte da equipe',
    icon: Users,
  },
  {
    href: '/freepass',
    label: 'Aula Experimental',
    description: 'Agende uma aula grátis',
    icon: Ticket,
  },
] as const

/** A seção na faixa central da viewport. */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = [...LINKS, { id: 'localizacao', label: '' }]
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)

    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return active
}

function StatusPill() {
  const open = useNetworkOpen()
  /**
   * O ponto dá UM flash quando a rede abre ou fecha, e fica quieto no resto do
   * tempo. Antes ele pulsava sem parar, o que lê como alerta pendente em vez de
   * informação. Trocar a key remonta o span e reinicia a animação uma vez.
   */
  const flashKey = open === null ? 'idle' : open ? 'open' : 'closed'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color: 'color-mix(in srgb, var(--color-text) 62%, transparent)',
      }}
    >
      <span
        key={flashKey}
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          color: open ? 'var(--color-open-dot)' : 'var(--color-neutral-600)',
          background: 'currentColor',
          animation: open === null ? undefined : 'statusFlash 900ms var(--ease-arch)',
        }}
      />
      {open === null ? '—' : open ? 'Aberto agora' : 'Fechado agora'}
    </span>
  )
}

export default function Header() {
  const pathname = usePathname()
  const compact = useCompact()
  const active = useActiveSection()
  const [drawer, setDrawer] = useState(false)
  const [openUnit, setOpenUnit] = useState<string | null>(null)
  const [formsOpen, setFormsOpen] = useState(false)
  const [mobileFormsOpen, setMobileFormsOpen] = useState(false)
  const formsRef = useRef<HTMLDivElement>(null)

  const solid = useSyncExternalStore(
    subscribeHeaderSolid,
    getHeaderSolid,
    getHeaderSolidServer
  )
  const headerSolid = pathname !== '/' || solid

  const unitPageSlug = pathname.match(/^\/unidades\/([^/]+)/)?.[1]
  const scheduleHref = unitPageSlug
    ? `/horarios/${unitPageSlug}`
    : '/horarios#grades-coletivas'
  const sectionHref = (link: (typeof LINKS)[number]) =>
    link.direct ? scheduleHref : pathname === '/' ? `#${link.id}` : `/#${link.id}`

  // o drawer tranca o scroll do corpo enquanto está aberto
  useEffect(() => {
    if (!drawer) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawer])

  useEffect(() => {
    if (!formsOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!formsRef.current?.contains(event.target as Node)) setFormsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFormsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [formsOpen])

  // fecha o drawer se a viewport crescer para além do limite compacto
  useEffect(() => {
    if (!compact) setDrawer(false)
    if (compact) setFormsOpen(false)
  }, [compact])

  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 66,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          background: headerSolid ? 'rgba(22,24,38,.9)' : 'transparent',
          backdropFilter: headerSolid ? 'blur(14px)' : undefined,
          WebkitBackdropFilter: headerSolid ? 'blur(14px)' : undefined,
          borderBottom: headerSolid
            ? '1px solid var(--color-divider)'
            : '1px solid transparent',
          transition:
            'background .35s var(--ease-arch), border-color .35s var(--ease-arch)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--content-max)',
            margin: '0 auto',
            padding: '0 var(--edge)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <Link href="/" aria-label="Flex Fitness Center — início" style={{ flexShrink: 0 }}>
            <Image
              src="/images/units/alphaville/flex-logo-outline.png"
              alt="Flex Fitness Center"
              width={118}
              height={34}
              priority
              style={{ width: 118, height: 'auto', display: 'block' }}
            />
          </Link>

          {!compact && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {LINKS.filter(link => link.desktop).map(link => {
                const on = active === link.id
                return (
                  <a
                    className="nav-link"
                    key={link.id}
                    href={sectionHref(link)}
                    aria-current={on ? 'true' : undefined}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            {!compact ? (
              <>
                <div
                  className="nav-forms"
                  ref={formsRef}
                  onMouseEnter={() => setFormsOpen(true)}
                  onMouseLeave={() => setFormsOpen(false)}
                >
                  <button
                    className="nav-forms-trigger"
                    type="button"
                    aria-expanded={formsOpen}
                    aria-haspopup="menu"
                    onClick={() => setFormsOpen(current => !current)}
                  >
                    Formulários
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>

                  {formsOpen && (
                    <div className="nav-forms-panel" role="menu">
                      <p className="nav-forms-label">
                        <ClipboardList size={14} aria-hidden="true" />
                        Formulários
                      </p>
                      <div className="nav-forms-list">
                        {FORMS.map(item => {
                          const Icon = item.icon
                          return (
                            <Link
                              className="nav-form-link"
                              href={item.href}
                              key={item.href}
                              role="menuitem"
                              onClick={() => setFormsOpen(false)}
                            >
                              <span className="nav-form-icon" aria-hidden="true">
                                <Icon size={20} strokeWidth={1.8} />
                              </span>
                              <span>
                                <strong>{item.label}</strong>
                                <small>{item.description}</small>
                              </span>
                              <span className="nav-form-arrow" aria-hidden="true">
                                →
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  className="btn btn-primary"
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '9px 16px', fontSize: 13 }}
                >
                  Fale com a FLEX
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-label="Abrir menu"
                aria-expanded={drawer}
                /* traços de 1.5px sem moldura sumiam sobre a foto do topo — o
                   botão agora tem a mesma caixa de 44px dos ícones sociais */
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  width: 44,
                  height: 44,
                  padding: 0,
                  borderRadius: 'var(--radius-md)',
                  background: 'color-mix(in srgb, var(--color-stage) 55%, transparent)',
                  border: '1px solid var(--color-divider)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                }}
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      height: 2,
                      width: i === 1 ? 14 : 20,
                      borderRadius: 2,
                      background: 'var(--color-text)',
                    }}
                  />
                ))}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* drawer — abaixo de 1000px */}
      {compact && (
        <>
          <div
            onClick={() => setDrawer(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              background: 'rgba(11,12,20,.6)',
              opacity: drawer ? 1 : 0,
              pointerEvents: drawer ? 'auto' : 'none',
              transition: 'opacity .34s var(--ease-arch)',
            }}
          />
          <aside
            aria-hidden={!drawer}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 95,
              width: 'min(88vw, 380px)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg)',
              borderLeft: '1px solid var(--color-divider)',
              transform: drawer ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform .34s var(--ease-arch)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '0 20px',
                height: 66,
                flexShrink: 0,
              }}
            >
              <StatusPill />
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Fechar menu"
                style={{
                  width: 44,
                  height: 44,
                  background: 'transparent',
                  border: 0,
                  color: 'var(--color-text)',
                  fontSize: 22,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* `overscroll-behavior: contain` impede que rolar até o fim do
                drawer continue rolando a página atrás dele */}
            <nav
              style={{
                flex: 1,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                padding: '8px 20px 20px',
              }}
            >
              {LINKS.map(link => (
                <a
                  key={link.id}
                  href={sectionHref(link)}
                  onClick={() => setDrawer(false)}
                  style={{
                    display: 'block',
                    padding: '13px 0',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: 22,
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  {'drawerLabel' in link ? link.drawerLabel : link.label}
                </a>
              ))}

              {/* o drawer carrega Localização, que o nav desktop omite */}
              <a
                href={pathname === '/' ? '#localizacao' : '/#localizacao'}
                onClick={() => setDrawer(false)}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: 22,
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                Localização
              </a>

              <div className="mobile-forms">
                <button
                  className="mobile-forms-trigger"
                  type="button"
                  aria-expanded={mobileFormsOpen}
                  onClick={() => setMobileFormsOpen(current => !current)}
                >
                  Formulários
                  <ChevronDown size={18} aria-hidden="true" />
                </button>

                {mobileFormsOpen && (
                  <div className="mobile-forms-list">
                    {FORMS.map(item => {
                      const Icon = item.icon
                      return (
                        <Link
                          className="mobile-form-link"
                          href={item.href}
                          key={item.href}
                          onClick={() => setDrawer(false)}
                        >
                          <span className="nav-form-icon" aria-hidden="true">
                            <Icon size={19} strokeWidth={1.8} />
                          </span>
                          <span>
                            <strong>{item.label}</strong>
                            <small>{item.description}</small>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* acordeão das quatro unidades */}
              <div style={{ paddingTop: 18 }}>
                <p className="label-sm">Unidades</p>
                {unitsData.map(unit => {
                  const on = openUnit === unit.slug
                  return (
                    <div key={unit.slug} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                      <button
                        type="button"
                        aria-expanded={on}
                        onClick={() => setOpenUnit(on ? null : unit.slug)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          width: '100%',
                          padding: '12px 0',
                          background: 'transparent',
                          border: 0,
                          color: 'var(--color-text)',
                          fontSize: 15,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        {unit.name}
                        <span
                          aria-hidden="true"
                          style={{
                            color: 'var(--color-accent-400)',
                            transform: on ? 'rotate(180deg)' : 'none',
                            transition: 'transform var(--dur-micro) var(--ease-arch)',
                          }}
                        >
                          ⌄
                        </span>
                      </button>

                      {/* abre por altura animada em vez de montar/desmontar:
                          o conteúdo fica sempre no DOM e o painel cresce de
                          0fr para 1fr, que é a única forma de animar até
                          `auto` sem medir nada em JS */}
                      <div className="accordion-panel" data-open={on}>
                        <div>
                          <div style={{ padding: '0 0 14px' }}>
                            <p
                              style={{
                                margin: '0 0 10px',
                                fontSize: 13,
                                lineHeight: 1.55,
                                color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                              }}
                            >
                              {unit.addressShort}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              <Link
                                className="btn btn-secondary"
                                href={`/unidades/${unit.slug}`}
                                onClick={() => setDrawer(false)}
                                style={{ padding: '8px 13px', fontSize: 13 }}
                              >
                                Ver unidade
                              </Link>
                              <Link
                                className="btn btn-secondary"
                                href={`/horarios/${unit.slug}`}
                                onClick={() => setDrawer(false)}
                                style={{ padding: '8px 13px', fontSize: 13 }}
                              >
                                Horários
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </nav>

            {/* rodapé do drawer: superfície + fio no topo, não o gradiente de costura */}
            <div
              style={{
                flexShrink: 0,
                padding: '16px 20px calc(16px + env(safe-area-inset-bottom))',
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-divider)',
              }}
            >
              <a
                className="btn btn-primary btn-block"
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '12px 18px' }}
              >
                Fale com a FLEX
              </a>

              {/* as redes ficam abaixo do CTA: quem abriu o menu para procurar
                  o perfil acha aqui, sem disputar com a ação principal */}
              <SocialLinks
                label="Redes sociais da Flex"
                style={{ marginTop: 12, justifyContent: 'center' }}
              />
            </div>
          </aside>
        </>
      )}
    </>
  )
}
