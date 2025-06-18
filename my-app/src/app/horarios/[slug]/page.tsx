// app/horarios/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiClock, 
  HiArrowLeft, 
  HiDownload, 
  HiExclamationCircle,
  HiRefresh 
} from 'react-icons/hi'
import { ScheduleService } from '@/utils/scheduleService'
import { Schedule } from '@/types/schedule'

// Mapeamento de slugs para dados das unidades
const unitMap: { [key: string]: { id: string; name: string; displayName: string} } = {
  'alphaville': {
    id: 'alphaville',
    name: 'Alphaville',
    displayName: 'Flex Fitness Alphaville',
    
  },
  'buena-vista': {
    id: 'buena-vista',
    name: 'Buena Vista',
    displayName: 'Flex Fitness Buena Vista',
  },
  'marista': {
    id: 'marista',
    name: 'Marista',
    displayName: 'Flex Fitness Marista',
   
  },
  'palmas': {
    id: 'palmas',
    name: 'Palmas',
    displayName: 'Flex Fitness Palmas',
  
  }
}

export default function SchedulePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  
  const [schedules, setSchedules] = useState<{ musculacao: Schedule | null; crossfit: Schedule | null }>({ musculacao: null, crossfit: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const unit = unitMap[slug]

  useEffect(() => {
    if (!unit) {
      setError('Unidade não encontrada')
      setLoading(false)
      return
    }

    loadSchedules()
  }, [slug, unit])

  const loadSchedules = async () => {
    if (!unit) return

    setLoading(true)
    setError(null)

    try {
      const schedulesData = await ScheduleService.getAllSchedules(unit.id)
      setSchedules(schedulesData)
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar horários')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (scheduleType: 'musculacao' | 'crossfit') => {
    const schedule = schedules[scheduleType]
    if (schedule?.imageUrl) {
      window.open(schedule.imageUrl, '_blank')
    }
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <HiExclamationCircle className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-flex-dark mb-2">Unidade não encontrada</h1>
          <p className="text-flex-gray mb-6">A unidade solicitada não existe.</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-flex-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            Voltar ao início
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-flex-gray hover:text-flex-primary transition-colors duration-200 mb-4"
          >
            <HiArrowLeft />
            Voltar
          </motion.button>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center"
            >
              <HiClock className="text-white text-2xl" />
            </motion.div>
            
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-flex-dark mb-1"
              >
                {unit.displayName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-flex-gray"
              >
                Horários de funcionamento e aulas
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-flex-gray">Carregando horários...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <HiExclamationCircle className="mx-auto text-6xl text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-flex-dark mb-2">Erro ao carregar</h2>
            <p className="text-flex-gray mb-6">{error}</p>
            <motion.button
              onClick={loadSchedules}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-flex-primary text-white px-6 py-3 rounded-lg font-medium mx-auto"
            >
              <HiRefresh />
              Tentar novamente
            </motion.button>
          </motion.div>
        ) : !schedules ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <HiClock className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-flex-dark mb-2">Horários não disponíveis</h2>
            <p className="text-flex-gray mb-6">
              Os horários desta unidade ainda não foram cadastrados.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Entre em contato conosco:</strong>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Info da unidade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                 
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={loadSchedules}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-gray-100 text-flex-dark px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <HiRefresh />
                    Atualizar
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Horários - Layout diferente para Alphaville */}
            {unit.id === 'alphaville' ? (
              // Layout especial para Alphaville com abas
              <div className="space-y-6">
                {/* Abas de navegação */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                        schedules.musculacao 
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => {
                        if (schedules.musculacao) {
                          document.getElementById('musculacao-tab')?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      Horário de Musculação
                      {schedules.musculacao && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Disponível
                        </span>
                      )}
                    </button>
                    <button
                      className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                        schedules.crossfit 
                          ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => {
                        if (schedules.crossfit) {
                          document.getElementById('crossfit-tab')?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      Horário de CrossFit
                      {schedules.crossfit && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Disponível
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Conteúdo das abas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Horário de Musculação */}
                  <div id="musculacao-tab" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-flex-dark">Horários de Musculação</h3>
                        {schedules.musculacao && (
                          <span className="text-xs text-flex-gray">
                            Atualizado em {schedules.musculacao.updatedAt.toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {schedules.musculacao ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="relative"
                        >
                          {/* Visualizador de PDF */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <iframe
                              src={`${schedules.musculacao.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                              className="w-full h-[400px]"
                              title={`Horários ${unit.displayName} - Musculação`}
                            />
                          </div>
                          
                          {/* Botão de download */}
                          <div className="mt-4 text-center">
                            <motion.a
                              href={schedules.musculacao.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                            >
                              <HiDownload />
                              Abrir PDF Musculação
                            </motion.a>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-8">
                          <HiClock className="mx-auto text-4xl text-gray-400 mb-4" />
                          <p className="text-flex-gray">Horário de musculação não disponível</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horário de CrossFit */}
                  <div id="crossfit-tab" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-flex-dark">Horários de CrossFit</h3>
                        {schedules.crossfit && (
                          <span className="text-xs text-flex-gray">
                            Atualizado em {schedules.crossfit.updatedAt.toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {schedules.crossfit ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="relative"
                        >
                          {/* Visualizador de PDF */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <iframe
                              src={`${schedules.crossfit.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                              className="w-full h-[400px]"
                              title={`Horários ${unit.displayName} - CrossFit`}
                            />
                          </div>
                          
                          {/* Botão de download */}
                          <div className="mt-4 text-center">
                            <motion.a
                              href={schedules.crossfit.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
                            >
                              <HiDownload />
                              Abrir PDF CrossFit
                            </motion.a>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-8">
                          <HiClock className="mx-auto text-4xl text-gray-400 mb-4" />
                          <p className="text-flex-gray">Horário de CrossFit não disponível</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Layout normal para outras unidades
              schedules.musculacao && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-flex-dark">Horários de Funcionamento</h3>
                      <span className="text-xs text-flex-gray">
                        Atualizado em {schedules.musculacao.updatedAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      {/* Visualizador de PDF */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <iframe
                          src={`${schedules.musculacao.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                          className="w-full h-[600px] md:h-[800px]"
                          title={`Horários ${unit.displayName} - Musculação`}
                        />
                      </div>
                      
                      {/* Fallback para dispositivos que não suportam iframe */}
                      <div className="mt-4 text-center">
                        <p className="text-sm text-flex-gray mb-3">
                          Não consegue visualizar? Faça o download do arquivo.
                        </p>
                        <motion.a
                          href={schedules.musculacao.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                        >
                          <HiDownload />
                          Abrir PDF Musculação
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )
            )}

            {/* Mensagem quando não há horários */}
            {!schedules.musculacao && (unit.id !== 'alphaville' || !schedules.crossfit) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <HiClock className="mx-auto text-6xl text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-flex-dark mb-2">Horários não disponíveis</h2>
                <p className="text-flex-gray mb-6">
                  Os horários desta unidade ainda não foram cadastrados.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Entre em contato conosco:</strong>
                  </p>
                
                </div>
              </motion.div>
            )}

            {/* Informações adicionais */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h4 className="font-semibold text-amber-800 mb-3">Informações importantes:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Os horários podem sofrer alterações em feriados</li>
                <li>• Para agendamento de aulas, consulte a recepção</li>
                <li>• Horários de funcionamento podem variar aos finais de semana</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}