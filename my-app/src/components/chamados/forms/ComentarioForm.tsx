'use client'

import { useState, useRef } from 'react'
import { Send, Paperclip, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ChamadoUsuario } from '@/lib/chamados/types'
import { adicionarComentario } from '@/lib/chamados/services/comentarioService'

interface ComentarioFormProps {
  chamadoId: string
  usuario: ChamadoUsuario
  onSuccess?: () => void
}

export default function ComentarioForm({ chamadoId, usuario, onSuccess }: ComentarioFormProps) {
  const [texto, setTexto] = useState('')
  const [anexo, setAnexo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return

    setLoading(true)
    try {
      await adicionarComentario(chamadoId, texto.trim(), usuario, anexo || undefined)
      setTexto('')
      setAnexo(null)
      toast.success('Comentário adicionado')
      onSuccess?.()
    } catch (err) {
      toast.error('Erro ao adicionar comentário')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4">
      <textarea
        rows={3}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Adicione um comentário..."
        className="w-full text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none resize-none"
      />

      {anexo && (
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-3">
          <span className="text-xs text-gray-600 flex-1 truncate">{anexo.name}</span>
          <button type="button" onClick={() => setAnexo(null)}>
            <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setAnexo(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!texto.trim() || loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar
        </button>
      </div>
    </form>
  )
}
