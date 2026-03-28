import { LucideIcon, Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  titulo: string
  descricao: string
  acao?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon = Inbox, titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{titulo}</h3>
      <p className="text-sm text-gray-500 text-center max-w-md">{descricao}</p>
      {acao && (
        <button
          onClick={acao.onClick}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          {acao.label}
        </button>
      )}
    </div>
  )
}
