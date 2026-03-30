'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Save, Users, Clock, Building2, Loader2, Plus, Trash2, UserPlus, UserMinus, MessageCircle, Pencil, X } from 'lucide-react'
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import { podeGerenciarConfiguracoes } from '@/lib/chamados/utils/permissions'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import { ChamadoUsuario, RoleType, PrioridadeType, Departamento, CategoriaType, UnidadeType } from '@/lib/chamados/types'
import { SLA_PADRAO, UNIDADES, CATEGORIAS } from '@/lib/chamados/constants'
import {
  criarDepartamento,
  listarDepartamentos,
  atualizarDepartamento,
  removerDepartamento,
  buscarMembrosDepartamento,
  associarUsuarioDepartamento,
  desvincularUsuarioDepartamento,
} from '@/lib/chamados/services/departamentoService'

const CORES_DEPARTAMENTO = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
]

export default function ConfiguracoesPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'usuarios' | 'departamentos' | 'sla'>('usuarios')
  const [usuarios, setUsuarios] = useState<ChamadoUsuario[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [slaConfig, setSlaConfig] = useState(SLA_PADRAO)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingDeps, setLoadingDeps] = useState(true)
  const [saving, setSaving] = useState(false)

  // New user form
  const [novoNome, setNovoNome] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [novoTelefone, setNovoTelefone] = useState('')
  const [novoRole, setNovoRole] = useState<RoleType>('solicitante')
  const [novoSenha, setNovoSenha] = useState('')
  const [novoDepartamento, setNovoDepartamento] = useState('')

  // New department form
  const [depNome, setDepNome] = useState('')
  const [depDescricao, setDepDescricao] = useState('')
  const [depCor, setDepCor] = useState(CORES_DEPARTAMENTO[0])
  const [depCategorias, setDepCategorias] = useState<CategoriaType[]>([])
  const [depUnidades, setDepUnidades] = useState<UnidadeType[]>(Object.keys(UNIDADES) as UnidadeType[])
  const [depWhatsApp, setDepWhatsApp] = useState(false)

  // Edit user
  const [editingUid, setEditingUid] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editTelefone, setEditTelefone] = useState('')
  const [editRole, setEditRole] = useState<RoleType>('solicitante')
  const [editDepartamento, setEditDepartamento] = useState('')
  const [editSenha, setEditSenha] = useState('')

  // Department members view
  const [selectedDepId, setSelectedDepId] = useState<string | null>(null)
  const [depMembros, setDepMembros] = useState<ChamadoUsuario[]>([])
  const [loadingMembros, setLoadingMembros] = useState(false)

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
      return
    }
    if (usuario && !podeGerenciarConfiguracoes(usuario)) {
      router.push('/chamados/meus')
    }
  }, [authLoading, usuario, router])

  // Load data
  useEffect(() => {
    if (!usuario) return
    async function load() {
      const snap = await getDocs(collection(db, 'chamados_usuarios'))
      setUsuarios(snap.docs.map(d => ({ ...d.data(), uid: d.id } as ChamadoUsuario)))
      setLoadingUsers(false)

      const deps = await listarDepartamentos()
      setDepartamentos(deps)
      setLoadingDeps(false)
    }
    load()
  }, [usuario])

  const reloadUsers = async () => {
    const snap = await getDocs(collection(db, 'chamados_usuarios'))
    setUsuarios(snap.docs.map(d => ({ ...d.data(), uid: d.id } as ChamadoUsuario)))
  }

  const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  const criarUsuario = async () => {
    if (!novoNome || !novoEmail || !novoSenha) {
      toast.error('Preencha nome, email e senha')
      return
    }
    setSaving(true)
    try {
      // Criar usuario via Admin SDK (API route) para nao trocar a sessao do admin
      const headers = await getAuthHeaders()
      const res = await fetch('/api/chamados/usuarios/criar', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: novoEmail, senha: novoSenha, nome: novoNome }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar usuario')

      const userData: Record<string, unknown> = {
        uid: data.uid,
        email: novoEmail,
        nome: novoNome,
        role: novoRole,
        unidades: Object.keys(UNIDADES),
        ativo: true,
        criadoEm: Timestamp.now(),
      }
      if (novoTelefone) userData.telefone = novoTelefone
      if (novoDepartamento) userData.departamentoId = novoDepartamento

      await setDoc(doc(db, 'chamados_usuarios', data.uid), userData)
      toast.success('Usuario criado')
      setNovoNome('')
      setNovoEmail('')
      setNovoSenha('')
      setNovoTelefone('')
      setNovoDepartamento('')
      await reloadUsers()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar usuario')
    } finally {
      setSaving(false)
    }
  }

  const toggleAtivo = async (uid: string, ativo: boolean) => {
    await updateDoc(doc(db, 'chamados_usuarios', uid), { ativo: !ativo })
    setUsuarios(prev => prev.map(u => u.uid === uid ? { ...u, ativo: !ativo } : u))
    toast.success(ativo ? 'Usuario desativado' : 'Usuario ativado')
  }

  const [confirmDeleteUid, setConfirmDeleteUid] = useState<string | null>(null)

  const excluirUsuario = async (uid: string) => {
    setSaving(true)
    try {
      // Excluir do Firebase Authentication via API route (Admin SDK)
      const headers = await getAuthHeaders()
      const res = await fetch('/api/chamados/usuarios/excluir', {
        method: 'POST',
        headers,
        body: JSON.stringify({ uid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir do Authentication')

      // Excluir do Firestore
      await deleteDoc(doc(db, 'chamados_usuarios', uid))
      setUsuarios(prev => prev.filter(u => u.uid !== uid))
      toast.success('Usuario excluido')
      setConfirmDeleteUid(null)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir usuario')
    } finally {
      setSaving(false)
    }
  }

  const iniciarEdicao = (u: ChamadoUsuario) => {
    setEditingUid(u.uid)
    setEditNome(u.nome)
    setEditTelefone(u.telefone || '')
    setEditRole(u.role)
    setEditDepartamento(u.departamentoId || '')
    setEditSenha('')
  }

  const cancelarEdicao = () => {
    setEditingUid(null)
    setEditSenha('')
  }

  const salvarEdicaoUsuario = async () => {
    if (!editingUid || !editNome.trim()) {
      toast.error('Nome e obrigatorio')
      return
    }
    setSaving(true)
    try {
      const updateData: { [key: string]: string } = {
        nome: editNome.trim(),
        role: editRole,
        telefone: editTelefone.trim() || '',
        departamentoId: editDepartamento || '',
      }
      await updateDoc(doc(db, 'chamados_usuarios', editingUid), updateData)

      // Alterar senha se preenchida
      if (editSenha.trim()) {
        if (editSenha.trim().length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres')
          setSaving(false)
          return
        }
        const headers = await getAuthHeaders()
        const res = await fetch('/api/chamados/usuarios/alterar-senha', {
          method: 'POST',
          headers,
          body: JSON.stringify({ uid: editingUid, novaSenha: editSenha.trim() }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha')
      }

      setUsuarios(prev => prev.map(u => u.uid === editingUid ? {
        ...u,
        nome: editNome.trim(),
        role: editRole,
        telefone: editTelefone.trim() || undefined,
        departamentoId: editDepartamento || undefined,
      } as ChamadoUsuario : u))
      toast.success(editSenha.trim() ? 'Usuario e senha atualizados' : 'Usuario atualizado')
      setEditingUid(null)
      setEditSenha('')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar usuario')
    } finally {
      setSaving(false)
    }
  }

  const salvarSLA = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'chamados_config', 'global'), { sla: slaConfig }, { merge: true })
      toast.success('SLA atualizado')
    } catch {
      toast.error('Erro ao salvar SLA')
    } finally {
      setSaving(false)
    }
  }

  // Department actions
  const handleCriarDepartamento = async () => {
    if (!depNome) {
      toast.error('Informe o nome do departamento')
      return
    }
    setSaving(true)
    try {
      await criarDepartamento({
        nome: depNome,
        descricao: depDescricao || undefined,
        cor: depCor,
        categorias: depCategorias,
        unidades: depUnidades,
        notificarWhatsApp: depWhatsApp,
      })
      toast.success('Departamento criado')
      setDepNome('')
      setDepDescricao('')
      setDepCategorias([])
      setDepWhatsApp(false)
      const deps = await listarDepartamentos()
      setDepartamentos(deps)
    } catch {
      toast.error('Erro ao criar departamento')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoverDepartamento = async (id: string) => {
    if (!confirm('Remover este departamento? Os membros serao desvinculados.')) return
    try {
      await removerDepartamento(id)
      setDepartamentos(prev => prev.filter(d => d.id !== id))
      if (selectedDepId === id) setSelectedDepId(null)
      toast.success('Departamento removido')
    } catch {
      toast.error('Erro ao remover')
    }
  }

  const handleSelectDep = async (depId: string) => {
    setSelectedDepId(depId)
    setLoadingMembros(true)
    const membros = await buscarMembrosDepartamento(depId)
    setDepMembros(membros)
    setLoadingMembros(false)
  }

  const handleAssociar = async (uid: string) => {
    if (!selectedDepId) return
    await associarUsuarioDepartamento(uid, selectedDepId)
    toast.success('Usuario associado')
    await reloadUsers()
    const membros = await buscarMembrosDepartamento(selectedDepId)
    setDepMembros(membros)
  }

  const handleDesvincular = async (uid: string) => {
    await desvincularUsuarioDepartamento(uid)
    toast.success('Usuario desvinculado')
    await reloadUsers()
    if (selectedDepId) {
      const membros = await buscarMembrosDepartamento(selectedDepId)
      setDepMembros(membros)
    }
  }

  const toggleDepWhatsApp = async (depId: string, current: boolean) => {
    await atualizarDepartamento(depId, { notificarWhatsApp: !current })
    setDepartamentos(prev => prev.map(d => d.id === depId ? { ...d, notificarWhatsApp: !current } : d))
    toast.success(!current ? 'WhatsApp ativado' : 'WhatsApp desativado')
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  const depNome_ = (depId: string | undefined) => departamentos.find(d => d.id === depId)?.nome || '—'

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="CONFIGURACOES"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'usuarios' as const, label: 'Usuarios', icon: Users },
            { key: 'departamentos' as const, label: 'Departamentos', icon: Building2 },
            { key: 'sla' as const, label: 'SLA', icon: Clock },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== USUARIOS TAB ==================== */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Novo Usuario</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Nome completo" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                <input value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="Email" type="email" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                <input value={novoSenha} onChange={e => setNovoSenha(e.target.value)} placeholder="Senha" type="password" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                <input value={novoTelefone} onChange={e => setNovoTelefone(e.target.value)} placeholder="Telefone (WhatsApp)" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                <select value={novoRole} onChange={e => setNovoRole(e.target.value as RoleType)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                  <option value="solicitante">Solicitante</option>
                  <option value="tecnico">Tecnico</option>
                  <option value="gestor">Gestor</option>
                  <option value="admin">Admin</option>
                </select>
                <select value={novoDepartamento} onChange={e => setNovoDepartamento(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                  <option value="">Sem departamento</option>
                  {departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>
              <button onClick={criarUsuario} disabled={saving} className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Criar Usuario
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Usuarios ({usuarios.length})</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {loadingUsers ? (
                  <LoadingState texto="Carregando usuarios..." />
                ) : (
                  usuarios.map(u => (
                    <div key={u.uid} className="px-5 py-3.5">
                      {editingUid === u.uid ? (
                        /* ---- EDIT MODE ---- */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editando usuario</p>
                            <button onClick={cancelarEdicao} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Nome</label>
                              <input value={editNome} onChange={e => setEditNome(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Email</label>
                              <input value={u.email} disabled className="w-full px-3 py-2 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Telefone</label>
                              <input value={editTelefone} onChange={e => setEditTelefone(e.target.value)} placeholder="(opcional)" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Cargo</label>
                              <select value={editRole} onChange={e => setEditRole(e.target.value as RoleType)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                                <option value="solicitante">Solicitante</option>
                                <option value="tecnico">Tecnico</option>
                                <option value="gestor">Gestor</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Departamento</label>
                              <select value={editDepartamento} onChange={e => setEditDepartamento(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                                <option value="">Sem departamento</option>
                                {departamentos.map(d => (
                                  <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Nova senha</label>
                              <input value={editSenha} onChange={e => setEditSenha(e.target.value)} type="password" placeholder="Deixe vazio para manter" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                              {editSenha && editSenha.length < 6 && (
                                <p className="text-[11px] text-amber-500 mt-1">Minimo 6 caracteres</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button onClick={salvarEdicaoUsuario} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              Salvar
                            </button>
                            <button onClick={cancelarEdicao} className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ---- VIEW MODE ---- */
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.nome}</p>
                            <p className="text-xs text-gray-500">
                              {u.email} | {u.role}
                              {u.departamentoId && <span className="ml-1 text-blue-600">| {depNome_(u.departamentoId)}</span>}
                              {u.telefone && <span className="ml-1 text-green-600">| {u.telefone}</span>}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => iniciarEdicao(u)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar usuario"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteUid(u.uid)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleAtivo(u.uid, u.ativo)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                u.ativo ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {u.ativo ? 'Ativo' : 'Inativo'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== DEPARTAMENTOS TAB ==================== */}
        {activeTab === 'departamentos' && (
          <div className="space-y-6">
            {/* Create Department */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Novo Departamento</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={depNome} onChange={e => setDepNome(e.target.value)} placeholder="Nome do departamento" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
                <input value={depDescricao} onChange={e => setDepDescricao(e.target.value)} placeholder="Descricao (opcional)" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300" />
              </div>

              {/* Color picker */}
              <div className="mt-4">
                <label className="text-xs text-gray-500 mb-2 block">Cor</label>
                <div className="flex gap-2">
                  {CORES_DEPARTAMENTO.map(cor => (
                    <button
                      key={cor}
                      onClick={() => setDepCor(cor)}
                      className={`w-8 h-8 rounded-full transition-all ${depCor === cor ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <label className="text-xs text-gray-500 mb-2 block">Categorias responsaveis</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(CATEGORIAS) as [CategoriaType, { label: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setDepCategorias(prev => prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key])}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        depCategorias.includes(key) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units */}
              <div className="mt-4">
                <label className="text-xs text-gray-500 mb-2 block">Unidades</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(UNIDADES) as [UnidadeType, { label: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setDepUnidades(prev => prev.includes(key) ? prev.filter(u => u !== key) : [...prev, key])}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        depUnidades.includes(key) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp toggle */}
              <label className="mt-4 flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={depWhatsApp} onChange={e => setDepWhatsApp(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                <span className="text-sm text-gray-700 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Notificar membros via WhatsApp
                </span>
              </label>

              <button onClick={handleCriarDepartamento} disabled={saving} className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Criar Departamento
              </button>
            </div>

            {/* Departments List */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Departamentos ({departamentos.length})
                </h3>
              </div>
              {loadingDeps ? (
                <LoadingState texto="Carregando..." />
              ) : departamentos.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-500">Nenhum departamento criado</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {departamentos.map(dep => (
                    <div key={dep.id} className="px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dep.cor }} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{dep.nome}</p>
                            <p className="text-xs text-gray-500">
                              {dep.categorias?.map(c => CATEGORIAS[c]?.label).join(', ') || 'Todas categorias'}
                              {' | '}
                              {dep.unidades?.map(u => UNIDADES[u]?.label).join(', ') || 'Todas unidades'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDepWhatsApp(dep.id, dep.notificarWhatsApp)}
                            className={`p-1.5 rounded-lg transition-colors ${dep.notificarWhatsApp ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                            title={dep.notificarWhatsApp ? 'WhatsApp ativo' : 'WhatsApp inativo'}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSelectDep(dep.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              selectedDepId === dep.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Membros
                          </button>
                          <button onClick={() => handleRemoverDepartamento(dep.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Members panel */}
                      {selectedDepId === dep.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Membros do departamento</p>
                          {loadingMembros ? (
                            <p className="text-xs text-gray-400">Carregando...</p>
                          ) : (
                            <>
                              {depMembros.length === 0 && <p className="text-xs text-gray-400 mb-3">Nenhum membro</p>}
                              <div className="space-y-2 mb-4">
                                {depMembros.map(m => (
                                  <div key={m.uid} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{m.nome}</p>
                                      <p className="text-xs text-gray-500">{m.email}{m.telefone ? ` | ${m.telefone}` : ''}</p>
                                    </div>
                                    <button onClick={() => handleDesvincular(m.uid)} className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                                      <UserMinus className="w-3 h-3" /> Remover
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Add member */}
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Adicionar membro</p>
                              <div className="space-y-1">
                                {usuarios
                                  .filter(u => u.ativo && u.departamentoId !== dep.id)
                                  .slice(0, 10)
                                  .map(u => (
                                    <div key={u.uid} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
                                      <p className="text-sm text-gray-700">{u.nome} <span className="text-xs text-gray-400">({u.email})</span></p>
                                      <button onClick={() => handleAssociar(u.uid)} className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                                        <UserPlus className="w-3 h-3" /> Adicionar
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== SLA TAB ==================== */}
        {activeTab === 'sla' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">Configuracao de SLA (em horas uteis)</h3>
            <div className="space-y-4">
              {(Object.entries(slaConfig) as [PrioridadeType, { resposta: number; resolucao: number }][]).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium text-gray-900 capitalize">{key}</span>
                  <div>
                    <label className="text-xs text-gray-500">Resposta (h)</label>
                    <input
                      type="number"
                      value={val.resposta}
                      onChange={e => setSlaConfig(prev => ({ ...prev, [key]: { ...prev[key as PrioridadeType], resposta: Number(e.target.value) } }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Resolucao (h)</label>
                    <input
                      type="number"
                      value={val.resolucao}
                      onChange={e => setSlaConfig(prev => ({ ...prev, [key]: { ...prev[key as PrioridadeType], resolucao: Number(e.target.value) } }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={salvarSLA} disabled={saving} className="mt-6 flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar SLA
            </button>
          </div>
        )}
      </div>

      {/* Modal Confirmar Exclusao de Usuario */}
      {confirmDeleteUid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Excluir Usuario</h3>
              </div>
              <p className="text-sm text-gray-600">
                Tem certeza que deseja excluir <strong>{usuarios.find(u => u.uid === confirmDeleteUid)?.nome}</strong>? Esta acao nao pode ser desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={() => setConfirmDeleteUid(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => excluirUsuario(confirmDeleteUid)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </ChamadosLayout>
  )
}
