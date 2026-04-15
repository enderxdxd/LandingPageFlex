'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { useChamadosAuth } from '@/lib/chamados/hooks/useAuth'
import { useNotificacoes } from '@/lib/chamados/hooks/useNotificacoes'
import ChamadosLayout from '@/components/chamados/layout/ChamadosLayout'
import LoadingState from '@/components/chamados/shared/LoadingState'
import type { Requester, DesignRequestType, NovoDesignRequestFormData } from '@/lib/arte/types'
import WizardStep1Tipo from '@/components/arte/wizard/WizardStep1Tipo'
import WizardStep2Destinos from '@/components/arte/wizard/WizardStep2Destinos'
import WizardStep3Campos from '@/components/arte/wizard/WizardStep3Campos'
import WizardStep4Detalhes from '@/components/arte/wizard/WizardStep4Detalhes'
import WizardStep5Revisao from '@/components/arte/wizard/WizardStep5Revisao'

const TOTAL_STEPS = 5
const STEP_TITLES = [
  'Tipo de arte',
  'Onde vai publicar',
  'Detalhes específicos',
  'Observações e referências',
  'Revisar e enviar',
]

export default function NovoArteProtectedPage() {
  const { usuario, loading: authLoading, logout } = useChamadosAuth()
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoes(usuario?.uid)
  const router = useRouter()

  const [requester, setRequester] = useState<Requester | null>(null)
  const [loadingRequester, setLoadingRequester] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<NovoDesignRequestFormData>({
    type: '',
    destinations: [],
    dynamicFields: {},
    description: '',
    referenceImages: [],
    deadline: '',
  })

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/chamados')
    }
  }, [authLoading, usuario, router])

  useEffect(() => {
    if (!usuario) return

    async function ensureRequester() {
      try {
        const unitId = usuario!.unidades?.[0] || 'alphaville'
        const roleMap: Record<string, string> = {
          'admin': 'gerente',
          'gestor': 'gerente',
          'tecnico': 'coordenador',
          'solicitante': 'recepcionista',
        }

        const res = await fetch('/api/arte/requesters/by-uid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: usuario!.uid,
            name: usuario!.nome,
            phone: usuario!.telefone || '',
            role: roleMap[usuario!.role] || 'outro',
            unitId,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setRequester(data as Requester)
        }
      } catch {
        // Silencioso
      } finally {
        setLoadingRequester(false)
      }
    }

    ensureRequester()
  }, [usuario])

  const updateForm = (field: keyof NovoDesignRequestFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    if (!requester) return

    setSubmitting(true)
    try {
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

        if (!uploadRes.ok) throw new Error('Erro no upload das imagens')
        const uploadResult = await uploadRes.json()
        referenceImages = uploadResult.files
      }

      const res = await fetch('/api/arte/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: requester.id,
          requesterName: requester.name,
          requesterPhone: requester.phone,
          requesterRole: requester.role,
          unitId: requester.unitId,
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
      router.push(`/chamados/arte/pedido/${result.id}?sucesso=1&numero=${result.requestNumber}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar solicitação')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !usuario) return <LoadingState texto="Carregando..." />

  const unidade = (requester?.unitId || usuario.unidades?.[0] || 'alphaville') as import('@/lib/arte/types').ArteUnidadeType

  return (
    <ChamadosLayout
      usuario={usuario}
      titulo="NOVO PEDIDO DE ARTE"
      notificacoes={notificacoes}
      naoLidas={naoLidas}
      onLogout={logout}
      onMarcarLida={marcarLida}
      onMarcarTodasLidas={marcarTodasLidas}
    >
      <Toaster position="top-center" />

      {loadingRequester ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Progress header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => step > 1 ? prevStep() : router.push('/chamados/arte')}
                className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={step > 1 ? 'Voltar passo anterior' : 'Voltar'}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide tabular-nums">
                  Passo {step} de {TOTAL_STEPS}
                </p>
                <p className="text-base font-bold text-gray-900 leading-tight mt-0.5">
                  {STEP_TITLES[step - 1]}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-label={`Passo ${step} de ${TOTAL_STEPS}`}
            >
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <WizardStep1Tipo
              selected={formData.type}
              onSelect={(type) => {
                updateForm('type', type)
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
        </div>
      )}
    </ChamadosLayout>
  )
}
