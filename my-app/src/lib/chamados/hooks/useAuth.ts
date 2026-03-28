'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { ChamadoUsuario } from '../types'

interface AuthContextType {
  user: User | null
  usuario: ChamadoUsuario | null
  loading: boolean
  error: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

export function useChamadosAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [usuario, setUsuario] = useState<ChamadoUsuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'chamados_usuarios', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data() as ChamadoUsuario
            setUsuario({ ...userData, uid: firebaseUser.uid })

            // Atualizar último acesso
            await updateDoc(userDocRef, {
              ultimoAcesso: Timestamp.now(),
            })
          } else {
            // Auto-criar usuário como solicitante na primeira vez
            const novoUsuario: ChamadoUsuario = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              role: 'admin', // Primeiro usuário = admin (altere depois para 'solicitante' em produção)
              unidades: ['alphaville', 'buena-vista', 'marista', 'palmas'],
              ativo: true,
              criadoEm: Timestamp.now(),
              ultimoAcesso: Timestamp.now(),
            }
            await setDoc(userDocRef, novoUsuario)
            setUsuario(novoUsuario)
          }
        } catch (err) {
          console.error('Erro ao buscar usuário:', err)
          setError('Erro ao carregar dados do usuário')
        }
      } else {
        setUsuario(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email: string, senha: string) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, senha)
    } catch (err: any) {
      const message = err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
        ? 'Email ou senha incorretos'
        : err.code === 'auth/too-many-requests'
        ? 'Muitas tentativas. Tente novamente mais tarde.'
        : 'Erro ao fazer login'
      setError(message)
      setLoading(false)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUsuario(null)
  }, [])

  return { user, usuario, loading, error, login, logout }
}
