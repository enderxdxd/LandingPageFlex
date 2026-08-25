/**
 * Home — o redesenho "nocturne".
 *
 * A abertura é UMA tela. Os dois capítulos fixados (380vh + 280vh de rolagem
 * sequestrada) foram removidos: prendiam o visitante por seis telas antes da
 * primeira informação útil. O átrio entrega marca, estado da rede e as quatro
 * unidades de uma vez, e o conteúdo começa em seguida.
 *
 * Tudo abaixo vive dentro de `.nocturne`, que é o escopo dos tokens em
 * globals.css. Sem esse wrapper, nenhuma das regras do redesenho se aplica.
 *
 * A ordem das seções e o passo do gradiente de costura (--seam-lift, por id em
 * globals.css) são a mesma coisa: a página clareia conforme sai do cinematográfico
 * para o prático. Reordenar seções aqui sem mexer nos lifts quebra a rampa.
 */

import Hero from '@/components/home/Hero'
import BrandStatement from '@/components/home/BrandStatement'
import Rede from '@/components/home/Rede'
import Unidades from '@/components/home/Unidades'
import Estrutura from '@/components/home/Estrutura'
import Modalidades from '@/components/home/Modalidades'
import Equipamentos from '@/components/home/Equipamentos'
import Galeria from '@/components/home/Galeria'
import Horarios from '@/components/home/Horarios'
import Localizacao from '@/components/home/Localizacao'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* a única transição entre #0b0c14 e o chão da página */}
      <div className="stage-bridge" />

      <BrandStatement />
      <Rede />
      <Unidades />
      <Estrutura />
      {/* estrutura diz o que existe; modalidades, o que acontece nela */}
      <Modalidades />
      <Equipamentos />
      <Galeria />
      <Horarios />
      <Localizacao />
      <FinalCTA />
    </>
  )
}
