'use client'

/**
 * A assinatura única de entrada das seções informativas.
 *
 * Uma regra, a página inteira: opacidade + translateY curto, `var(--ease-arch)`,
 * uma vez por sessão, disparado ao cruzar a faixa central da viewport.
 *
 * Deliberadamente NÃO é aplicado a cada linha de texto, cada célula de tabela
 * ou cada card. Só a blocos de decisão — título de seção, dado principal,
 * painel selecionado, CTA. Animar tudo transforma a página num carrossel de
 * efeitos e atrapalha a leitura.
 *
 * O elemento nasce visível no HTML e só é escondido depois que o observador
 * está montado: sem isso, quem tem JS bloqueado (ou quem chega antes da
 * hidratação) fica olhando para uma seção em branco.
 */

import { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  /** atraso em ms, para escalonar 2–4 blocos irmãos — não uma lista inteira */
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'tbody'
  className?: string
  style?: React.CSSProperties
  id?: string
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    setArmed(true)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          setShown(true)
          observer.disconnect() // uma vez por sessão
        })
      },
      // a faixa central: o bloco entra quando está de fato sendo lido
      { rootMargin: '-12% 0px -18% 0px', threshold: 0 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      id={id}
      className={className}
      data-reveal={armed ? (shown ? 'in' : 'out') : undefined}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
