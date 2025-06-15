'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { unitsData } from '@/lib/constants/units-data'
import UnitCard from './UnitCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function UnitsShowcase() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  return (
    <section 
      ref={sectionRef}
      className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 relative overflow-hidden"
    >
      {/* Enhanced Background Animation */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-flex-primary/10 to-flex-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-flex-secondary/10 to-flex-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(220, 38, 38, 0.3) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(37, 99, 235, 0.3) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(220, 38, 38, 0.3) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(37, 99, 235, 0.3) 75%)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
            }}
            animate={{
              backgroundPosition: [
                '0 0, 0 30px, 30px -30px, -30px 0px',
                '30px 30px, 30px 60px, 60px 0px, 0px 30px',
                '0 0, 0 30px, 30px -30px, -30px 0px'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Floating abstract shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <motion.path
            d="M100,400 Q300,200 500,400 T900,400"
            stroke="url(#path-gradient1)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M100,600 Q500,300 900,600"
            stroke="url(#path-gradient2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <defs>
            <linearGradient id="path-gradient1">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="path-gradient2">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Particle system */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-flex-primary' : 'bg-flex-secondary'} rounded-full opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-20, 20, -20],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Enhanced title section */}
        <motion.div 
          className="text-center mb-16"
          style={{ scale: titleScale }}
        >
          <motion.h2 
            className="font-display text-5xl md:text-7xl mb-6 animate-on-scroll relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              NOSSAS{' '}
              <motion.span 
                className="gradient-text relative"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(220, 38, 38, 0.3)",
                    "0 0 30px rgba(37, 99, 235, 0.3)",
                    "0 0 20px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                UNIDADES
                
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-primary to-flex-secondary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />
                
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-4 h-4 bg-flex-red rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-flex-blue rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [360, 180, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
              </motion.span>
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-flex-gray animate-on-scroll relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Escolha a unidade mais próxima e comece sua transformação
            
            {/* Text highlight effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-flex-red/5 to-flex-blue/5 -z-10 blur-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            />
          </motion.p>
        </motion.div>

        {/* Desktop View - Enhanced Grid */}
        <div className="hidden lg:block">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {unitsData.map((unit, index) => (
              <motion.div
                key={unit.id}
                className="animate-on-scroll"
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 60,
                    rotateY: -15,
                    scale: 0.9
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    rotateY: 0,
                    scale: 1
                  }
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1
                }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.02,
                  zIndex: 10
                }}
                style={{ 
                  transformStyle: 'preserve-3d'
                }}
              >
                <UnitCard unit={unit} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile View - Enhanced Swiper */}
        <div className="lg:hidden animate-on-scroll">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={true}
              autoplay={{ 
                delay: 4000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                bulletClass: 'swiper-pagination-bullet units-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active units-bullet-active'
              }}
              className="units-swiper pb-16"
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  effect: 'slide'
                },
                768: {
                  slidesPerView: 2,
                  centeredSlides: false,
                  effect: 'slide'
                }
              }}
            >
              {unitsData.map((unit) => (
                <SwiperSlide key={unit.id}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    <UnitCard unit={unit} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* Additional interactive elements */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              backgroundColor: "rgba(255,255,255,0.9)"
            }}
          >
            <motion.h3 
              className="font-display text-3xl gradient-text mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(30, 64, 175, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🏢 MAIS UNIDADES EM BREVE
            </motion.h3>
            <p className="text-flex-gray mb-6">
              Estamos expandindo para atender você ainda melhor
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Cadastrar Interesse</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 opacity-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 30, repeat: Infinity }}
      >
        <div className="text-8xl text-flex-primary font-display">FLEX</div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 opacity-10"
        animate={{
          rotate: [360, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ duration: 25, repeat: Infinity }}
      >
        <div className="text-6xl text-flex-secondary font-display">FITNESS</div>
      </motion.div>

      {/* Floating location pins */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {unitsData.map((unit, index) => (
          <motion.div
            key={unit.id}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${15 + (index * 20)}%`,
              top: `${20 + (index * 15)}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 10, -10, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: index * 0.8
            }}
          >
            📍
          </motion.div>
        ))}
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .units-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .units-bullet {
          background: rgba(30, 64, 175, 0.3) !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }

        .units-bullet-active {
          background: linear-gradient(45deg, #1E40AF, #3B82F6) !important;
          transform: scale(1.3) !important;
          box-shadow: 0 0 10px rgba(30, 64, 175, 0.5) !important;
        }

        .units-bullet:hover {
          transform: scale(1.1) !important;
          background: rgba(59, 130, 246, 0.6) !important;
        }

        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          background: linear-gradient(to right, rgba(30, 64, 175, 0.2), rgba(59, 130, 246, 0.2)) !important;
        }
      `}</style>
    </section>
  )
}