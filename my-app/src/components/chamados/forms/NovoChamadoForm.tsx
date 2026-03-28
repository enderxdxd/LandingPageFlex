'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  MapPin, Monitor, Wrench, Sparkles, Briefcase,
  ArrowLeft, ArrowRight, Upload, X, FileText,
  AlertCircle, Check, Loader2, Image as ImageIcon,
} from 'lucide-react'
import { NovoChamadoFormData, ChamadoUsuario, CategoriaType, UnidadeType, PrioridadeType } from '@/lib/chamados/types'
import { UNIDADES, CATEGORIAS, SUBCATEGORIAS, PRIORIDADE_CONFIG, SLA_PADRAO } from '@/lib/chamados/constants'
import { criarChamado } from '@/lib/chamados/services/chamadoService'

interface NovoChamadoFormProps {
  usuario: ChamadoUsuario
}

const CATEGORIA_ICONS: Record<string, React.ElementType> = {
  ti: Monitor,
  manutencao: Wrench,
  limpeza: Sparkles,
  administrativo: Briefcase,
}

const STEPS = ['Unidade e Categoria', 'Detalhes', 'Descrição', 'Revisão']

export default function NovoChamadoForm({ usuario }: NovoChamadoFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<NovoChamadoFormData>({
    unidade: '',
    categoria: '',
    subcategoria: '',
    titulo: '',
    descricao: '',
    local: '',
    prioridade: 'media',
    anexos: [],
  })

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

  const canNext = () => {
    switch (step) {
      case 0: return formData.unidade && formData.categoria
      case 1: return formData.subcategoria && formData.titulo && formData.local
      case 2: return formData.descricao.length >= 20
      default: return true
    }
  }

  const handleSubmit = async () => {
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
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all shrink-0 ${
                  i < step
                    ? 'bg-blue-600 text-white'
                    : i === step
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full mx-2 hidden sm:block ${i < step ? 'bg-blue-600' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Unidade e Categoria */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Selecione a Unidade</h2>
              <p className="text-sm text-gray-500 mb-6">Escolha a unidade onde o problema ocorre</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {(Object.entries(UNIDADES) as [UnidadeType, { label: string; endereco: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => update('unidade', key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.unidade === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className={`w-5 h-5 mb-2 ${formData.unidade === key ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="text-sm font-semibold text-gray-900">{val.label}</p>
                    <p className="text-xs text-gray-500">{val.endereco}</p>
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-1">Selecione a Categoria</h2>
              <p className="text-sm text-gray-500 mb-6">Qual área deve atender este chamado?</p>

              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(CATEGORIAS) as [CategoriaType, { label: string }][]).map(([key, val]) => {
                  const Icon = CATEGORIA_ICONS[key] || Briefcase
                  return (
                    <button
                      key={key}
                      onClick={() => { update('categoria', key); update('subcategoria', '') }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.categoria === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${formData.categoria === key ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="text-sm font-semibold text-gray-900">{val.label}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Detalhes */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Detalhes do Chamado</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subcategoria *</label>
                  <select
                    value={formData.subcategoria}
                    onChange={(e) => update('subcategoria', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecione...</option>
                    {formData.categoria && SUBCATEGORIAS[formData.categoria as CategoriaType]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Título *</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.titulo}
                    onChange={(e) => update('titulo', e.target.value)}
                    placeholder="Resuma o problema em uma frase"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.titulo.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Local Específico *</label>
                  <input
                    type="text"
                    value={formData.local}
                    onChange={(e) => update('local', e.target.value)}
                    placeholder="Ex: Sala de musculação, andar 2"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Prioridade *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(PRIORIDADE_CONFIG) as [PrioridadeType, typeof PRIORIDADE_CONFIG[PrioridadeType]][]).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => update('prioridade', key)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          formData.prioridade === key
                            ? `${val.borderColor} ${val.bgColor}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${val.dotColor}`} />
                          <span className="text-sm font-medium text-gray-900">{val.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Resolução em até {SLA_PADRAO[key as PrioridadeType].resolucao}h úteis
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Descrição e Anexos */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Descrição Detalhada</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição *</label>
                  <textarea
                    rows={6}
                    value={formData.descricao}
                    onChange={(e) => update('descricao', e.target.value)}
                    placeholder="Descreva o problema com o máximo de detalhes possível. Quando começou? O que estava fazendo?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                  <p className={`text-xs mt-1 ${formData.descricao.length < 20 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.descricao.length}/20 caracteres mínimos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Anexos (opcional - até 5 arquivos, max 10MB cada)
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Imagens e PDFs</p>
                  </div>

                  {formData.anexos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.anexos.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)}KB</span>
                          <button onClick={() => removeAnexo(i)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Revisão */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Revisão do Chamado</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Unidade</span>
                    <span className="text-sm font-medium text-gray-900">{UNIDADES[formData.unidade as UnidadeType]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Categoria</span>
                    <span className="text-sm font-medium text-gray-900">{CATEGORIAS[formData.categoria as CategoriaType]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subcategoria</span>
                    <span className="text-sm font-medium text-gray-900">{formData.subcategoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Local</span>
                    <span className="text-sm font-medium text-gray-900">{formData.local}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Prioridade</span>
                    <span className={`text-sm font-medium ${PRIORIDADE_CONFIG[formData.prioridade]?.color}`}>
                      {PRIORIDADE_CONFIG[formData.prioridade]?.label}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Título</p>
                  <p className="text-sm font-medium text-gray-900">{formData.titulo}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Descrição</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.descricao}</p>
                </div>

                {formData.anexos.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-2">{formData.anexos.length} anexo(s)</p>
                    {formData.anexos.map((file, i) => (
                      <p key={i} className="text-sm text-gray-700">{file.name}</p>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">SLA Estimado</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Resposta em até {SLA_PADRAO[formData.prioridade].resposta}h úteis |
                      Resolução em até {SLA_PADRAO[formData.prioridade].resolucao}h úteis
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => step === 0 ? router.back() : setStep(step - 1)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? 'Cancelar' : 'Voltar'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Abrindo...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Abrir Chamado
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
