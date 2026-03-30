import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { Chamado, StatusType, PrioridadeType, UnidadeType, CategoriaType, Anexo, NovoChamadoFormData, ChamadoUsuario } from '../types'
import { gerarProtocolo } from '../utils/protocolo'
import { calcularPrazosSLA } from '../utils/sla'
import { buscarDepartamentoPorCategoriaUnidade, buscarEmailsDepartamento } from './departamentoService'
import { UNIDADES, CATEGORIAS } from '../constants'

const COLLECTION = 'chamados'
const PAGE_SIZE = 20

/**
 * Cria um novo chamado
 */
export async function criarChamado(
  dados: NovoChamadoFormData,
  usuario: ChamadoUsuario
): Promise<string> {
  const protocolo = await gerarProtocolo()
  const agora = Timestamp.now()
  const sla = calcularPrazosSLA(dados.prioridade, agora.toDate())

  // Upload de anexos
  const anexos: Anexo[] = []
  for (const file of dados.anexos) {
    const storageRef = ref(storage, `chamados/${protocolo}/${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    anexos.push({
      nome: file.name,
      url,
      tipo: file.type,
      tamanho: file.size,
    })
  }

  // Auto-gerar titulo a partir da descricao
  const titulo = dados.descricao.length > 60
    ? dados.descricao.substring(0, 60).trim() + '...'
    : dados.descricao.trim()

  const chamado: Omit<Chamado, 'id'> = {
    protocolo,
    solicitante: {
      nome: usuario.nome,
      email: usuario.email,
      setor: '',
    },
    unidade: dados.unidade as UnidadeType,
    titulo,
    descricao: dados.descricao,
    ...(dados.local ? { local: dados.local } : {}),
    prioridade: dados.prioridade,
    status: 'aberto',
    anexos,
    sla: {
      ...sla,
      estourado: false,
    },
    criadoEm: agora,
    atualizadoEm: agora,
  }

  const docRef = await addDoc(collection(db, COLLECTION), chamado)

  // Criar registro no histórico
  await addDoc(collection(db, COLLECTION, docRef.id, 'historico'), {
    tipo: 'criacao',
    descricao: `Chamado ${protocolo} criado`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: usuario.role === 'admin' ? 'admin' : usuario.role === 'tecnico' ? 'tecnico' : 'solicitante',
    },
    criadoEm: agora,
  })

  // Notificar emails da unidade
  try {
    const { EMAILS_POR_UNIDADE } = await import('../constants')
    const emailsUnidade = EMAILS_POR_UNIDADE[dados.unidade] || []
    const emailsGeral = EMAILS_POR_UNIDADE['geral'] || []
    const todosEmails = Array.from(new Set([...emailsUnidade, ...emailsGeral]))

    if (todosEmails.length > 0) {
      await fetch('/api/chamados/notificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'novo_admin',
          chamadoId: docRef.id,
          protocolo,
          titulo,
          prioridade: dados.prioridade,
          unidade: UNIDADES[dados.unidade as UnidadeType]?.label || dados.unidade,
          categoria: 'Não categorizado',
          destinatarios: todosEmails.map(email => ({ email, nome: email.split('@')[0] })),
        }),
      })
    }
  } catch {
    // Erro na notificacao nao deve bloquear criacao do chamado
  }

  return docRef.id
}

/**
 * Categoriza um chamado (admin/gestor/tecnico)
 */
export async function categorizarChamado(
  chamadoId: string,
  categoria: CategoriaType,
  subcategoria: string,
  usuario: ChamadoUsuario
): Promise<void> {
  const chamadoRef = doc(db, COLLECTION, chamadoId)
  const chamadoSnap = await getDoc(chamadoRef)
  if (!chamadoSnap.exists()) throw new Error('Chamado não encontrado')

  const chamado = chamadoSnap.data() as Chamado
  const agora = Timestamp.now()

  // Buscar departamento responsavel pela nova categoria
  let departamentoId: string | undefined
  let departamentoNome: string | undefined
  try {
    const dep = await buscarDepartamentoPorCategoriaUnidade(
      categoria,
      chamado.unidade
    )
    if (dep) {
      departamentoId = dep.id
      departamentoNome = dep.nome
    }
  } catch {
    // Departamento nao encontrado
  }

  await updateDoc(chamadoRef, {
    categoria,
    subcategoria,
    ...(departamentoId ? { departamentoId } : {}),
    atualizadoEm: agora,
  })

  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'categorizacao',
    descricao: `Categorizado como ${CATEGORIAS[categoria]?.label || categoria} - ${subcategoria}${departamentoNome ? ` (Dept: ${departamentoNome})` : ''}`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: usuario.role === 'admin' ? 'admin' : usuario.role === 'tecnico' ? 'tecnico' : 'solicitante',
    },
    dados: {
      para: `${categoria} - ${subcategoria}`,
    },
    criadoEm: agora,
  })

  // Notificar departamento se encontrado
  if (departamentoId) {
    try {
      const membros = await buscarEmailsDepartamento(departamentoId)
      if (membros.length > 0) {
        const dep = await buscarDepartamentoPorCategoriaUnidade(categoria, chamado.unidade)
        await fetch('/api/chamados/notificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'novo_departamento',
            chamadoId,
            protocolo: chamado.protocolo,
            titulo: chamado.titulo || chamado.descricao.substring(0, 60),
            prioridade: chamado.prioridade,
            unidade: UNIDADES[chamado.unidade]?.label || chamado.unidade,
            categoria: CATEGORIAS[categoria]?.label || categoria,
            departamento: departamentoNome,
            destinatarios: membros,
            enviarWhatsApp: dep?.notificarWhatsApp ?? false,
          }),
        })
      }
    } catch {
      // Erro na notificacao nao bloqueia
    }
  }
}

/**
 * Busca um chamado por ID
 */
export async function buscarChamado(id: string): Promise<Chamado | null> {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Chamado
}

/**
 * Lista chamados com filtros e paginação
 */
export async function listarChamados(filtros: {
  status?: StatusType
  categoria?: CategoriaType
  prioridade?: PrioridadeType
  unidade?: UnidadeType
  email?: string
  tecnicoUid?: string
  ultimoDoc?: DocumentSnapshot
  pageSize?: number
}): Promise<{ chamados: Chamado[]; ultimoDoc: DocumentSnapshot | null }> {
  const constraints: ReturnType<typeof where>[] = []

  if (filtros.status) constraints.push(where('status', '==', filtros.status))
  if (filtros.categoria) constraints.push(where('categoria', '==', filtros.categoria))
  if (filtros.prioridade) constraints.push(where('prioridade', '==', filtros.prioridade))
  if (filtros.unidade) constraints.push(where('unidade', '==', filtros.unidade))
  if (filtros.email) constraints.push(where('solicitante.email', '==', filtros.email))
  if (filtros.tecnicoUid) constraints.push(where('atribuidoPara.uid', '==', filtros.tecnicoUid))

  const q = query(
    collection(db, COLLECTION),
    ...constraints,
    orderBy('criadoEm', 'desc'),
    ...(filtros.ultimoDoc ? [startAfter(filtros.ultimoDoc)] : []),
    limit(filtros.pageSize || PAGE_SIZE)
  )

  const snapshot = await getDocs(q)
  const chamados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chamado))
  const ultimoDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  return { chamados, ultimoDoc }
}

/**
 * Atualiza o status de um chamado
 */
export async function atualizarStatus(
  chamadoId: string,
  novoStatus: StatusType,
  usuario: ChamadoUsuario,
  justificativa?: string
): Promise<void> {
  const chamadoRef = doc(db, COLLECTION, chamadoId)
  const chamadoSnap = await getDoc(chamadoRef)
  if (!chamadoSnap.exists()) throw new Error('Chamado não encontrado')

  const chamado = chamadoSnap.data() as Chamado
  const statusAnterior = chamado.status
  const agora = Timestamp.now()

  const baseUpdates = {
    status: novoStatus,
    atualizadoEm: agora,
    ...(novoStatus === 'resolvido' ? { 'sla.resolvidoEm': agora } : {}),
    ...(novoStatus === 'fechado' || novoStatus === 'cancelado' ? { fechadoEm: agora } : {}),
    ...(statusAnterior === 'aberto' && novoStatus !== 'aberto' && novoStatus !== 'cancelado' ? { 'sla.respondidoEm': agora } : {}),
  }

  await updateDoc(chamadoRef, baseUpdates)

  // Registrar no histórico
  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'mudanca_status',
    descricao: justificativa || `Status alterado de "${statusAnterior}" para "${novoStatus}"`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: usuario.role === 'admin' ? 'admin' : usuario.role === 'tecnico' ? 'tecnico' : 'solicitante',
    },
    dados: {
      de: statusAnterior,
      para: novoStatus,
    },
    criadoEm: agora,
  })

  // Notificar solicitante por email sobre mudanca de status
  try {
    const { STATUS_CONFIG } = await import('../constants')
    const statusLabel = STATUS_CONFIG[novoStatus]?.label || novoStatus
    const tipoNotif = novoStatus === 'resolvido' ? 'resolvido' : 'status'

    await fetch('/api/chamados/notificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: tipoNotif,
        chamadoId,
        protocolo: chamado.protocolo,
        titulo: chamado.titulo || chamado.descricao?.substring(0, 60),
        prioridade: chamado.prioridade,
        unidade: UNIDADES[chamado.unidade]?.label || chamado.unidade,
        categoria: chamado.categoria ? CATEGORIAS[chamado.categoria]?.label || chamado.categoria : 'Não categorizado',
        destinatarios: [{ email: chamado.solicitante.email, nome: chamado.solicitante.nome }],
        detalhes: statusLabel,
      }),
    })
  } catch {
    // Erro na notificacao nao bloqueia mudanca de status
  }
}

/**
 * Atribui um técnico ao chamado
 */
export async function atribuirTecnico(
  chamadoId: string,
  tecnico: { uid: string; nome: string; email: string },
  usuario: ChamadoUsuario
): Promise<void> {
  const chamadoRef = doc(db, COLLECTION, chamadoId)
  const agora = Timestamp.now()

  await updateDoc(chamadoRef, {
    atribuidoPara: tecnico,
    atualizadoEm: agora,
  })

  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'atribuicao',
    descricao: `Chamado atribuído a ${tecnico.nome}`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: 'admin',
    },
    dados: {
      para: tecnico.nome,
    },
    criadoEm: agora,
  })
}

/**
 * Atualiza a prioridade do chamado
 */
export async function atualizarPrioridade(
  chamadoId: string,
  novaPrioridade: PrioridadeType,
  usuario: ChamadoUsuario
): Promise<void> {
  const chamadoRef = doc(db, COLLECTION, chamadoId)
  const chamadoSnap = await getDoc(chamadoRef)
  if (!chamadoSnap.exists()) throw new Error('Chamado não encontrado')

  const chamado = chamadoSnap.data() as Chamado
  const prioridadeAnterior = chamado.prioridade
  const agora = Timestamp.now()

  // Recalcular SLA
  const novoSLA = calcularPrazosSLA(novaPrioridade, chamado.criadoEm.toDate())

  await updateDoc(chamadoRef, {
    prioridade: novaPrioridade,
    'sla.prazoResposta': novoSLA.prazoResposta,
    'sla.prazoResolucao': novoSLA.prazoResolucao,
    atualizadoEm: agora,
  })

  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'mudanca_prioridade',
    descricao: `Prioridade alterada de "${prioridadeAnterior}" para "${novaPrioridade}"`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: 'admin',
    },
    dados: {
      de: prioridadeAnterior,
      para: novaPrioridade,
    },
    criadoEm: agora,
  })
}

/**
 * Adiciona avaliação do solicitante
 */
export async function avaliarChamado(
  chamadoId: string,
  nota: 1 | 2 | 3 | 4 | 5,
  comentario: string,
  usuario: ChamadoUsuario
): Promise<void> {
  const chamadoRef = doc(db, COLLECTION, chamadoId)
  const agora = Timestamp.now()

  await updateDoc(chamadoRef, {
    avaliacaoSolicitante: { nota, comentario },
    atualizadoEm: agora,
  })

  await addDoc(collection(db, COLLECTION, chamadoId, 'historico'), {
    tipo: 'avaliacao',
    descricao: `Avaliação: ${nota}/5 estrelas`,
    autor: {
      uid: usuario.uid,
      nome: usuario.nome,
      role: 'solicitante',
    },
    dados: {
      comentario,
    },
    criadoEm: agora,
  })
}

/**
 * Listener em tempo real para um chamado
 */
export function escutarChamado(
  chamadoId: string,
  callback: (chamado: Chamado | null) => void
) {
  return onSnapshot(doc(db, COLLECTION, chamadoId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Chamado)
    } else {
      callback(null)
    }
  })
}

/**
 * Buscar estatísticas para o dashboard
 */
export async function buscarEstatisticas(unidade?: UnidadeType) {
  const constraints: ReturnType<typeof where>[] = []
  if (unidade) constraints.push(where('unidade', '==', unidade))

  const q = query(collection(db, COLLECTION), ...constraints)
  const snapshot = await getDocs(q)

  const chamados = snapshot.docs.map(d => d.data() as Chamado)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return {
    totalAbertos: chamados.filter(c => c.status === 'aberto').length,
    totalEmAndamento: chamados.filter(c => c.status === 'em_andamento').length,
    resolvidosHoje: chamados.filter(c =>
      c.status === 'resolvido' && c.sla?.resolvidoEm && c.sla.resolvidoEm.toDate() >= hoje
    ).length,
    slaEstourado: chamados.filter(c => c.sla?.estourado).length,
    totalMes: chamados.filter(c => {
      const d = c.criadoEm.toDate()
      return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()
    }).length,
    variacaoMes: 0,
    porCategoria: {
      ti: chamados.filter(c => c.categoria === 'ti').length,
      manutencao: chamados.filter(c => c.categoria === 'manutencao').length,
      limpeza: chamados.filter(c => c.categoria === 'limpeza').length,
      administrativo: chamados.filter(c => c.categoria === 'administrativo').length,
    },
    porUnidade: {
      alphaville: chamados.filter(c => c.unidade === 'alphaville').length,
      'buena-vista': chamados.filter(c => c.unidade === 'buena-vista').length,
      marista: chamados.filter(c => c.unidade === 'marista').length,
      palmas: chamados.filter(c => c.unidade === 'palmas').length,
    },
  }
}
