// src/lib/constants/units-data.ts
import { SOCIAL_LINKS } from './social'

/**
 * O perfil é o mesmo da rede inteira — as quatro unidades apontam para ele.
 * Sai de `social.ts` para não existirem cinco cópias da mesma URL no repo.
 */
const INSTAGRAM = SOCIAL_LINKS.find(link => link.id === 'instagram')!.href

export interface Unit {
  id: string
  slug: string
  name: string
  /** "Goiânia — GO" / "Palmas — TO" — the kicker above the unit name */
  city: string
  description: string
  address: string
  /** the address as the redesign prints it: one line, em-dashed, no country */
  addressShort: string
  phone: string
  whatsapp: string
  /** wa.me digits — 12 chars, no leading zero on the mobile prefix */
  whatsappDigits: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  features: string[]
  specialFeatures?: string[]
  images: string[]
  heroImage: string
  /** the wide/editorial frame: 16:10 unit panel, 21:9 unit-page hero */
  wideImage: string
  /** three curated photographs for the unit page, in order */
  featuredImages: string[]
  heroVideo?: string
  comingSoon?: boolean
  hasPool?: boolean
  hasCrossfit?: boolean
  area: string
  parking: string
  accessibility: boolean
  metro?: string
  landmark: string
  coordinates: {
    lat: number
    lng: number
  }
  instagram: string
}

export const unitsData: Unit[] = [
  {
    id: 'alphaville',
    slug: 'alphaville',
    name: 'Alphaville',
    city: 'Goiânia — GO',
    description: 'Nossa unidade mais completa, localizada no coração de Alphaville. Equipada com tecnologia de ponta e oferecendo uma experiência premium de fitness, incluindo nossa exclusiva área de CrossFit.',
    address: 'Av. Alphaville Flamboyant - S/N - Quadra 05 - Lote 05 e 06 - Res. Alphaville Flamboyant, Goiânia - GO, 74884-527, Brazil',
    addressShort: 'Av. Alphaville Flamboyant, Quadra 05, Lotes 05 e 06 — Res. Alphaville Flamboyant, Goiânia — GO, 74884-527',
    phone: '62 3414-7330',
    whatsapp: '(62) 9537-8033',
    whatsappDigits: '556295378033',
    hours: {
      weekdays: '04:30 - 23:00',
      saturday: '07:00 - 16:00',
      sunday: '07:00 - 14:00'
    },
    features: [
      'Musculação Completa',
      'Cardio Premium',
      'Aulas Coletivas',
      'Personal Training',
      'Vestiários Premium',
      'Estacionamento Gratuito',
      'Wi-Fi Liberado',
      'Ar Condicionado',
      'Área de Alongamento',
      'Loja de Suplementos'
    ],
    specialFeatures: [
      'CrossFit Box Exclusivo',
      'Equipamentos de Alta Performance',
      'Treinadores Certificados CrossFit',
      'WODs Diários',
      'Competições Internas'
    ],
    images: [
      '/images/units/alphaville/area-musculacao.jpeg',
      '/images/units/alphaville/crossfit-box.jpeg',
      '/images/units/alphaville/cardio.jpeg',
      '/images/units/alphaville/vestiarios.jpeg',
      '/images/units/alphaville/aulas-coletivas.jpeg',
      '/images/units/alphaville/recepcao.jpeg',
      '/images/units/alphaville/alphaville1.jpeg',
      '/images/units/alphaville/hero.jpeg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_001.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_003.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_023.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_027.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_030.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_035.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_047.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_055.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_064.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_065.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_084.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_093.jpg',
      '/images/units/alphaville/Flex_Alphaville_by_NelsonPacheco_158.jpg'
    ],
    heroImage: '/images/units/alphaville/hero.jpeg',
    wideImage: '/images/optimized/alphaville-wide.webp',
    featuredImages: [
      '/images/optimized/alphaville-crossfit.webp',
      '/images/optimized/alphaville-musculacao.webp',
      '/images/optimized/alphaville-recepcao.webp'
    ],
    instagram: INSTAGRAM,
    hasPool: false,
    hasCrossfit: true,
    area: '3.500 m²',
    parking: '80+ vagas',
    accessibility: true,
    landmark: 'Próximo ao AlphaPark Hotel',
    coordinates: {
      lat: -23.5081,
      lng: -46.8487
    }
  },
  {
    id: 'buena-vista',
    slug: 'buena-vista',
    name: 'Buena Vista',
    city: 'Goiânia — GO',
    description: 'Localizada em uma das regiões mais nobres de Goiânia, nossa unidade Buena Vista oferece um ambiente sofisticado e acolhedor para seus treinos, com vista panorâmica da cidade.',
    address: 'R. T-61, 191 - St. Bueno, Goiânia - GO, 74223-170, Brasil',
    addressShort: 'R. T-61, 191 — St. Bueno, Goiânia — GO, 74223-170',
    phone: '62 3515-0588',
    whatsapp: '(62) 9244-1708',
    whatsappDigits: '556292441708',
    hours: {
      weekdays: '04:30 - 23:00',
      saturday: '07:00 - 16:00',
      sunday: '07:00 - 14:00'
    },
    features: [
      'Musculação Completa',
      'Cardio Premium',
      'Aulas Coletivas',
      'Personal Training',
      'Vestiários Premium',
      'Estacionamento Gratuito',
      'Wi-Fi Liberado',
      'Ar Condicionado',
      'Área de Alongamento',
      'Loja de Suplementos',
  
    ],
    specialFeatures: [
      'Salas premium para coletivas',
      'Equipamentos Life Fitness',
      
    ],
    images: [
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_001.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_005.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_006.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_012.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_021.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_025.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_028.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_029.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_034.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_039.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_042.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_044.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_056.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_069.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_094.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_099.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_121.jpg',
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_156.jpg',
      '/images/units/buenavista/hero.jpeg'
    ],
    heroImage: '/images/units/buenavista/hero.jpeg',
    wideImage: '/images/optimized/buenavista-wide.webp',
    featuredImages: [
      '/images/optimized/buenavista-121.webp',
      '/images/optimized/buenavista-156.webp',
      '/images/optimized/buenavista-006.webp'
    ],
    instagram: INSTAGRAM,
    area: '2.550 m²',
    parking: '100+ vagas',
    accessibility: true,
    landmark: 'Dentro do Shopping Buena-Vista',
    coordinates: {
      lat: -16.6869,
      lng: -49.2648
    }
  },
  {
    id: 'marista',
    slug: 'marista',
    name: 'Marista',
    city: 'Goiânia — GO',
    description: 'Nossa unidade familiar no coração do Setor Marista, projetada para oferecer conforto e praticidade para toda a família, com ambiente acolhedor e equipamentos modernos.',
    address: 'Av. Portugal 744 Setor Marista CEP 74150-030, Goiânia GO',
    addressShort: 'Av. Portugal, 744 — Setor Marista, Goiânia — GO, 74150-030',
    phone: '62 3241-7700',
    whatsapp: '(62) 9383-0661',
    whatsappDigits: '556293830661',
    hours: {
      weekdays: '05:00 - 22:00',
      saturday: '07:00 - 18:00',
      sunday: '07:00 - 14:00'
    },
    features: [
      'Musculação Completa',
      'Cardio Premium',
      'Aulas Coletivas',
      'Personal Training',
      'Vestiários Premium',
      'Estacionamento Gratuito',
      'Wi-Fi Liberado',
      'Ar Condicionado',
      'Área de Alongamento',
      'Loja de Suplementos',
      'Kids Space'
    ],
    specialFeatures: [
      'Espaço Kids Monitorado',
      'Aulas para Terceira Idade',
      'Horários Flexíveis'
    ],
    images: [
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_002.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_008.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_009.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_015.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_019.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_022.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_023.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_024.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_030.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_032.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_034.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_038.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_041.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_044.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_050.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_054.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_055.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_058.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_060.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_061.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_062.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_065.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_068.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_078.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_119.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_121.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_136.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_145.jpg',
      '/images/units/marista/hero.jpeg'
    ],
    heroImage: '/images/units/marista/hero.jpeg',
    wideImage: '/images/optimized/marista-wide.webp',
    featuredImages: [
      '/images/optimized/marista-024.webp',
      '/images/optimized/marista-030.webp',
      '/images/optimized/marista-hero.webp'
    ],
    instagram: INSTAGRAM,
    area: '2.600 m²',
    parking: '150+',
    accessibility: true,
    landmark: 'Dentro do ASSAÍ ATACADISTA',
    coordinates: {
      lat: -16.7025,
      lng: -49.2536
    }
  },
  {
    id: 'palmas',
    slug: 'palmas',
    name: 'Palmas',
    city: 'Palmas — TO',
    description: 'A Flex na capital do Tocantins, com projeto arquitetônico inovador, área aquática completa e tecnologia de última geração.',
    address: 'Q. 206 Sul Avenida Ns 4, 469 - Arse, Palmas - TO',
    addressShort: 'Q. 206 Sul, Avenida NS 4, 469 — Arse, Palmas — TO',
    phone: '62 9383-3713',
    whatsapp: '(62) 9383-3713',
    whatsappDigits: '556293833713',
    hours: {
      weekdays: '05:00 - 22:00',
      saturday: '07:00 - 18:00',
      sunday: '07:00 - 14:00'
    },
    features: [
      'Musculação Completa',
      'Cardio Premium',
      'Aulas Coletivas',
      'Personal Training',
      'Vestiários Premium',
      'Estacionamento Gratuito',
      'Wi-Fi Liberado',
      'Ar Condicionado',
      'Área de Alongamento',
      'Loja de Suplementos',
      'Piscina Semi-olímpica'
    ],
    specialFeatures: [
      'Primeira Flex em Palmas',
      'Piscina Semi-olímpica',
      'Área Aquática Completa',
      'Hidromassagem',
      'Sauna Úmida'
    ],
    images: [
      '/images/units/palmas/p1 (1).jpeg',
      '/images/units/palmas/p1 (2).jpeg',
      '/images/units/palmas/p1 (3).jpeg',
      '/images/units/palmas/p1 (4).jpeg',
      '/images/units/palmas/p1 (5).jpeg',
      '/images/units/palmas/p1 (6).jpeg',
      '/images/units/palmas/p1 (7).jpeg',
      '/images/units/palmas/p1 (8).jpeg',
      '/images/units/palmas/p1 (9).jpeg',
      '/images/units/palmas/p1 (10).jpeg',
      '/images/units/palmas/p1 (11).jpeg',
      '/images/units/palmas/p1 (12).jpeg',
      '/images/units/palmas/p1 (13).jpeg',
      '/images/units/palmas/p1 (14).jpeg',
      '/images/units/palmas/p1 (15).jpeg',
      '/images/units/palmas/p1 (16).jpeg',
      '/images/units/palmas/p1 (17).jpeg',
      '/images/units/palmas/p1 (18).jpeg',
      '/images/units/palmas/p1 (19).jpeg',
      '/images/units/palmas/p1 (20).jpeg'
    ],
    heroImage: '/images/units/palmas/hero-projeto.jpg',
    wideImage: '/images/optimized/palmas-wide.webp',
    featuredImages: [
      '/images/optimized/palmas-01.webp',
      '/images/optimized/palmas-08.webp',
      '/images/optimized/palmas-hero.webp'
    ],
    instagram: INSTAGRAM,
    hasPool: true,
    // não estava nos dados fornecidos pelo cliente — não inventar um número
    area: 'A confirmar',
    parking: '100 vagas',
    accessibility: true,
    landmark: 'Q. 206 Sul — Arse',
    coordinates: {
      lat: -10.1847,
      lng: -48.3337
    }
  }
]

export const getUnitBySlug = (slug: string): Unit | undefined => {
  return unitsData.find(unit => unit.slug === slug)
}

/** WhatsApp da unidade, com mensagem contextual. */
export const unitWhatsAppUrl = (unit: Unit, message?: string): string => {
  const text = message ?? `Olá! Gostaria de conhecer a unidade ${unit.name} da Flex Fitness.`
  return `https://wa.me/${unit.whatsappDigits}?text=${encodeURIComponent(text)}`
}

/** Busca no Google Maps pelo nome + endereço da unidade. */
export const unitMapUrl = (unit: Unit): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Flex Fitness ${unit.name} ${unit.addressShort}`
  )}`
