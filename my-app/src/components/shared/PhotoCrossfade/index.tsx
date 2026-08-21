'use client'

/**
 * Troca de fotografia sem flash.
 *
 * O problema: mudar o `src` e animar a opacidade começa a transição ANTES da
 * imagem existir. Se ela não estiver em cache, o quadro de maior impacto entra
 * vazio ou atrasado.
 *
 * A solução aqui é segurar a fotografia atual em cena até a próxima ter
 * carregado de verdade. A candidata é montada invisível, com o MESMO `sizes` da
 * visível — então o browser busca exatamente a URL que o next/image vai pintar,
 * e o `onLoad` dela é a prova de que a troca pode acontecer. Construir a URL do
 * otimizador à mão erraria o candidato do srcset e aqueceria o cache errado.
 *
 * Um `<Image>` extra por unidade "aquecida" (hover/foco) deixa a troca
 * instantânea no desktop; no toque, o segurar-até-carregar cobre o resto.
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface PhotoCrossfadeProps {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  /** srcs a pré-carregar por intenção (hover/foco), antes de qualquer clique. */
  warm?: string[]
}

export default function PhotoCrossfade({
  src,
  alt,
  sizes,
  priority,
  warm = [],
}: PhotoCrossfadeProps) {
  const [painted, setPainted] = useState(src)
  const [pending, setPending] = useState<string | null>(null)
  // muda a cada promoção para reiniciar a animação; 0 = primeiro render, sem fade
  const [pass, setPass] = useState(0)
  const paintedRef = useRef(painted)
  paintedRef.current = painted

  useEffect(() => {
    if (src === paintedRef.current) {
      setPending(null)
      return
    }
    setPending(src)
  }, [src])

  const promote = (loaded: string) => {
    // o alvo pode ter mudado enquanto esta carregava — descartar a atrasada
    if (loaded !== src) return
    setPainted(loaded)
    setPending(null)
    setPass(current => current + 1)
  }

  // não reaquecer o que já está pintado ou a caminho
  const warming = warm.filter(item => item !== painted && item !== pending)

  return (
    <>
      <Image
        key={`${painted}#${pass}`}
        src={painted}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit: 'cover',
          animation: pass > 0 ? 'photoIn 380ms var(--ease-arch)' : undefined,
        }}
      />

      {pending && (
        <Image
          src={pending}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          onLoad={() => promote(pending)}
          style={{ objectFit: 'cover', opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* camada de aquecimento: fora de tela, mesmo `sizes`, nenhuma pintura */}
      {warming.length > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {warming.map(item => (
            <Image key={item} src={item} alt="" fill sizes={sizes} />
          ))}
        </span>
      )}
    </>
  )
}
