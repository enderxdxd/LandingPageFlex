// src/app/unidades/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getUnitBySlug } from '@/lib/constants/units-data'
import dynamic from 'next/dynamic'

const UnitPageClient = dynamic(() => import('./UnitPageClient'), {
  ssr: false
})

interface UnitPageProps {
  params: {
    slug: string
  }
}

export default function UnitPage({ params }: UnitPageProps) {
  const unit = getUnitBySlug(params.slug)

  if (!unit) {
    notFound()
  }

  return <UnitPageClient unit={unit} />
}

// Generate static params for all units
export async function generateStaticParams() {
  const { unitsData } = await import('@/lib/constants/units-data')
  
  return unitsData.map((unit) => ({
    slug: unit.slug,
  }))
}

// Generate metadata for each unit
export async function generateMetadata({ params }: UnitPageProps) {
  const unit = getUnitBySlug(params.slug)

  if (!unit) {
    return {
      title: 'Unidade não encontrada - Flex Fitness',
    }
  }

  return {
    title: `Flex Fitness ${unit.name} - Academia Premium`,
    description: unit.description,
    keywords: `flex fitness ${unit.name.toLowerCase()}, academia ${unit.name.toLowerCase()}, musculação, crossfit, personal trainer`,
  }
}