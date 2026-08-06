'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  MapPin, Upload, X, FileText, Check, Loader2,
  Image as ImageIcon, Info, Camera, Send, UserCircle,
} from 'lucide-react'
import { NovoChamadoFormData, ChamadoUsuario, UnidadeType, PrioridadeType } from '@/lib/chamados/types'
import { UNIDADES, PRIORIDADE_CONFIG, SLA_PADRAO } from '@/lib/chamados/constants'
import { criarChamado, listarUsuariosAtribuiveis } from '@/lib/chamados/services/chamadoService'
import Tooltip from '@/components/chamados/shared/Tooltip'

interface NovoChamadoFormProps {
  usuario: ChamadoUsuario
}

export default function NovoChamadoForm({ usuario }: NovoChamadoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [usuariosAtribuiveis, setUsuariosAtribuiveis] = useState<{ uid: string; nome: string; email: string; role: string }[]>([])
  const [formData, setFormData] = useState<NovoChamadoFormData>({
    unidade: '',
    descricao: '',
    local: '',
    prioridade: 'media',
    anexos: [],
  })

  useEffect(() => {
    listarUsuariosAtribuiveis()
      .then(setUsuariosAtribuiveis)
      .catch(() => {})
  }, [])

  const update = (field: keyof NovoChamadoFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const onDrop = useCallback((files: File[]) => {
    const novos = [...formData.anexos, ...files].slice(0, 5)
    update('anexos', novos)
  }, [formData.anexos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  const removeAnexo = (index: number) => {
    update('anexos', formData.anexos.filter((_, i) => i !== index))
  }

  const canSubmit = formData.unidade && formData.descricao.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    try {
      const id = await criarChamado(formData, usuario)
      toast.success('Chamado aberto com sucesso!')
      router.push(`/chamados/meus/${id}`)
    } catch (err) {
      toast.error('Erro ao abrir chamado. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Form Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Abrir novo chamado</h2>
            <p className="text-sm text-gray-500">Descreva o problema e nossa equipe vai resolver</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unidade */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
            <MapPin className="w-4 h-4 text-blue-600" />
            Onde esta o problema?
            <Tooltip text="Selecione a unidade da academia onde o problema foi identificado. Isso ajuda a direcionar para a equipe correta." />
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.entries(UNIDADES) as [UnidadeType, { label: string; endereco: string }][]).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => update('unidade', key)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                  formData.unidade === key
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-150 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  formData.unidade === key ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  <span className={`text-xs font-bold ${
                    formData.unidade === key ? 'text-white' : 'text-gray-500'
                  }`}>
                    {val.label.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    formData.unidade === key ? 'text-blue-900' : 'text-gray-900'
                  }`}>{val.label}</p>
                  <p className="text-xs text-gray-400">{val.endereco}</p>
                </div>
                {formData.unidade === key && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Descricao */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label htmlFor="descricao" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            Descreva o problema
            <Tooltip text="Inclua o que aconteceu, quando comecou e o que ja foi tentado. Quanto mais detalhes, mais rapido a equipe resolve." />
          </label>
          <p className="text-xs text-gray-400 mb-3 ml-6">
            Quanto mais detalhes, mais rapido conseguimos resolver
          </p>
          <textarea
            id="descricao"
            rows={4}
            value={formData.descricao}
            onChange={(e) => update('descricao', e.target.value)}
            placeholder="Ex: O ar-condicionado da sala de musculação não está ligando desde ontem de manhã. Já tentamos ligar pelo controle remoto mas não responde..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
          />
        </div>

        {/* Local + Prioridade - lado a lado em desktop */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Local */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label htmlFor="local" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              Local
              <span className="text-xs text-gray-400 font-normal">opcional</span>
              <Tooltip text="Informe a area especifica: sala, andar, vestiario, piscina, etc. Facilita a localizacao pela equipe tecnica." />
            </label>
            <input
              id="local"
              type="text"
              value={formData.local}
              onChange={(e) => update('local', e.target.value)}
              placeholder="Sala, andar, area..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Urgencia */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <Info className="w-4 h-4 text-gray-400" />
              Urgencia
              <Tooltip text="Baixa: problema menor sem impacto. Media: afeta o funcionamento mas ha alternativa. Alta: impacto significativo. Critica: risco a seguranca ou parada total." />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(PRIORIDADE_CONFIG) as [PrioridadeType, typeof PRIORIDADE_CONFIG[PrioridadeType]][]).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update('prioridade', key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                    formData.prioridade === key
                      ? `${val.borderColor} ${val.bgColor}`
                      : 'border-gray-150 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${val.dotColor}`} />
                  <span className={`text-xs font-medium ${
                    formData.prioridade === key ? val.color : 'text-gray-600'
                  }`}>{val.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Direcionar para */}
        {usuariosAtribuiveis.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
              <UserCircle className="w-4 h-4 text-gray-400" />
              Direcionar para
              <span className="text-xs text-gray-400 font-normal">opcional</span>
              <Tooltip text="Escolha um responsável para receber este chamado. Se não selecionar, o chamado ficará disponível para toda a equipe." />
            </label>
            <p className="text-xs text-gray-400 mb-3 ml-6">
              Selecione quem deve receber e resolver este chamado
            </p>
            <select
              value={formData.direcionadoPara?.uid || ''}
              onChange={(e) => {
                const uid = e.target.value
                if (!uid) {
                  update('direcionadoPara', undefined)
                } else {
                  const u = usuariosAtribuiveis.find(u => u.uid === uid)
                  if (u) update('direcionadoPara', { uid: u.uid, nome: u.nome, email: u.email })
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Ninguem (equipe geral)</option>
              {usuariosAtribuiveis
                .map(u => (
                  <option key={u.uid} value={u.uid}>
                    {u.nome} ({u.role === 'admin' ? 'Administrador' : u.role === 'gestor' ? 'Gestor' : 'Técnico'})
                  </option>
                ))}
            </select>
            {formData.direcionadoPara && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200/60">
                <UserCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700">
                  O chamado será direcionado para <strong>{formData.direcionadoPara.nome}</strong> e esta pessoa será notificada por email.
                </p>
                <button
                  type="button"
                  onClick={() => update('direcionadoPara', undefined)}
                  className="ml-auto p-0.5 rounded hover:bg-blue-100 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Anexos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
            <Camera className="w-4 h-4 text-gray-400" />
            Fotos do problema
            <span className="text-xs text-gray-400 font-normal">opcional</span>
          </label>
          <p className="text-xs text-gray-400 mb-3 ml-6">Fotos ajudam a equipe a entender e resolver mais rapido</p>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-5 h-5 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Solte aqui' : 'Clique ou arraste arquivos'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Imagens e PDFs, ate 10MB cada</p>
              </div>
            </div>
          </div>

          {formData.anexos.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {formData.anexos.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
                  <button
                    type="button"
                    onClick={() => removeAnexo(i)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-right">{formData.anexos.length}/5 arquivos</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Abrindo...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Abrir Chamado
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
