'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { XCircle, CheckCircle, Clock, Play, Pause, Loader2, Tag, Zap, X, ArrowRightLeft, UserCircle } from 'lucide-react'
import { Chamado, ChamadoUsuario, StatusType, CategoriaType } from '@/lib/chamados/types'
import { atualizarStatus, categorizarChamado, redirecionarChamado, listarUsuariosAtribuiveis } from '@/lib/chamados/services/chamadoService'
import { podeCancelarChamado, podeAlterarStatus, podeRedirecionarChamado, podeFecharChamado, podeRecategorizarChamado } from '@/lib/chamados/utils/permissions'
import { CATEGORIAS, SUBCATEGORIAS } from '@/lib/chamados/constants'
import ConfirmModal from '@/components/chamados/shared/ConfirmModal'

interface ChamadoAcoesProps {
  chamado: Chamado
  usuario: ChamadoUsuario
}

export default function ChamadoAcoes({ chamado, usuario }: ChamadoAcoesProps) {
  const [loading, setLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showCategorizar, setShowCategorizar] = useState(false)
  const [showRedirecionar, setShowRedirecionar] = useState(false)
  const [usuariosAtribuiveis, setUsuariosAtribuiveis] = useState<{ uid: string; nome: string; email: string; role: string }[]>([])
  const [redirecionarUid, setRedirecionarUid] = useState('')
  const [catForm, setCatForm] = useState<{ categoria: CategoriaType | ''; subcategoria: string }>({
    categoria: chamado.categoria || '',
    subcategoria: chamado.subcategoria || '',
  })

  const canCancel = podeCancelarChamado(usuario, chamado)
  const canChangeStatus = podeAlterarStatus(usuario, chamado)
  const canCategorize = podeRecategorizarChamado(usuario, chamado)
  const canRedirect = podeRedirecionarChamado(usuario, chamado)
  const canClose = podeFecharChamado(usuario, chamado)

  useEffect(() => {
    if (canRedirect) {
      listarUsuariosAtribuiveis()
        .then(setUsuariosAtribuiveis)
        .catch(() => {})
    }
  }, [canRedirect])

  const alterarStatus = async (novoStatus: StatusType) => {
    setLoading(true)
    try {
      await atualizarStatus(chamado.id, novoStatus, usuario)
      toast.success(`Status alterado para "${novoStatus}"`)
    } catch (err) {
      toast.error('Erro ao alterar status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    await alterarStatus('cancelado')
    setShowCancel(false)
  }

  const handleCategorizar = async () => {
    if (!catForm.categoria || !catForm.subcategoria) {
      toast.error('Selecione categoria e subcategoria')
      return
    }
    setLoading(true)
    try {
      await categorizarChamado(chamado.id, catForm.categoria as CategoriaType, catForm.subcategoria, usuario)
      toast.success('Chamado categorizado')
      setShowCategorizar(false)
    } catch (err) {
      toast.error('Erro ao categorizar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRedirecionar = async () => {
    if (!redirecionarUid) {
      toast.error('Selecione um usuario')
      return
    }
    const novoResp = usuariosAtribuiveis.find(u => u.uid === redirecionarUid)
    if (!novoResp) return

    setLoading(true)
    try {
      await redirecionarChamado(chamado.id, { uid: novoResp.uid, nome: novoResp.nome, email: novoResp.email }, usuario)
      toast.success(`Chamado redirecionado para ${novoResp.nome}`)
      setShowRedirecionar(false)
      setRedirecionarUid('')
    } catch (err) {
      toast.error('Erro ao redirecionar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!canChangeStatus && !canCancel && !canCategorize && !canRedirect && !canClose) return null

  const isFinal = ['fechado', 'cancelado'].includes(chamado.status)
  if (isFinal && !canCategorize) return null

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-gray-400" />
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ações</p>
          </div>

          <div className="space-y-2.5">
            {/* Categorizar */}
            {canCategorize && !isFinal && (
              <button
                onClick={() => setShowCategorizar(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50/80 border border-amber-200/80 rounded-xl hover:bg-amber-100 hover:border-amber-300 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Tag className="w-4 h-4 text-amber-600" />
                </div>
                <span>{chamado.categoria ? 'Alterar Categoria' : 'Categorizar Chamado'}</span>
              </button>
            )}

            {canChangeStatus && !isFinal && (
              <>
                {chamado.status === 'aberto' && (
                  <ActionButton
                    onClick={() => alterarStatus('em_andamento')}
                    loading={loading}
                    icon={Play}
                    label="Iniciar Atendimento"
                    color="blue"
                  />
                )}

                {chamado.status === 'em_andamento' && (
                  <>
                    <ActionButton
                      onClick={() => alterarStatus('aguardando')}
                      loading={loading}
                      icon={Pause}
                      label="Aguardando Informação"
                      color="violet"
                    />
                    <ActionButton
                      onClick={() => alterarStatus('resolvido')}
                      loading={loading}
                      icon={CheckCircle}
                      label="Marcar como Resolvido"
                      color="green"
                    />
                  </>
                )}

                {chamado.status === 'aguardando' && (
                  <ActionButton
                    onClick={() => alterarStatus('em_andamento')}
                    loading={loading}
                    icon={Play}
                    label="Retomar Atendimento"
                    color="blue"
                  />
                )}

              </>
            )}

            {/* Fechar - só quem abriu o chamado (ou admin) */}
            {canClose && (
              <ActionButton
                onClick={() => alterarStatus('fechado')}
                loading={loading}
                icon={Clock}
                label="Fechar Chamado"
                color="gray"
              />
            )}

            {/* Redirecionar */}
            {canRedirect && !isFinal && (
              <button
                onClick={() => setShowRedirecionar(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-700 bg-indigo-50/80 border border-indigo-200/80 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-left">
                  <span>Redirecionar Chamado</span>
                  {chamado.atribuidoPara && (
                    <p className="text-[11px] text-indigo-500 font-normal">Atual: {chamado.atribuidoPara.nome}</p>
                  )}
                </div>
              </button>
            )}

            {canCancel && chamado.status === 'aberto' && (
              <button
                onClick={() => setShowCancel(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all group mt-1"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <span>Cancelar Chamado</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Categorizar */}
      {showCategorizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Tag className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{chamado.categoria ? 'Alterar Categoria' : 'Categorizar Chamado'}</h3>
              </div>
              <button
                onClick={() => setShowCategorizar(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={catForm.categoria}
                  onChange={(e) => setCatForm({ categoria: e.target.value as CategoriaType, subcategoria: '' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                >
                  <option value="">Selecione a categoria...</option>
                  {(Object.entries(CATEGORIAS) as [CategoriaType, { label: string }][]).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              {catForm.categoria && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategoria</label>
                  <select
                    value={catForm.subcategoria}
                    onChange={(e) => setCatForm(prev => ({ ...prev, subcategoria: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                  >
                    <option value="">Selecione a subcategoria...</option>
                    {SUBCATEGORIAS[catForm.categoria as CategoriaType]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reference description */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Descrição do solicitante</p>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{chamado.descricao}</p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={() => setShowCategorizar(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCategorizar}
                disabled={!catForm.categoria || !catForm.subcategoria || loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                Categorizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Redirecionar */}
      {showRedirecionar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <ArrowRightLeft className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Redirecionar Chamado</h3>
              </div>
              <button
                onClick={() => { setShowRedirecionar(false); setRedirecionarUid('') }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {chamado.atribuidoPara && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <UserCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">
                    Responsavel atual: <strong className="text-gray-900">{chamado.atribuidoPara.nome}</strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Novo responsavel</label>
                <select
                  value={redirecionarUid}
                  onChange={(e) => setRedirecionarUid(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                >
                  <option value="">Selecione um usuario...</option>
                  {usuariosAtribuiveis
                    .filter(u => u.uid !== chamado.atribuidoPara?.uid && u.uid !== usuario.uid)
                    .map(u => (
                      <option key={u.uid} value={u.uid}>
                        {u.nome} ({u.role === 'admin' ? 'Administrador' : u.role === 'gestor' ? 'Gestor' : 'Técnico'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-amber-700">
                  O novo responsável será notificado por email e terá acesso ao chamado.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={() => { setShowRedirecionar(false); setRedirecionarUid('') }}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedirecionar}
                disabled={!redirecionarUid || loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                Redirecionar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        titulo="Cancelar Chamado"
        descricao="Tem certeza que deseja cancelar este chamado? Esta ação não pode ser desfeita."
        confirmLabel="Cancelar Chamado"
        variant="danger"
        loading={loading}
      />
    </>
  )
}

/* Action button helper */
function ActionButton({ onClick, loading, icon: Icon, label, color }: {
  onClick: () => void
  loading: boolean
  icon: React.ElementType
  label: string
  color: 'blue' | 'green' | 'violet' | 'gray'
}) {
  const colors = {
    blue: {
      text: 'text-blue-700',
      bg: 'bg-blue-50/80',
      border: 'border-blue-200/80',
      hover: 'hover:bg-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-100 group-hover:bg-blue-200',
      iconColor: 'text-blue-600',
    },
    green: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200/80',
      hover: 'hover:bg-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-100 group-hover:bg-emerald-200',
      iconColor: 'text-emerald-600',
    },
    violet: {
      text: 'text-violet-700',
      bg: 'bg-violet-50/80',
      border: 'border-violet-200/80',
      hover: 'hover:bg-violet-100 hover:border-violet-300',
      iconBg: 'bg-violet-100 group-hover:bg-violet-200',
      iconColor: 'text-violet-600',
    },
    gray: {
      text: 'text-gray-700',
      bg: 'bg-gray-50/80',
      border: 'border-gray-200/80',
      hover: 'hover:bg-gray-100 hover:border-gray-300',
      iconBg: 'bg-gray-100 group-hover:bg-gray-200',
      iconColor: 'text-gray-600',
    },
  }

  const c = colors[color]

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${c.text} ${c.bg} border ${c.border} rounded-xl ${c.hover} transition-all disabled:opacity-50 group`}
    >
      <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center transition-colors`}>
        {loading ? <Loader2 className={`w-4 h-4 ${c.iconColor} animate-spin`} /> : <Icon className={`w-4 h-4 ${c.iconColor}`} />}
      </div>
      <span>{label}</span>
    </button>
  )
}
