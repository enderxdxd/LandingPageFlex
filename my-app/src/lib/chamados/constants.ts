import {
  UnidadeType,
  CategoriaType,
  PrioridadeType,
  StatusType,
  ChamadoConfig,
} from './types'

// ==================== UNIDADES ====================

export const UNIDADES: Record<UnidadeType, { label: string; endereco: string }> = {
  'alphaville': { label: 'Alphaville', endereco: 'Goiânia - GO' },
  'buena-vista': { label: 'Buena Vista', endereco: 'Goiânia - GO' },
  'marista': { label: 'Marista', endereco: 'Goiânia - GO' },
  'palmas': { label: 'Palmas', endereco: 'Palmas - TO' },
}

// ==================== CATEGORIAS ====================

export const CATEGORIAS: Record<CategoriaType, { label: string; icon: string }> = {
  'ti': { label: 'TI', icon: 'Monitor' },
  'manutencao': { label: 'Manutenção', icon: 'Wrench' },
  'limpeza': { label: 'Limpeza', icon: 'Sparkles' },
  'administrativo': { label: 'Administrativo', icon: 'Briefcase' },
}

// ==================== SUBCATEGORIAS ====================

export const SUBCATEGORIAS: Record<CategoriaType, string[]> = {
  'ti': [
    'Computador / Notebook',
    'Internet / Wi-Fi',
    'Impressora',
    'Software / Sistema',
    'Câmera de segurança',
    'Som / Áudio ambiente',
    'TV / Monitor',
    'Ponto eletrônico',
    'Outro',
  ],
  'manutencao': [
    'Ar-condicionado',
    'Iluminação',
    'Equipamento de academia',
    'Hidráulica / Encanamento',
    'Elétrica',
    'Porta / Fechadura',
    'Pintura / Parede',
    'Piso',
    'Elevador',
    'Outro',
  ],
  'limpeza': [
    'Banheiro / Vestiário',
    'Área de treino',
    'Recepção',
    'Estacionamento',
    'Piscina (se aplicável)',
    'Copa / Cozinha',
    'Área externa',
    'Outro',
  ],
  'administrativo': [
    'Recursos Humanos',
    'Financeiro',
    'Compras / Suprimentos',
    'Contrato / Documentação',
    'Comunicação interna',
    'Outro',
  ],
}

// ==================== STATUS ====================

export const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'aberto': { label: 'Aberto', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'em_andamento': { label: 'Em Andamento', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  'aguardando': { label: 'Aguardando', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  'resolvido': { label: 'Resolvido', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  'fechado': { label: 'Fechado', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  'cancelado': { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
}

export const STATUS_ORDER: StatusType[] = ['aberto', 'em_andamento', 'aguardando', 'resolvido', 'fechado', 'cancelado']

// ==================== PRIORIDADE ====================

export const PRIORIDADE_CONFIG: Record<PrioridadeType, { label: string; color: string; bgColor: string; borderColor: string; dotColor: string }> = {
  'baixa': { label: 'Baixa', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500' },
  'media': { label: 'Média', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', dotColor: 'bg-yellow-500' },
  'alta': { label: 'Alta', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', dotColor: 'bg-orange-500' },
  'critica': { label: 'Crítica', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', dotColor: 'bg-red-500' },
}

// ==================== SLA PADRÃO ====================

export const SLA_PADRAO: Record<PrioridadeType, { resposta: number; resolucao: number }> = {
  'baixa': { resposta: 24, resolucao: 72 },
  'media': { resposta: 8, resolucao: 48 },
  'alta': { resposta: 4, resolucao: 24 },
  'critica': { resposta: 1, resolucao: 8 },
}

// ==================== EMAILS POR UNIDADE ====================

export const EMAILS_POR_UNIDADE: Record<string, string[]> = {
  'alphaville': [
    'vendas.alphaville@flexacademia.com.br',
    'supervisaotecnicaalphaville@flexacademia.com.br',
  ],
  'buena-vista': [
    'vendasflexbuenavista@flexacademia.com.br',
    'supervisaotecnicabuenavista@flexacademia.com.br',
  ],
  'marista': [
    'jonatas@flexacademia.com.br',
    'vendasmarista@flexacademia.com.br',
  ],
  'palmas': [
    'vendaspalmas@flexacademia.com.br',
    'gestaotecnica@flexpalmas.com.br',
  ],
  'geral': [
    'hudson@flexacademia.com.br',
    'comercial@flexacademia.com.br',
  ],
}

// ==================== CONFIG PADRÃO ====================

export const CONFIG_PADRAO: Omit<ChamadoConfig, 'id'> = {
  sla: SLA_PADRAO,
  categorias: {
    ti: { subcategorias: SUBCATEGORIAS.ti },
    manutencao: { subcategorias: SUBCATEGORIAS.manutencao },
    limpeza: { subcategorias: SUBCATEGORIAS.limpeza },
    administrativo: { subcategorias: SUBCATEGORIAS.administrativo },
  },
  emailsNotificacao: EMAILS_POR_UNIDADE,
  horarioFuncionamento: {
    inicio: '08:00',
    fim: '18:00',
    diasUteis: [1, 2, 3, 4, 5],
  },
}

// ==================== KANBAN COLUMNS ====================

export const KANBAN_COLUMNS: StatusType[] = ['aberto', 'em_andamento', 'aguardando', 'resolvido', 'fechado']
