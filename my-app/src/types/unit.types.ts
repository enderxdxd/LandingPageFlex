export interface Unit {
  id: string
  name: string
  slug: string
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
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  isNew?: boolean
  comingSoon?: boolean
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
}