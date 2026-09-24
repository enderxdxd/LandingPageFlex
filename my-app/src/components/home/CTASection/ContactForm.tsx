'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiX, HiMail, HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { unitsData } from '@/lib/constants/units-data'
import { HONEYPOT_FIELD, honeypotInputProps } from '@/lib/api/honeypot'

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
  /** campo-armadilha; sempre vazio quando quem preenche é gente */
  [HONEYPOT_FIELD]?: string
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)

  /* O modal abria sem saída pelo teclado: nem Escape, nem foco movido para
     dentro. Quem navega por teclado ficava preso atrás do overlay. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

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
          [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? '',
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
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-form-title"
          tabIndex={-1}
          /* `overscroll-contain` impede que a rolagem do modal "vaze" para a
             página atrás dele no toque. */
          className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto overscroll-contain outline-none"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 id="contact-form-title" className="font-display text-3xl gradient-text">Agendar Visita</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-flex-gray hover:text-flex-dark hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flex-primary"
            >
              <HiX className="text-2xl" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitWhatsApp)} className="space-y-4">
            {/* Os campos não tinham `<label>` nenhum: o placeholder era o único
                rótulo, então ele some assim que a pessoa digita e leitor de tela
                não anuncia nada. Cada um ganhou rótulo real, `autoComplete` e o
                teclado certo no celular. */}
            <div>
              <label htmlFor="cf-name" className="block text-sm font-medium text-flex-dark mb-1">
                Nome
              </label>
              <input
                id="cf-name"
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Seu nome"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red focus-visible:ring-2 focus-visible:ring-flex-primary"
              />
              {errors.name && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-email" className="block text-sm font-medium text-flex-dark mb-1">
                E-mail
              </label>
              <input
                id="cf-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                })}
                placeholder="seu@email.com"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red focus-visible:ring-2 focus-visible:ring-flex-primary"
              />
              {errors.email && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-phone" className="block text-sm font-medium text-flex-dark mb-1">
                Telefone
              </label>
              <input
                id="cf-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                placeholder="(62) 99999-9999"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red focus-visible:ring-2 focus-visible:ring-flex-primary"
              />
              {errors.phone && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-unit" className="block text-sm font-medium text-flex-dark mb-1">
                Unidade de interesse
              </label>
              {/* `<select>` nativo herda o tema do sistema: sem cor de fundo e
                  de texto explícitas, as opções ficam ilegíveis no modo escuro
                  do celular. */}
              <select
                id="cf-unit"
                autoComplete="off"
                {...register('unit', { required: 'Selecione uma unidade' })}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark focus:outline-none focus:border-flex-red focus-visible:ring-2 focus-visible:ring-flex-primary"
                style={{ backgroundColor: '#f3f4f6', color: '#0F172A' }}
              >
                <option value="">Selecione a unidade</option>
                {unitsData.map((unit) => (
                  <option key={unit.id} value={unit.slug}>
                    {unit.name}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-message" className="block text-sm font-medium text-flex-dark mb-1">
                Mensagem <span className="text-flex-gray font-normal">(opcional)</span>
              </label>
              <textarea
                id="cf-message"
                {...register('message')}
                placeholder="Conte o que você procura…"
                rows={3}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-flex-dark placeholder:text-flex-gray focus:outline-none focus:border-flex-red focus-visible:ring-2 focus-visible:ring-flex-primary resize-none"
              />
            </div>

            {/* Campo-armadilha: invisível para gente, preenchido por robô. */}
            <input {...honeypotInputProps} {...register(HONEYPOT_FIELD as any)} />

            <div className="space-y-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={emailStatus === 'sending'}
                className="w-full bg-green-500 text-white py-4 rounded-full font-medium hover:bg-green-600 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <FaWhatsapp className="text-lg" aria-hidden="true" />
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
                    Enviando…
                  </>
                ) : (
                  <>
                    <HiMail className="text-lg" aria-hidden="true" />
                    Enviar por E-mail
                  </>
                )}
              </motion.button>
            </div>

            {emailStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <HiCheck className="text-lg flex-shrink-0" aria-hidden="true" />
                Solicitação enviada! Em breve entraremos em contato.
              </motion.div>
            )}

            {emailStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <HiExclamationCircle className="text-lg flex-shrink-0" aria-hidden="true" />
                Não foi possível enviar por e-mail. Tente novamente ou use o WhatsApp.
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}