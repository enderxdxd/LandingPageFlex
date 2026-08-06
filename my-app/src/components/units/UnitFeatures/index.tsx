'use client'

import { motion } from 'framer-motion'
import { Unit } from '@/lib/constants/units-data'
import { HiCheckCircle, HiStar } from 'react-icons/hi'
import { FaDumbbell, FaSwimmingPool, FaChild, FaEye } from 'react-icons/fa'
import { MdAccessibility, MdLocalParking } from 'react-icons/md'
import { Ruler } from 'lucide-react'

interface UnitFeaturesProps {
  unit: Unit
}

export default function UnitFeatures({ unit }: UnitFeaturesProps) {
  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('piscina')) return FaSwimmingPool
    if (feature.toLowerCase().includes('kids') || feature.toLowerCase().includes('criança')) return FaChild
    if (feature.toLowerCase().includes('vista') || feature.toLowerCase().includes('terraço')) return FaEye
    if (feature.toLowerCase().includes('estacionamento') || feature.toLowerCase().includes('parking')) return MdLocalParking
    if (feature.toLowerCase().includes('acessib')) return MdAccessibility
    return FaDumbbell
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-flex-dark">
            O que oferecemos em{' '}
            <span className="gradient-text">{unit.name}</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Infraestrutura completa e serviços premium para sua melhor experiência de treino
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unit.features.map((feature, index) => {
            const FeatureIcon = getFeatureIcon(feature)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-flex-primary/20 hover:shadow-md transition-all duration-200 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-flex-primary/8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FeatureIcon className="text-lg text-flex-primary" />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-medium text-flex-dark text-sm">{feature}</h3>
                  <HiCheckCircle className="text-green-500 flex-shrink-0" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Special Features Section */}
        {unit.specialFeatures && unit.specialFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="text-center mb-10">
              <h3 className="font-display text-3xl text-flex-dark mb-2 inline-flex items-center gap-2">
                <HiStar className="text-amber-500" />
                Diferenciais Exclusivos
              </h3>
              <p className="text-gray-500">
                Recursos unicos que fazem desta unidade especial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {unit.specialFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-flex-primary to-flex-secondary p-6 rounded-xl text-white">
                    <HiStar className="text-white/60 text-2xl mb-3" />
                    <h4 className="font-display text-lg mb-1">{feature}</h4>
                    <div className="w-10 h-0.5 bg-white/40 rounded-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          className="mt-16 grid md:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-flex-primary/8 rounded-full flex items-center justify-center mx-auto mb-3">
              <Ruler className="w-5 h-5 text-flex-primary" />
            </div>
            <h3 className="font-display text-2xl text-flex-dark mb-1">{unit.area}</h3>
            <p className="text-gray-500 text-sm">Area Total</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-flex-primary/8 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdLocalParking className="text-xl text-flex-primary" />
            </div>
            <h3 className="font-display text-2xl text-flex-dark mb-1">{unit.parking}</h3>
            <p className="text-gray-500 text-sm">Estacionamento</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-flex-primary/8 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdAccessibility className="text-xl text-flex-secondary" />
            </div>
            <h3 className="font-display text-2xl text-flex-dark mb-1">100%</h3>
            <p className="text-gray-500 text-sm">Acessivel</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-display text-2xl text-flex-dark mb-3">
              Pronto para comecar?
            </h3>
            <p className="text-gray-500 mb-6">
              Venha conhecer todos os nossos diferenciais pessoalmente
            </p>
            <button
              onClick={() => window.location.assign('/freepass')}
              className="bg-flex-primary text-white px-8 py-3 rounded-full font-medium hover:bg-flex-secondary transition-colors duration-200"
            >
              Agendar Visita
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
