import { Unit } from '@/types/unit.types'

export const unitsData: Unit[] = [
  {
    id: '1',
    name: 'Alphaville',
    slug: 'alphaville',
    address: 'Av. Alphaville, 1000 - Alphaville Flamboyant, Goiânia - GO',
    phone: '(62) 3333-0001',
    whatsapp: '62999990001',
    hours: {
      weekdays: '05:00 - 23:00',
      saturday: '07:00 - 20:00',
      sunday: '08:00 - 18:00'
    },
    features: [
      'Musculação Premium',
      'Cardio Zone',
      'Sala de Spinning',
      'Estúdio de Pilates',
      'Área Funcional',
      'Vestiários VIP'
    ],
    specialFeatures: ['CrossFit Box Oficial'],
    images: [
      '/images/units/alphaville/1.jpg',
      '/images/units/alphaville/2.jpg',
      '/images/units/alphaville/3.jpg',
      '/images/units/alphaville/4.jpg'
    ],
    heroImage: '/images/units/alphaville/hero.jpg',
    heroVideo: '/videos/alphaville-hero.mp4',
    description: 'Nossa unidade mais completa, com Box de CrossFit oficial e equipamentos de última geração.',
    coordinates: {
      lat: -16.7089,
      lng: -49.2672
    }
  },
  {
    id: '2',
    name: 'Bueno Vista',
    slug: 'bueno-vista',
    address: 'Av. T-1, 2000 - Setor Bueno, Goiânia - GO',
    phone: '(62) 3333-0002',
    whatsapp: '62999990002',
    hours: {
      weekdays: '05:00 - 23:00',
      saturday: '07:00 - 20:00',
      sunday: '08:00 - 18:00'
    },
    features: [
      'Musculação Completa',
      'Área Cardio',
      'Salas de Aula Coletiva',
      'Estúdio de Yoga',
      'Área Funcional',
      'Lounge VIP'
    ],
    images: [
      '/images/units/bueno-vista/1.jpg',
      '/images/units/bueno-vista/2.jpg',
      '/images/units/bueno-vista/3.jpg',
      '/images/units/bueno-vista/4.jpg'
    ],
    heroImage: '/images/units/bueno-vista/hero.jpg',
    description: 'Localizada no coração do Setor Bueno, oferece o melhor em equipamentos e conforto.',
    coordinates: {
      lat: -16.7089,
      lng: -49.2672
    }
  },
  {
    id: '3',
    name: 'Marista',
    slug: 'marista',
    address: 'Av. 136, 500 - Setor Marista, Goiânia - GO',
    phone: '(62) 3333-0003',
    whatsapp: '62999990003',
    hours: {
      weekdays: '05:00 - 23:00',
      saturday: '07:00 - 20:00',
      sunday: '08:00 - 18:00'
    },
    features: [
      'Musculação High-Tech',
      'Cardio Premium',
      'Estúdio de Dança',
      'Sala de Lutas',
      'Área Funcional',
      'Café Fitness'
    ],
    images: [
      '/images/units/marista/1.jpg',
      '/images/units/marista/2.jpg',
      '/images/units/marista/3.jpg',
      '/images/units/marista/4.jpg'
    ],
    heroImage: '/images/units/marista/hero.jpg',
    heroVideo: '/videos/marista-hero.mp4',
    description: 'Design moderno e atmosfera exclusiva no coração do Setor Marista.',
    coordinates: {
      lat: -16.7089,
      lng: -49.2672
    }
  },
  {
    id: '4',
    name: 'Palmas',
    slug: 'palmas',
    address: 'Quadra 104 Sul - Palmas, TO',
    phone: '(63) 3333-0004',
    whatsapp: '63999990004',
    hours: {
      weekdays: '05:00 - 23:00',
      saturday: '07:00 - 20:00',
      sunday: '08:00 - 18:00'
    },
    features: [
      'Musculação Completa',
      'Área Cardio',
      'Salas Multiuso',
      'Área Funcional',
      'Kids Space',
      'Rooftop Training'
    ],
    specialFeatures: ['Piscina Semi-Olímpica Aquecida'],
    images: [
      '/images/units/palmas/1.jpg',
      '/images/units/palmas/2.jpg',
      '/images/units/palmas/3.jpg',
      '/images/units/palmas/4.jpg'
    ],
    heroImage: '/images/units/palmas/hero.jpg',
    description: 'Nova unidade com piscina aquecida e área de treino ao ar livre. Inauguração em breve!',
    coordinates: {
      lat: -10.1689,
      lng: -48.3317
    },
    isNew: true,
    comingSoon: true
  }
]