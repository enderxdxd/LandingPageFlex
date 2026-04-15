'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, FileText, Calendar, MessageSquare } from 'lucide-react'
import { addBusinessDays, format, isWeekend, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface WizardStep4DetalhesProps {
  description: string
  referenceImages: File[]
  deadline: string
  onChangeDescription: (v: string) => void
  onChangeImages: (v: File[]) => void
  onChangeDeadline: (v: string) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Calcula a data mínima: 2 dias úteis a partir de hoje
 */
function getMinDeadline(): string {
  const min = addBusinessDays(new Date(), 2)
  return format(min, 'yyyy-MM-dd')
}

export default function WizardStep4Detalhes({
  description,
  referenceImages,
  deadline,
  onChangeDescription,
  onChangeImages,
  onChangeDeadline,
  onNext,
  onBack,
}: WizardStep4DetalhesProps) {
  const minDeadline = getMinDeadline()

  const onDrop = useCallback((files: File[]) => {
    const novos = [...referenceImages, ...files].slice(0, 5)
    onChangeImages(novos)
  }, [referenceImages, onChangeImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  const removeImage = (index: number) => {
    onChangeImages(referenceImages.filter((_, i) => i !== index))
  }

  const canContinue = !!deadline && deadline >= minDeadline

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Detalhes finais</h2>
        <p className="text-sm text-gray-500">Observações, referências e prazo</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Observação */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            Observação adicional
            <span className="text-xs text-gray-400 font-normal">opcional</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Alguma informação extra que ajude o designer? Ex: usar a mesma identidade visual da última arte..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
          />
        </div>

        {/* Referências */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            Imagens de referência
            <span className="text-xs text-gray-400 font-normal">opcional</span>
          </label>
          <p className="text-xs text-gray-400 mb-3 ml-6">
            Tem uma arte que gostou? Envie como referência para o designer
          </p>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-5 h-5 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Solte aqui' : 'Clique ou arraste imagens'}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG ou WebP, até 10MB cada (máx 5)</p>
            </div>
          </div>

          {referenceImages.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {referenceImages.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                  <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-right">{referenceImages.length}/5</p>
            </div>
          )}
        </div>

        {/* Prazo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Prazo desejado
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-3 ml-6">
            Mínimo de 2 dias úteis a partir de hoje
          </p>
          <input
            type="date"
            value={deadline}
            onChange={(e) => onChangeDeadline(e.target.value)}
            min={minDeadline}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {deadline && deadline < minDeadline && (
            <p className="text-xs text-red-500 mt-2">O prazo mínimo é {format(new Date(minDeadline + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })}</p>
          )}
        </div>
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
          Revisar pedido
        </button>
      </div>
    </div>
  )
}
