// src/app/normas-utilizacao/page.tsx
'use client'

import { motion } from 'framer-motion'
import { HiShieldCheck, HiUsers, HiCog } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { FaDumbbell, FaRunning, FaRegHandshake, FaBan } from 'react-icons/fa'
import { MdSecurity, MdGavel, MdWarning } from 'react-icons/md'

export default function NormasUtilizacaoPage() {
  const lastUpdated = "Janeiro de 2025"

  const normasCategories = [
    {
      id: "condutas-proibidas",
      name: "Condutas Proibidas",
      icon: FaBan,
      color: "red",
      description: "Comportamentos que não são permitidos nas dependências da Flex Academia",
      items: [
        "Comercialização de produtos ou serviços nas dependências da academia",
        "Uso inadequado ou impróprio dos equipamentos",
        "Não reposição dos pesos utilizados nos respectivos locais",
        "Soltar ou bater os pesos no chão, gritar, ou utilizar palavras de baixo calão",
        "Atitudes agressivas com outros clientes ou funcionários",
        "Uso de roupas e calçados inadequados para atividades físicas",
        "Permanecer sentado nos equipamentos sem treinar",
        "Comer na área de treinamento",
        "Treinar descalço"
      ]
    },
    {
      id: "normas-gerais",
      name: "Normas Gerais de Convivência",
      icon: HiUsers,
      color: "blue",
      description: "Regras básicas para uma convivência harmoniosa entre todos os frequentadores",
      items: [
        "É vedada a entrada e circulação de animais",
        "Não é permitido circular sem camisa ou camiseta",
        "Proibido fumar ou ingerir bebida alcoólica no interior da academia",
        "Terminantemente proibido o ingresso de pessoas portando armas de fogo",
        "Uso de celular apenas no modo silencioso/vibratório",
        "Boxes/cabines de banho são de uso individual",
        "Utilização adequada dos serviços, equipamentos e bens da academia"
      ]
    },
    {
      id: "atividades-comerciais",
      name: "Atividades Comerciais",
      icon: MdGavel,
      color: "orange",
      description: "Restrições relacionadas a atividades comerciais e promocionais",
      items: [
        "Proibida distribuição de propostas comerciais, folhetos e peças promocionais",
        "Vedados eventos públicos e demonstração com mercadorias",
        "Não é permitida propaganda com cartazes",
        "Proibidas atividades de vendedores ambulantes e anunciadores",
        "Vedadas rifas e angariação de recursos financeiros",
        "Exceções apenas com autorização prévia e escrita da academia"
      ]
    },
    {
      id: "equipamentos-tempo",
      name: "Uso de Equipamentos e Tempo",
      icon: FaDumbbell,
      color: "green",
      description: "Regras para uso adequado dos equipamentos e gestão do tempo",
      items: [
        "Utilização máxima de 30 minutos por usuário em aparelhos ergométricos quando há espera",
        "Obrigatório revezamento com outros alunos nos equipamentos",
        "Uso adequado e cuidadoso dos equipamentos",
        "Reparação obrigatória de danos causados aos equipamentos"
      ]
    },
    {
      id: "vestiarios-armarios",
      name: "Vestiários e Armários",
      icon: MdSecurity,
      color: "purple",
      description: "Normas para uso dos vestiários, armários e guarda-volumes",
      items: [
        "Guarda-volumes não implicam dever de guarda da academia",
        "Vedado deixar pertences nos vestiários após a saída",
        "Academia pode abrir guarda-volumes ao final do dia",
        "Bens recolhidos ficam sob guarda por 30 dias",
        "Para armários, utilizar cadeado próprio do tipo recomendado",
        "Academia isenta de responsabilidade por uso inadequado de fechamento"
      ]
    },
    {
      id: "filmagem-fotografia",
      name: "Filmagem e Fotografia",
      icon: HiExclamationTriangle,
      color: "yellow",
      description: "Regras sobre captação de imagem e som nas dependências",
      items: [
        "Não é permitido filmar ou fotografar sem autorização expressa da Direção",
        "Proibida filmagem com tripé ou equipamentos que atrapalhem outros alunos",
        "Qualquer gravação deve ter aprovação prévia por escrito"
      ]
    }
  ]

  const penalidades = [
    {
      type: "Advertência Verbal",
      description: "Primeira ocorrência de condutas inadequadas não graves",
      icon: MdWarning,
      color: "yellow"
    },
    {
      type: "Rescisão por Reincidência",
      description: "Repetição de condutas inadequadas após advertência",
      icon: HiExclamationTriangle,
      color: "orange"
    },
    {
      type: "Rescisão Imediata",
      description: "Atos de agressão, ameaça, venda de substâncias ilícitas, roubo, furto e outros ilícitos penais",
      icon: FaBan,
      color: "red"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: "from-red-500/10 to-red-600/10 border-red-500/20 text-red-600",
      blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-600",
      orange: "from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-600",
      green: "from-green-500/10 to-green-600/10 border-green-500/20 text-green-600",
      purple: "from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-600",
      yellow: "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 text-yellow-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-flex-dark to-flex-navy relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Floating fitness icons */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              {i % 2 === 0 ? '🏋️' : '💪'}
            </motion.div>
          ))}
        </div>

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
              <FaDumbbell className="text-white text-3xl" />
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl gradient-text mb-6">
              NORMAS DE UTILIZAÇÃO
            </h1>
            
            <p className="text-xl text-flex-light/80 mb-4">
              Regras para uma convivência harmoniosa na Flex Academia
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
                  <FaRegHandshake className="text-2xl text-flex-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-flex-dark">
                    Bem-vindo à Flex Academia
                  </h2>
                  <p className="text-flex-gray">
                    Conheça nossas normas de convivência
                  </p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-flex-gray leading-relaxed mb-4">
                  Ao aderir a qualquer contrato de utilização da Flex Academia, você concorda com a 
                  observância das seguintes normas. Estas regras foram estabelecidas para garantir 
                  um ambiente seguro, respeitoso e agradável para todos os nossos frequentadores.
                </p>
                
                <p className="text-flex-gray leading-relaxed mb-4">
                  O cumprimento dessas normas é fundamental para manter a qualidade dos nossos 
                  serviços e a harmonia entre todos os usuários da academia.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiShieldCheck className="text-blue-600 text-xl" />
                    <h3 className="font-semibold text-blue-800">Importante</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Este documento pode sofrer alterações a qualquer momento. Recomendamos 
                    consultar sempre a versão atualizada em nosso website.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Normas Categories */}
            <div className="space-y-8">
              {normasCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(category.color)} rounded-xl flex items-center justify-center border`}
                      >
                        <category.icon className="text-2xl" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-flex-dark mb-2">
                          {category.name}
                        </h3>
                        <p className="text-flex-gray">{category.description}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${getColorClasses(category.color).split(' ')[0]} ${getColorClasses(category.color).split(' ')[1]} mt-2 flex-shrink-0`}></div>
                            <p className="text-flex-gray text-sm leading-relaxed">{item}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Penalidades Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <MdGavel className="text-white text-2xl" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-display font-bold text-red-800 mb-4">
                    Penalidades
                  </h2>
                  <p className="text-red-700">
                    Consequências para o descumprimento das normas estabelecidas
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {penalidades.map((penalidade, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(penalidade.color)} rounded-xl flex items-center justify-center mb-4`}>
                        <penalidade.icon className="text-2xl" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-flex-dark mb-3">
                        {penalidade.type}
                      </h3>
                      <p className="text-flex-gray text-sm">
                        {penalidade.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Horário de Funcionamento */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Funcionamento da Academia
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-4 flex items-center gap-2">
                    <HiCog className="text-flex-primary" />
                    Horários de Funcionamento
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-flex-gray text-sm">
                        A Flex Academia funciona durante os 12 meses do ano nos horários 
                        divulgados no website e na recepção de cada unidade.
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Atenção:</strong> As unidades fecham nos feriados memoráveis 
                        federais, estaduais e municipais, sem extensão do prazo contratual.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-4 flex items-center gap-2">
                    <FaRunning className="text-flex-primary" />
                    Personal Trainers
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-flex-gray text-sm mb-3">
                      A Flex Academia poderá permitir a atuação de personal trainers 
                      contratados pelos usuários dos serviços.
                    </p>
                    <p className="text-flex-primary text-sm font-medium">
                      Requisito: Personal trainers devem estar devidamente cadastrados 
                      junto à Flex Academia.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Casos Omissos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Sugestões e Casos Omissos
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Comunicação com a Academia</h3>
                  <p className="text-flex-gray">
                    Toda e qualquer sugestão, reclamação ou alteração deverá ser encaminhada, 
                    por escrito, à Administração, que analisará cada caso conforme critérios 
                    estabelecidos pela Direção.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Situações Não Previstas</h3>
                  <p className="text-flex-gray">
                    Os casos omissos neste regulamento deverão ser analisados pela Direção da 
                    Flex Academia, que tomará as decisões conforme os princípios e valores da empresa.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiShieldCheck className="text-blue-600 text-xl" />
                    <h3 className="font-semibold text-blue-800">Avisos e Orientações</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    As normas constantes dos avisos e orientações afixados no interior das 
                    instalações da Flex Academia passam a fazer parte integrante deste regulamento.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}