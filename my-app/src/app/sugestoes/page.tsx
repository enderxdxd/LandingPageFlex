// src/app/sugestoes/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiLightBulb, HiCamera, HiCheck, HiExclamationCircle, HiChevronDown, HiX } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'

// CustomSelect Component (mesmo do anterior)
interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  label?: string
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  error,
  required = false,
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-flex-light mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-left text-flex-light focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-400' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-flex-light' : 'text-flex-light/50'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiChevronDown className="text-flex-light/70" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-lg shadow-2xl z-20 max-h-60 overflow-y-auto"
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left text-gray-800 hover:bg-yellow-500/10 transition-colors duration-150 ${
                      value === option.value ? 'bg-yellow-500/20 text-yellow-700 font-medium' : ''
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Tipagem
type SugData = {
  nome: string
  telefone: string
  email?: string
  sou: string
  qual_flex: string
  sugestao: string
}

// Mapas de valores para labels
const souLabels: Record<string, string> = {
  'aluno': 'Aluno(a) da Flex',
  'ex-aluno': 'Ex-aluno(a)',
  'visitante': 'Visitante',
  'funcionario': 'Funcionário(a)',
  'fornecedor': 'Fornecedor/Parceiro',
  'familiar': 'Familiar de aluno',
  'outro': 'Outro'
}

const flexLabels: Record<string, string> = {
  'marista': 'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville': 'Flex Fitness Alphaville',
  'palmas': 'Flex Fitness Palmas (Em breve)',
  'geral': 'Sugestão Geral'
}

export default function Sugestoes() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fotosSelecionadas, setFotosSelecionadas] = useState<File[]>([])
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SugData>()

  // Função para converter arquivos para base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Lidar com seleção de fotos
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validar quantidade máxima
    if (fotosSelecionadas.length + files.length > 5) {
      setSubmitError('Máximo 5 fotos permitidas')
      return
    }

    // Validar tamanho e tipo de cada arquivo
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setSubmitError(`Arquivo ${file.name} é muito grande. Máximo 5MB por foto.`)
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setSubmitError(`Arquivo ${file.name} não é uma imagem válida.`)
        return
      }
    }

    setFotosSelecionadas(prev => [...prev, ...files])
    setSubmitError(null)
  }

  // Remover foto
  const removerFoto = (index: number) => {
    setFotosSelecionadas(prev => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: SugData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validações obrigatórias
      if (!data.sou) {
        setSubmitError('Por favor, selecione quem você é')
        return
      }
      if (!data.qual_flex) {
        setSubmitError('Por favor, selecione para qual Flex é a sugestão')
        return
      }

      // Processar fotos se existirem
      let fotosBase64: string[] = []
      let nomesFotos: string[] = []

      if (fotosSelecionadas.length > 0) {
        try {
          fotosBase64 = await Promise.all(
            fotosSelecionadas.map(foto => convertFileToBase64(foto))
          )
          nomesFotos = fotosSelecionadas.map(foto => foto.name)
        } catch (error) {
          setSubmitError('Erro ao processar as fotos. Tente novamente.')
          return
        }
      }

      // Dados para envio
      const dadosEnvio = {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email, // Opcional
        sou: souLabels[data.sou] || data.sou,
        qual_flex: flexLabels[data.qual_flex] || data.qual_flex, // Nome completo para exibição
        codigo_flex: data.qual_flex, // Código para filtro de email
        sugestao: data.sugestao,
        fotos: fotosBase64,
        nomes_fotos: nomesFotos,
        quantidade_fotos: fotosBase64.length
      }

      // Enviar para API
      const response = await fetch('/api/send-sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar sugestão')
      }

      setIsSubmitted(true)
      setFotosSelecionadas([])
      reset()

    } catch (err) {
      console.error('Erro ao enviar:', err)
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao enviar sugestão. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-flex-dark to-flex-navy flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HiCheck className="text-white text-4xl" />
          </motion.div>
          <h2 className="text-2xl font-bold text-flex-dark mb-4">Sugestão Recebida!</h2>
          <p className="text-flex-gray mb-6">
            Obrigado por sua sugestão! Ela é muito importante para continuarmos melhorando.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium"
            >
              Enviar Outra Sugestão
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 text-flex-dark px-6 py-3 rounded-full font-medium"
            >
              Voltar ao Início
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flex-dark to-flex-navy pt-20">
      <div className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <HiLightBulb className="text-white text-3xl" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl gradient-text mb-4">
              CANAL DE SUGESTÕES
            </h1>
            <p className="text-flex-light/80 text-lg">
              Sua opinião é fundamental para continuarmos evoluindo
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Nome Completo *
              </label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              {errors.nome && (
                <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  Telefone *
                </label>
                <input
                  {...register('telefone', { required: 'Telefone é obrigatório' })}
                  placeholder="(62) 99999-9999"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.telefone && (
                  <p className="text-red-400 text-sm mt-1">{errors.telefone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  E-mail (Opcional)
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <CustomSelect
              label="Eu sou:"
              required
              options={[
                { value: 'aluno', label: 'Aluno(a) da Flex' },
                { value: 'ex-aluno', label: 'Ex-aluno(a)' },
                { value: 'visitante', label: 'Visitante' },
                { value: 'funcionario', label: 'Funcionário(a)' },
                { value: 'fornecedor', label: 'Fornecedor/Parceiro' },
                { value: 'familiar', label: 'Familiar de aluno' },
                { value: 'outro', label: 'Outro' }
              ]}
              value={watch('sou') || ''}
              onChange={(value) => setValue('sou', value)}
              error={errors.sou?.message}
              placeholder="Selecione uma opção"
            />

            <CustomSelect
              label="Qual Flex?"
              required
              options={[
                { value: 'marista', label: 'Flex Fitness Marista' },
                { value: 'buena-vista', label: 'Flex Fitness Buena Vista' },
                { value: 'alphaville', label: 'Flex Fitness Alphaville' },
                { value: 'palmas', label: 'Flex Fitness Palmas (Em breve)' },
                { value: 'geral', label: 'Sugestão Geral' }
              ]}
              value={watch('qual_flex') || ''}
              onChange={(value) => setValue('qual_flex', value)}
              error={errors.qual_flex?.message}
              placeholder="Selecione a unidade"
            />

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Sua Sugestão *
              </label>
              <textarea
                {...register('sugestao', { 
                  required: 'Por favor, compartilhe sua sugestão',
                  minLength: {
                    value: 10,
                    message: 'Por favor, detalhe um pouco mais sua sugestão'
                  }
                })}
                rows={6}
                placeholder="Compartilhe sua ideia, sugestão ou feedback. Seja específico(a) para que possamos entender melhor..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
              {errors.sugestao && (
                <p className="text-red-400 text-sm mt-1">{errors.sugestao.message}</p>
              )}
            </div>

            {/* Sistema de Upload de Fotos Melhorado */}
            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Anexar Fotos (Opcional)
              </label>
              
              {/* Área de Upload */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="fotos"
                  onChange={handleFotoChange}
                />
                <label
                  htmlFor="fotos"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-yellow-500/50 transition-colors"
                >
                  <div className="text-center">
                    <HiCamera className="mx-auto text-3xl text-flex-light/50 mb-2" />
                    <p className="text-flex-light/70 text-sm">
                      {fotosSelecionadas.length === 0 
                        ? 'Clique para anexar fotos' 
                        : 'Clique para adicionar mais fotos'
                      }
                    </p>
                    <p className="text-flex-light/50 text-xs mt-1">
                      JPG, PNG até 5MB cada (máx. {5 - fotosSelecionadas.length} fotos restantes)
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview das Fotos Selecionadas */}
              {fotosSelecionadas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-2"
                >
                  <p className="text-flex-light/70 text-sm font-medium">
                    Fotos selecionadas ({fotosSelecionadas.length}/5):
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {fotosSelecionadas.map((foto, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <HiCamera className="text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-flex-light text-sm font-medium truncate max-w-[200px]">
                              {foto.name}
                            </p>
                            <p className="text-flex-light/50 text-xs">
                              {(foto.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerFoto(index)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              >
                <HiExclamationCircle />
                {submitError}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando Sugestão...
                </div>
              ) : (
                'Enviar Sugestão'
              )}
            </motion.button>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HiLightBulb className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-500 font-medium text-sm mb-1">💡 Dica</h4>
                  <p className="text-flex-light/70 text-sm">
                    Seja específico em sua sugestão. Quanto mais detalhes, melhor poderemos analisá-la!
                  </p>
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}