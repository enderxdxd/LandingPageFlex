'use client'

import { useState, useRef } from 'react'
import { Send, Paperclip, X, Loader2, ImageIcon } from 'lucide-react'
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-white">
              {usuario.nome.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Input */}
          <div className="flex-1 min-w-0">
            <textarea
              rows={2}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva um comentário..."
              className="w-full text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none resize-none leading-relaxed bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Attachment preview */}
      {anexo && (
        <div className="mx-4 mb-2 flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
            {anexo.type.startsWith('image/') ? (
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <Paperclip className="w-3.5 h-3.5 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{anexo.name}</p>
            <p className="text-[10px] text-gray-400">{(anexo.size / 1024).toFixed(0)} KB</p>
          </div>
          <button type="button" onClick={() => setAnexo(null)} className="p-1 rounded-md hover:bg-gray-200 transition-colors">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center gap-1">
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
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Anexar arquivo"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!texto.trim() || loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar
        </button>
      </div>
    </form>
  )
}
