import { RoleType, StatusType, ChamadoUsuario, Chamado } from '../types'

/**
 * Verifica se o usuário pode realizar determinada ação
 */
export function podeAbrirChamado(usuario: ChamadoUsuario): boolean {
  return usuario.ativo
}

export function podeVerChamado(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false

  // Admin e gestor veem tudo
  if (usuario.role === 'admin') return true
  if (usuario.role === 'gestor' && usuario.unidades.includes(chamado.unidade)) return true

  // Técnico vê chamados atribuídos a ele
  if (usuario.role === 'tecnico' && chamado.atribuidoPara?.uid === usuario.uid) return true

  // Solicitante vê seus próprios chamados
  if (chamado.solicitante.email === usuario.email) return true

  return false
}

export function podeComentar(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false

  switch (usuario.role) {
    case 'admin':
      return true
    case 'gestor':
      return usuario.unidades.includes(chamado.unidade)
    case 'tecnico':
      return chamado.atribuidoPara?.uid === usuario.uid
    case 'solicitante':
      return chamado.solicitante.email === usuario.email
    default:
      return false
  }
}

export function podeAlterarStatus(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false

  switch (usuario.role) {
    case 'admin':
      return true
    case 'gestor':
      return usuario.unidades.includes(chamado.unidade)
    case 'tecnico':
      return chamado.atribuidoPara?.uid === usuario.uid
    default:
      return false
  }
}

export function podeAtribuirTecnico(usuario: ChamadoUsuario): boolean {
  return usuario.ativo && (usuario.role === 'admin' || usuario.role === 'gestor')
}

export function podeRedirecionarChamado(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false
  if (['fechado', 'cancelado'].includes(chamado.status)) return false

  // Admin e gestor sempre podem redirecionar
  if (usuario.role === 'admin') return true
  if (usuario.role === 'gestor' && usuario.unidades.includes(chamado.unidade)) return true

  // Tecnico atribuido pode redirecionar para outro
  if (usuario.role === 'tecnico' && chamado.atribuidoPara?.uid === usuario.uid) return true

  return false
}

export function podeVerDashboard(usuario: ChamadoUsuario): boolean {
  return usuario.ativo && (usuario.role === 'admin' || usuario.role === 'gestor')
}

export function podeVerRelatorios(usuario: ChamadoUsuario): boolean {
  return usuario.ativo && (usuario.role === 'admin' || usuario.role === 'gestor')
}

export function podeGerenciarUsuarios(usuario: ChamadoUsuario): boolean {
  return usuario.ativo && usuario.role === 'admin'
}

export function podeGerenciarConfiguracoes(usuario: ChamadoUsuario): boolean {
  return usuario.ativo && usuario.role === 'admin'
}

export function podeFecharChamado(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false
  if (chamado.status !== 'resolvido') return false

  // Só quem abriu o chamado pode fechar (confirmar resolução)
  if (chamado.solicitante.email === usuario.email) return true

  // Admin como fallback
  if (usuario.role === 'admin') return true

  return false
}

export function podeRecategorizarChamado(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false
  if (['fechado', 'cancelado'].includes(chamado.status)) return false

  switch (usuario.role) {
    case 'admin':
      return true
    case 'gestor':
      return usuario.unidades.includes(chamado.unidade)
    case 'tecnico':
      return chamado.atribuidoPara?.uid === usuario.uid
    default:
      return false
  }
}

export function podeCancelarChamado(usuario: ChamadoUsuario, chamado: Chamado): boolean {
  if (!usuario.ativo) return false

  if (usuario.role === 'admin' || usuario.role === 'gestor') return true

  // Solicitante pode cancelar se o chamado ainda está aberto
  if (chamado.solicitante.email === usuario.email && chamado.status === 'aberto') return true

  return false
}

/**
 * Retorna as rotas de navegação baseado no role do usuário
 */
export function getNavItems(role: RoleType) {
  const items = [
    { label: 'Novo Chamado', href: '/chamados/novo', roles: ['solicitante', 'tecnico', 'gestor', 'admin'] },
    { label: 'Meus Chamados', href: '/chamados/meus', roles: ['solicitante', 'tecnico', 'gestor', 'admin'] },
    { label: 'Painel', href: '/chamados/painel', roles: ['gestor', 'admin'] },
    { label: 'Relatórios', href: '/chamados/painel/relatorios', roles: ['gestor', 'admin'] },
    { label: 'Configurações', href: '/chamados/painel/configuracoes', roles: ['admin'] },
  ]

  return items.filter(item => item.roles.includes(role))
}
