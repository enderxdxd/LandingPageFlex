// src/app/normas-utilizacao/page.tsx
'use client'

import { HiDownload, HiPrinter } from 'react-icons/hi'

export default function NormasUtilizacaoPage() {
  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 pt-24">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Normas de Utilização Flex Academia
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
            NORMAS DE UTILIZAÇÃO FLEX ACADEMIA
          </h2>
          
          <p className="mb-6 text-gray-700">
            Ao aderir a qualquer contrato de utilização da Flex Academia, você concorda com a observância das seguintes normas:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.</h3>
              <p className="text-gray-700 mb-3">
                É expressamente proibida qualquer conduta do usuário dos serviços que não esteja de acordo com o objeto deste instrumento, que seja contrária à moral e aos bons costumes ou que, por qualquer forma, cause perturbação ao ambiente da Flex Academia, aos funcionários ou frequentadores, como, exemplificativamente:
              </p>
              <ul className="ml-6 space-y-1 text-gray-700">
                <li>a) a comercialização de produtos ou serviços nas dependências da FLEX ACADEMIA;</li>
                <li>b) o uso inadequado ou impróprio dos equipamentos;</li>
                <li>c) não repor os pesos utilizados nos respectivos locais;</li>
                <li>d) soltar ou bater os pesos no chão, gritar, ou utilizar palavras de baixo calão etc.;</li>
                <li>e) atitudes agressivas com outros clientes ou com funcionários da FLEX ACADEMIA;</li>
                <li>f) uso de roupas e calçados inadequados a prática de atividades físicas;</li>
                <li>g) permanecer sentado nos equipamentos enquanto não estiver treinando sendo obrigatório o revezamento com outros alunos;</li>
                <li>h) comer na área de treinamento;</li>
                <li>i) treinar descalço;</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.</h3>
              <p className="text-gray-700">
                O usuário dos serviços que cometer qualquer atitude, ofensa, agressão física e demais atos que infrinjam a Lei e/ou que resultem em prejuízo para a FLEX ACADEMIA, deverá ressarcir a mesma.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.</h3>
              <p className="text-gray-700">
                É vedada a entrada e a circulação de animais na FLEX ACADEMIA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.</h3>
              <p className="text-gray-700">
                Não é permitido circular pela FLEX ACADEMIA sem camisa ou camiseta.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.</h3>
              <p className="text-gray-700">
                Não é permitido fumar ou ingerir bebida alcoólica no interior da FLEX ACADEMIA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.</h3>
              <p className="text-gray-700">
                É terminantemente proibido o ingresso de pessoas portando armas de fogo no interior da FLEX ACADEMIA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7.</h3>
              <p className="text-gray-700">
                Não é permitido filmar ou fotografar no interior da FLEX ACADEMIA, salvo mediante autorização expressa da Direção.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8.</h3>
              <p className="text-gray-700">
                Filmagem usando tripé ou qualquer outro meio que atrapalhe ou gere reclamações de outros alunos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9.</h3>
              <p className="text-gray-700">
                Somente é permitido o uso de celular no interior da FLEX ACADEMIA no modo silencioso/vibratório.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10.</h3>
              <p className="text-gray-700">
                Os boxes/cabines de banho localizados no interior dos vestiários são de uso individual.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">11.</h3>
              <p className="text-gray-700">
                O usuário dos serviços deve utilizar adequadamente os serviços, equipamentos e bens da FLEX ACADEMIA, ficando obrigado a reparar quaisquer danos por ele causados a equipamentos, funcionários e/ou terceiros, podendo ter as suas a atividades suspensas até a efetiva reparação do dano.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">12.</h3>
              <p className="text-gray-700">
                É proibida a utilização das partes comuns da FLEX ACADEMIA, inclusive estacionamento, para a distribuição de propostas comerciais, folhetos, peças promocionais, cupons e expedientes deste gênero. São igualmente vedados eventos públicos, demonstração com mercadorias, propaganda com cartazes ou atividades de vendedores ambulantes, anunciadores, aliciadores em geral, rifas e/ou qualquer tipo de angariação de recursos financeiros, seja qual for a natureza ou produto, salvo se com autorização prévia e escrita da FLEX ACADEMIA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">13.</h3>
              <p className="text-gray-700">
                O usuário dos serviços que praticar, no interior da academia, atos de agressão física, ameaça, venda de substâncias ilícitas, roubo, furto e outros que configurem ilícitos penais, bem como atos cuja gravidade jus fique tal medida, a critério da FLEX ACADEMIA, estará sujeito à rescisão imediata e permanente do contrato, sem prejuízo das penalidades contratuais aplicáveis e do ressarcimento de perdas e danos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">14.</h3>
              <p className="text-gray-700">
                O usuário inadimplente com cheque(s) devolvido(s) não poderá em hipótese alguma fazer o pagamento com outro cheque, devendo ser quitado imediatamente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">15.</h3>
              <p className="text-gray-700">
                Usuários com histórico de devolução de cheques não poderão ter o plano renovado com a forma de pagamento cheque. Sendo aceito apenas cartão de crédito ou pagamento a vista.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">16.</h3>
              <p className="text-gray-700">
                O usuário dos serviços que mantiver condutas em desacordo com as obrigações do contrato e deste instrumento, não abrangidas pelo item, supra, estará sujeito a advertência verbal e, no caso de reincidência, à rescisão imediata e permanente do contrato, sem prejuízo das penalidades contratuais aplicáveis e do ressarcimento de perdas e danos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">17.</h3>
              <p className="text-gray-700">
                Na hipótese de haver espera para utilização dos aparelhos ergométricos, deverá ser respeitada a utilização máxima de 30 (trinta) minutos por usuário.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">18.</h3>
              <p className="text-gray-700">
                A FLEX ACADEMIA poderá permitir a atuação de personal trainers contratados pelos usuários dos serviços, desde que devidamente cadastrados junto à FLEX ACADEMIA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">19.</h3>
              <p className="text-gray-700">
                A utilização de guarda-volumes, se disponível, não implica dever de guarda da FLEX ACADEMIA, exceto nas hipóteses ora previstas, sendo vedado ao usuário dos serviços deixar seus pertences nos vestiários após a sua saída da FLEX. O usuário reconhece que a FLEX ACADEMIA poderá abrir o guarda-volumes ao final do dia e recolher os bens deixados, mantendo-os sob sua guarda pelo prazo de 30 dias. Decorrido este prazo, a FLEX ACADEMIA u lizará todos os procedimentos legais para liberação do dever de guarda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">20.</h3>
              <p className="text-gray-700">
                Para a utilização dos armários, se disponíveis, o usuário dos serviços, por questões de sua própria segurança e inviolabilidade do armário, deverá utilizar cadeado de sua propriedade, do tipo recomendado pela FLEX ACADEMIA, devendo ser consultada a unidade respectiva. Fica a FLEX ACADEMIA isenta de qualquer responsabilidade caso tal procedimento não seja obedecido (utilização de outro tipo de material para fechamento do armário).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">21.</h3>
              <p className="text-gray-700">
                A FLEX ACADEMIA funcionará durante os 12 (doze) meses do ano nos horários divulgados no website e na recepção de cada unidade. As unidades fecham nos feriados memoráveis federais, estaduais e municipais, caso em que não caberá ao usuário dos serviços extensão do prazo contratual.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">22.</h3>
              <p className="text-gray-700">
                As normas constantes dos avisos e orientações afixados no interior das instalações da FLEX ACADEMIA, que não estiverem contempladas neste instrumento, passam a fazer parte integrante do mesmo, sendo certo que o seu não cumprimento poderá acarretar na rescisão antecipada ou a não renovação do mesmo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">23.</h3>
              <p className="text-gray-700">
                Toda e qualquer sugestão, reclamação ou alteração deverá ser encaminhada, por escrito, à Administração, que analisará cada caso conforme critérios estabelecidos pela Direção.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">24.</h3>
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