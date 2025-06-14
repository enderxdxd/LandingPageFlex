import { Unit } from '@/types/unit.types'

export const units: Unit[] = [
  {
    id: '1',
    name: 'Flex Mooca',
    slug: 'mooca',
    address: 'Rua da Mooca, 1234',
    phone: '(11) 1234-5678',
    whatsapp: '(11) 98765-4321',
    hours: {
      weekdays: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 14:00'
    },
    features: ['Musculação', 'CrossFit', 'Pilates', 'Yoga'],
    specialFeatures: ['Piscina', 'Sauna', 'Spa'],
    images: ['/images/units/mooca-1.jpg'],
    heroImage: '/images/units/mooca-hero.jpg',
    description: 'Unidade premium com piscina e spa',
    coordinates: {
      lat: -23.5505,
      lng: -46.6333
    }
  },
  {
    id: '2',
    name: 'Flex Vila Mariana',
    slug: 'vila-mariana',
    address: 'Av. Paulista, 1000',
    phone: '(11) 2345-6789',
    whatsapp: '(11) 98765-4321',
    hours: {
      weekdays: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 14:00'
    },
    features: ['Musculação', 'CrossFit', 'Pilates'],
    specialFeatures: ['Academia ao ar livre', 'Área de treino funcional'],
    images: ['/images/units/vila-mariana-1.jpg'],
    heroImage: '/images/units/vila-mariana-hero.jpg',
    description: 'Unidade com foco em treinamento funcional',
    coordinates: {
      lat: -23.5897,
      lng: -46.6398
    },
    comingSoon: true
  }
] 