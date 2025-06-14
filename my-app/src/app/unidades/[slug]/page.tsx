import { notFound } from 'next/navigation'
import { unitsData } from '@/lib/constants/units-data'
import UnitHero from '@/components/units/UnitHero'
import UnitFeatures from '@/components/units/UnitFeatures'
import UnitGallery from '@/components/units/UnitGallery'
import UnitSchedule from '@/components/units/UnitSchedule'
import UnitContact from '@/components/units/UnitContact'

interface UnitPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return unitsData.map((unit) => ({
    slug: unit.slug,
  }))
}

export async function generateMetadata({ params }: UnitPageProps) {
  const unit = unitsData.find((u) => u.slug === params.slug)
  
  if (!unit) {
    return {
      title: 'Unidade não encontrada - Flex Fitness Center'
    }
  }

  return {
    title: `${unit.name} - Flex Fitness Center`,
    description: unit.description,
  }
}

export default function UnitPage({ params }: UnitPageProps) {
  const unit = unitsData.find((u) => u.slug === params.slug)

  if (!unit) {
    notFound()
  }

  return (
    <main className="pt-20">
      <UnitHero unit={unit} />
      <UnitFeatures unit={unit} />
      <UnitGallery unit={unit} />
      <UnitSchedule unit={unit} />
      <UnitContact unit={unit} />
    </main>
  )
}