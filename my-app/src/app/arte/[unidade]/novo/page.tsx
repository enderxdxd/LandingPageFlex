'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2, Palette, ArrowLeft } from 'lucide-react'
import type { ArteUnidadeType, Requester, DesignRequestType, DestinationType, NovoDesignRequestFormData } from '@/lib/arte/types'
import { ARTE_UNIDADES } from '@/lib/arte/constants'
import { getOrCreateDeviceId } from '@/lib/arte/utils/deviceId'
import WizardStep1Tipo from '@/components/arte/wizard/WizardStep1Tipo'
import WizardStep2Destinos from '@/components/arte/wizard/WizardStep2Destinos'
import WizardStep3Campos from '@/components/arte/wizard/WizardStep3Campos'
import WizardStep4Detalhes from '@/components/arte/wizard/WizardStep4Detalhes'
import WizardStep5Revisao from '@/components/arte/wizard/WizardStep5Revisao'

const TOTAL_STEPS = 5

export default function NovoDesignRequestPage() {
  const router = useRouter()
  const params = useParams()
  const unidade = params.unidade as ArteUnidadeType
  const unidadeInfo = ARTE_UNIDADES[unidade]

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requester, setRequester] = useState<Requester | null>(null)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<NovoDesignRequestFormData>({
    type: '',
    destinations: [],
    dynamicFields: {},
    description: '',
    referenceImages: [],
    deadline: '',
  })

  // Verificar identificação
  useEffect(() => {
    async function check() {
      try {
        const deviceId = getOrCreateDeviceId()
        const res = await fetch(`/api/arte/requesters?deviceId=${encodeURIComponent(deviceId)}`)
        const data = await res.json()

        if (data.requester && !data.requester.isBlocked) {
          setRequester(data.requester as Requester)
        } else {
          // Redirecionar para identificação
          router.replace(`/arte/${unidade}`)
          return
        }
      } catch {
        router.replace(`/arte/${unidade}`)
        return
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [router, unidade])

  const updateForm = (field: keyof NovoDesignRequestFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    if (!requester) return

    setSubmitting(true)
    try {
      // Upload de referências primeiro (se houver)
      let referenceImages: { url: string; storagePath: string; fileName: string }[] = []

      if (formData.referenceImages.length > 0) {
        const uploadData = new FormData()
        formData.referenceImages.forEach(file => uploadData.append('files', file))
        uploadData.append('folder', 'references')
        uploadData.append('requestId', 'temp-' + Date.now())

        const uploadRes = await fetch('/api/arte/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (!uploadRes.ok) {
          throw new Error('Erro no upload das imagens')
        }

        const uploadResult = await uploadRes.json()
        referenceImages = uploadResult.files
      }

      // Criar a solicitação
      const res = await fetch('/api/arte/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: requester.id,
          requesterName: requester.name,
          requesterPhone: requester.phone,
          requesterRole: requester.role,
          unitId: unidade,
          type: formData.type,
          destinations: formData.destinations,
          dynamicFields: formData.dynamicFields,
          description: formData.description,
          referenceImages,
          deadline: formData.deadline,
          totalRequests: requester.totalRequests,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao criar solicitação')
      }

      const result = await res.json()
      toast.success(`Pedido #${result.requestNumber} criado!`)
      router.push(`/arte/${unidade}/novo/sucesso?numero=${result.requestNumber}&id=${result.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar solicitação')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!requester) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step > 1 ? prevStep() : router.push(`/arte/${unidade}`)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">Novo pedido</p>
              <p className="text-xs text-gray-500">{unidadeInfo.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-gray-400 mr-1">Passo {step} de {TOTAL_STEPS}</p>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < step ? 'w-6 bg-blue-600' : 'w-3 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {step === 1 && (
          <WizardStep1Tipo
            selected={formData.type}
            onSelect={(type) => {
              updateForm('type', type)
              // Limpar campos dinâmicos se trocar de tipo
              updateForm('dynamicFields', {})
              nextStep()
            }}
          />
        )}

        {step === 2 && (
          <WizardStep2Destinos
            selected={formData.destinations}
            onChange={(destinations) => updateForm('destinations', destinations)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <WizardStep3Campos
            type={formData.type as DesignRequestType}
            fields={formData.dynamicFields}
            unidade={unidade}
            onChange={(fields) => updateForm('dynamicFields', fields)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 4 && (
          <WizardStep4Detalhes
            description={formData.description}
            referenceImages={formData.referenceImages}
            deadline={formData.deadline}
            onChangeDescription={(v) => updateForm('description', v)}
            onChangeImages={(v) => updateForm('referenceImages', v)}
            onChangeDeadline={(v) => updateForm('deadline', v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 5 && (
          <WizardStep5Revisao
            formData={formData}
            unidade={unidade}
            submitting={submitting}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onEditStep={setStep}
          />
        )}
      </main>
    </div>
  )
}
