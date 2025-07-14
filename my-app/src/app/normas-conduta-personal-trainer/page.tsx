// src/app/normas-personal-trainer/page.tsx
'use client'

import { motion } from 'framer-motion'
import { HiShieldCheck, HiUsers, HiAcademicCap } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { FaRunning, FaDumbbell, FaUserTie, FaBan, FaCamera } from 'react-icons/fa'
import { MdSecurity, MdGavel, MdWarning, MdSchedule } from 'react-icons/md'
import { GiClothes } from 'react-icons/gi'

export default function NormasPersonalTrainerPage() {
  const lastUpdated = "Janeiro de 2025"

  const normasCategories = [
    {
      id: "qualificacao-cadastro",
      name: "Qualificação e Cadastro",
      icon: HiAcademicCap,
      color: "blue",
      description: "Requisitos obrigatórios para atuar como Personal Trainer na Flex Academia",
      items: [
        "Cadastro obrigatório e efetuado a critério da Flex Academia",
        "Registro e situação de regularidade perante o CREF - Conselho Regional de Educação Física",
        "Comprovação de aptidão para exercer a atividade de Personal Trainer",
        "Porte obrigatório da carteira de identidade profissional do CREF durante as aulas",
        "Qualquer irregularidade de documentação facultará à Flex Academia a resolução imediata do termo"
      ]
    },
    {
      id: "prestacao-servicos",
      name: "Prestação de Serviços",
      icon: FaUserTie,
      color: "green",
      description: "Regras para a prestação adequada dos serviços de personal training",
      items: [
        "Prestar serviços com estrita observância da boa técnica, visando segurança e bem-estar dos alunos",
        "Pautar atividades profissionais nos preceitos do CONFEF, CREF e Código de Ética da Educação Física",
        "Somente ministrar aulas para alunos devidamente matriculados e com plano ativo",
        "Responsabilidade integral pelos serviços prestados aos alunos particulares",
        "Flex Academia isenta de responsabilidade por danos causados por dolo ou culpa do personal",
        "Disponibilizar lista com nomes dos alunos sempre que solicitado"
      ]
    },
    {
      id: "acesso-horarios",
      name: "Acesso e Horários",
      icon: MdSchedule,
      color: "purple",
      description: "Regras sobre acesso às dependências e horários de funcionamento",
      items: [
        "Vedado compartilhar acesso às dependências com terceiros",
        "Condições do termo são individuais e intransferíveis",
        "Serviços devem ocorrer durante o horário de funcionamento da academia",
        "Não é permitida a utilização do estacionamento em nenhuma unidade",
        "Cobrança de diária não autorizada ou aplicação de penalidades por descumprimento"
      ]
    },
    {
      id: "vestuario-identificacao",
      name: "Vestuário e Identificação",
      icon: GiClothes,
      color: "orange",
      description: "Normas sobre uniformização e identificação visual",
      items: [
        "Uso obrigatório de camisa de identificação com nome 'Personal Trainer'",
        "Permitido que a camisa contenha nome e logomarca do personal",
        "Padrão obrigatório: camisa Flex Personal Trainer e calça/bermuda preta",
        "Proibido uso de vestimentas que obstruam a identificação",
        "Vedado uso de camisas com marcas de concorrentes ou outras academias",
        "Proibidas estampas de cunho político, religioso, discriminatório ou ofensivo"
      ]
    },
    {
      id: "restricoes-atividades",
      name: "Restrições de Atividades",
      icon: FaBan,
      color: "red",
      description: "Atividades e situações expressamente proibidas",
      items: [
        "Não ministrar aulas com qualquer parte do corpo temporariamente imobilizada",
        "Proibida realização de avaliação física dos alunos nas dependências",
        "Não utilizar salas de ginástica para ministrar aulas ou supervisionar treinos",
        "Máximo de 3 alunos no mesmo horário",
        "Proibido treinar descalço ou permitir que alunos treinem descalços",
        "Não filmar ou fotografar sem autorização expressa da Direção",
        "Proibida filmagem com tripé ou equipamentos que atrapalhem outros alunos"
      ]
    },
    {
      id: "responsabilidades-financeiras",
      name: "Responsabilidades Financeiras",
      icon: MdGavel,
      color: "yellow",
      description: "Aspectos financeiros e responsabilidades econômicas",
      items: [
        "Personal deve pactuar preço dos serviços diretamente com seus alunos",
        "Flex Academia não possui responsabilidade sobre condições acordadas entre personal e aluno",
        "Academia não responde por obrigações de pagamento entre personal e aluno",
        "Qualquer débito relacionado a mensalidades ou taxas resultará no bloqueio de acesso",
        "Reparação obrigatória de danos causados a equipamentos, funcionários ou terceiros"
      ]
    }
  ]

  const penalidades = [
    {
      type: "Advertência",
      description: "Aplicação de penalidades por descumprimento das normas",
      icon: MdWarning,
      color: "yellow"
    },
    {
      type: "Suspensão Temporária",
      description: "Suspensão de atividades até reparação de danos causados",
      icon: HiExclamationTriangle,
      color: "orange"
    },
    {
      type: "Rescisão Unilateral",
      description: "Rescisão do termo por descumprimento de obrigações contratuais",
      icon: FaBan,
      color: "red"
    },
    {
      type: "Bloqueio de 12 Meses",
      description: "Proibição de acesso por 12 meses após rescisão por descumprimento",
      icon: MdSecurity,
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
              {i % 3 === 0 ? '🏃' : i % 3 === 1 ? '💪' : '🏋️'}
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
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaRunning className="text-white text-3xl" />
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl gradient-text mb-6">
              NORMAS PERSONAL TRAINER
            </h1>
            
            <p className="text-xl text-flex-light/80 mb-4">
              Diretrizes para Personal Trainers Autorizados na Flex Academia
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
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FaUserTie className="text-2xl text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-flex-dark">
                    Contrato de Cessão Onerosa de Espaço e Equipamentos
                  </h2>
                  <p className="text-flex-gray">
                    Normas para Personal Trainers Autorizados
                  </p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-flex-gray leading-relaxed mb-4">
                  Ao contratar o "Contrato de Cessão Onerosa de Espaço e Equipamentos", 
                  o Personal Trainer ("Autorizado") concorda com as Normas de Utilização da 
                  Flex Academia, cujas regras são aplicáveis ao Personal Trainer Autorizado e seus alunos.
                </p>
                
                <p className="text-flex-gray leading-relaxed mb-4">
                  Em caso de descumprimento destas normas, a Flex Academia poderá rescindir 
                  o Termo e não será responsabilizada por qualquer consequência decorrente.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiExclamationTriangle className="text-red-600 text-xl" />
                    <h3 className="font-semibold text-red-800">Importante</h3>
                  </div>
                  <p className="text-red-700 text-sm">
                    Condutas infratoras, desabonadoras e/ou prejudiciais às operações e à 
                    imagem da Flex Academia não serão admitidas e podem resultar em rescisão imediata.
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
                    Penalidades e Consequências
                  </h2>
                  <p className="text-red-700">
                    Medidas aplicáveis em caso de descumprimento das normas
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Responsabilidades Especiais */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Responsabilidades Especiais
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-4 flex items-center gap-2">
                    <HiShieldCheck className="text-green-600" />
                    Responsabilidade Técnica
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Inteira responsabilidade:</strong> O personal trainer é 
                        inteiramente responsável pelos serviços prestados aos seus alunos 
                        particulares, inclusive por quaisquer danos ou prejuízos sofridos 
                        por seus alunos.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Isenção da academia:</strong> A Flex Academia resta isenta 
                        de qualquer responsabilidade por danos causados por dolo ou culpa 
                        do personal trainer.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-4 flex items-center gap-2">
                    <FaCamera className="text-orange-600" />
                    Filmagem e Fotografia
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Autorização necessária:</strong> Não é permitido filmar ou 
                        fotografar o interior da academia e das aulas, salvo mediante 
                        autorização expressa da Direção.
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">
                        <strong>Equipamentos proibidos:</strong> Não é permitida filmagem 
                        usando tripé ou qualquer meio que atrapalhe ou gere reclamações 
                        de outros alunos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Diferenciação de Atividades */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Diferenciação de Atividades
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <GiClothes className="text-purple-600 text-2xl" />
                    <h3 className="font-semibold text-purple-800">Uso da Camisa de Identificação</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-purple-700 text-sm">
                      <strong>Durante as aulas:</strong> O personal trainer somente poderá utilizar 
                      a camisa com o nome "Personal Trainer" enquanto estiver ministrando suas aulas particulares.
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Atividades pessoais:</strong> Para que não se confunda a prestação de 
                      serviços de Personal Trainer e a prática de atividades físicas pessoais, a 
                      identificação deve ser usada apenas durante o trabalho.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-flex-dark mb-3">Vestuário Obrigatório</h4>
                    <ul className="space-y-2 text-flex-gray text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Camisa da Flex Personal Trainer
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Calça ou bermuda no padrão cor preta
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Identificação sempre visível
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-flex-dark mb-3">Restrições de Vestuário</h4>
                    <ul className="space-y-2 text-flex-gray text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Marcas de concorrentes
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Conteúdo político ou religioso
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Material discriminatório ou ofensivo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comunicação e Casos Omissos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-display font-bold text-flex-dark mb-6">
                Comunicação e Casos Omissos
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Sugestões e Reclamações</h3>
                  <p className="text-flex-gray">
                    Toda e qualquer sugestão, reclamação ou alteração deverá ser encaminhada, 
                    por escrito, à Administração, que analisará cada caso conforme critérios 
                    estabelecidos pela Direção da Flex Academia.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-flex-dark mb-2">Situações Não Previstas</h3>
                  <p className="text-flex-gray">
                    Os casos omissos neste regulamento deverão ser analisados pela Direção da 
                    Flex Academia, que aplicará os princípios e valores da empresa.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiShieldCheck className="text-blue-600 text-xl" />
                    <h3 className="font-semibold text-blue-800">Atualizações</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Este documento pode sofrer alterações a qualquer momento. Sempre consulte 
                    a versão atualizada no website da Flex Academia.
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