'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiClock, 
  HiArrowLeft, 
  HiDownload, 
  HiExclamationCircle,
  HiRefresh,
  HiEye,
  HiCalendar
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
  const [activeTab, setActiveTab] = useState<'musculacao' | 'crossfit'>('musculacao')

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

  if (!unit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <HiExclamationCircle className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-flex-dark mb-2">Unidade não encontrada</h1>
          <p className="text-flex-gray mb-6">A unidade solicitada não existe.</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-flex-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-flex-primary/90 transition-colors duration-200"
          >
            Voltar ao início
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header melhorado com espaçamento adequado */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <HiArrowLeft className="text-xl text-gray-600" />
              </motion.button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg"
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
                  className="text-flex-gray flex items-center gap-1"
                >
                  <HiCalendar className="text-sm" />
                  Horários de funcionamento e aulas
                </motion.p>
              </div>
            </div>
            
            <motion.button
              onClick={loadSchedules}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
            >
              <HiRefresh className={loading ? 'animate-spin' : ''} />
              Atualizar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content com melhor espaçamento */}
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-flex-gray font-medium">Carregando horários...</p>
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Layout especial para Alphaville com abas melhoradas */}
            {unit.id === 'alphaville' ? (
              <div className="space-y-6">
                {/* Abas de navegação melhoradas */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('musculacao')}
                      className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 relative ${
                        activeTab === 'musculacao'
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiClock className="text-lg" />
                        <span>Horário de Musculação</span>
                        {schedules.musculacao && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Disponível
                          </span>
                        )}
                      </div>
                      {activeTab === 'musculacao' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('crossfit')}
                      className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 relative ${
                        activeTab === 'crossfit'
                          ? 'bg-orange-50 text-orange-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiClock className="text-lg" />
                        <span>Horário de CrossFit</span>
                        {schedules.crossfit && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Disponível
                          </span>
                        )}
                      </div>
                      {activeTab === 'crossfit' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Conteúdo das abas melhorado */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className={`p-6 ${
                    activeTab === 'musculacao' 
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10' 
                      : 'bg-gradient-to-r from-orange-500/10 to-orange-600/10'
                  } border-b border-gray-100`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-flex-dark flex items-center gap-2">
                        <HiClock className={activeTab === 'musculacao' ? 'text-blue-600' : 'text-orange-600'} />
                        Horários de {activeTab === 'musculacao' ? 'Musculação' : 'CrossFit'}
                      </h3>
                      {schedules[activeTab] && (
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-flex-gray">
                            Atualizado em {schedules[activeTab]!.updatedAt.toLocaleDateString('pt-BR')}
                          </span>
                          <motion.a
                            href={schedules[activeTab]!.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 shadow-md ${
                              activeTab === 'musculacao'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                          >
                            <HiEye />
                            Abrir PDF
                          </motion.a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {schedules[activeTab] ? (
                      <div className="space-y-4">
                        {/* Visualizador de PDF melhorado */}
                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
                          <iframe
                            src={`${schedules[activeTab]!.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                            className="w-full h-[500px] md:h-[600px]"
                            title={`Horários ${unit.displayName} - ${activeTab === 'musculacao' ? 'Musculação' : 'CrossFit'}`}
                          />
                        </div>
                        
                        {/* Informações adicionais */}
                        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-center">
                            <motion.a
                              href={schedules[activeTab]!.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                              <HiDownload />
                              Download PDF
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <HiClock className="mx-auto text-5xl text-gray-400 mb-4" />
                        <p className="text-flex-gray text-lg">
                          Horário de {activeTab === 'musculacao' ? 'musculação' : 'CrossFit'} não disponível
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Entre em contato conosco para mais informações
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              // Layout melhorado para outras unidades
              schedules.musculacao && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-flex-dark flex items-center gap-2">
                        <HiClock className="text-blue-600" />
                        Horários de Funcionamento
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-flex-gray">
                          Atualizado em {schedules.musculacao.updatedAt.toLocaleDateString('pt-BR')}
                        </span>
                        <motion.a
                          href={schedules.musculacao.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                        >
                          <HiEye />
                          Abrir PDF
                        </motion.a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Visualizador de PDF */}
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
                        <iframe
                          src={`${schedules.musculacao.imageUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                          className="w-full h-[600px] md:h-[700px]"
                          title={`Horários ${unit.displayName}`}
                        />
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm text-flex-gray">
                            Não consegue visualizar? Faça o download do arquivo ou abra em nova aba.
                          </p>
                        </div>
                        <motion.a
                          href={schedules.musculacao.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                        >
                          <HiDownload />
                          Download PDF
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Mensagem quando não há horários - melhorada */}
            {!schedules.musculacao && (unit.id !== 'alphaville' || !schedules.crossfit) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <HiClock className="mx-auto text-6xl text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-flex-dark mb-2">Horários não disponíveis</h2>
                <p className="text-flex-gray mb-6">
                  Os horários desta unidade ainda não foram cadastrados.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-blue-800 mb-2">Entre em contato conosco:</h4>
                  <p className="text-sm text-blue-700">
                    Nossa equipe está sempre pronta para ajudar com informações sobre horários e agendamentos.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Informações adicionais melhoradas */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-md"
            >
              <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                <HiExclamationCircle />
                Informações importantes
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Os horários podem sofrer alterações em feriados
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Para agendamento de aulas, consulte a recepção
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-amber-700">
                  
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Em caso de dúvidas, entre em contato conosco
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}