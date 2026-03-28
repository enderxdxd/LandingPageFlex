'use client'

import { HiLocationMarker, HiMail, HiDocumentText } from 'react-icons/hi'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-flex-dark text-white py-14 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <p className="font-body text-flex-slate text-lg font-light tracking-wide">
              Evolution Flex Fitness Center Ltda
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-8 font-body">
            <div className="flex items-center gap-2.5">
              <HiLocationMarker className="w-4 h-4 text-flex-accent flex-shrink-0" />
              <span className="text-gray-400 text-sm">
                Av. Alphaville Flamboyant n 3455, Goiania - GO
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <HiMail className="w-4 h-4 text-flex-accent flex-shrink-0" />
              <a
                href="mailto:contato@flexacademia.com.br"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                contato@flexacademia.com.br
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <HiDocumentText className="w-4 h-4 text-flex-accent flex-shrink-0" />
              <span className="text-gray-400 text-sm">
                CNPJ: 41.033.075/0001-56
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Evolution Flex Fitness Center Ltda. Todos os direitos reservados.
          </p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Politica de Privacidade
            </Link>
            <span className="text-gray-700">|</span>
            <Link
              href="/termos-uso"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
