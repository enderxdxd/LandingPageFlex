'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIAS, UNIDADES } from '@/lib/chamados/constants'
import { CategoriaType, UnidadeType } from '@/lib/chamados/types'

interface DashboardChartsProps {
  porCategoria: Record<CategoriaType, number>
  porUnidade: Record<string, number>
}

const CORES_CATEGORIA = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6']
const CORES_UNIDADE = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']

export default function DashboardCharts({ porCategoria, porUnidade }: DashboardChartsProps) {
  const categoriaData = (Object.entries(porCategoria) as [CategoriaType, number][]).map(([key, value]) => ({
    name: CATEGORIAS[key]?.label || key,
    value,
  }))

  const unidadeData = (Object.entries(porUnidade) as [string, number][]).map(([key, value]) => ({
    name: UNIDADES[key as UnidadeType]?.label || key,
    chamados: value,
  }))

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Pie Chart - Por Categoria */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Por Categoria</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoriaData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {categoriaData.map((_, index) => (
                <Cell key={index} fill={CORES_CATEGORIA[index % CORES_CATEGORIA.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Por Unidade */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Por Unidade</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={unidadeData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="chamados" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
