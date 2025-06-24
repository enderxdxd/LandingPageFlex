// src/app/trabalhe-aqui/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiBriefcase, HiDocumentText, HiCheck, HiExclamationCircle, HiChevronDown, HiX } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'

// CustomSelect Component
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
          className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-left text-flex-light focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
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
                    className={`w-full px-4 py-3 text-left text-gray-800 hover:bg-purple-500/10 transition-colors duration-150 ${
                      value === option.value ? 'bg-purple-500/20 text-purple-700 font-medium' : ''
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
type CVData = {
  nome: string
  email: string
  telefone: string
  departamento: string
  unidade: string
  cargo?: string
  experiencia?: string
}

// Mapas de valores para labels
const departmentLabels: Record<string, string> = {
  'estagio-educacao-fisica': 'Estágio Educação Física',
  'financeiro':              'Financeiro',
  'limpeza':                 'Limpeza',
  'manutencao':              'Manutenção',
  'marketing':               'Marketing',
  'natacao':                 'Natação- Apenas Unid Palmas',
  'professor-ginastica':     'Professor Ginástica',
  'professor-musculacao':    'Professor Musculação',
  'recepcao':                'Recepção',
  'vendas':                  'Vendas'
}

const unitLabels: Record<string, string> = {
  'marista':     'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville':  'Flex Fitness Alphaville',
  'palmas':      'Flex Fitness Palmas (Em breve)',
  'qualquer':    'Qualquer Unidade'
}

export default function TrabalheAqui() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CVData>()

  // Função para converter arquivo para base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Lidar com seleção de arquivo
  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    // Validar tipo
    const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!tiposPermitidos.includes(file.type)) {
      setSubmitError('Tipo de arquivo não permitido. Use PDF, DOC ou DOCX.')
      return
    }

    setArquivoSelecionado(file)
    setSubmitError(null)
  }

  async function onSubmit(data: CVData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validações obrigatórias
      if (!data.departamento) {
        setSubmitError('Por favor, selecione o departamento')
        return
      }
      if (!data.unidade) {
        setSubmitError('Por favor, selecione a unidade')
        return
      }
      if (!arquivoSelecionado) {
        setSubmitError('Por favor, anexe seu currículo')
        return
      }

      // Processar arquivo
      let curriculoBase64 = ''
      try {
        curriculoBase64 = await convertFileToBase64(arquivoSelecionado)
      } catch (error) {
        setSubmitError('Erro ao processar o arquivo. Tente novamente.')
        return
      }

      // Dados para envio
      const dadosEnvio = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        departamento: departmentLabels[data.departamento] || data.departamento,
        codigo_departamento: data.departamento,
        unidade: unitLabels[data.unidade] || data.unidade,
        cargo: data.cargo || 'Não especificado',
        experiencia: data.experiencia || 'Não informado',
        curriculo: curriculoBase64,
        nome_arquivo: arquivoSelecionado.name
      }

      // Enviar para API
      const response = await fetch('/api/send-curriculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar currículo')
      }

      setIsSubmitted(true)
      setArquivoSelecionado(null)
      reset()

    } catch (err) {
      console.error('Erro ao enviar:', err)
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao enviar currículo. Tente novamente.'
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
          <h2 className="text-2xl font-bold text-flex-dark mb-4">Currículo Recebido!</h2>
          <p className="text-flex-gray mb-6">
            Obrigado pelo interesse! Analisaremos seu perfil e entraremos em contato se houver oportunidades.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium"
            >
              Enviar Outro Currículo
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
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <HiBriefcase className="text-white text-3xl" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl gradient-text mb-4">
              TRABALHE AQUI
            </h1>
            <p className="text-flex-light/80 text-lg mb-6">
              Faça parte da equipe que transforma vidas através do fitness
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-6 backdrop-blur-lg border border-white/10 mb-8"
            >
              <h3 className="font-semibold text-flex-light mb-3">Por que trabalhar na Flex?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-flex-light/80">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">💪</span>
                  <span>Ambiente dinâmico e motivador</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">🚀</span>
                  <span>Crescimento profissional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🤝</span>
                  <span>Equipe colaborativa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">🎯</span>
                  <span>Missão inspiradora</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  Nome Completo *
                </label>
                <input
                  {...register('nome', { required: 'Nome é obrigatório' })}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.nome && (
                  <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'E-mail é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'E-mail inválido'
                    }
                  })}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                {...register('telefone', { required: 'Telefone é obrigatório' })}
                placeholder="(62) 99999-9999"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.telefone && (
                <p className="text-red-400 text-sm mt-1">{errors.telefone.message}</p>
              )}
            </div>

            <CustomSelect
              label="Departamento"
              required
              options={[
                { value: 'estagio-educacao-fisica', label: 'Estágio Educação Física' },
                { value: 'financeiro', label: 'Financeiro' },
                { value: 'limpeza', label: 'Limpeza' },
                { value: 'manutencao', label: 'Manutenção' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'natacao', label: 'Natação- Apenas Unid Palmas' },
                { value: 'professor-ginastica', label: 'Professor Ginástica' },
                { value: 'professor-musculacao', label: 'Professor Musculação' },
                { value: 'recepcao', label: 'Recepção' },
                { value: 'vendas', label: 'Vendas' }
              ]}
              value={watch('departamento') || ''}
              onChange={(value) => setValue('departamento', value)}
              error={errors.departamento?.message}
              placeholder="Selecione o departamento"
            />

            <CustomSelect
              label="Unidade de Interesse"
              required
              options={[
                { value: 'marista', label: 'Flex Fitness Marista' },
                { value: 'buena-vista', label: 'Flex Fitness Buena Vista' },
                { value: 'alphaville', label: 'Flex Fitness Alphaville' },
                { value: 'palmas', label: 'Flex Fitness Palmas (Em breve)' },
                { value: 'qualquer', label: 'Qualquer Unidade' }
              ]}
              value={watch('unidade') || ''}
              onChange={(value) => setValue('unidade', value)}
              error={errors.unidade?.message}
              placeholder="Selecione a unidade"
            />

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Cargo/Posição Pretendida
              </label>
              <input
                {...register('cargo')}
                placeholder="Ex: Personal Trainer, Consultor de Vendas, etc."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Conte sobre sua experiência
              </label>
              <textarea
                {...register('experiencia')}
                rows={4}
                placeholder="Descreva brevemente sua experiência na área, principais qualificações, certificações, etc."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Anexar Currículo *
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="arquivo"
                  onChange={handleArquivoChange}
                />
                <label
                  htmlFor="arquivo"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <div className="text-center">
                    <HiDocumentText className="mx-auto text-4xl text-flex-light/50 mb-3" />
                    {arquivoSelecionado ? (
                      <div>
                        <p className="text-flex-light text-base font-medium mb-1">
                          {arquivoSelecionado.name}
                        </p>
                        <p className="text-flex-light/50 text-sm">
                          {(arquivoSelecionado.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setArquivoSelecionado(null)
                            const input = document.getElementById('arquivo') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="text-red-400 text-sm mt-2 hover:text-red-300"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-flex-light/70 text-base font-medium mb-1">
                          Clique para anexar seu currículo
                        </p>
                        <p className="text-flex-light/50 text-sm">
                          PDF, DOC ou DOCX até 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
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
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando Currículo...
                </div>
              ) : (
                'Enviar Currículo'
              )}
            </motion.button>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HiBriefcase className="text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-purple-400 font-medium text-sm mb-1">💼 Processo Seletivo</h4>
                  <p className="text-flex-light/70 text-sm">
                    Após análise do currículo, candidatos selecionados serão contatados para entrevista.
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