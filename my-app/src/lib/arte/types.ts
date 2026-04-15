import { Timestamp } from 'firebase/firestore'

// ==================== UNIDADES ====================

export type ArteUnidadeType = 'alphaville' | 'buena-vista' | 'goiania' | 'palmas'

// ==================== CARGOS ====================

export type RequesterRoleType = 'recepcionista' | 'gerente' | 'professor' | 'personal' | 'coordenador' | 'outro'

// ==================== TIPOS DE ARTE ====================

export type DesignRequestType =
  | 'aula-experimental'
  | 'escala'
  | 'evento'
  | 'comunicado'
  | 'promocao'
  | 'aniversariantes'
  | 'outro'

// ==================== DESTINOS ====================

export type DestinationType = 'tv' | 'stories' | 'feed' | 'whatsapp' | 'impresso'

// ==================== STATUS ====================

export type DesignRequestStatus = 'novo' | 'em-producao' | 'em-revisao' | 'concluido' | 'cancelado'

// ==================== REVIEW STATUS ====================

export type ReviewStatusType = 'aguardando' | 'aprovado' | 'ajuste-solicitado'

// ==================== SOLICITANTE ====================

export interface Requester {
  id: string
  deviceId: string
  name: string
  phone: string            // formato E.164: +5562999999999
  phoneDisplay: string     // formato BR: (62) 99999-9999
  unitId: ArteUnidadeType
  role: RequesterRoleType
  createdAt: Timestamp
  lastActiveAt: Timestamp
  isBlocked: boolean
  totalRequests: number
}

// ==================== REFERÊNCIA ====================

export interface ReferenceImage {
  url: string
  storagePath: string
  fileName: string
  uploadedAt: Timestamp
}

// ==================== ENTREGA ====================

export interface DeliveryFile {
  url: string
  storagePath: string
  fileName: string
  dimension: DestinationType | 'outro'
  sizeBytes: number
}

export interface Delivery {
  version: number
  files: DeliveryFile[]
  deliveredAt: Timestamp
  deliveredBy: string
  reviewStatus: ReviewStatusType
  reviewedAt: Timestamp | null
  feedback: string | null
}

// ==================== SOLICITAÇÃO DE ARTE ====================

export interface DesignRequest {
  id: string
  requestNumber: number
  unitId: ArteUnidadeType
  type: DesignRequestType
  destinations: DestinationType[]
  dynamicFields: Record<string, unknown>
  description: string
  referenceImages: ReferenceImage[]
  deadline: Timestamp

  // Solicitante (denormalizado)
  requesterId: string
  requesterName: string
  requesterPhone: string
  requesterRole: string

  // Status e atribuição
  status: DesignRequestStatus
  assignedTo: string | null
  assignedToName: string | null

  // Versões entregues
  deliveries: Delivery[]

  // Timeline
  createdAt: Timestamp
  updatedAt: Timestamp
  assignedAt: Timestamp | null
  firstDeliveryAt: Timestamp | null
  completedAt: Timestamp | null

  // Flags
  isUrgent: boolean
  roundsOfRevision: number
}

// ==================== COMENTÁRIOS ====================

export interface DesignRequestComment {
  id: string
  requestId: string
  authorType: 'requester' | 'designer' | 'admin'
  authorId: string
  authorName: string
  message: string
  createdAt: Timestamp
  readBy: string[]
}

// ==================== FORMULÁRIOS ====================

// Campos dinâmicos por tipo

export interface AulaExperimentalFields {
  nomeAula: string
  dataInicio: string           // ISO date string
  diasSemana: string[]         // ['seg', 'ter', ...]
  horario: string              // 'HH:mm'
  professores: string
  unidadeAula: ArteUnidadeType
}

export interface EscalaFields {
  periodoVigencia: string
  escalaArquivo?: File | null
  escalaTexto?: string
  unidadeEscala: ArteUnidadeType
}

export interface EventoFields {
  nomeEvento: string
  data: string
  horario: string
  local: ArteUnidadeType | 'todas'
  professores: string
  descricaoCurta: string
  comoInscrever: 'recepcao' | 'link' | 'gratis' | 'outro'
  comoInscreverDetalhe?: string
  temaVisual?: string
}

export interface ComunicadoFields {
  titulo: string
  corpo: string
  urgencia: 'normal' | 'urgente'
  dataValidade: string
}

export interface PromocaoFields {
  nomePromocao: string
  descricaoBeneficio: string
  condicoes: string
  validaDe: string
  validaAte: string
  callToAction: 'matricule-se' | 'recepcao' | 'outro'
  callToActionOutro?: string
  publicoAlvo: 'novos' | 'atuais' | 'ex-alunos' | 'todos'
}

export interface AniversariantesFields {
  mesReferencia: string
  listaArquivo?: File | null
  listaTexto?: string
  unidadeAniversariantes: ArteUnidadeType
}

export interface OutroFields {
  titulo: string
  descricaoDetalhada: string
}

export type DynamicFields =
  | AulaExperimentalFields
  | EscalaFields
  | EventoFields
  | ComunicadoFields
  | PromocaoFields
  | AniversariantesFields
  | OutroFields

// ==================== FORMULÁRIO DE CRIAÇÃO ====================

export interface NovoDesignRequestFormData {
  type: DesignRequestType | ''
  destinations: DestinationType[]
  dynamicFields: Record<string, unknown>
  description: string
  referenceImages: File[]
  deadline: string             // ISO date string
}

// ==================== CADASTRO SOLICITANTE ====================

export interface RequesterFormData {
  name: string
  phone: string
  role: RequesterRoleType | ''
}
