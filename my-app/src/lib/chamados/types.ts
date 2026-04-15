import { Timestamp } from 'firebase/firestore'

// ==================== ENUMS ====================

export type UnidadeType = 'alphaville' | 'buena-vista' | 'marista' | 'palmas'
export type CategoriaType = 'ti' | 'manutencao' | 'limpeza' | 'administrativo'
export type PrioridadeType = 'baixa' | 'media' | 'alta' | 'critica'
export type StatusType = 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'fechado' | 'cancelado'
export type RoleType = 'solicitante' | 'tecnico' | 'designer' | 'admin' | 'gestor'
export type HistoricoTipo = 'criacao' | 'comentario' | 'mudanca_status' | 'atribuicao' | 'redirecionamento' | 'mudanca_prioridade' | 'categorizacao' | 'anexo' | 'avaliacao'
export type NotificacaoTipo = 'novo_chamado' | 'atribuido' | 'comentario' | 'status_alterado' | 'sla_proximo' | 'sla_estourado' | 'resolvido'

// ==================== INTERFACES ====================

export interface Anexo {
  nome: string
  url: string
  tipo: string
  tamanho: number
}

export interface Chamado {
  id: string
  protocolo: string

  // Solicitante
  solicitante: {
    nome: string
    email: string
    telefone?: string
    cargo?: string
    setor: string
  }

  // Chamado
  unidade: UnidadeType
  categoria?: CategoriaType
  subcategoria?: string
  titulo?: string
  descricao: string
  local?: string

  // Classificação
  prioridade: PrioridadeType
  status: StatusType
  departamentoId?: string

  // Responsável
  atribuidoPara?: {
    uid: string
    nome: string
    email: string
  }

  // Anexos
  anexos: Anexo[]

  // SLA
  sla: {
    prazoResposta: Timestamp
    prazoResolucao: Timestamp
    respondidoEm?: Timestamp
    resolvidoEm?: Timestamp
    estourado: boolean
  }

  // Metadata
  criadoEm: Timestamp
  atualizadoEm: Timestamp
  fechadoEm?: Timestamp
  avaliacaoSolicitante?: {
    nota: 1 | 2 | 3 | 4 | 5
    comentario?: string
  }
}

export interface HistoricoChamado {
  id: string
  tipo: HistoricoTipo
  descricao: string
  autor: {
    uid: string
    nome: string
    role: 'solicitante' | 'tecnico' | 'admin'
  }
  dados?: {
    de?: string
    para?: string
    comentario?: string
    anexo?: { nome: string; url: string }
  }
  criadoEm: Timestamp
}

export interface ChamadoUsuario {
  uid: string
  email: string
  nome: string
  telefone?: string
  role: RoleType
  departamentoId?: string
  unidades: UnidadeType[]
  categorias?: CategoriaType[]
  ativo: boolean
  criadoEm: Timestamp
  ultimoAcesso?: Timestamp
}

// ==================== DEPARTAMENTOS ====================

export interface Departamento {
  id: string
  nome: string
  descricao?: string
  cor: string
  categorias: CategoriaType[]
  unidades: UnidadeType[]
  notificarWhatsApp: boolean
  criadoEm: Timestamp
  atualizadoEm: Timestamp
}

export interface ChamadoNotificacao {
  id: string
  usuarioId: string
  chamadoId: string
  protocolo: string
  tipo: NotificacaoTipo
  titulo: string
  mensagem: string
  lida: boolean
  emailEnviado: boolean
  criadoEm: Timestamp
}

export interface SLAConfig {
  resposta: number // Em horas
  resolucao: number // Em horas
}

export interface CategoriaConfig {
  subcategorias: string[]
  responsavelPadrao?: string
}

export interface ChamadoConfig {
  id: 'global'
  sla: Record<PrioridadeType, SLAConfig>
  categorias: Record<CategoriaType, CategoriaConfig>
  emailsNotificacao: Record<string, string[]>
  horarioFuncionamento: {
    inicio: string
    fim: string
    diasUteis: number[]
  }
}

// ==================== FORM TYPES ====================

export interface NovoChamadoFormData {
  unidade: UnidadeType | ''
  descricao: string
  local: string
  prioridade: PrioridadeType
  anexos: File[]
  direcionadoPara?: {
    uid: string
    nome: string
    email: string
  }
}

// ==================== FILTER TYPES ====================

export interface ChamadoFilters {
  status?: StatusType | 'todos'
  categoria?: CategoriaType | 'todos'
  prioridade?: PrioridadeType | 'todos'
  unidade?: UnidadeType | 'todos'
  tecnico?: string | 'todos'
  busca?: string
  periodo?: 'hoje' | '7dias' | '30dias' | '90dias' | 'customizado'
  dataInicio?: Date
  dataFim?: Date
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalAbertos: number
  totalEmAndamento: number
  resolvidosHoje: number
  slaEstourado: number
  totalMes: number
  variacaoMes: number
}

export interface ChamadoResumo {
  id: string
  protocolo: string
  titulo?: string
  descricao?: string
  status: StatusType
  prioridade: PrioridadeType
  unidade: UnidadeType
  categoria?: CategoriaType
  criadoEm: Timestamp
  slaEstourado: boolean
}
