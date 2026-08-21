/**
 * CTA final — fotografia full-bleed sob um scrim, sem card.
 *
 * Duas ações: "Encontrar minha FLEX" desce para #localizacao (a escolha de
 * unidade acontece lá, com foto e endereço), e o WhatsApp central. Não há
 * preço em nenhum caminho — todo caminho comercial vai para o WhatsApp.
 */

import Image from 'next/image'
import Reveal from '@/components/shared/Reveal'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'

export default function FinalCTA() {
  return (
    <section
      style={{
        position: 'relative',
        isolation: 'isolate',
        padding: 'clamp(84px,13vh,180px) var(--edge)',
        overflow: 'hidden',
      }}
    >
      <Image
        src="/images/optimized/buenavista-wide.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: -2 }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background:
            'linear-gradient(180deg, rgba(11,12,20,.72) 0%, rgba(11,12,20,.86) 100%)',
        }}
      />

      {/* título primeiro, ações logo atrás — os botões não chegam junto com a
          headline, senão não há ponto de pouso para a leitura */}
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Reveal>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(38px,6.6vw,104px)',
              lineHeight: 0.9,
              maxWidth: '18ch',
            }}
          >
            Seu próximo treino começa aqui.
          </h2>

          <p
            style={{
              margin: '22px 0 0',
              fontSize: 'clamp(15px,1.7vw,20px)',
              lineHeight: 1.6,
              maxWidth: '46ch',
              color: 'color-mix(in srgb, var(--color-text) 68%, transparent)',
            }}
          >
            Escolha sua unidade e venha conhecer a FLEX.
          </p>
        </Reveal>

        <Reveal
          delay={140}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 'clamp(28px,4vh,44px)',
          }}
        >
          <a className="btn btn-primary" href="#localizacao" style={{ padding: '13px 22px' }}>
            Encontrar minha FLEX
          </a>
          <a
            className="btn btn-secondary"
            href={CONTACT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '13px 22px' }}
          >
            Falar no WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}
