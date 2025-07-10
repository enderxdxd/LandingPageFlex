// src/lib/constants/units-data.ts
export interface Unit {
  id: string
  slug: string
  name: string
  description: string
  address: string
  phone: string
  whatsapp: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  features: string[]
  specialFeatures?: string[]
  images: string[]
  heroImage: string
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
    description: 'Nossa unidade mais completa, localizada no coração de Alphaville. Equipada com tecnologia de ponta e oferecendo uma experiência premium de fitness, incluindo nossa exclusiva área de CrossFit.',
    address: 'Av. Alphaville Flamboyant - S/N - Quadra 05 - Lote 05 e 06 - Res. Alphaville Flamboyant, Goiânia - GO, 74884-527, Brazil',
    phone: '+55 62 3414-7330',
    whatsapp: '(62) 9537-8033',
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
    instagram: 'https://www.instagram.com/flexfitnesscenter/',
    hasPool: false,
    hasCrossfit: true,
    area: '3500m',
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
    description: 'Localizada em uma das regiões mais nobres de Goiânia, nossa unidade Bueno Vista oferece um ambiente sofisticado e acolhedor para seus treinos, com vista panorâmica da cidade.',
    address: 'R. T-61, 191 - St. Bueno, Goiânia - GO, 74223-170, Brasil',
    phone: '(62) 3515-0588',
    whatsapp: '(62) 9244-1708',
    hours: {
      weekdays: '05:00 - 23:00',
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
      '/images/units/buenavista/Flex_BuenaVista_by_NelsonPacheco_033.jpg',
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
    instagram: 'https://www.instagram.com/flexfitnesscenter/',
    area: '2550m',
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
    description: 'Nossa unidade familiar no coração do Setor Marista, projetada para oferecer conforto e praticidade para toda a família, com ambiente acolhedor e equipamentos modernos.',
    address: 'Av. Portugal 744 Setor Marista CEP 74150-030, Goiânia GO',
    phone: '(62) 3241-7700',
    whatsapp: '(62) 9383-0661',
    hours: {
      weekdays: '05:00 - 22:00',
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
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_123.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_136.jpg',
      '/images/units/marista/Flex_Marista_by_NelsonPacheco_145.jpg',
      '/images/units/marista/hero.jpeg'
    ],
    heroImage: '/images/units/marista/hero.jpeg',
    instagram: 'https://www.instagram.com/flexfitnesscenter/',
    area: '2600m',
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
    description: 'Nossa aguardada unidade em Palmas promete revolucionar o fitness na capital do Tocantins. Com projeto arquitetônico inovador e tecnologia de última geração.',
    address: 'Q. 206 Sul Avenida Ns 4, 469 - Arse, Palmas - TO',
    phone: '----',
    whatsapp: '----',
    hours: {
      weekdays: '05:00 - 00:00',
      saturday: '06:00 - 16:00',
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
      'Sauna Seca e Úmida'
    ],
    images: [
      '/images/units/palmas/projeto-musculacao.jpg',
      '/images/units/palmas/projeto-piscina.jpg',
      '/images/units/palmas/projeto-recepcao.jpg',
      '/images/units/palmas/projeto-cardio.jpg',
      '/images/units/palmas/projeto-vestiarios.jpg',
      '/images/units/palmas/projeto-externa.jpg'
    ],
    heroImage: '/images/units/palmas/hero-projeto.jpg',
    instagram: 'https://www.instagram.com/flexfitnesscenter/',
    comingSoon: true,
    hasPool: true,
    area: 'm',
    parking: '100 vagas',
    accessibility: true,
    landmark: '',
    coordinates: {
      lat: -10.1847,
      lng: -48.3337
    }
  }
]

export const getUnitBySlug = (slug: string): Unit | undefined => {
  return unitsData.find(unit => unit.slug === slug)
}