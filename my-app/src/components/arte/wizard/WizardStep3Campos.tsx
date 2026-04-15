'use client'

import type { DesignRequestType, ArteUnidadeType } from '@/lib/arte/types'
import { ARTE_UNIDADES, DIAS_SEMANA, MESES, COMO_INSCREVER, CALL_TO_ACTIONS, PUBLICO_ALVO } from '@/lib/arte/constants'
import { Check } from 'lucide-react'

interface WizardStep3CamposProps {
  type: DesignRequestType
  fields: Record<string, unknown>
  unidade: ArteUnidadeType
  onChange: (fields: Record<string, unknown>) => void
  onNext: () => void
  onBack: () => void
}

export default function WizardStep3Campos({ type, fields, unidade, onChange, onNext, onBack }: WizardStep3CamposProps) {
  const update = (key: string, value: unknown) => {
    onChange({ ...fields, [key]: value })
  }

  const hoje = new Date().toISOString().split('T')[0]

  const canContinue = validateFields(type, fields)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Detalhes do pedido</h2>
        <p className="text-sm text-gray-500">Preencha as informações específicas para o designer</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 mb-8">
        {type === 'aula-experimental' && (
          <>
            <InputField label="Nome da aula" placeholder="Ex: Ritmos, Pilates, Muay Thai" value={fields.nomeAula as string || ''} onChange={(v) => update('nomeAula', v)} required />
            <InputField label="Data de início" type="date" value={fields.dataInicio as string || ''} onChange={(v) => update('dataInicio', v)} min={hoje} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dias da semana <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {DIAS_SEMANA.map(dia => {
                  const selected = ((fields.diasSemana as string[]) || []).includes(dia.value)
                  return (
                    <button
                      key={dia.value}
                      type="button"
                      onClick={() => {
                        const current = (fields.diasSemana as string[]) || []
                        const next = selected ? current.filter(d => d !== dia.value) : [...current, dia.value]
                        update('diasSemana', next)
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                        selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {dia.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <InputField label="Horário" type="time" value={fields.horario as string || ''} onChange={(v) => update('horario', v)} required />
            <InputField label="Professor(es)" placeholder="Ex: Maria e João" value={fields.professores as string || ''} onChange={(v) => update('professores', v)} required />
            <SelectField label="Unidade onde acontece" value={fields.unidadeAula as string || unidade} onChange={(v) => update('unidadeAula', v)} options={Object.entries(ARTE_UNIDADES).map(([k, v]) => ({ value: k, label: v.label }))} required />
          </>
        )}

        {type === 'escala' && (
          <>
            <InputField label="Período de vigência" placeholder="Ex: Abril 2026" value={fields.periodoVigencia as string || ''} onChange={(v) => update('periodoVigencia', v)} required />
            <TextareaField label="Escala de aulas (pode colar o texto aqui)" placeholder="Escreva os horários e aulas da grade..." value={fields.escalaTexto as string || ''} onChange={(v) => update('escalaTexto', v)} rows={6} />
            <p className="text-xs text-gray-400">Ou envie como imagem/planilha no próximo passo (referências)</p>
            <SelectField label="Unidade" value={fields.unidadeEscala as string || unidade} onChange={(v) => update('unidadeEscala', v)} options={Object.entries(ARTE_UNIDADES).map(([k, v]) => ({ value: k, label: v.label }))} required />
          </>
        )}

        {type === 'evento' && (
          <>
            <InputField label="Nome do evento" placeholder="Ex: Aulão de Verão" value={fields.nomeEvento as string || ''} onChange={(v) => update('nomeEvento', v)} required />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Data" type="date" value={fields.data as string || ''} onChange={(v) => update('data', v)} min={hoje} required />
              <InputField label="Horário" type="time" value={fields.horario as string || ''} onChange={(v) => update('horario', v)} required />
            </div>
            <SelectField label="Local" value={fields.local as string || unidade} onChange={(v) => update('local', v)} options={[{ value: 'todas', label: 'Todas as unidades' }, ...Object.entries(ARTE_UNIDADES).map(([k, v]) => ({ value: k, label: v.label }))]} required />
            <InputField label="Professor(es) responsáveis" placeholder="Ex: Maria e João" value={fields.professores as string || ''} onChange={(v) => update('professores', v)} required />
            <TextareaField label="Descrição curta" placeholder="Breve descrição do evento (máx 200 caracteres)" value={fields.descricaoCurta as string || ''} onChange={(v) => update('descricaoCurta', v.slice(0, 200))} maxLength={200} required />
            <SelectField label="Como se inscrever" value={fields.comoInscrever as string || ''} onChange={(v) => update('comoInscrever', v)} options={COMO_INSCREVER} required />
            {(fields.comoInscrever === 'link' || fields.comoInscrever === 'outro') && (
              <InputField label={fields.comoInscrever === 'link' ? 'Link de inscrição' : 'Detalhes'} placeholder={fields.comoInscrever === 'link' ? 'https://...' : 'Descreva como se inscrever'} value={fields.comoInscreverDetalhe as string || ''} onChange={(v) => update('comoInscreverDetalhe', v)} required />
            )}
            <InputField label="Tema visual desejado" placeholder="Ex: tropical, minimalista... (opcional)" value={fields.temaVisual as string || ''} onChange={(v) => update('temaVisual', v)} />
          </>
        )}

        {type === 'comunicado' && (
          <>
            <InputField label="Título do comunicado" placeholder="Ex: Horário especial de Carnaval" value={fields.titulo as string || ''} onChange={(v) => update('titulo', v)} required />
            <TextareaField label="Corpo do texto" placeholder="Escreva o texto completo do comunicado..." value={fields.corpo as string || ''} onChange={(v) => update('corpo', v)} rows={5} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgência <span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                {['normal', 'urgente'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('urgencia', opt)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      fields.urgencia === opt
                        ? opt === 'urgente' ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {opt === 'normal' ? '📋 Normal' : '🚨 Urgente'}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Data de validade (quando parar de exibir)" type="date" value={fields.dataValidade as string || ''} onChange={(v) => update('dataValidade', v)} min={hoje} required />
          </>
        )}

        {type === 'promocao' && (
          <>
            <InputField label="Nome da promoção" placeholder="Ex: Matrícula Grátis" value={fields.nomePromocao as string || ''} onChange={(v) => update('nomePromocao', v)} required />
            <TextareaField label="Descrição do benefício" placeholder="O que o aluno ganha?" value={fields.descricaoBeneficio as string || ''} onChange={(v) => update('descricaoBeneficio', v)} required />
            <TextareaField label="Condições" placeholder="Quais são as condições para participar?" value={fields.condicoes as string || ''} onChange={(v) => update('condicoes', v)} required />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Válida de" type="date" value={fields.validaDe as string || ''} onChange={(v) => update('validaDe', v)} required />
              <InputField label="Válida até" type="date" value={fields.validaAte as string || ''} onChange={(v) => update('validaAte', v)} required />
            </div>
            <SelectField label="Chamada para ação" value={fields.callToAction as string || ''} onChange={(v) => update('callToAction', v)} options={CALL_TO_ACTIONS} required />
            {fields.callToAction === 'outro' && (
              <InputField label="Qual chamada?" placeholder="Ex: Ligue agora" value={fields.callToActionOutro as string || ''} onChange={(v) => update('callToActionOutro', v)} required />
            )}
            <SelectField label="Público-alvo" value={fields.publicoAlvo as string || ''} onChange={(v) => update('publicoAlvo', v)} options={PUBLICO_ALVO} required />
          </>
        )}

        {type === 'aniversariantes' && (
          <>
            <SelectField label="Mês de referência" value={fields.mesReferencia as string || ''} onChange={(v) => update('mesReferencia', v)} options={MESES} required />
            <TextareaField label="Lista de aniversariantes (pode colar aqui)" placeholder="Nome - dia/mês&#10;Maria - 05/04&#10;João - 12/04" value={fields.listaTexto as string || ''} onChange={(v) => update('listaTexto', v)} rows={6} />
            <p className="text-xs text-gray-400">Ou envie como imagem/planilha no próximo passo</p>
            <SelectField label="Unidade" value={fields.unidadeAniversariantes as string || unidade} onChange={(v) => update('unidadeAniversariantes', v)} options={Object.entries(ARTE_UNIDADES).map(([k, v]) => ({ value: k, label: v.label }))} required />
          </>
        )}

        {type === 'outro' && (
          <>
            <InputField label="Título" placeholder="Descreva em poucas palavras o que precisa" value={fields.titulo as string || ''} onChange={(v) => update('titulo', v)} required />
            <div>
              <TextareaField label="Descrição detalhada" placeholder="Descreva exatamente o que você precisa. Quanto mais detalhes melhor!" value={fields.descricaoDetalhada as string || ''} onChange={(v) => update('descricaoDetalhada', v)} rows={6} required minLength={100} />
              <p className={`text-xs mt-1 ${
                (fields.descricaoDetalhada as string || '').length < 100 ? 'text-red-500' : 'text-green-600'
              }`}>
                {(fields.descricaoDetalhada as string || '').length}/100 caracteres (mínimo 100)
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

// ==================== Helpers ====================

function InputField({ label, type = 'text', value, onChange, placeholder, required, min, maxLength, minLength }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; min?: string; maxLength?: number; minLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        maxLength={maxLength}
        minLength={minLength}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows = 3, required, maxLength, minLength }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; required?: boolean; maxLength?: number; minLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right mt-1">{value.length}/{maxLength}</p>
      )}
    </div>
  )
}

function SelectField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Selecione...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// ==================== Validação por tipo ====================

function validateFields(type: DesignRequestType, fields: Record<string, unknown>): boolean {
  switch (type) {
    case 'aula-experimental':
      return !!(fields.nomeAula && fields.dataInicio && (fields.diasSemana as string[] || []).length > 0 && fields.horario && fields.professores)
    case 'escala':
      return !!(fields.periodoVigencia && (fields.escalaTexto || fields.escalaArquivo))
    case 'evento':
      return !!(fields.nomeEvento && fields.data && fields.horario && fields.local && fields.professores && fields.descricaoCurta && fields.comoInscrever)
    case 'comunicado':
      return !!(fields.titulo && fields.corpo && fields.urgencia && fields.dataValidade)
    case 'promocao':
      return !!(fields.nomePromocao && fields.descricaoBeneficio && fields.condicoes && fields.validaDe && fields.validaAte && fields.callToAction && fields.publicoAlvo)
    case 'aniversariantes':
      return !!(fields.mesReferencia && (fields.listaTexto || fields.listaArquivo))
    case 'outro':
      return !!(fields.titulo && (fields.descricaoDetalhada as string || '').length >= 100)
    default:
      return false
  }
}
