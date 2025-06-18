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
      'Loja de Suplementos'
    ],
    specialFeatures: [
      'CrossFit Box Exclusivo',
      'Equipamentos Rogue Fitness',
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
      '/images/units/alphaville/recepcao.jpeg'
    ],
    heroImage: '/images/units/alphaville/hero.jpeg',
    
    hasPool: false,
    hasCrossfit: true,
    area: '1.200m²',
    parking: '120 vagas',
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
      weekdays: '04:30 - 00:00',
      saturday: '06:00 - 16:00',
      sunday: '07:00 - 19:00'
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
      'Vista Panorâmica'
    ],
    specialFeatures: [
      'Terraço com Vista da Cidade',
      'Sala VIP para Personal',
      'Equipamentos Life Fitness',
      'Aulas ao Ar Livre'
    ],
    images: [
      '/images/units/buenavista/area-musculacao.jpg',
      '/images/units/buenavista/terraco.jpg',
      '/images/units/buenavista/cardio.jpg',
      '/images/units/buenavista/vestiarios.jpg',
      '/images/units/buenavista/recepcao.jpg',
      '/images/units/buenavista/vista-cidade.jpg'
    ],
    heroImage: '/images/units/buenavista/hero.jpeg',
    area: '950m²',
    parking: '60 vagas',
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
      'Kids Space'
    ],
    specialFeatures: [
      'Espaço Kids Monitorado',
      'Aulas para Terceira Idade',
      'Programa Família Fit',
      'Horários Flexíveis'
    ],
    images: [
      '/images/units/marista/area-musculacao.jpg',
      '/images/units/marista/kids-space.jpg',
      '/images/units/marista/cardio.jpg',
      '/images/units/marista/vestiarios.jpg',
      '/images/units/marista/aulas-coletivas.jpg',
      '/images/units/marista/recepcao.jpg'
    ],
    heroImage: '/images/units/marista/hero.jpeg',
    area: '800m²',
    parking: '200+',
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
    comingSoon: true,
    hasPool: true,
    area: '1.500m²',
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