// src/app/sugestoes/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiLightBulb, HiCamera, HiCheck, HiExclamationCircle, HiChevronDown } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

// Configurar EmailJS
emailjs.init("YOUR_PUBLIC_KEY") // Substitua pela sua chave pública

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
          className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-left text-flex-light focus:ring-2 focus:ring-flex-primary focus:border-transparent transition-all duration-200 ${
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

type SugData = {
  nome: string
  celular: string
  sou: string
  flex: string
  sugestao: string
  fotos?: FileList
}

export default function Sugestoes() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SugData>()

  const convertFilesToBase64 = async (files: FileList): Promise<string[]> => {
    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })
    })
    return Promise.all(promises)
  }

  async function onSubmit(data: SugData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let fotosBase64: string[] = []
      let nomesFotos: string[] = []

      if (data.fotos && data.fotos.length > 0) {
        fotosBase64 = await convertFilesToBase64(data.fotos)
        nomesFotos = Array.from(data.fotos).map(file => file.name)
      }

      const templateParams = {
        to_email: 'henriquepcosta@hotmail.com',
        from_name: data.nome,
        celular: data.celular,
        sou: data.sou,
        flex: data.flex,
        sugestao: data.sugestao,
        fotos: fotosBase64.join('|||'),
        nomes_fotos: nomesFotos.join(', '),
        quantidade_fotos: fotosBase64.length,
        data_sugestao: new Date().toLocaleString('pt-BR'),
        reply_to: data.celular
      }

      const result = await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID_SUGESTAO',
        templateParams
      )

      if (result.status === 200) {
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.error('Erro ao enviar:', error)
      setSubmitError('Erro ao enviar sugestão. Tente novamente.')
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
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent"
              />
              {errors.nome && (
                <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Celular *
              </label>
              <input
                {...register('celular', { required: 'Celular é obrigatório' })}
                placeholder="(62) 99999-9999"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent"
              />
              {errors.celular && (
                <p className="text-red-400 text-sm mt-1">{errors.celular.message}</p>
              )}
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
              value={watch('flex') || ''}
              onChange={(value) => setValue('flex', value)}
              error={errors.flex?.message}
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
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent resize-none"
              />
              {errors.sugestao && (
                <p className="text-red-400 text-sm mt-1">{errors.sugestao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Anexar Fotos (Opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  {...register('fotos')}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  id="fotos"
                />
                <label
                  htmlFor="fotos"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-yellow-500/50 transition-colors"
                >
                  <div className="text-center">
                    <HiCamera className="mx-auto text-3xl text-flex-light/50 mb-2" />
                    <p className="text-flex-light/70 text-sm">
                      Clique para anexar fotos
                    </p>
                    <p className="text-flex-light/50 text-xs mt-1">
                      JPG, PNG até 5MB cada (máx. 5 fotos)
                    </p>
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