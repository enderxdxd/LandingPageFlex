'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiCog, HiShieldCheck, HiInformationCircle, HiChevronDown, HiEye } from 'react-icons/hi'
import { FaCookieBite, FaChartBar, FaAd, FaUsers } from 'react-icons/fa'
import { Cookie } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface CookieCategory {
  id: keyof CookiePreferences
  name: string
  description: string
  icon: React.ElementType
  color: string
  required: boolean
  cookies: Array<{
    name: string
    purpose: string
    duration: string
    provider: string
  }>
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Cookies Essenciais',
    description: 'Necessários para o funcionamento básico do site. Não podem ser desabilitados.',
    icon: HiShieldCheck,
    color: 'green',
    required: true,
    cookies: [
      {
        name: 'session_id',
        purpose: 'Identificação da sessão do usuário',
        duration: 'Sessão',
        provider: 'Flex Fitness'
      },
      {
        name: 'cookie_consent',
        purpose: 'Armazena preferências de cookies',
        duration: '1 ano',
        provider: 'Flex Fitness'
      },
      {
        name: 'csrf_token',
        purpose: 'Proteção contra ataques CSRF',
        duration: 'Sessão',
        provider: 'Flex Fitness'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Cookies de Análise',
    description: 'Nos ajudam a entender como você interage com nosso site.',
    icon: FaChartBar,
    color: 'blue',
    required: false,
    cookies: [
      {
        name: '_ga',
        purpose: 'Distingue usuários únicos',
        duration: '2 anos',
        provider: 'Google Analytics'
      },
      {
        name: '_ga_*',
        purpose: 'Mantém estado da sessão',
        duration: '2 anos',
        provider: 'Google Analytics'
      },
      {
        name: 'hotjar_*',
        purpose: 'Análise de comportamento do usuário',
        duration: '1 ano',
        provider: 'Hotjar'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Cookies de Marketing',
    description: 'Utilizados para personalizar anúncios e medir sua eficácia.',
    icon: FaAd,
    color: 'orange',
    required: false,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Pixel de conversão do Facebook',
        duration: '90 dias',
        provider: 'Meta (Facebook)'
      },
      {
        name: 'ads_*',
        purpose: 'Personalização de anúncios',
        duration: '1 ano',
        provider: 'Google Ads'
      },
      {
        name: 'utm_*',
        purpose: 'Rastreamento de campanhas',
        duration: '6 meses',
        provider: 'Flex Fitness'
      }
    ]
  },
  {
    id: 'functional',
    name: 'Cookies Funcionais',
    description: 'Permitem funcionalidades aprimoradas e personalização.',
    icon: FaUsers,
    color: 'purple',
    required: false,
    cookies: [
      {
        name: 'user_preferences',
        purpose: 'Preferências do usuário (tema, idioma)',
        duration: '1 ano',
        provider: 'Flex Fitness'
      },
      {
        name: 'chat_*',
        purpose: 'Chat de atendimento',
        duration: '30 dias',
        provider: 'Zendesk'
      }
    ]
  }
]

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Verificar se já existe consentimento
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Delay para aparecer depois que a página carrega
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    saveCookiePreferences(allPreferences)
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    saveCookiePreferences(minimalPreferences)
    setIsVisible(false)
  }

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }))

    // Aqui você implementaria a lógica para carregar/descarregar scripts
    // baseado nas preferências
    if (prefs.analytics) {
      // Carregar Google Analytics
      console.log('Loading analytics scripts...')
    }
    
    if (prefs.marketing) {
      // Carregar pixels de marketing
      console.log('Loading marketing scripts...')
    }
    
    if (prefs.functional) {
      // Carregar funcionalidades adicionais
      console.log('Loading functional scripts...')
    }
  }

  const togglePreference = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return // Não pode ser desabilitado
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const getCategoryIcon = (category: CookieCategory) => {
    const IconComponent = category.icon
    return <IconComponent className="text-lg" />
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      green: 'text-green-500 bg-green-500/10 border-green-500/20',
      blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ck-overlay"
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.3 }
            }}
            className={`ck-sheet ${showDetails ? 'ck-sheet-full' : ''}`}
          >
            {/* O cabeçalho tinha um ícone de biscoito girando em loop infinito,
                que nenhuma pessoa precisa ver e que `prefers-reduced-motion`
                não desligava. O título basta. */}
            <div className="ck-head">
              <h2 id="ck-title" className="ck-title">
                {showDetails ? 'Escolha o que permitir' : 'Cookies neste site'}
              </h2>
              <button
                type="button"
                onClick={handleRejectAll}
                aria-label="Recusar cookies opcionais e fechar"
                className="ck-close"
              >
                <HiX aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!showDetails ? (
                /* A versão anterior ocupava ~80% da primeira tela no celular:
                   quatro parágrafos de prosa jurídica e dois cartões de
                   "Proteção de Dados"/"Controle Total" empurravam a decisão
                   para baixo da dobra. Como 98% do acesso é por celular, o
                   primeiro contato de quase todo visitante com a marca era
                   esta parede. Agora: duas frases e as três saídas. */
                <div className="ck-body">
                  <p className="ck-text">
                    Usamos cookies para entender como o site é usado e para medir
                    nossas campanhas. Os necessários para o site funcionar são
                    sempre ativos; os demais só com o seu aceite.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="ck-link"
                  >
                    Escolher o que permitir
                  </button>
                </div>
              ) : (
                // Detailed view
                <div className="p-6">
                  <div className="mb-6">
                    <motion.button
                      whileHover={{ x: -5 }}
                      onClick={() => setShowDetails(false)}
                      className="flex items-center gap-2 text-flex-primary hover:text-flex-secondary transition-colors mb-4"
                    >
                      <HiChevronDown className="rotate-90" />
                      <span>Voltar</span>
                    </motion.button>
                    
                    <h3 className="text-lg font-semibold text-flex-dark mb-2">
                      Configurações Detalhadas de Cookies
                    </h3>
                    <p className="text-flex-gray text-sm">
                      Escolha quais tipos de cookies você deseja permitir em nosso site.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {cookieCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getCategoryColor(category.color)}`}>
                                {getCategoryIcon(category)}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-flex-dark">
                                    {category.name}
                                  </h4>
                                  {category.required && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      Obrigatório
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-flex-gray mt-1">
                                  {category.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedCategory(
                                  expandedCategory === category.id ? null : category.id
                                )}
                                className="p-2 text-flex-gray hover:text-flex-primary transition-colors"
                              >
                                <HiInformationCircle className="text-lg" />
                              </motion.button>

                              <motion.label 
                                className="relative inline-flex items-center cursor-pointer"
                                whileTap={{ scale: 0.95 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={preferences[category.id]}
                                  onChange={() => togglePreference(category.id)}
                                  disabled={category.required}
                                  className="sr-only peer"
                                />
                                <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                  preferences[category.id] 
                                    ? 'bg-gradient-to-r from-flex-primary to-flex-secondary' 
                                    : 'bg-gray-300'
                                } ${category.required ? 'opacity-50' : ''}`}>
                                  <motion.div
                                    className="absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ease-in-out"
                                    animate={{
                                      x: preferences[category.id] ? 20 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                                </div>
                              </motion.label>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedCategory === category.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-100 bg-gray-50/50"
                            >
                              <div className="p-4">
                                <h5 className="font-medium text-flex-dark mb-3 text-sm">
                                  Cookies utilizados:
                                </h5>
                                <div className="space-y-3">
                                  {category.cookies.map((cookie, cookieIndex) => (
                                    <motion.div
                                      key={cookieIndex}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: cookieIndex * 0.05 }}
                                      className="bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      <div className="grid md:grid-cols-4 gap-2 text-xs">
                                        <div>
                                          <span className="font-medium text-flex-dark block">Nome:</span>
                                          <span className="text-flex-gray font-mono">{cookie.name}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-flex-dark block">Finalidade:</span>
                                          <span className="text-flex-gray">{cookie.purpose}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-flex-dark block">Duração:</span>
                                          <span className="text-flex-gray">{cookie.duration}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-flex-dark block">Provedor:</span>
                                          <span className="text-flex-gray">{cookie.provider}</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aceitar e recusar com o MESMO peso visual. Antes, "Aceitar Todos"
                era um gradiente saturado com brilho animado e "Rejeitar Todos"
                um contorno apagado — desenho que empurra o consentimento, o
                oposto do que a LGPD pede de uma escolha livre. */}
            <div className="ck-foot">
              <div className="ck-actions">
                <button type="button" onClick={handleRejectAll} className="ck-btn">
                  Recusar opcionais
                </button>

                {showDetails && (
                  <button type="button" onClick={handleAcceptSelected} className="ck-btn">
                    Salvar escolha
                  </button>
                )}

                <button type="button" onClick={handleAcceptAll} className="ck-btn ck-btn-accent">
                  Aceitar todos
                </button>
              </div>

              <div className="ck-links">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="/privacy-policy"
                  className="hover:text-flex-primary transition-colors"
                >
                  Política de Privacidade
                </motion.a>
                <span>•</span>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="/termos-uso"
                  className="hover:text-flex-primary transition-colors"
                >
                  Termos de Uso
                </motion.a>
                <span>•</span>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="/politica-cookies"
                  className="hover:text-flex-primary transition-colors"
                >
                  Política de Cookies
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}