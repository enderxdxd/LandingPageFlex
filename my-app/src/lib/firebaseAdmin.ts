import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (!raw) return undefined
  // Remove aspas extras que a Vercel pode adicionar
  const cleaned = raw.replace(/^"(.*)"$/, '$1')
  // Converte \n literal em quebras de linha reais
  return cleaned.replace(/\\n/g, '\n')
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
