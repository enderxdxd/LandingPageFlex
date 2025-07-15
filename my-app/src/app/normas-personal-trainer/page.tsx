// src/app/normas-personal-trainer/page.tsx
'use client'

import { HiDownload, HiPrinter } from 'react-icons/hi'
import { useEffect, useState } from 'react'

export default function NormasPersonalTrainerPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleExportPDF = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 pt-24">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Normas de Conduta de Personal Trainer
          </h1>

          {/* Actions */}
          <div className="flex gap-3 mb-6 no-print">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <HiDownload className="w-4 h-4" />
              Exportar PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <HiPrinter className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="print-area">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            NORMAS DE CONDUTA DE PERSONAL TRAINER
          </h2>
          
          <p className="mb-6 text-gray-700">
            Ao contratar o &quot;CONTRATO DE CESSÃO ONEROSA DE ESPAÇO E EQUIPAMENTOS&quot; (&quot;Termo&quot;), o Personal Trainer (&quot;Autorizado&quot;) concorda com as Normas de Utilização da Flex Academia, cujas regras são aplicáveis ao Personal Trainer Autorizado e seus alunos. Em caso de descumprimento destas normas, a Flex Academia poderá rescindir o Termo e não será responsabilizada.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.</h3>
              <p className="text-gray-700">
                O Autorizado declara estar ciente e concordar que, enquanto estiver ministrando aulas ou praticando as suas atividades físicas como Aluno, deverá seguir todas as regras estabelecidas nas Normas de Utilização Flex Academia aqui estabelecidas, além das já descritas no Termo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.</h3>
              <p className="text-gray-700">
                O Autorizado deverá prestar seus serviços com a estrita observância da boa técnica, visando à segurança e o bem estar de seus Alunos particulares, além de pautar suas atividades profissionais nos preceitos estabelecidos pelos Estatutos do CONFEF e do CREF e pelo Código de Ética do Profissional de Educação Física, bem como das Normas de Utilização Flex Academia e Termo de Personal Trainer, de maneira que condutas infratoras, desabonadoras e/ou prejudiciais às operações e à imagem da Flex Academia não serão admitidas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.</h3>
              <p className="text-gray-700">
                A Flex Academia permitirá a atuação do Autorizado nas dependências da Flex, caso este seja aderente ao Termo e cumpra as obrigações dele decorrentes, especialmente quanto ao seu registro e sua situação de regularidade perante o CREF- Conselho Regional de Educação Física, bem como sua responsabilidade técnica e profissional para com seu(s) Aluno(s) particular(es).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.</h3>
              <p className="text-gray-700">
                O cadastro do Autorizado é obrigatório e será efetuado a critério da Flex Academia, tendo como finalidade de identificação e registro dos profissionais, sem constituir qualquer recomendação da Flex Academia sobre a qualidade do trabalho desses profissionais.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.</h3>
              <p className="text-gray-700">
                O Autorizado somente poderá ministrar aulas para Alunos devidamente matriculados e com Plano ativo na Flex Academia, assim como o Autorizado também deverá estar com o Termo assinado e cadastro ativo na Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.</h3>
              <p className="text-gray-700">
                O Autorizado é inteiramente responsável pelos serviços prestados aos seus Alunos particulares, inclusive, por quaisquer danos ou prejuízos que venham a ser sofridos por seus alunos, por dolo ou culpa do Autorizado, restando a Flex Academia isenta de qualquer responsabilidade.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7.</h3>
              <p className="text-gray-700">
                É obrigatório o Autorizado estar munido da sua carteira de identidade profissional do CREF enquanto estiver ministrando aulas particulares no interior da Flex Academia, em especial, para a devida apresentação, pelo Autorizado, em eventual fiscalização pelo órgão de classe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8.</h3>
              <p className="text-gray-700">
                O Autorizado declara ter a qualificação profissional e registro junto ao CREF, devendo comprovar estar apto para exercer a atividade de &quot;Personal Trainer&quot;, sendo certo que qualquer irregularidade de documentação profissional do Autorizado, perante os órgãos competentes, facultará à Flex Academia a imediata resolução do presente Termo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9.</h3>
              <p className="text-gray-700">
                Fica vedado ao Autorizado compartilhar seu acesso às dependências da Flex Academia com terceiros, vez que as condições do Termo são individuais e intransferíveis, sob pena de ser cobrado do valor da diária não autorizada ou da aplicação de penalidades/advertências ou, ainda, da rescisão unilateral do Termo de Autorização.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10.</h3>
              <p className="text-gray-700">
                Fica vedado ao Autorizado ministrar aulas particulares com qualquer parte do corpo temporariamente imobilizada por meio de gessos, tipoias, botas ortopédicas e afins, vez que o Autorizado deve prestar suporte adequado aos seus Alunos particulares e não poderá fazê-lo com qualquer membro imobilizado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">11.</h3>
              <p className="text-gray-700">
                O Autorizado fica ciente que não é permitido a utilização do estacionamento em nenhuma unidade da Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">12.</h3>
              <p className="text-gray-700">
                Em caso de descumprimento de qualquer obrigação constante neste Termo e/ou nas Normas de Utilização Flex Academia, fica resguardado à Flex Academia o direito de não permitir o acesso do Autorizado pelo período de 12 meses contados da respectiva rescisão, podendo o Autorizado responder por eventuais perdas e danos causados à Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">13.</h3>
              <p className="text-gray-700">
                O Autorizado que, por ação ou omissão, vier a trazer quaisquer prejuízos à Flex Academia e/ou seus frequentadores, responderá pela reparação do dano causado em toda a sua extensão.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">14.</h3>
              <p className="text-gray-700">
                O Autorizado não poderá realizar avaliação física dos seus Alunos particulares no interior das Unidades Flex Academia, vez que a Flex Academia não dispõe de local exclusivo e específico para esta finalidade.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">15.</h3>
              <p className="text-gray-700">
                Não poderá o Autorizado utilizar as salas de ginásticas para ministrar aulas e supervisionar treinos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">16.</h3>
              <p className="text-gray-700">
                Enquanto o Autorizado estiver ministrando suas aulas particulares, é obrigatória a utilização de camisa da Flex Personal Trainer contendo o nome &quot;Personal Trainer&quot; para facilitar a sua identificação no interior das Unidades Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">17.</h3>
              <p className="text-gray-700">
                O Autorizado poderá ministrar aulas para até 3(três) Alunos no mesmo horário e deverá disponibilizar lista com os nomes dos seus Alunos, sempre que solicitado pela Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">18.</h3>
              <p className="text-gray-700">
                Não é permitido aos alunos treinarem descalços.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">19.</h3>
              <p className="text-gray-700">
                Não é permitido filmar ou fotografar o interior da academia e das aulas, salvo mediante autorização expressa da Direção.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">20.</h3>
              <p className="text-gray-700">
                Não é permitido a filmagem usando tripé ou qualquer outro meio que atrapalhe ou gere reclamações de outros alunos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">21.</h3>
              <p className="text-gray-700">
                Para que não se confunda a prestação de serviços de Personal Trainer e a prática de atividades físicas pessoais, o Autorizado somente poderá utilizar a camisa com o nome de &quot;Personal Trainer&quot; enquanto estiver ministrando suas aulas particulares.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">22.</h3>
              <p className="text-gray-700">
                Não é permitida a utilização de vestimentas ou adereços que obstruam a camisa de identificação do Autorizado como &quot;Personal Trainer&quot; enquanto este estiver ministrando suas aulas particulares.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">23.</h3>
              <p className="text-gray-700 mb-3">
                Nas dependências Flex Academia, não é permitida a utilização, pelo Autorizado, de camisas ou adereços que:
              </p>
              <ul className="ml-6 space-y-1 text-gray-700">
                <li>a. divulguem marcas de concorrentes ou que contenham nomes, propagandas, logomarcas, estampas ou textos diversos que se refiram a outras academias ou a outros empreendimentos do seguimento;</li>
                <li>b. apresentem risco à imagem da Flex Academia ou desconforto de seus frequentadores, tais como, mas não se limitando as, de cunho político, religioso, discriminatório ou que ofendam minorias ou outras que possam ser reputadas como nocivas à marca, à moral e aos bons costumes.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">24.</h3>
              <p className="text-gray-700">
                É obrigatória a utilização de camisa da Flex Personal Trainer e calça ou bermuda no padrão de cor Preta, enquanto o Autorizado estiver ministrando aulas particulares, para facilitar a identificação visual dos Autorizados nas Unidades Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">25.</h3>
              <p className="text-gray-700">
                Se o autorizado também for um aluno, é importante saber que qualquer débito relacionado a mensalidades ou taxas de personal trainer resultará no bloqueio de seu acesso à academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">26.</h3>
              <p className="text-gray-700">
                O Autorizado deverá pactuar o preço dos seus serviços de Personal Trainer diretamente com seus Alunos particulares, sendo certo que a Flex Academia não possui qualquer responsabilidade ou ingerência sobre as condições acordadas entre o Autorizado e seus Alunos, assim como não responderá por quaisquer obrigações de pagamento decorrentes do contrato firmado entre estes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">27.</h3>
              <p className="text-gray-700">
                Os serviços prestados pelo Autorizado aos seus Alunos deverão ocorrer durante o período em que a Flex Academia estiver aberta ao público geral, de acordo com o horário de funcionamento e a disponibilidade de cada Unidade Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">28.</h3>
              <p className="text-gray-700">
                É proibida a prática de orientação técnica de Personal Trainer por pessoa não autorizada e que não cumpra os requisitos exigidos pela legislação, pelo CREF e/ou pela Flex Academia, sob pena de ser considerado exercício ilegal da profissão, cabendo, ainda, a tomada de eventuais medidas cabíveis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">29.</h3>
              <p className="text-gray-700">
                O Autorizado dos serviços deve utilizar adequadamente os serviços, equipamentos e bens da FLEX ACADEMIA, ficando obrigado a reparar quaisquer danos por ele causados a equipamentos, funcionários e/ou terceiros, podendo ter as suas atividades suspensas até a efetiva reparação do dano.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">30.</h3>
              <p className="text-gray-700">
                Toda e qualquer sugestão, reclamação ou alteração deverá ser encaminhada, por escrito, à administração, que analisará cada caso conforme critérios estabelecidos pela direção da Flex Academia. Casos omissos neste regulamento deverão ser analisados pela direção da Flex Academia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">31.</h3>
              <p className="text-gray-700">
                Toda e qualquer sugestão, reclamação ou alteração deverá ser encaminhada, por escrito, à Administração, que analisará cada caso conforme critérios estabelecidos pela Direção.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">32.</h3>
              <p className="text-gray-700">
                Os casos omissos neste regulamento deverão ser analisados pela Direção.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}