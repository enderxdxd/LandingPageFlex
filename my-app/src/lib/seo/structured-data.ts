/**
 * Dados estruturados (JSON-LD) da rede.
 *
 * Por que isto importa mais que qualquer outra alavanca de SEO aqui: são
 * quatro academias FÍSICAS, e quem procura academia procura por proximidade.
 * Sem `LocalBusiness`, o Google tem que adivinhar endereço, telefone e horário
 * a partir do texto da página — e não mostra o resultado enriquecido (horário,
 * avaliação, rota) que decide o clique numa busca por "academia perto de mim".
 *
 * Os dados saem de `units-data` e `hours`, nunca digitados de novo: uma lista
 * paralela divergiria em semanas e marcação errada é pior que marcação nenhuma.
 */

import { unitsData, type Unit } from '@/lib/constants/units-data'
import { FOUNDED_YEAR } from '@/lib/home/brand'
import { SOCIAL_LINKS } from '@/lib/constants/social'

export const SITE_URL = 'https://www.flexfitnesscenter.com.br'
export const BRAND_NAME = 'Flex Fitness Center'

/** Só os dígitos, no formato E.164 que o schema.org espera. */
function toE164(digits: string): string {
  return `+${digits.replace(/\D/g, '')}`
}

/**
 * "04:30 - 23:00" → { opens: '04:30', closes: '23:00' }.
 *
 * Devolve `null` para qualquer coisa que não case (um "Fechado", por exemplo),
 * e o dia simplesmente não entra na marcação.
 */
function parseRange(range: string): { opens: string; closes: string } | null {
  const match = range.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/)
  if (!match) return null
  return { opens: match[1], closes: match[2] }
}

/**
 * Caixa delimitadora grosseira de cada estado onde a rede opera.
 *
 * Existe porque `coordinates` nunca teve consumidor — os links de mapa do site
 * usam o endereço em texto — e por isso ninguém percebeu que Alphaville estava
 * marcada em Barueri/SP, a ~900 km da unidade real em Goiânia. Ao virar dado
 * estruturado, essa coordenada passaria a AFIRMAR para o Google que a academia
 * fica em São Paulo, que é o oposto do objetivo de busca local.
 *
 * Geo errada é pior que geo ausente, então uma coordenada que contradiz o
 * estado declarado no endereço simplesmente não entra na marcação.
 */
const STATE_BOUNDS: Record<string, { lat: [number, number]; lng: [number, number] }> = {
  GO: { lat: [-19.6, -12.3], lng: [-53.3, -45.9] },
  TO: { lat: [-13.6, -5.0], lng: [-50.9, -45.6] },
}

function geoSchema(unit: Unit, estado: string) {
  const bounds = STATE_BOUNDS[estado]
  const { lat, lng } = unit.coordinates

  if (
    !bounds ||
    lat < bounds.lat[0] || lat > bounds.lat[1] ||
    lng < bounds.lng[0] || lng > bounds.lng[1]
  ) {
    return undefined
  }

  return {
    '@type': 'GeoCoordinates',
    latitude: lat,
    longitude: lng,
  }
}

function openingHours(unit: Unit) {
  const spec: Array<Record<string, unknown>> = []

  const weekdays = parseRange(unit.hours.weekdays)
  if (weekdays) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: weekdays.opens,
      closes: weekdays.closes,
    })
  }

  const saturday = parseRange(unit.hours.saturday)
  if (saturday) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: saturday.opens,
      closes: saturday.closes,
    })
  }

  const sunday = parseRange(unit.hours.sunday)
  if (sunday) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: sunday.opens,
      closes: sunday.closes,
    })
  }

  return spec
}

/**
 * Uma unidade como `ExerciseGym` — o tipo mais específico que o schema.org
 * oferece para academia, e que herda tudo de `LocalBusiness`.
 */
export function gymSchema(unit: Unit) {
  const [cidade, estado] = unit.city.split(' — ')

  return {
    '@type': 'ExerciseGym',
    '@id': `${SITE_URL}/unidades/${unit.slug}#gym`,
    name: `${BRAND_NAME} ${unit.name}`,
    url: `${SITE_URL}/unidades/${unit.slug}`,
    image: `${SITE_URL}${unit.wideImage}`,
    description: unit.description,
    telephone: toE164(unit.whatsappDigits),
    address: {
      '@type': 'PostalAddress',
      streetAddress: unit.addressShort,
      addressLocality: cidade,
      addressRegion: estado,
      addressCountry: 'BR',
    },
    geo: geoSchema(unit, estado),
    openingHoursSpecification: openingHours(unit),
    amenityFeature: unit.features.map(feature => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
    sameAs: [unit.instagram],
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    /* `isAccessibleForFree: false` seria enganoso (não é academia gratuita) e
       preço não é publicado em lugar nenhum do site — todo caminho comercial
       vai para o WhatsApp. Então a faixa de preço fica de fora de propósito. */
  }
}

/** A rede como organização, e a home como site — o nó que os ginásios apontam. */
export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.jpg`,
    foundingDate: String(FOUNDED_YEAR),
    areaServed: ['Goiânia', 'Palmas'],
    sameAs: SOCIAL_LINKS.map(link => link.href),
  }
}

/** O grafo completo da home: a rede + as quatro unidades, num `<script>` só. */
export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      ...unitsData.map(gymSchema),
    ],
  }
}
