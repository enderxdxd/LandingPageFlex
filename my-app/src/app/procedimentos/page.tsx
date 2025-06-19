// src/app/procedimentos/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiDocumentText, HiUpload, HiCheck, HiExclamationCircle, HiChevronDown } from 'react-icons/hi'
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
                    className={`w-full px-4 py-3 text-left text-gray-800 hover:bg-blue-500/10 transition-colors duration-150 ${
                      value === option.value ? 'bg-blue-500/20 text-blue-700 font-medium' : ''
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

type FormData = {
  unidade: string
  procedimento: string
  motivo: string
  dataInicio?: string
  dataFim?: string
  matricula?: string
  nome: string
  whatsapp: string
  email: string
  detalhes?: string
  arquivo?: FileList
}

export default function Procedimentos() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<FormData>()
  
  const procedimentoSelecionado = watch('procedimento')
  const mostrarDatas = procedimentoSelecionado?.includes('trancamento')

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let anexoBase64 = ''
      let nomeArquivo = ''

      if (data.arquivo && data.arquivo[0]) {
        anexoBase64 = await convertFileToBase64(data.arquivo[0])
        nomeArquivo = data.arquivo[0].name
      }

      const templateParams = {
        to_email: 'henriquepcosta@hotmail.com',
        from_name: data.nome,
        from_email: data.email,
        unidade: data.unidade,
        procedimento: data.procedimento,
        motivo: data.motivo,
        data_inicio: data.dataInicio || 'Não informado',
        data_fim: data.dataFim || 'Não informado',
        matricula: data.matricula || 'Não informado',
        whatsapp: data.whatsapp,
        detalhes: data.detalhes || 'Nenhum detalhe adicional',
        anexo: anexoBase64,
        nome_arquivo: nomeArquivo,
        data_solicitacao: new Date().toLocaleString('pt-BR'),
        reply_to: data.email
      }

      const result = await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams
      )

      if (result.status === 200) {
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.error('Erro ao enviar:', error)
      setSubmitError('Erro ao enviar solicitação. Tente novamente.')
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
          <h2 className="text-2xl font-bold text-flex-dark mb-4">Solicitação Enviada!</h2>
          <p className="text-flex-gray mb-6">
            Sua solicitação foi recebida com sucesso. Nossa equipe entrará em contato em breve.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-flex-primary text-white px-6 py-3 rounded-full font-medium"
            >
              Fazer Nova Solicitação
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
              className="w-20 h-20 bg-gradient-to-r from-flex-primary to-flex-secondary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <HiDocumentText className="text-white text-3xl" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl gradient-text mb-4">
              PROCEDIMENTOS 
            </h1>
            <p className="text-flex-light/80 text-lg">
              Solicite alterações no seu plano de forma rápida e segura
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
              label="Unidade"
              required
              options={[
                { value: 'marista', label: 'Flex Fitness Marista' },
                { value: 'buena-vista', label: 'Flex Fitness Buena Vista' },
                { value: 'alphaville', label: 'Flex Fitness Alphaville' }
              ]}
              value={watch('unidade') || ''}
              onChange={(value) => setValue('unidade', value)}
              error={errors.unidade?.message}
              placeholder="Selecione a unidade"
            />

            <CustomSelect
              label="Tipo de Procedimento"
              required
              options={[
                { value: 'cancelamento', label: 'Cancelamento de Plano' },
                { value: 'transferencia-credito', label: 'Transferência de Crédito (R$)' },
                { value: 'transferencia-dias', label: 'Transferência de Dias' },
                { value: 'trancamento', label: 'Lançamento de Trancamento' },
                { value: 'trancamento-pago', label: 'Trancamento Pago R$ 100,00' },
                { value: 'resgate-cheque', label: 'Resgate Cheque para Troca' },
                { value: 'trocar-pagamento', label: 'Trocar Forma de Pagamento' },
                { value: 'trocar-unidade', label: 'Trocar de Unidade' },
                { value: 'retencao-credito', label: 'Retenção de Crédito para Novo Plano' }
              ]}
              value={watch('procedimento') || ''}
              onChange={(value) => setValue('procedimento', value)}
              error={errors.procedimento?.message}
              placeholder="Selecione o procedimento"
            />

            <CustomSelect
              label="Motivo"
              required
              options={[
                { value: 'mudanca', label: 'Mudança de Cidade ou Bairro' },
                { value: 'tempo', label: 'Falta de Tempo' },
                { value: 'insatisfacao', label: 'Insatisfação' },
                { value: 'saude', label: 'Problemas de Saúde' },
                { value: 'financeiros', label: 'Problemas Financeiros' },
                { value: 'outros', label: 'Outros' }
              ]}
              value={watch('motivo') || ''}
              onChange={(value) => setValue('motivo', value)}
              error={errors.motivo?.message}
              placeholder="Selecione o motivo"
            />

            {mostrarDatas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-flex-light mb-2">
                    Data Início Trancamento
                  </label>
                  <input
                    type="date"
                    {...register('dataInicio')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light focus:ring-2 focus:ring-flex-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-flex-light mb-2">
                    Data Fim Trancamento
                  </label>
                  <input
                    type="date"
                    {...register('dataFim')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light focus:ring-2 focus:ring-flex-primary focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  Matrícula (se souber)
                </label>
                <input
                  {...register('matricula')}
                  placeholder="Número da matrícula"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent"
                />
              </div>
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  WhatsApp *
                </label>
                <input
                  {...register('whatsapp', { required: 'WhatsApp é obrigatório' })}
                  placeholder="(62) 99999-9999"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent"
                />
                {errors.whatsapp && (
                  <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-flex-light mb-2">
                  E-mail para Comprovante *
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Detalhes Adicionais
              </label>
              <textarea
                {...register('detalhes')}
                rows={4}
                placeholder="Informe detalhes importantes sobre sua solicitação..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-flex-light placeholder:text-flex-light/50 focus:ring-2 focus:ring-flex-primary focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-flex-light mb-2">
                Anexar Documento (Opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  {...register('arquivo')}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="arquivo"
                />
                <label
                  htmlFor="arquivo"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-flex-primary/50 transition-colors"
                >
                  <div className="text-center">
                    <HiUpload className="mx-auto text-3xl text-flex-light/50 mb-2" />
                    <p className="text-flex-light/70 text-sm">
                      Clique para anexar um arquivo
                    </p>
                    <p className="text-flex-light/50 text-xs mt-1">
                      PDF, JPG, PNG até 10MB
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
              className="w-full gradient-bg text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                'Enviar Solicitação'
              )}
            </motion.button>

            <p className="text-center text-flex-light/60 text-sm">
              Sua solicitação será analisada em até 24 horas úteis
            </p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}