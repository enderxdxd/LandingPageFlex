import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { Schedule } from '@/types/schedule'

export class ScheduleService {
  static async uploadSchedule(
    unitId: string, 
    unitName: string, 
    scheduleType: 'musculacao' | 'crossfit',
    file: File
  ): Promise<string> {
    try {
      // Delete existing schedule if exists
      await this.deleteSchedule(unitId, scheduleType)

      // Upload new file
      const fileRef = ref(storage, `schedules/${unitId}-${scheduleType}.pdf`)
      await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(fileRef)

      // Save to Firestore
      const scheduleRef = doc(db, 'schedules', `${unitId}-${scheduleType}`)
      await setDoc(scheduleRef, {
        unitName,
        unitId,
        scheduleType,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return downloadURL
    } catch (error) {
      console.error('Error uploading schedule:', error)
      throw new Error('Erro ao fazer upload do horário')
    }
  }

  static async getSchedule(unitId: string, scheduleType: 'musculacao' | 'crossfit'): Promise<Schedule | null> {
    try {
      const scheduleRef = doc(db, 'schedules', `${unitId}-${scheduleType}`)
      const scheduleSnap = await getDoc(scheduleRef)
      
      if (scheduleSnap.exists()) {
        const data = scheduleSnap.data()
        return {
          id: scheduleSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Schedule
      }
      
      return null
    } catch (error) {
      console.error('Error getting schedule:', error)
      throw new Error('Erro ao buscar horário')
    }
  }

  static async getAllSchedules(unitId: string): Promise<{ musculacao: Schedule | null; crossfit: Schedule | null }> {
    try {
      const [musculacao, crossfit] = await Promise.all([
        this.getSchedule(unitId, 'musculacao'),
        this.getSchedule(unitId, 'crossfit')
      ])
      
      return { musculacao, crossfit }
    } catch (error) {
      console.error('Error getting all schedules:', error)
      throw new Error('Erro ao buscar horários')
    }
  }

  static async deleteSchedule(unitId: string, scheduleType: 'musculacao' | 'crossfit'): Promise<void> {
    try {
      // Delete from Storage
      const fileRef = ref(storage, `schedules/${unitId}-${scheduleType}.pdf`)
      try {
        await deleteObject(fileRef)
      } catch (error) {
        // File might not exist, continue
        console.log('File not found in storage, continuing...')
      }

      // Delete from Firestore
      const scheduleRef = doc(db, 'schedules', `${unitId}-${scheduleType}`)
      await deleteDoc(scheduleRef)
    } catch (error) {
      console.error('Error deleting schedule:', error)
      throw new Error('Erro ao deletar horário')
    }
  }
} 