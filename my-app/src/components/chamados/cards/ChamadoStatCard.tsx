import { LucideIcon } from 'lucide-react'

interface ChamadoStatCardProps {
  titulo: string
  valor: number | string
  icon: LucideIcon
  cor: 'blue' | 'yellow' | 'green' | 'red'
  variacao?: number
}

const COR_MAP = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
}

export default function ChamadoStatCard({ titulo, valor, icon: Icon, cor, variacao }: ChamadoStatCardProps) {
  const cores = COR_MAP[cor]

  return (
    <div className={`bg-white rounded-xl border ${cores.border} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${cores.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${cores.icon}`} />
        </div>
        {variacao !== undefined && (
          <span className={`text-xs font-medium ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {variacao >= 0 ? '+' : ''}{variacao}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-gray-900">{valor}</p>
      <p className="text-xs text-gray-500 mt-1">{titulo}</p>
    </div>
  )
}
