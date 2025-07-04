// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiUpload, 
  HiTrash, 
  HiEye, 
  HiClock, 
  HiCheck,
  HiX,
  HiExclamationCircle
} from 'react-icons/hi'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ScheduleService } from '@/utils/scheduleService'
import { Schedule } from '@/types/schedule'

// Dados das unidades
const units = [
  { id: 'alphaville', name: 'Alphaville', displayName: 'Flex Fitness Alphaville' },
  { id: 'buena-vista', name: 'Buena Vista', displayName: 'Flex Fitness Buena Vista' },
  { id: 'marista', name: 'Marista', displayName: 'Flex Fitness Marista' },
  { id: 'palmas', name: 'Palmas', displayName: 'Flex Fitness Palmas' }
]

// Componente de Login
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error: any) {
      setError('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flex-primary to-flex-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-flex-primary to-flex-secondary rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <HiClock className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-2xl font-bold text-flex-dark mb-2">Área do Administrador</h1>
          <p className="text-flex-gray">Gerencie os horários das unidades</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-flex-dark mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-primary focus:border-transparent transition-all duration-200"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-flex-dark mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flex-primary focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <HiExclamationCircle />
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-flex-primary to-flex-secondary text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

// Componente principal do Admin
function AdminDashboard() {
  const [schedules, setSchedules] = useState<{ 
    [key: string]: { 
      musculacao: Schedule | null; 
      crossfit: Schedule | null 
    } 
  }>({})
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllSchedules()
  }, [])

  const loadAllSchedules = async () => {
    setLoading(true)
    const schedulesData: { [key: string]: { musculacao: Schedule | null; crossfit: Schedule | null } } = {}
    
    for (const unit of units) {
      try {
        const unitSchedules = await ScheduleService.getAllSchedules(unit.id)
        schedulesData[unit.id] = unitSchedules
      } catch (error) {
        console.error(`Error loading schedules for ${unit.id}:`, error)
        schedulesData[unit.id] = { musculacao: null, crossfit: null }
      }
    }
    
    setSchedules(schedulesData)
    setLoading(false)
  }

  const handleFileUpload = async (unitId: string, scheduleType: 'musculacao' | 'crossfit', file: File) => {
    if (!file.type.includes('pdf')) {
      alert('Por favor, selecione um arquivo PDF')
      return
    }

    const uploadKey = `${unitId}-${scheduleType}`
    setUploading(prev => ({ ...prev, [uploadKey]: true }))

    try {
      const unit = units.find(u => u.id === unitId)
      if (!unit) throw new Error('Unidade não encontrada')

      await ScheduleService.uploadSchedule(unitId, unit.displayName, scheduleType, file)
      
      // Recarregar os horários desta unidade
      const updatedSchedules = await ScheduleService.getAllSchedules(unitId)
      setSchedules(prev => ({ ...prev, [unitId]: updatedSchedules }))

      alert('Horário atualizado com sucesso!')
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer upload')
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleDelete = async (unitId: string, scheduleType: 'musculacao' | 'crossfit') => {
    if (!confirm('Tem certeza que deseja deletar este horário?')) return

    try {
      await ScheduleService.deleteSchedule(unitId, scheduleType)
      const updatedSchedules = await ScheduleService.getAllSchedules(unitId)
      setSchedules(prev => ({ ...prev, [unitId]: updatedSchedules }))
      alert('Horário deletado com sucesso!')
    } catch (error: any) {
      alert(error.message || 'Erro ao deletar horário')
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-flex-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-flex-primary to-flex-secondary rounded-lg flex items-center justify-center">
              <HiClock className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-flex-dark">Administrador de Horários</h1>
              <p className="text-sm text-flex-gray">Flex Fitness Center</p>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-flex-gray hover:text-red-600 transition-colors duration-200"
          >
            <HiX />
            Sair
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-flex-dark mb-2">Gerenciar Horários</h2>
          <p className="text-flex-gray">Faça upload dos PDFs de horários para cada unidade</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit, index) => {
            const unitSchedules = schedules[unit.id]
            const isUploadingMusculacao = uploading[`${unit.id}-musculacao`]
            const isUploadingCrossfit = uploading[`${unit.id}-crossfit`]

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header da unidade */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-flex-dark mb-1">
                    {unit.displayName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      unitSchedules.musculacao ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-flex-gray">
                      {unitSchedules.musculacao ? 'Horário musculação' : 'Sem horário musculação'}
                    </span>
                  </div>
                  {unit.id === 'alphaville' && (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        unitSchedules.crossfit ? 'bg-orange-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm text-flex-gray">
                        {unitSchedules.crossfit ? 'Horário CrossFit' : 'Sem horário CrossFit'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-6">
                  {/* Horário de Musculação */}
                  <div>
                    <h4 className="font-medium text-flex-dark mb-3">Horário de Musculação</h4>
                    {unitSchedules.musculacao ? (
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <HiCheck className="text-green-600 text-sm" />
                            <div>
                              <p className="font-medium text-green-800 text-sm">Horário ativo</p>
                              <p className="text-xs text-green-600">
                                Atualizado em {unitSchedules.musculacao.updatedAt.toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <motion.a
                            href={unitSchedules.musculacao.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                          >
                            <HiEye className="text-xs" />
                            Ver
                          </motion.a>

                          <motion.button
                            onClick={() => handleDelete(unit.id, 'musculacao')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                          >
                            <HiTrash className="text-xs" />
                            Deletar
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <HiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-xs text-flex-gray">Sem horário de musculação</p>
                      </div>
                    )}

                    {/* Upload área musculação */}
                    <div className="mt-3">
                      <label className="block">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(unit.id, 'musculacao', file)
                          }}
                          className="hidden"
                          disabled={isUploadingMusculacao}
                        />
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer
                            hover:border-flex-primary hover:bg-flex-primary/5 transition-all duration-200
                            ${isUploadingMusculacao ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {isUploadingMusculacao ? (
                            <div className="flex items-center justify-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-flex-primary border-t-transparent rounded-full"
                              />
                              <span className="text-flex-primary text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <HiUpload className="mx-auto text-lg text-gray-400 mb-1" />
                              <p className="text-xs font-medium text-flex-dark">
                                {unitSchedules.musculacao ? 'Substituir' : 'Upload'} horário musculação
                              </p>
                            </>
                          )}
                        </motion.div>
                      </label>
                    </div>
                  </div>

                  {/* Horário de CrossFit - APENAS para Alphaville */}
                  {unit.id === 'alphaville' && (
                    <div>
                      <h4 className="font-medium text-flex-dark mb-3">Horário de CrossFit</h4>
                      {unitSchedules.crossfit ? (
                        <div className="space-y-3">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <HiCheck className="text-orange-600 text-sm" />
                              <div>
                                <p className="font-medium text-orange-800 text-sm">Horário ativo</p>
                                <p className="text-xs text-orange-600">
                                  Atualizado em {unitSchedules.crossfit.updatedAt.toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <motion.a
                              href={unitSchedules.crossfit.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 transition-colors duration-200"
                            >
                              <HiEye className="text-xs" />
                              Ver
                            </motion.a>

                            <motion.button
                              onClick={() => handleDelete(unit.id, 'crossfit')}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                            >
                              <HiTrash className="text-xs" />
                              Deletar
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <HiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                          <p className="text-xs text-flex-gray">Sem horário de CrossFit</p>
                        </div>
                      )}

                      {/* Upload área CrossFit */}
                      <div className="mt-3">
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(unit.id, 'crossfit', file)
                            }}
                            className="hidden"
                            disabled={isUploadingCrossfit}
                          />
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer
                              hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-200
                              ${isUploadingCrossfit ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {isUploadingCrossfit ? (
                              <div className="flex items-center justify-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"
                                />
                                <span className="text-orange-500 text-sm">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <HiUpload className="mx-auto text-lg text-gray-400 mb-1" />
                                <p className="text-xs font-medium text-flex-dark">
                                  {unitSchedules.crossfit ? 'Substituir' : 'Upload'} horário CrossFit
                                </p>
                              </>
                            )}
                          </motion.div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Componente principal
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-flex-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return user ? <AdminDashboard /> : <LoginForm onLogin={() => {}} />
}