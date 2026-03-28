import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Departamento, ChamadoUsuario, CategoriaType, UnidadeType } from '../types'

const COLLECTION = 'chamados_departamentos'
const USERS_COLLECTION = 'chamados_usuarios'

/**
 * Cria um novo departamento
 */
export async function criarDepartamento(dados: {
  nome: string
  descricao?: string
  cor: string
  categorias: CategoriaType[]
  unidades: UnidadeType[]
  notificarWhatsApp: boolean
}): Promise<string> {
  const agora = Timestamp.now()
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...dados,
    criadoEm: agora,
    atualizadoEm: agora,
  })
  return docRef.id
}

/**
 * Atualiza um departamento
 */
export async function atualizarDepartamento(
  id: string,
  dados: Partial<Omit<Departamento, 'id' | 'criadoEm'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...dados,
    atualizadoEm: Timestamp.now(),
  })
}

/**
 * Remove um departamento e desvincula membros
 */
export async function removerDepartamento(id: string): Promise<void> {
  // Desvincular membros
  const membros = await buscarMembrosDepartamento(id)
  for (const membro of membros) {
    await updateDoc(doc(db, USERS_COLLECTION, membro.uid), {
      departamentoId: null,
    })
  }
  await deleteDoc(doc(db, COLLECTION, id))
}

/**
 * Lista todos os departamentos
 */
export async function listarDepartamentos(): Promise<Departamento[]> {
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Departamento))
}

/**
 * Busca um departamento por ID
 */
export async function buscarDepartamento(id: string): Promise<Departamento | null> {
  const docSnap = await getDoc(doc(db, COLLECTION, id))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Departamento
}

/**
 * Busca membros de um departamento
 */
export async function buscarMembrosDepartamento(departamentoId: string): Promise<ChamadoUsuario[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('departamentoId', '==', departamentoId),
    where('ativo', '==', true)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), uid: d.id } as ChamadoUsuario))
}

/**
 * Associa um usuario a um departamento
 */
export async function associarUsuarioDepartamento(
  uid: string,
  departamentoId: string
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { departamentoId })
}

/**
 * Desvincula um usuario do departamento
 */
export async function desvincularUsuarioDepartamento(uid: string): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { departamentoId: null })
}

/**
 * Busca os emails dos membros de um departamento (para notificacao dinamica)
 */
export async function buscarEmailsDepartamento(departamentoId: string): Promise<{ email: string; nome: string; telefone?: string }[]> {
  const membros = await buscarMembrosDepartamento(departamentoId)
  return membros.map(m => ({ email: m.email, nome: m.nome, telefone: m.telefone }))
}

/**
 * Busca departamento responsavel por uma categoria+unidade
 */
export async function buscarDepartamentoPorCategoriaUnidade(
  categoria: CategoriaType,
  unidade: UnidadeType
): Promise<Departamento | null> {
  const q = query(
    collection(db, COLLECTION),
    where('categorias', 'array-contains', categoria)
  )
  const snap = await getDocs(q)
  const departamentos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Departamento))

  // Filtrar por unidade (Firestore nao suporta 2 array-contains)
  const match = departamentos.find(d => d.unidades.includes(unidade))
  return match || departamentos[0] || null
}
