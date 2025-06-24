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
            <h1 className="font-display text-4xl md:text-5xl gradient-text mb-8">
              Política de Privacidade
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <h2>1. Informações que coletamos</h2>
              <p>
                Coletamos informações quando você visita nosso site, se inscreve para nossos serviços,
                ou interage conosco de outras formas.
              </p>

              <h2>2. Como usamos cookies</h2>
              <p>
                Utilizamos cookies para melhorar sua experiência em nosso site. Você pode controlar
                quais cookies são definidos através de nossas configurações de cookies.
              </p>

              <h2>3. Tipos de cookies que utilizamos</h2>
              <ul>
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site</li>
                <li><strong>Cookies de Análise:</strong> Nos ajudam a entender como você usa o site</li>
                <li><strong>Cookies de Marketing:</strong> Utilizados para personalizar anúncios</li>
                <li><strong>Cookies Funcionais:</strong> Permitem funcionalidades aprimoradas</li>
              </ul>

              <h2>4. Seus direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais.
                Entre em contato conosco para exercer esses direitos.
              </p>

              <div className="bg-flex-primary/10 p-6 rounded-xl mt-8">
                <h3 className="text-flex-primary font-semibold mb-2">
                  Gerenciar Configurações de Cookies
                </h3>
                <p className="text-flex-dark mb-4">
                  Você pode alterar suas preferências de cookies a qualquer momento clicando no botão abaixo.
                </p>
                <CookieSettingsButton />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}