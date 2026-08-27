// src/app/procedimentos/page.tsx
'use client'

import { useState } from 'react'
import ConsentField from '@/components/shared/ConsentField'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiDocumentText, HiUpload, HiCheck, HiExclamationCircle, HiChevronDown } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

// Configurar EmailJS
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER!)

function buildFieldsTable(data: FormData): string {
  const rows: [string, string][] = [
    ['Unidade',      data.unidade],
    ['Procedimento', data.procedimento],
    ['Motivo',       data.motivo],
    ['Data Início',  data.dataInicio || '—'],
    ['Data Fim',     data.dataFim    || '—'],
    ['Matrícula',    data.matricula  || '—'],
    ['Nome',         data.nome],
    ['WhatsApp',     data.whatsapp],
    ['E-mail',       data.email],
    ['Detalhes',     data.detalhes   || '—'],
  ]

  const trs = rows
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:8px 12px;border:1px solid #ddd;background:#f8f9fa;"><strong>${label}</strong></td>` +
        `<td style="padding:8px 12px;border:1px solid #ddd;">${value}</td>` +
        `</tr>`
    )
    .join('')

  return `<table style="border-collapse:collapse;width:100%;margin:16px 0;font-family:Arial,sans-serif;">${trs}</table>`
}

// Mapeia destinatários por unidade
const unitRecipients: Record<string, string> = {
  'marista': 'jonatas@flexacademia.com.br,hudson@flexacademia.com.br,comercial@flexacademia.com.br, comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br,vendasmarista@flexacademia.com.br' ,
  'buena-vista': 'vendasflexbuenavista@flexacademia.com.br,supervisaotecnicabuenavista@flexacademia.com.br,hudson@flexacademia.com.br,comercial@flexacademia.com.br, comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br',
  'alphaville': 'hudson@flexacademia.com.br,comercial@flexacademia.com.br, comercial.atendimento@flexacademia.com.br,atendimento@paresconsultoria.com.br,vendas.alphaville@flexacademia.com.br,supervisaotecnicaalphaville@flexacademia.com.br',
  'palmas': 'comercial@flexacademia.com.br,comercial.atendimento@flexacademia.com.br,financeiro@flexacademia.com.br,vendaspalmas@flexacademia.com.br,gestaotecnica@flexpalmas.com.br,atendimento@paresconsultoria.com.br'
}

// Mapeia nomes das unidades
const unitNames: Record<string, string> = {
  'marista':     'Flex Fitness Marista',
  'buena-vista': 'Flex Fitness Buena Vista',
  'alphaville':  'Flex Fitness Alphaville',
  'palmas':      'Flex Fitness Palmas',
}

// Mapeia nomes dos procedimentos
const procedureNames: Record<string, string> = {
  'cancelamento': 'Cancelamento de Plano',
  'transferencia-credito': 'Transferência de Crédito (R$)',
  'transferencia-dias': 'Transferência de Dias',
  'trancamento': 'Lançamento de Trancamento',
  'trancamento-pago': 'Trancamento Pago R$ 150,00',
  'resgate-cheque': 'Resgate Cheque para Troca',
  'trocar-pagamento': 'Trocar Forma de Pagamento',
  'trocar-unidade': 'Trocar de Unidade',
  'retencao-credito': 'Retenção de Crédito para Novo Plano'
}

const signatureLinks = {
  cancelamento: 'https://app.zapsign.com.br/verificar/doc/7e0e84ef-36ac-432d-b60e-614136502106',
  'transferencia-dias': 'https://app.zapsign.com.br/verificar/doc/1b8f4550-b9ec-42dd-9a94-02a9c5235fd9'
} as const

// Mapeia nomes dos motivos
const reasonNames: Record<string, string> = {
  'mudanca': 'Mudança de Cidade ou Bairro',
  'tempo': 'Falta de Tempo',
  'insatisfacao': 'Insatisfação',
  'saude': 'Problemas de Saúde',
  'financeiros': 'Problemas Financeiros',
  'outros': 'Outros'
}

// Tipagem do formulário
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
  name: string
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  error,
  required = false,
  label,
  name
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

export default function Procedimentos() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  /** LGPD: nunca começa marcado — consentimento pré-marcado não é consentimento */
  const [consent, setConsent] = useState(false)
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue, trigger } = useForm<FormData>()
  
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

  // Substitua a função onSubmit por esta:
  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    setSubmitError(null)
  
    try {
      // Validações
      if (!data.unidade) {
        setSubmitError('Por favor, selecione uma unidade')
        return
      }
      if (!data.procedimento) {
        setSubmitError('Por favor, selecione um procedimento')
        return
      }
      if (!data.motivo) {
        setSubmitError('Por favor, selecione um motivo')
        return
      }
  
      // Processar arquivo se existir
      let anexoBase64 = ''
      let nomeArquivo = ''
      
      if (arquivoSelecionado) {
        // Validar tamanho (máximo 10MB)
        if (arquivoSelecionado.size > 10 * 1024 * 1024) {
          setSubmitError('Arquivo muito grande. Máximo 10MB.')
          return
        }
        
        // Validar tipo
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        if (!tiposPermitidos.includes(arquivoSelecionado.type)) {
          setSubmitError('Tipo de arquivo não permitido. Use PDF, JPG ou PNG.')
          return
        }
        
        try {
          anexoBase64 = await convertFileToBase64(arquivoSelecionado)
          nomeArquivo = arquivoSelecionado.name
        } catch (error) {
          setSubmitError('Erro ao processar o arquivo. Tente novamente.')
          return
        }
      }
  
      // Dados formatados
      const dataFormatada = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
  
      const unidadeNome = unitNames[data.unidade] || data.unidade
      const procedimentoNome = procedureNames[data.procedimento] || data.procedimento
      const motivoNome = reasonNames[data.motivo] || data.motivo
      const numeroSolicitacao = `FLEX-${Date.now().toString().slice(-6)}`
      
      // Obter emails da unidade (string separada por vírgula)
      const managerEmailString = unitRecipients[data.unidade]
  
      if (!managerEmailString) {
        throw new Error('Unidade não encontrada no sistema')
      }
  
      // Converter string em array de emails
      const managerEmails = managerEmailString.split(',').map(email => email.trim())
  
      // Blocos condicionais
      const resgateBlock = data.procedimento.includes('resgate-cheque')
        ? `<div style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0;">
           <h4 style="color:#856404;margin:0 0 10px 0;">Sobre resgate de cheques:</h4>
           <p style="color:#856404;margin:0;">O processo para resgate de cheques só poderá ser efetuado após o pagamento total dos cheques a serem resgatados + a taxa de resgate.</p>
           </div>`
        : ''
  
      const cancelBlock = data.procedimento === 'cancelamento'
        ? `<div style="background:#f8d7da;padding:15px;border-left:4px solid #dc3545;margin:20px 0;">
           <h4 style="color:#721c24;margin:0 0 10px 0;">Em caso de solicitação de rescisão:</h4>
           <p style="color:#721c24;margin:0;">O prazo é de <strong>ATÉ 40 DIAS</strong>.</p>
           </div>`
        : ''
  
      // Dados comuns para ambos os emails
      const emailData = {
        numero_solicitacao: numeroSolicitacao,
        unidade: unidadeNome,
        procedimento: procedimentoNome,
        motivo: motivoNome,
        data_solicitacao: dataFormatada,
        nome_cliente: data.nome,
        whatsapp: data.whatsapp,
        email_cliente: data.email,
        matricula: data.matricula || 'Não informado',
        detalhes: data.detalhes || 'Nenhum detalhe adicional',
        data_inicio: data.dataInicio || 'Não se aplica',
        data_fim: data.dataFim || 'Não se aplica',
        resgate_block: resgateBlock,
        cancelamento_block: cancelBlock,
        anexo: anexoBase64,
        nome_arquivo: nomeArquivo
      }
  
      // Definir tipo de email
      const isCancelamento = data.procedimento === 'cancelamento'
      const isTransferenciaDias = data.procedimento === 'transferencia-dias'
      const clientTemplate = isCancelamento
        ? 'cancelamento'
        : isTransferenciaDias
          ? 'cessao-plano'
          : 'comprovante'
      const clientSubject = isCancelamento
        ? `📋 Confirmação Necessária - Cancelamento ${numeroSolicitacao} - Flex Fitness`
        : isTransferenciaDias
          ? `📋 Confirmação Necessária - Termo de Cessão de Plano ${numeroSolicitacao} - Flex Fitness`
          : `✅ Comprovante de Solicitação - ${numeroSolicitacao} - Flex Fitness`
      const clientSignatureLink = isCancelamento
        ? signatureLinks.cancelamento
        : isTransferenciaDias
          ? signatureLinks['transferencia-dias']
          : ''
      
      // Criar destinatários
      const destinatarios = []
  
      // 1. Email para o cliente (SEM anexo)
      destinatarios.push({
        email: data.email,
        subject: clientSubject,
        template: clientTemplate,
        link_assinatura: clientSignatureLink,
        anexo: '',
        nome_arquivo: ''
      })
  
      // 2. Emails para a empresa (COM anexo se existir)
      managerEmails.forEach(email => {
        destinatarios.push({
          email: email,
          subject: `🚨 Nova Solicitação - ${procedimentoNome} - ${numeroSolicitacao}`,
          template: 'empresa',
          link_assinatura: '',
          anexo: anexoBase64,
          nome_arquivo: nomeArquivo
        })
      })
  
      // Enviar todos os emails de uma vez
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatarios: destinatarios,
          ...emailData
        })
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar emails')
      }
  
      setIsSubmitted(true)
      setArquivoSelecionado(null) // Limpar arquivo selecionado
      reset()
      
    } catch (err) {
      console.error('Erro ao enviar:', err)
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao enviar solicitação. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="form-success-page min-h-screen bg-gradient-to-br from-flex-dark to-flex-navy flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="form-success-card bg-white rounded-2xl p-8 max-w-md w-full text-center"
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
            Sua solicitação foi recebida com sucesso. Um comprovante foi enviado para seu e-mail e nossa equipe entrará em contato em breve.Confira o SPAM caso não receba o comprovante.
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
    <div className="form-page min-h-screen bg-gradient-to-br from-flex-dark to-flex-navy pt-20">
      <div className="form-page-inner section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-page-content max-w-2xl mx-auto"
        >
          <div className="form-page-hero text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="form-page-icon w-20 h-20 bg-gradient-to-r from-flex-primary to-flex-secondary rounded-full flex items-center justify-center mx-auto mb-6"
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
            className="form-card glass-effect rounded-2xl p-8 backdrop-blur-lg border border-white/10 space-y-6"
          >
            <CustomSelect
              name="unidade"
              label="Unidade"
              required
              options={[
                { value: 'marista', label: 'Flex Fitness Marista' },
                { value: 'buena-vista', label: 'Flex Fitness Buena Vista' },
                { value: 'alphaville', label: 'Flex Fitness Alphaville' },
                { value: 'palmas', label: 'Flex Fitness Palmas' }
              ]}
              value={watch('unidade') || ''}
              onChange={(value) => setValue('unidade', value)}
              error={errors.unidade?.message}
              placeholder="Selecione a unidade"
            />

            <CustomSelect
              name="procedimento"
              label="Tipo de Procedimento"
              required
              options={[
                { value: 'cancelamento', label: 'Cancelamento de Plano' },
                { value: 'transferencia-credito', label: 'Transferência de Crédito (R$)' },
                { value: 'transferencia-dias', label: 'Transferência de Dias' },
                { value: 'trancamento', label: 'Lançamento de Trancamento' },
                { value: 'trancamento-pago', label: 'Trancamento Pago R$ 150,00' },
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
              name="motivo"
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
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="arquivo"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setArquivoSelecionado(file)
                    }
                  }}
                />
                <label
                  htmlFor="arquivo"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-flex-primary/50 transition-colors"
                >
                  <div className="text-center">
                    <HiUpload className="mx-auto text-3xl text-flex-light/50 mb-2" />
                    {arquivoSelecionado ? (
                      <div>
                        <p className="text-flex-light text-sm font-medium">
                          {arquivoSelecionado.name}
                        </p>
                        <p className="text-flex-light/50 text-xs mt-1">
                          {(arquivoSelecionado.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setArquivoSelecionado(null)
                            // Reset input
                            const input = document.getElementById('arquivo') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="text-red-400 text-xs mt-2 hover:text-red-300"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-flex-light/70 text-sm">
                          Clique para anexar um arquivo
                        </p>
                        <p className="text-flex-light/50 text-xs mt-1">
                          PDF, JPG, PNG até 10MB
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

            <ConsentField
              checked={consent}
              onChange={setConsent}
              purpose="registrar e responder minha solicitação"
            />

            <motion.button
              type="submit"
              disabled={isSubmitting || !consent}
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
              Sua solicitação será analisada pela nossa equipe.
            </p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
