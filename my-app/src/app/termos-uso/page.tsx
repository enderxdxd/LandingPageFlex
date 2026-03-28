// src/app/termos-de-uso/page.tsx
'use client'

import { motion } from 'framer-motion'
import { HiScale, HiShieldCheck, HiDocumentText, HiExclamation } from 'react-icons/hi'
import { FaGavel, FaHandshake, FaUserShield } from 'react-icons/fa'
import { Cookie } from 'lucide-react'
import CookieSettingsButton from '@/components/CookieSettingsButton'

export default function TermsOfUsePage() {
  const lastUpdated = "15 de Dezembro de 2024"

  const sections = [
    {
      id: "aceitacao",
      title: "1. Aceitação dos Termos",
      icon: FaHandshake,
      content: `Ao acessar e utilizar o site da Flex Fitness Center (flexfitness.com.br), você concorda em cumprir 
      e estar sujeito aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes 
      termos, não deve utilizar nosso website ou serviços.`
    },
    {
      id: "servicos",
      title: "2. Descrição dos Serviços",
      icon: HiDocumentText,
      content: `A Flex Fitness Center oferece serviços de academia, personal training, aulas coletivas, CrossFit, 
      natação e outros serviços relacionados à atividade física e bem-estar. Nosso website fornece informações 
      sobre nossos serviços, unidades, horários e permite o agendamento de visitas e contato com nossa equipe.`
    },
    {
      id: "cadastro",
      title: "3. Cadastro e Conta de Usuário",
      icon: FaUserShield,
      content: `Para acessar determinados serviços, você pode precisar criar uma conta. Você é responsável por 
      manter a confidencialidade de suas informações de login e por todas as atividades que ocorrem em sua conta. 
      Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.`
    },
    {
      id: "uso-permitido",
      title: "4. Uso Permitido",
      icon: HiShieldCheck,
      content: `Você concorda em usar nosso website apenas para fins legítimos e de acordo com estes Termos. 
      Você não deve usar o site de forma que possa danificar, desabilitar, sobrecarregar ou prejudicar o site 
      ou interferir no uso e aproveitamento do site por qualquer outra parte.`
    },
    {
      id: "propriedade-intelectual",
      title: "5. Propriedade Intelectual",
      icon: FaGavel,
      content: `Todo o conteúdo presente no site, incluindo mas não limitado a textos, gráficos, logos, imagens, 
      áudios, vídeos e software, é propriedade da Flex Fitness Center ou de seus licenciadores e está protegido 
      por leis de direitos autorais e outras leis de propriedade intelectual.`
    },
    {
      id: "responsabilidades",
      title: "6. Limitação de Responsabilidade",
      icon: HiExclamation,
      content: `A Flex Fitness Center não será responsável por quaisquer danos diretos, indiretos, incidentais, 
      especiais ou consequentes decorrentes do uso ou incapacidade de uso do website, mesmo que tenhamos sido 
      avisados da possibilidade de tais danos.`
    }
  ]

  const contractTerms = [
    {
      title: "Contratos de Serviços",
      items: [
        "Planos mensais, trimestrais, semestrais e anuais disponíveis",
        "Renovação automática conforme escolha do cliente",
        "Política de cancelamento de acordo com o Código de Defesa do Consumidor",
        "Direito de arrependimento de 7 dias para novos contratos"
      ]
    },
    {
      title: "Pagamentos e Reembolsos",
      items: [
        "Pagamentos processados através de meios seguros",
        "Reembolsos conforme política específica de cada modalidade",
        "Multas por rescisão antecipada conforme contrato",
        "Parcelamentos disponíveis para determinados planos"
      ]
    },
    {
      title: "Uso das Instalações",
      items: [
        "Respeito às regras internas de cada unidade",
        "Uso adequado dos equipamentos e instalações",
        "Cumprimento dos horários de funcionamento",
        "Apresentação de documento de identificação quando solicitado"
      ]
    }
  ]

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
              className="w-20 h-20 bg-gradient-to-br from-flex-primary to-flex-secondary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <HiScale className="text-white text-3xl" />
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl gradient-text mb-6">
              TERMOS DE USO
            </h1>
            
            <p className="text-xl text-flex-light/80 mb-4">
              Flex Fitness Center - Academia Premium
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
                <div className="w-12 h-12 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-xl flex items-center justify-center">
                  <HiDocumentText className="text-2xl text-flex-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-flex-dark">
                    Bem-vindo aos Nossos Termos
                  </h2>
                  <p className="text-flex-gray">
                    Leia atentamente antes de utilizar nossos serviços
                  </p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-flex-gray leading-relaxed">
                  Estes Termos de Uso estabelecem as regras e condições para a utilização do website 
                  e serviços da <strong>Flex Fitness Center</strong>, pessoa jurídica de direito privado, com sede em Goiânia/GO.
                </p>
                
                <p className="text-flex-gray leading-relaxed">
                  Ao acessar nosso website ou utilizar nossos serviços, você declara ter lido, 
                  compreendido e concordado com todos os termos aqui apresentados.
                </p>
              </div>
            </motion.div>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                      >
                        <section.icon className="text-2xl text-flex-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-flex-dark mb-2">
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-flex-gray leading-relaxed pl-16">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contract Terms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="bg-gradient-to-r from-flex-primary/5 to-flex-secondary/5 rounded-2xl p-8 border border-flex-primary/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold gradient-text mb-4">
                    Condições Contratuais
                  </h2>
                  <p className="text-flex-gray">
                    Termos específicos para nossos serviços de academia
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {contractTerms.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                    >
                      <h3 className="font-display text-lg font-bold text-flex-dark mb-4">
                        {term.title}
                      </h3>
                      <ul className="space-y-2">
                        {term.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-flex-gray">
                            <HiShieldCheck className="text-green-500 text-base mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Legal Disclaimers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                7. Disposições Gerais
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Modificações</h3>
                  <p className="text-flex-gray">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    As alterações entrarão em vigor imediatamente após a publicação no website.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Lei Aplicável</h3>
                  <p className="text-flex-gray">
                    Estes termos são regidos pelas leis da República Federativa do Brasil. 
                    Qualquer disputa será resolvida nos tribunais competentes de Goiânia/GO.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Contato</h3>
                  <p className="text-flex-gray">
                    Para dúvidas sobre estes termos, entre em contato através dos canais 
                    disponíveis em nosso website ou visite uma de nossas unidades.
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
              <div className="bg-gradient-to-r from-flex-primary to-flex-secondary rounded-2xl p-8 text-white">
                <h2 className="font-display text-2xl font-bold mb-4">
                  Dúvidas sobre os Termos?
                </h2>
                <p className="mb-6 opacity-90">
                  Nossa equipe está pronta para esclarecer qualquer questão
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="bg-white text-flex-primary px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Falar no WhatsApp
                  </button>
                  <button
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-flex-primary transition-all"
                  >
                    Visitar Unidade
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
                    href="/politica-cookies"
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all text-flex-primary"
                  >
                    <Cookie className="w-4 h-4" /> Política de Cookies
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