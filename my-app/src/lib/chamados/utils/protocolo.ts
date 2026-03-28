import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Gera um protocolo único no formato CHM-2026-00001
 * Busca o último protocolo no Firestore e incrementa
 */
export async function gerarProtocolo(): Promise<string> {
  const ano = new Date().getFullYear()
  const prefix = `CHM-${ano}-`

  const chamadosRef = collection(db, 'chamados')
  const q = query(chamadosRef, orderBy('protocolo', 'desc'), limit(1))
  const snapshot = await getDocs(q)

  let proximoNumero = 1

  if (!snapshot.empty) {
    const ultimoProtocolo = snapshot.docs[0].data().protocolo as string
    const ultimoAno = ultimoProtocolo.split('-')[1]

    if (ultimoAno === String(ano)) {
      const ultimoNumero = parseInt(ultimoProtocolo.split('-')[2], 10)
      proximoNumero = ultimoNumero + 1
    }
  }

  const numero = String(proximoNumero).padStart(5, '0')
  return `${prefix}${numero}`
}
