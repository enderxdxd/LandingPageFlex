'use client'

import { Loader2, Send, Edit3, ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { NovoDesignRequestFormData, ArteUnidadeType, DesignRequestType } from '@/lib/arte/types'
import { TIPOS_ARTE, DESTINOS, ARTE_UNIDADES, DIAS_SEMANA, MESES, COMO_INSCREVER, CALL_TO_ACTIONS, PUBLICO_ALVO } from '@/lib/arte/constants'

interface WizardStep5RevisaoProps {
  formData: NovoDesignRequestFormData
  unidade: ArteUnidadeType
  submitting: boolean
  onSubmit: () => void
  onBack: () => void
  onEditStep: (step: number) => void
}

export default function WizardStep5Revisao({
  formData,
  unidade,
  submitting,
  onSubmit,
  onBack,
  onEditStep,
}: WizardStep5RevisaoProps) {
  const tipo = TIPOS_ARTE[formData.type as DesignRequestType]
  const f = formData.dynamicFields

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Revise seu pedido</h2>
        <p className="text-sm text-gray-500">Confira se está tudo certo antes de enviar</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Tipo */}
        <ReviewSection title="Tipo de arte" step={1} onEdit={onEditStep}>
          <p className="text-sm text-gray-900">{tipo?.emoji} {tipo?.label}</p>
        </ReviewSection>

        {/* Destinos */}
        <ReviewSection title="Destinos" step={2} onEdit={onEditStep}>
          <div className="flex flex-wrap gap-2">
            {formData.destinations.map(d => {
              const dest = DESTINOS[d]
              return (
                <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  {dest.emoji} {dest.label}
                </span>
              )
            })}
          </div>
        </ReviewSection>

        {/* Campos dinâmicos */}
        <ReviewSection title="Detalhes" step={3} onEdit={onEditStep}>
          <div className="space-y-2">
            {formData.type === 'aula-experimental' && (
              <>
                <ReviewField label="Aula" value={f.nomeAula as string} />
                <ReviewField label="Início" value={f.dataInicio ? format(new Date(f.dataInicio as string + 'T12:00:00'), "dd/MM/yyyy") : ''} />
                <ReviewField label="Dias" value={(f.diasSemana as string[] || []).map(d => DIAS_SEMANA.find(ds => ds.value === d)?.label).join(', ')} />
                <ReviewField label="Horário" value={f.horario as string} />
                <ReviewField label="Professor(es)" value={f.professores as string} />
                <ReviewField label="Unidade" value={ARTE_UNIDADES[f.unidadeAula as ArteUnidadeType]?.label || ''} />
              </>
            )}
            {formData.type === 'escala' && (
              <>
                <ReviewField label="Período" value={f.periodoVigencia as string} />
                {f.escalaTexto && <ReviewField label="Escala" value={(f.escalaTexto as string).substring(0, 100) + ((f.escalaTexto as string).length > 100 ? '...' : '')} />}
                <ReviewField label="Unidade" value={ARTE_UNIDADES[f.unidadeEscala as ArteUnidadeType]?.label || ''} />
              </>
            )}
            {formData.type === 'evento' && (
              <>
                <ReviewField label="Evento" value={f.nomeEvento as string} />
                <ReviewField label="Data" value={f.data ? format(new Date(f.data as string + 'T12:00:00'), "dd/MM/yyyy") : ''} />
                <ReviewField label="Horário" value={f.horario as string} />
                <ReviewField label="Local" value={f.local === 'todas' ? 'Todas as unidades' : ARTE_UNIDADES[f.local as ArteUnidadeType]?.label || ''} />
                <ReviewField label="Professor(es)" value={f.professores as string} />
                <ReviewField label="Descrição" value={f.descricaoCurta as string} />
                <ReviewField label="Inscrição" value={COMO_INSCREVER.find(c => c.value === f.comoInscrever)?.label || ''} />
              </>
            )}
            {formData.type === 'comunicado' && (
              <>
                <ReviewField label="Título" value={f.titulo as string} />
                <ReviewField label="Texto" value={(f.corpo as string || '').substring(0, 100) + ((f.corpo as string || '').length > 100 ? '...' : '')} />
                <ReviewField label="Urgência" value={f.urgencia === 'urgente' ? '🚨 Urgente' : '📋 Normal'} />
                <ReviewField label="Válido até" value={f.dataValidade ? format(new Date(f.dataValidade as string + 'T12:00:00'), "dd/MM/yyyy") : ''} />
              </>
            )}
            {formData.type === 'promocao' && (
              <>
                <ReviewField label="Promoção" value={f.nomePromocao as string} />
                <ReviewField label="Benefício" value={(f.descricaoBeneficio as string || '').substring(0, 80) + '...'} />
                <ReviewField label="Período" value={`${f.validaDe ? format(new Date(f.validaDe as string + 'T12:00:00'), "dd/MM") : ''} a ${f.validaAte ? format(new Date(f.validaAte as string + 'T12:00:00'), "dd/MM") : ''}`} />
                <ReviewField label="CTA" value={CALL_TO_ACTIONS.find(c => c.value === f.callToAction)?.label || ''} />
                <ReviewField label="Público" value={PUBLICO_ALVO.find(p => p.value === f.publicoAlvo)?.label || ''} />
              </>
            )}
            {formData.type === 'aniversariantes' && (
              <>
                <ReviewField label="Mês" value={MESES.find(m => m.value === f.mesReferencia)?.label || ''} />
                {f.listaTexto && <ReviewField label="Lista" value={(f.listaTexto as string).substring(0, 80) + '...'} />}
                <ReviewField label="Unidade" value={ARTE_UNIDADES[f.unidadeAniversariantes as ArteUnidadeType]?.label || ''} />
              </>
            )}
            {formData.type === 'outro' && (
              <>
                <ReviewField label="Título" value={f.titulo as string} />
                <ReviewField label="Descrição" value={(f.descricaoDetalhada as string || '').substring(0, 100) + '...'} />
              </>
            )}
          </div>
        </ReviewSection>

        {/* Detalhes finais */}
        <ReviewSection title="Observação e prazo" step={4} onEdit={onEditStep}>
          {formData.description && (
            <ReviewField label="Observação" value={formData.description} />
          )}
          {formData.referenceImages.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Referências:</span>
              <span className="text-xs text-blue-600 font-medium">{formData.referenceImages.length} imagem(ns)</span>
            </div>
          )}
          <ReviewField
            label="Prazo"
            value={formData.deadline ? format(new Date(formData.deadline + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''}
          />
        </ReviewSection>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
          Voltar e editar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 active:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar solicitação
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ==================== Helpers ====================

function ReviewSection({ title, step, onEdit, children }: {
  title: string; step: number; onEdit: (step: number) => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          Editar
        </button>
      </div>
      {children}
    </div>
  )
}

function ReviewField({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-500 shrink-0 min-w-[80px]">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  )
}
