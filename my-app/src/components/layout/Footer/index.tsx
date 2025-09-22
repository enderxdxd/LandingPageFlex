'use client'

import { motion } from 'framer-motion'
import { HiLocationMarker, HiMail, HiDocumentText, HiPhone } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="bg-flex-dark text-white py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-flex-accent/10 to-flex-blue-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Company Logo and Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-6">
              <h3 className="font-elegant text-5xl text-flex-secondary mb-3 font-bold">
                Flex Fitness Center
              </h3>
              <p className="font-body text-flex-slate text-lg font-light tracking-wide">
                Evolution Flex Fitness Center Ltda
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 font-body">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <HiLocationMarker className="w-5 h-5 text-flex-accent flex-shrink-0" />
                <div className="text-gray-300 text-sm font-light">
                  Av. Alphaville Flamboyant nº 3455, Residencial Alphaville Flamboyant, Goiânia - GO - CEP 74884-527
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <HiMail className="w-5 h-5 text-flex-accent flex-shrink-0" />
                <a 
                  href="mailto:contato@flexacademia.com.br"
                  className="text-gray-300 hover:text-flex-secondary transition-colors text-sm font-light"
                >
                  contato@flexacademia.com.br
                </a>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <HiDocumentText className="w-5 h-5 text-flex-accent flex-shrink-0" />
                <span className="text-gray-300 text-sm font-light">
                  CNPJ: 41.033.075/0001-56
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-600/30 mt-12 pt-8 text-center"
        >
          <p className="font-body text-xs text-gray-400 font-light">
            © {new Date().getFullYear()} Evolution Flex Fitness Center Ltda. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-gray-400 mt-2 font-light italic">
            Desenvolvido com 💪 para transformar vidas através do fitness
          </p>
        </motion.div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-flex-primary via-flex-secondary to-flex-accent" />
    </footer>
  )
}
