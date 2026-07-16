'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiX, HiMail, HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { unitsData } from '@/lib/constants/units-data'

// WhatsApp do consultor / atendimento central
const CONSULTANT_PHONE = '556293833713'

interface ContactFormProps {
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  unit: string
  message?: string
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  // Envia os dados preenchidos pelo WhatsApp do consultor
  const onSubmitWhatsApp = (data: FormData) => {
    const unitName = unitsData.find((u) => u.slug === data.unit)?.name || data.unit

    const lines = [
      'Olá! Tenho interesse na Flex Fitness e gostaria de agendar uma visita.',
      '',
      `*Nome:* ${data.name}`,
      `*E-mail:* ${data.email}`,
      `*Telefone:* ${data.phone}`,
      `*Unidade de interesse:* ${unitName}`,
    ]

    if (data.message?.trim()) {
      lines.push(`*Mensagem:* ${data.message.trim()}`)
    }

    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${CONSULTANT_PHONE}?text=${text}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  // Envia os dados preenchidos por e-mail (API /api/contact)
  const onSubmitEmail = async (data: FormData) => {
    const unitName = unitsData.find((u) => u.slug === data.unit)?.name || data.unit
    setEmailStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.name,
          email: data.email,
          telefone: data.phone,
          unidade: unitName,
          codigo_flex: data.unit,
          mensagem: data.message?.trim() || 'Tenho interesse em agendar uma visita na Flex Fitness.',
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao enviar')
      }

      setEmailStatus('success')
      setTimeout(onClose, 2000)
    } catch (err) {
      console.error('Erro ao enviar contato por e-mail:', err)
      setEmailStatus('error')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-8 max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-3xl gradient-text">Agendar Visita</h3>
            <button onClick={onClose} className="text-flex-gray hover:text-flex-dark">
              <HiX className="text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitWhatsApp)} className="space-y-4">
            <div>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Seu nome"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                placeholder="Seu email"
                type="email"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('phone', { required: 'Telefone é obrigatório' })}
                placeholder="Seu telefone"
                type="tel"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <select
                {...register('unit', { required: 'Selecione uma unidade' })}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark focus:outline-none focus:border-flex-red"
              >
                <option value="">Selecione a unidade</option>
                {unitsData.map((unit) => (
                  <option key={unit.id} value={unit.slug}>
                    {unit.name}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register('message')}
                placeholder="Mensagem (opcional)"
                rows={3}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red resize-none"
              />
            </div>

            <div className="space-y-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={emailStatus === 'sending'}
                className="w-full bg-green-500 text-white py-4 rounded-full font-medium hover:bg-green-600 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <FaWhatsapp className="text-lg" />
                Enviar pelo WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit(onSubmitEmail)}
                disabled={emailStatus === 'sending'}
                className="w-full gradient-bg text-white py-4 rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {emailStatus === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <HiMail className="text-lg" />
                    Enviar por E-mail
                  </>
                )}
              </motion.button>
            </div>

            {emailStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <HiCheck className="text-lg flex-shrink-0" />
                Solicitação enviada! Em breve entraremos em contato.
              </motion.div>
            )}

            {emailStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <HiExclamationCircle className="text-lg flex-shrink-0" />
                Não foi possível enviar por e-mail. Tente novamente ou use o WhatsApp.
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}