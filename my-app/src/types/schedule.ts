export interface Schedule {
  id: string
  unitName: string
  unitId: string
  scheduleType: 'musculacao' | 'crossfit'
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface Unit {
  id: string
  name: string
  displayName: string
} 