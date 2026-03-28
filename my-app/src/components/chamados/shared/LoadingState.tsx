import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  texto?: string
}

export default function LoadingState({ texto = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-sm text-gray-500">{texto}</p>
    </div>
  )
}
