'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiX } from 'react-icons/hi'
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

  const onSubmit = async (data: FormData) => {
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full gradient-bg text-white py-4 rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-lg" />
              Enviar pelo WhatsApp
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}