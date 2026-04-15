import {
  ArteUnidadeType,
  DesignRequestType,
  DesignRequestStatus,
  DestinationType,
  RequesterRoleType,
} from './types'

// ==================== UNIDADES ====================

export const ARTE_UNIDADES: Record<ArteUnidadeType, { label: string; cor: string }> = {
  'alphaville': { label: 'Alphaville', cor: 'blue' },
  'buena-vista': { label: 'Buena Vista', cor: 'green' },
  'goiania': { label: 'Goiânia', cor: 'orange' },
  'palmas': { label: 'Palmas', cor: 'purple' },
}

export const ARTE_UNIDADES_VALIDAS: ArteUnidadeType[] = ['alphaville', 'buena-vista', 'goiania', 'palmas']

// ==================== TIPOS DE ARTE ====================

export const TIPOS_ARTE: Record<DesignRequestType, { label: string; descricao: string; emoji: string }> = {
  'aula-experimental': {
    label: 'Aula experimental ou novo horário',
    descricao: 'Divulgar uma aula nova ou horário experimental',
    emoji: '🎓',
  },
  'escala': {
    label: 'Escala de aulas coletivas',
    descricao: 'Divulgar a grade de horários do mês',
    emoji: '📅',
  },
  'evento': {
    label: 'Evento, desafio ou workshop',
    descricao: 'Divulgar um evento especial',
    emoji: '🏆',
  },
  'comunicado': {
    label: 'Comunicado ou aviso',
    descricao: 'Informar algo importante aos alunos',
    emoji: '📢',
  },
  'promocao': {
    label: 'Promoção ou campanha',
    descricao: 'Divulgar uma oferta comercial',
    emoji: '💰',
  },
  'aniversariantes': {
    label: 'Aniversariantes do mês',
    descricao: 'Lista de aniversariantes',
    emoji: '🎂',
  },
  'outro': {
    label: 'Outro (descreva você mesmo)',
    descricao: 'Qualquer outra necessidade',
    emoji: '✏️',
  },
}

// ==================== DESTINOS ====================

export const DESTINOS: Record<DestinationType, { label: string; emoji: string; proporcao: string; resolucao: string }> = {
  'tv': {
    label: 'TV da recepção',
    emoji: '📺',
    proporcao: '16:9',
    resolucao: '1920x1080',
  },
  'stories': {
    label: 'Stories Instagram',
    emoji: '📱',
    proporcao: '9:16',
    resolucao: '1080x1920',
  },
  'feed': {
    label: 'Feed Instagram',
    emoji: '📷',
    proporcao: '1:1',
    resolucao: '1080x1080',
  },
  'whatsapp': {
    label: 'WhatsApp',
    emoji: '💬',
    proporcao: '1:1',
    resolucao: '1080x1080',
  },
  'impresso': {
    label: 'Impresso',
    emoji: '🖨️',
    proporcao: 'A definir',
    resolucao: 'Definir com designer',
  },
}

// ==================== STATUS ====================

export const STATUS_ARTE: Record<DesignRequestStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'novo': { label: 'Novo', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'em-producao': { label: 'Em Produção', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  'em-revisao': { label: 'Em Revisão', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  'concluido': { label: 'Concluído', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  'cancelado': { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
}

// ==================== CARGOS ====================

export const CARGOS: Record<RequesterRoleType, { label: string }> = {
  'recepcionista': { label: 'Recepcionista' },
  'gerente': { label: 'Gerente' },
  'professor': { label: 'Professor(a)' },
  'personal': { label: 'Personal Trainer' },
  'coordenador': { label: 'Coordenador(a)' },
  'outro': { label: 'Outro' },
}

// ==================== DIAS DA SEMANA ====================

export const DIAS_SEMANA = [
  { value: 'seg', label: 'Seg' },
  { value: 'ter', label: 'Ter' },
  { value: 'qua', label: 'Qua' },
  { value: 'qui', label: 'Qui' },
  { value: 'sex', label: 'Sex' },
  { value: 'sab', label: 'Sáb' },
  { value: 'dom', label: 'Dom' },
]

// ==================== MESES ====================

export const MESES = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

// ==================== COMO SE INSCREVER ====================

export const COMO_INSCREVER = [
  { value: 'recepcao', label: 'Na recepção' },
  { value: 'link', label: 'Link' },
  { value: 'gratis', label: 'Grátis (sem inscrição)' },
  { value: 'outro', label: 'Outro' },
]

// ==================== CALL TO ACTION ====================

export const CALL_TO_ACTIONS = [
  { value: 'matricule-se', label: 'Matricule-se hoje' },
  { value: 'recepcao', label: 'Fale na recepção' },
  { value: 'outro', label: 'Outro' },
]

// ==================== PUBLICO ALVO ====================

export const PUBLICO_ALVO = [
  { value: 'novos', label: 'Novos alunos' },
  { value: 'atuais', label: 'Alunos atuais' },
  { value: 'ex-alunos', label: 'Ex-alunos' },
  { value: 'todos', label: 'Todos' },
]

// ==================== CORES POR UNIDADE (KANBAN) ====================

export const COR_UNIDADE: Record<ArteUnidadeType, { border: string; bg: string; text: string }> = {
  'alphaville': { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  'buena-vista': { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  'goiania': { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
  'palmas': { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
}

// ==================== KANBAN COLUMNS ====================

export const KANBAN_ARTE_COLUMNS: DesignRequestStatus[] = ['novo', 'em-producao', 'em-revisao', 'concluido']
