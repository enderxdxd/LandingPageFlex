'use client'

import { motion } from 'framer-motion'
import CookieSettingsButton from '@/components/CookieSettingsButton'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="font-elegant text-4xl md:text-5xl gradient-text mb-8">
              Política de Privacidade
            </h1>
            
            <div className="prose prose-lg max-w-none font-body space-y-6">
              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Introdução</h2>
                <p>
                  A sua privacidade é importante para nós. Faz parte da política de privacidade da 
                  <strong> Evolution Flex Fitness Center</strong> respeitar a sua privacidade em relação 
                  a qualquer informação sua que possamos coletar no site da Flex Fitness Center.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Coleta de Dados Pessoais</h2>
                <p>
                  Solicitamos informações pessoais apenas quando absolutamente necessário para fornecer 
                  um serviço, atendimento ou uma melhor experiência para você. Coletamos esses dados de 
                  maneira legal, com seu conhecimento e consentimento, quando aplicável. Além disso, 
                  informamos claramente a finalidade do tratamento dessas informações.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Uso dos Dados Pessoais</h2>
                
                <h3 className="font-elegant text-xl text-flex-secondary mb-3">Finalidades Específicas para o Uso dos Dados</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-flex-dark">Comunicação com o cliente:</h4>
                    <p>Obter o nome completo, e-mail, telefone, cidade e estado do cliente para fins de comunicação e sua identificação como usuário do Website.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-flex-dark">Verificação de identidade:</h4>
                    <p>Podemos usar os Dados Pessoais para verificar quem é o cliente ou quem deseja ser membro. Por exemplo, é possível que verifiquemos a idade do cliente, ou se este obteve uma permissão dos pais ou responsáveis para usar o Website.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-flex-dark">Envio de materiais de marketing:</h4>
                    <p>Podemos enviar materiais de marketing, tais como e-mails promocionais ou informativos sobre modalidades, para manter o cliente informado de nossos próximos lançamentos e promoções. O cliente geralmente precisa optar por receber nossos materiais de marketing, podendo cancelar o recebimento a qualquer momento.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-flex-dark">Resposta às perguntas do cliente e atendimento às suas solicitações:</h4>
                    <p>Podemos enviar comunicados a pedido do cliente ou se este consentir de outra forma.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-flex-dark">Fornecimento de suporte e recebimento de feedback:</h4>
                    <p>Podemos solicitar os Dados Pessoais para prestar suporte ao cliente. Podemos, ainda, coletar os Dados Pessoais que estão associados com o feedback do cliente.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Bases Legais para o Tratamento</h2>
                <p>Utilizamos os dados pessoais com base em:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Consentimento do titular dos dados</li>
                  <li>Execução de contrato ou procedimentos preliminares relacionados</li>
                  <li>Cumprimento de obrigação legal ou regulatória</li>
                  <li>Legítimo interesse do controlador, exceto nos casos em que prevaleçam os direitos e liberdades fundamentais do titular</li>
                </ul>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Retenção de Dados</h2>
                <p>
                  Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço 
                  solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis 
                  para evitar todos os tipos de incidentes.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Compartilhamento de Dados</h2>
                <p>
                  Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, 
                  exceto quando exigido por lei, ou decisão judicial.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Direitos dos Titulares dos Dados</h2>
                <p>Você poderá solicitar, a qualquer momento:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Informação sobre como seus dados pessoais estão sendo usados</li>
                  <li>Acesso aos dados pessoais que mantemos sobre você</li>
                  <li>Correção de dados pessoais inexatos, incompletos ou desatualizados que mantemos sobre você</li>
                  <li>Anonimização, bloqueio ou eliminação dos dados desnecessários, excessivos ou tratados em desconformidade, sempre levando-se em consideração as exceções quanto à manutenção dos dados necessários para fins de cumprimento legal</li>
                  <li>Portabilidade de dados a outro fornecedor de serviço ou produto</li>
                  <li>Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa</li>
                  <li>Revogação do consentimento</li>
                  <li>Informações sobre o compartilhamento de seus dados com entidades públicas e privadas</li>
                </ul>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Segurança dos Dados</h2>
                <p>
                  Usamos boas práticas de segurança organizacional e técnica destinadas a preservar a 
                  segurança dos Dados Pessoais tratados. É importante frisar, no entanto, que nenhum dado 
                  transmitido pela Internet é 100% seguro e qualquer informação divulgada online pode 
                  potencialmente ser coletada e usada por outras partes que não sejam o destinatário pretendido.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Cookies e Tecnologias de Rastreamento</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar a sua experiência no nosso site. 
                  Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
                
                <div className="bg-flex-primary/10 p-6 rounded-xl mt-6">
                  <h3 className="text-flex-primary font-semibold mb-2">
                    Gerenciar Configurações de Cookies
                  </h3>
                  <p className="text-flex-dark mb-4">
                    Você pode alterar suas preferências de cookies a qualquer momento clicando no botão abaixo.
                  </p>
                  <CookieSettingsButton />
                </div>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Transferências Internacionais de Dados</h2>
                <p>
                  Se aplicável, transferimos dados pessoais para fora do país de origem do usuário. 
                  Tomamos as medidas apropriadas para garantir que os dados pessoais sejam protegidos 
                  de acordo com esta política de privacidade e as leis aplicáveis de proteção de dados.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Privacidade de Crianças</h2>
                <p>
                  Nós respeitamos a privacidade das crianças. Nossos Serviços não são projetados para 
                  atrair um público com menos de 18 anos e não coletamos Dados Pessoais de crianças 
                  abaixo dessa idade. Deve-se entrar em contato conosco usando os dados de contato abaixo 
                  caso o cliente acredite termos coletado informações de menores sem autorização, e nos 
                  esforçaremos para apagá-lo.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Alteração à Declaração de Privacidade</h2>
                <p>
                  Ocasionalmente, poderemos modificar esta Declaração de Privacidade a fim de atender às 
                  melhores práticas de segurança e regulação do mercado. Caso sejam feitas alterações 
                  substanciais, buscaremos notificá-lo de forma razoável sobre tais alterações por e-mail. 
                  Ao continuar a usar os Serviços após tal notificação e/ou consentimento, o cliente 
                  compromete-se a seguir a Declaração de Privacidade modificada. Caso o cliente não concorde 
                  com nossas alterações à Declaração de Privacidade, seu único e exclusivo recurso será 
                  descontinuar o uso dos Serviços.
                </p>
              </section>

              <section>
                <h2 className="font-elegant text-2xl text-flex-primary mb-4">Contato</h2>
                <p>
                  Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, 
                  entre em contato com o nosso Encarregado pelo tratamento e proteção de dados pessoais (DPO):
                </p>
                <div className="bg-flex-accent/10 p-4 rounded-lg mt-4">
                  <p className="font-semibold">Flex Fitness Center - DPO</p>
                  <p>E-mail: <a href="mailto:contato@flexacademia.com.br" className="text-flex-primary hover:underline">contato@flexacademia.com.br</a></p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}