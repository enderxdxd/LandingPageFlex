// src/app/freepass/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiGift, HiCheck, HiExclamationCircle, HiChevronDown } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'

// CustomSelect Component (reutilizado da página de sugestões)
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
          {label} {required && <span className="text-red-400">*</span>}
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
type FreepassData = {
  qual_unidade: string
  nome: string
  email: string
  celular: string
  aceito_termos: boolean
}

// Mapas de valores para labels
const unidadeLabels: Record<string, string> = {
  'marista': 'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville': 'Flex Fitness Alphaville',
  'palmas': 'Flex Fitness Palmas (Em breve)'
}

export default function Freepass() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FreepassData>()

  async function onSubmit(data: FreepassData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validações obrigatórias
      if (!data.qual_unidade) {
        setSubmitError('Por favor, selecione uma unidade')
        return
      }
      
      if (!data.aceito_termos) {
        setSubmitError('Você deve aceitar os Termos de Política e Privacidade')
        return
      }

      // Dados para envio
      const dadosEnvio = {
        qual_unidade: unidadeLabels[data.qual_unidade] || data.qual_unidade,
        codigo_unidade: data.qual_unidade,
        nome: data.nome,
        email: data.email,
        celular: data.celular,
        aceito_termos: data.aceito_termos
      }

      // Enviar para API
      const response = await fetch('/api/send-freepass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao solicitar freepass')
      }

      setIsSubmitted(true)
      reset()

    } catch (err) {
      console.error('Erro ao enviar:', err)
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao solicitar freepass. Tente novamente.'
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
          <h2 className="text-2xl font-bold text-flex-dark mb-4">Freepass Solicitado!</h2>
          <p className="text-flex-gray mb-6">
            Seu freepass foi solicitado com sucesso! Em breve entraremos em contato para agendar sua visita.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium"
            >
              Solicitar Outro Freepass
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
              <HiGift className="text-white text-3xl" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl gradient-text mb-4">
              SOLICITE SEU FREEPASS
            </h1>
            <p className="text-flex-light/80 text-lg">
              Conheça nossa academia e treine gratuitamente
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10 space-y-6"
          >
            <CustomSelect
              label="Qual unidade:"
              required
              options={[
                { value: 'marista', label: 'Flex Fitness Marista' },
                { value: 'buena-vista', label: 'Flex Fitness Buena Vista' },
                { value: 'alphaville', label: 'Flex Fitness Alphaville' },
                { value: 'palmas', label: 'Flex Fitness Palmas (Em breve)' }
              ]}
              value={watch('qual_unidade') || ''}
              onChange={(value) => setValue('qual_unidade', value)}
              error={errors.qual_unidade?.message}
              placeholder="Selecione uma unidade"
            />

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Nome <span className="text-red-400">*</span>
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

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Celular <span className="text-red-400">*</span>
              </label>
              <input
                {...register('celular', { required: 'Celular é obrigatório' })}
                placeholder="(62) 99999-9999"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              {errors.celular && (
                <p className="text-red-400 text-sm mt-1">{errors.celular.message}</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('aceito_termos', { 
                  required: 'Você deve aceitar os Termos de Política e Privacidade' 
                })}
                className="mt-1 w-4 h-4 bg-white/5 border border-white/20 rounded text-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
              <div>
                <label className="text-flex-light text-sm cursor-pointer">
                  Li e Aceito os Termos de Política e Privacidade. <span className="text-red-400">*</span>
                </label>
                {errors.aceito_termos && (
                  <p className="text-red-400 text-sm mt-1">{errors.aceito_termos.message}</p>
                )}
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
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Solicitando Freepass...
                </div>
              ) : (
                'Solicitar Freepass'
              )}
            </motion.button>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HiGift className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-500 font-medium text-sm mb-1">🎁 Seu Freepass Inclui</h4>
                  <ul className="text-flex-light/70 text-sm space-y-1">
                    <li>• Visita guiada pela academia</li>
                    <li>• Treino experimental gratuito</li>
                    <li>• Orientação com nossos profissionais</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-flex-light/70 text-sm hover:text-yellow-500 transition-colors underline"
                onClick={() => {
                  window.location.href = '/privacy-policy'
                }}
              >
                📄 Termos de Política e Privacidade
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}