// src/app/politica-cookies/page.tsx
'use client'

import { motion } from 'framer-motion'
import { HiCog, HiShieldCheck, HiEye, HiChartBar } from 'react-icons/hi'
import { FaCookieBite, FaAd, FaUsers, FaLock } from 'react-icons/fa'
import { Wrench, Globe, ClipboardList } from 'lucide-react'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import { useCookieManager } from '@/hooks/useCookieManager'

export default function CookiePolicyPage() {
  const { resetConsent, preferences } = useCookieManager()
  const lastUpdated = "15 de Dezembro de 2024"

  const cookieCategories = [
    {
      id: "necessary",
      name: "Cookies Essenciais",
      icon: FaLock,
      color: "green",
      description: "Estes cookies são necessários para o funcionamento básico do website e não podem ser desabilitados.",
      purpose: "Garantir funcionalidades básicas e segurança",
      examples: [
        {
          name: "session_id",
          purpose: "Identificação da sessão do usuário",
          duration: "Sessão do navegador",
          provider: "Flex Fitness"
        },
        {
          name: "cookie_consent",
          purpose: "Armazenar suas preferências de cookies",
          duration: "1 ano",
          provider: "Flex Fitness"
        },
        {
          name: "csrf_token",
          purpose: "Proteção contra ataques de segurança",
          duration: "Sessão do navegador",
          provider: "Flex Fitness"
        }
      ]
    },
    {
      id: "analytics",
      name: "Cookies de Análise",
      icon: HiChartBar,
      color: "blue",
      description: "Estes cookies nos ajudam a entender como os visitantes interagem com nosso website, coletando e relatando informações anonimamente.",
      purpose: "Melhorar a experiência do usuário e performance do site",
      examples: [
        {
          name: "_ga",
          purpose: "Distinguir usuários únicos",
          duration: "2 anos",
          provider: "Google Analytics"
        },
        {
          name: "_ga_*",
          purpose: "Manter estado da sessão",
          duration: "2 anos",
          provider: "Google Analytics"
        },
        {
          name: "_hjid",
          purpose: "Identificação única do usuário no Hotjar",
          duration: "1 ano",
          provider: "Hotjar"
        },
        {
          name: "_hjIncludedInSessionSample",
          purpose: "Determinar se o usuário está incluído na amostra de dados",
          duration: "30 minutos",
          provider: "Hotjar"
        }
      ]
    },
    {
      id: "marketing",
      name: "Cookies de Marketing",
      icon: FaAd,
      color: "orange",
      description: "Estes cookies são utilizados para exibir anúncios relevantes para você e seus interesses. Também são usados para limitar o número de vezes que você vê um anúncio.",
      purpose: "Personalizar anúncios e medir eficácia de campanhas",
      examples: [
        {
          name: "_fbp",
          purpose: "Pixel de conversão do Facebook",
          duration: "3 meses",
          provider: "Meta (Facebook)"
        },
        {
          name: "ads_*",
          purpose: "Personalização de anúncios do Google",
          duration: "1 ano",
          provider: "Google Ads"
        },
        {
          name: "utm_*",
          purpose: "Rastreamento de origem de tráfego e campanhas",
          duration: "6 meses",
          provider: "Flex Fitness"
        }
      ]
    },
    {
      id: "functional",
      name: "Cookies Funcionais",
      icon: FaUsers,
      color: "purple",
      description: "Estes cookies permitem que o website forneça funcionalidades e personalização aprimoradas, como chat ao vivo e preferências de idioma.",
      purpose: "Melhorar funcionalidades e personalização",
      examples: [
        {
          name: "user_preferences",
          purpose: "Armazenar preferências do usuário (tema, idioma)",
          duration: "1 ano",
          provider: "Flex Fitness"
        },
        {
          name: "__zlcmid",
          purpose: "Chat de atendimento ao cliente",
          duration: "1 ano",
          provider: "Zendesk"
        },
        {
          name: "ZD-*",
          purpose: "Funcionalidades do sistema de suporte",
          duration: "Varia",
          provider: "Zendesk"
        }
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: "from-green-500/10 to-green-600/10 border-green-500/20 text-green-600",
      blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-600",
      orange: "from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-600",
      purple: "from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getCurrentStatus = (categoryId: string) => {
    if (categoryId === 'necessary') return { status: 'Sempre Ativo', color: 'text-green-600' }
    
    const isActive = preferences[categoryId as keyof typeof preferences]
    return {
      status: isActive ? 'Ativo' : 'Inativo',
      color: isActive ? 'text-green-600' : 'text-red-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-flex-dark to-flex-navy relative overflow-hidden">
        <div className="section-padding relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaCookieBite className="text-white text-3xl" />
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl gradient-text mb-6">
              POLÍTICA DE COOKIES
            </h1>
            
            <p className="text-xl text-flex-light/80 mb-4">
              Como utilizamos cookies para melhorar sua experiência
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20"
            >
              <p className="text-flex-light text-sm">
                <strong>Última atualização:</strong> {lastUpdated}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl flex items-center justify-center">
                  <FaCookieBite className="text-2xl text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-flex-dark">
                    O que são Cookies?
                  </h2>
                  <p className="text-flex-gray">
                    Tecnologia que melhora sua experiência online
                  </p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-flex-gray leading-relaxed mb-4">
                  Cookies são pequenos arquivos de texto que são colocados no seu dispositivo quando você 
                  visita nosso website. Eles são amplamente utilizados para fazer com que os websites 
                  funcionem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                </p>
                
                <p className="text-flex-gray leading-relaxed mb-4">
                  Na <strong>Flex Fitness Center</strong>, utilizamos cookies para melhorar sua experiência 
                  de navegação, personalizar conteúdo, analisar o tráfego do site e entender de onde nossos 
                  visitantes vêm.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiShieldCheck className="text-blue-600 text-xl" />
                    <h3 className="font-semibold text-blue-800">Seu Controle</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Você tem controle total sobre quais cookies aceitar. Pode alterar suas preferências 
                    a qualquer momento através do botão de configurações de cookies em nosso site.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cookie Categories */}
            <div className="space-y-8">
              {cookieCategories.map((category, index) => {
                const status = getCurrentStatus(category.id)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(category.color)} rounded-xl flex items-center justify-center border`}
                          >
                            <category.icon className="text-2xl" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-display font-bold text-flex-dark">
                                {category.name}
                              </h3>
                              <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.color} bg-current bg-opacity-10`}>
                                {status.status}
                              </span>
                            </div>
                            <p className="text-flex-gray mb-2">{category.description}</p>
                            <p className="text-sm text-flex-primary font-medium">
                              <strong>Finalidade:</strong> {category.purpose}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-flex-dark mb-4 flex items-center gap-2">
                          <HiEye className="text-flex-primary" />
                          Cookies Utilizados
                        </h4>
                        
                        <div className="space-y-4">
                          {category.examples.map((cookie, cookieIndex) => (
                            <motion.div
                              key={cookieIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: cookieIndex * 0.05 }}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-flex-primary/30 transition-all"
                            >
                              <div className="grid md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <span className="font-semibold text-flex-dark block mb-1">Nome:</span>
                                  <span className="text-flex-gray font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                    {cookie.name}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-flex-dark block mb-1">Finalidade:</span>
                                  <span className="text-flex-gray">{cookie.purpose}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-flex-dark block mb-1">Duração:</span>
                                  <span className="text-flex-gray">{cookie.duration}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-flex-dark block mb-1">Provedor:</span>
                                  <span className="text-flex-gray font-medium">{cookie.provider}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Cookie Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="bg-gradient-to-r from-flex-primary/5 to-flex-secondary/5 rounded-2xl p-8 border border-flex-primary/10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiCog className="text-white text-2xl" />
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold gradient-text mb-4">
                    Gerencie Seus Cookies
                  </h2>
                  <p className="text-flex-gray">
                    Você tem controle total sobre suas preferências de cookies
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-display text-lg font-bold text-flex-dark mb-4">
                      <span className="inline-flex items-center gap-2"><Wrench className="w-5 h-5" /> Configurar Cookies</span>
                    </h3>
                    <p className="text-flex-gray mb-4 text-sm">
                      Personalize quais tipos de cookies você deseja aceitar em nosso website.
                    </p>
                    <button
                      onClick={resetConsent}
                      className="w-full bg-flex-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-flex-secondary transition-colors duration-200"
                    >
                      Abrir Configurações
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-display text-lg font-bold text-flex-dark mb-4">
                      <span className="inline-flex items-center gap-2"><Globe className="w-5 h-5" /> Configurações do Navegador</span>
                    </h3>
                    <p className="text-flex-gray mb-4 text-sm">
                      Você também pode gerenciar cookies diretamente nas configurações do seu navegador.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-orange-500 rounded"></span>
                        <span className="text-flex-gray">Chrome: Configurações → Privacidade</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-500 rounded"></span>
                        <span className="text-flex-gray">Firefox: Preferências → Privacidade</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-500 rounded"></span>
                        <span className="text-flex-gray">Safari: Preferências → Privacidade</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Third Party Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Serviços de Terceiros
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-flex-dark">Google Analytics</h3>
                  <p className="text-flex-gray text-sm">
                    Utilizamos o Google Analytics para analisar o uso do nosso website. 
                    As informações coletadas são usadas para melhorar nossos serviços.
                  </p>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-flex-primary hover:text-flex-secondary transition-colors text-sm"
                  >
                    Ver Política do Google →
                  </a>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-flex-dark">Facebook Pixel</h3>
                  <p className="text-flex-gray text-sm">
                    O Facebook Pixel nos ajuda a medir a eficácia de nossas campanhas 
                    publicitárias e personalizar anúncios.
                  </p>
                  <a
                    href="https://www.facebook.com/privacy/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-flex-primary hover:text-flex-secondary transition-colors text-sm"
                  >
                    Ver Política do Facebook →
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Legal Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Base Legal e Seus Direitos
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Lei Geral de Proteção de Dados (LGPD)</h3>
                  <p className="text-flex-gray">
                    Esta política está em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). 
                    Processamos seus dados com base no consentimento para cookies não essenciais.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Seus Direitos</h3>
                  <ul className="text-flex-gray space-y-2">
                    <li className="flex items-start gap-2">
                      <HiShieldCheck className="text-green-500 text-base mt-0.5 flex-shrink-0" />
                      <span>Aceitar ou recusar cookies não essenciais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiShieldCheck className="text-green-500 text-base mt-0.5 flex-shrink-0" />
                      <span>Alterar suas preferências a qualquer momento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiShieldCheck className="text-green-500 text-base mt-0.5 flex-shrink-0" />
                      <span>Solicitar informações sobre dados coletados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiShieldCheck className="text-green-500 text-base mt-0.5 flex-shrink-0" />
                      <span>Excluir cookies do seu navegador</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Atualizações</h3>
                  <p className="text-flex-gray">
                    Esta política pode ser atualizada periodicamente. Recomendamos que você 
                    a revise regularmente para estar ciente de quaisquer alterações.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCookieBite className="text-2xl" />
                </div>
                
                <h2 className="font-display text-2xl font-bold mb-4">
                  Dúvidas sobre Cookies?
                </h2>
                <p className="mb-6 opacity-90">
                  Nossa equipe está pronta para esclarecer qualquer questão sobre nossa política de cookies
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="bg-white text-orange-500 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Falar no WhatsApp
                  </button>
                  <button
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-orange-500 transition-all"
                  >
                    Enviar E-mail
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Related Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-flex-dark mb-4 text-center">
                  Documentos Relacionados
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/privacy-policy"
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all text-flex-primary"
                  >
                    <HiShieldCheck />
                    Política de Privacidade
                  </a>
                  <a
                    href="/termos-de-uso"
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all text-flex-primary"
                  >
                    <ClipboardList className="w-4 h-4" /> Termos de Uso
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CookieSettingsButton />
    </div>
  )
}