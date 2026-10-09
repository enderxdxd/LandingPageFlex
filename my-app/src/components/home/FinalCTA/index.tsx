/**
 * CTA final — fotografia full-bleed sob um scrim, sem card.
 *
 * A aula experimental entra aqui como ação principal. Antes a home inteira
 * tinha só dois destinos — WhatsApp e #localizacao — e `/freepass`, que é a
 * única página que captura o lead no CRM (nome, e-mail, telefone via RD
 * Station), só existia dentro do menu. Quem rolava a página até o fim nunca
 * era convidado a agendar.
 *
 * O WhatsApp continua ao lado, porque conversa fechada na hora vale mais do
 * que formulário para quem já decidiu. "Encontrar minha FLEX" desceu para
 * link discreto: a seção de Localização é a imediatamente acima desta.
 *
 * Não há preço em nenhum caminho.
 */

import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/shared/Reveal'
import { CONTACT_WHATSAPP_URL } from '@/lib/constants/contact'

export default function FinalCTA() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(72px,10vh,140px) var(--edge)',
        borderTop: '2px solid var(--color-text)',
      }}
    >

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
              color: 'var(--color-text-soft)',
            }}
          >
            A primeira aula é por nossa conta. Escolha a unidade e venha conhecer.
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
          <Link className="btn btn-primary" href="/freepass" style={{ padding: '13px 22px' }}>
            Agendar aula experimental
          </Link>
          <a
            className="btn btn-secondary"
            href={CONTACT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '13px 22px' }}
          >
            Falar no WhatsApp
          </a>
          <a className="btn btn-ghost" href="#localizacao" style={{ padding: '13px 18px' }}>
            Ver endereços
          </a>
        </Reveal>

        {/* A foto como chapa, não como fundo sob scrim: o texto vive no papel e
            a imagem aparece com o contraste original. */}
        <div
          style={{
            position: 'relative',
            marginTop: 'clamp(36px,5vh,64px)',
            aspectRatio: '16 / 9',
            border: '2px solid var(--color-text)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/images/optimized/buenavista-wide.webp"
            alt="Área de treino da unidade Buena Vista"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  )
}
