'use client'

import { Unit } from '@/lib/constants/units-data'
import UnitHero from '@/components/units/UnitHero'
import UnitFeatures from '@/components/units/UnitFeatures'
import UnitGallery from '@/components/units/UnitGallery'
import UnitSchedule from '@/components/units/UnitSchedule'
import UnitContact from '@/components/units/UnitContact'
import UnitCrossFit from '@/components/units/UnitCrossFit'

interface UnitPageClientProps {
  unit: Unit
}

export default function UnitPageClient({ unit }: UnitPageClientProps) {
  return (
    <main className="min-h-screen">
      <UnitHero unit={unit} />
      <UnitFeatures unit={unit} />
      
      {/* CrossFit section específica para Alphaville */}
      {unit.hasCrossfit && <UnitCrossFit unit={unit} />}
      
      <UnitGallery unit={unit} />
      <UnitSchedule unit={unit} />
      <UnitContact unit={unit} />
    </main>
  )
} 