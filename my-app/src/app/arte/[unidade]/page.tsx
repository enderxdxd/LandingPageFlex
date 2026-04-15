'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Palette, User, Phone, Briefcase, ArrowRight, LogOut } from 'lucide-react'
import { ARTE_UNIDADES, CARGOS } from '@/lib/arte/constants'
import type { ArteUnidadeType, RequesterRoleType, Requester } from '@/lib/arte/types'
import { getOrCreateDeviceId, clearDeviceId } from '@/lib/arte/utils/deviceId'

export default function ArteLandingPage() {
  const router = useRouter()
  const params = useParams()
  const unidade = params.unidade as ArteUnidadeType
  const unidadeInfo = ARTE_UNIDADES[unidade]

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', role: '' as RequesterRoleType | '' })

  // Verificar se já existe requester para este dispositivo
  useEffect(() => {
    async function checkExisting() {
      try {
        const deviceId = getOrCreateDeviceId()
        const res = await fetch(`/api/arte/requesters?deviceId=${encodeURIComponent(deviceId)}`)
        const data = await res.json()

        if (data.requester && !data.requester.isBlocked) {
          setRequester(data.requester as Requester)
        }
      } catch {
        // Primeiro acesso
      } finally {
        setLoading(false)
      }
    }
    checkExisting()
  }, [])

  // Máscara de telefone
  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 11)
    if (nums.length <= 2) return `(${nums}`
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone || !form.role) {
      toast.error('Preencha todos os campos')
      return
    }

    const phoneNums = form.phone.replace(/\D/g, '')
    if (phoneNums.length < 10 || phoneNums.length > 11) {
      toast.error('Número de WhatsApp inválido')
      return
    }

    setSubmitting(true)
    try {
      const deviceId = getOrCreateDeviceId()
      const res = await fetch('/api/arte/requesters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          name: form.name.trim(),
          phone: form.phone,
          role: form.role,
          unitId: unidade,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao cadastrar')
      }

      const data = await res.json()
      setRequester(data as Requester)
      toast.success('Cadastro realizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    clearDeviceId()
    setRequester(null)
    setForm({ name: '', phone: '', role: '' })
    toast.success('Identificação limpa')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  // Já identificado — mostrar boas-vindas
  if (requester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Toaster position="top-center" />

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Flex Arte</p>
                <p className="text-xs text-gray-500">{unidadeInfo.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                Olá, <strong>{requester.name?.split(' ')[0]}</strong> 👋
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                title="Não é você?"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Solicitar arte
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Peça uma arte para o designer da Flex. Basta preencher o formulário e a equipe vai produzir.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/arte/${unidade}/novo`)}
              className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold text-gray-900">Novo pedido de arte</p>
                <p className="text-sm text-gray-500">Criar uma nova solicitação</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            <button
              onClick={() => router.push(`/arte/${unidade}/meus-pedidos`)}
              className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold text-gray-900">Meus pedidos</p>
                <p className="text-sm text-gray-500">Ver status dos seus pedidos</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Não identificado — formulário de cadastro
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Flex Arte</h1>
          <p className="text-gray-500">
            Solicite artes para a unidade <strong>{unidadeInfo.label}</strong>
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Primeiro, se identifique</p>
            <p className="text-xs text-gray-400">Seus dados ficam salvos neste dispositivo</p>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Seu nome"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 text-gray-400" />
              WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
              placeholder="(62) 99999-9999"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Cargo */}
          <div>
            <label htmlFor="role" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Cargo
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as RequesterRoleType }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Selecione seu cargo...</option>
              {(Object.entries(CARGOS) as [RequesterRoleType, { label: string }][]).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.name || !form.phone || !form.role}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Sistema interno — Flex Fitness Center
        </p>
      </div>
    </div>
  )
}
