'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, Suspense, lazy, useState, useEffect } from 'react'
import { unitsData } from '@/lib/constants/units-data'
import { UnitCard } from './UnitCard'
import ClientOnly, { useIsMobile, useIsClient } from '@/components/ClientOnly'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import dynamic from 'next/dynamic'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'

// Lazy load do Swiper para melhor performance
const MobileSwiper = dynamic(() => import('@/components/MobileSwiper'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flex-primary"></div>
    </div>
  )
})

// Loading Skeleton Component
const UnitCardSkeleton = () => (
  <div className="h-[400px] rounded-2xl bg-gray-200 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-8 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-full"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

// Enhanced Stats Component
const UnitsStats = ({ isClient, isMobile }: { isClient: boolean, isMobile: boolean }) => (
  <motion.div
    className="grid grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mb-12 max-w-2xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.6, duration: 0.8 }}
  >
    {[
      { number: '4', label: 'Unidades', icon: '🏢' },
      { number: '5k+', label: 'Alunos', icon: '👥' },
      { number: '15+', label: 'Anos', icon: '⭐' }
    ].map((stat, index) => (
      <motion.div
        key={index}
        className="text-center p-4 lg:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
        whileHover={isClient && !isMobile ? { 
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        } : {}}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 + (index * 0.1), duration: 0.6 }}
      >
        <div className="text-2xl lg:text-3xl mb-2">{stat.icon}</div>
        <div className="font-display text-2xl lg:text-3xl font-bold gradient-text mb-1">
          {stat.number}
        </div>
        <div className="text-sm lg:text-base text-gray-600">{stat.label}</div>
      </motion.div>
    ))}
  </motion.div>
)

// Enhanced Grid Component with better responsiveness
const ResponsiveUnitsGrid = ({ 
  isClient, 
  isMobile, 
  unitsData 
}: { 
  isClient: boolean
  isMobile: boolean
  unitsData: any[]
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    {unitsData.map((unit, idx) => (
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
          delay: idx * 0.1
        }}
        whileHover={isClient && !isMobile ? { 
          y: -10,
          rotateY: 2,
          scale: 1.02,
          zIndex: 10
        } : {}}
        style={{ 
          transformStyle: 'preserve-3d'
        }}
      >
        <Suspense fallback={<UnitCardSkeleton />}>
          <UnitCard 
            unit={unit} 
            priority={idx === 0} 
            lazy={idx > 2}
            index={idx}
          />
        </Suspense>
      </motion.div>
    ))}
  </div>
)

// Enhanced CTA Section
const EnhancedCTA = ({ isClient, isMobile }: { isClient: boolean, isMobile: boolean }) => (
  <motion.div
    className="mt-16 lg:mt-20 text-center"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 1, duration: 0.8 }}
  >
    <motion.div
      className="inline-block bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-gray-200/50 shadow-2xl relative overflow-hidden"
      whileHover={isClient && !isMobile ? { 
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        backgroundColor: "rgba(255,255,255,0.95)"
      } : {}}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(30, 64, 175, 0.3) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {['🏋️', '💪', '🎯', '⚡', '🔥'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${15 + (index * 10)}%`,
            }}
            animate={isClient ? {
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
              opacity: [0.05, 0.15, 0.05]
            } : {}}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: index * 0.5
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex items-center justify-center mb-4"
        animate={isClient ? {
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <HiSparkles className="text-4xl text-flex-primary mr-2" />
        <HiSparkles className="text-3xl text-flex-secondary" />
      </motion.div>

      <motion.h3 
        className="font-display text-3xl lg:text-4xl gradient-text mb-4"
        animate={isClient ? {
          textShadow: [
            "0 0 20px rgba(30, 64, 175, 0.3)",
            "0 0 30px rgba(59, 130, 246, 0.3)",
            "0 0 20px rgba(30, 64, 175, 0.3)"
          ]
        } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🏢 MAIS UNIDADES EM BREVE
      </motion.h3>
      
      <div className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Estamos expandindo para atender você ainda melhor! 
        <br className="hidden sm:block" />
      </div>

      {/* Trust indicators */}
      <motion.div
        className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        
        <div className="flex items-center">
          <span className="text-green-500 mr-1">✓</span>
          Equipamentos de última geração
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-1">✓</span>
          Professores especializados
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
)

export default function UnitsShowcase() {
  const sectionRef = useRef(null)
  const isClient = useIsClient()
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const { networkSpeed, prefersReducedMotion } = useMobileOptimization({
    reduceAnimations: true,
    optimizePerformance: true
  })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Smooth spring animations
  const backgroundY = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '40%']),
    { stiffness: 100, damping: 30 }
  )
  const titleScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0.8, 1]),
    { stiffness: 100, damping: 30 }
  )

  // Intersection Observer for better performance
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Mobile optimized version
  if (isMobile) {
    return (
      <section 
        id="units"
        ref={sectionRef}
        className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 sm:py-20 relative overflow-hidden"
        role="region"
        aria-labelledby="units-title"
      >
      {/* Simplified Background for mobile */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50" />
        <div className="absolute inset-0 opacity-3">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(96, 165, 250, 0.1) 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced title section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2 
              id="units-title"
              className="font-display text-4xl sm:text-5xl lg:text-7xl mb-6 animate-on-scroll relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="relative inline-block">
                NOSSAS{' '}
                <span className="gradient-text relative">
                  UNIDADES
                  <motion.div
                    className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-flex-primary to-flex-secondary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                  />
                </span>
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Descubra a unidade Flex Fitness mais próxima de você e comece sua transformação hoje mesmo.
            </motion.p>

            {/* Stats Section */}
            <UnitsStats isClient={isClient} isMobile={isMobile} />
          </div>

          {/* Mobile Swiper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <MobileSwiper>
              {unitsData.map((unit, idx) => (
                <UnitCard 
                  key={unit.id} 
                  unit={unit} 
                  priority={idx === 0}
                  lazy={idx > 1}
                  index={idx}
                />
              ))}
            </MobileSwiper>
          </motion.div>

          {/* Enhanced CTA */}
          <EnhancedCTA isClient={isClient} isMobile={isMobile} />
        </div>
      </section>
    )
  }

  // Desktop version with full animations
  return (
    <section 
      id="units"
      ref={sectionRef}
      className="scroll-section min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 relative overflow-hidden"
      role="region"
      aria-labelledby="units-title"
    >
      {/* Enhanced Background Animation - Simplified */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: isClient && isVisible ? backgroundY : 0 }}
      >
        {/* Subtle geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-blue-200/20 rounded-full blur-3xl"
          animate={isClient && isVisible ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          } : {}}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full blur-3xl"
          animate={isClient && isVisible ? {
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4]
          } : {}}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/30" />

        {/* Simplified grid pattern */}
        {isClient && (
          <div className="absolute inset-0 opacity-3">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, rgba(96, 165, 250, 0.1) 2px, transparent 2px)
                `,
                backgroundSize: '80px 80px'
              }}
            />
          </div>
        )}

        {/* Minimal particle system */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/30 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={isClient && isVisible ? {
                y: [-20, 20, -20],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                delay: i * 2
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced title section */}
        <motion.div 
          className="text-center mb-16"
          style={{ scale: isClient ? titleScale : 1 }}
        >
          <motion.h2 
            id="units-title"
            className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 animate-on-scroll relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="relative inline-block"
              whileHover={isClient ? { scale: 1.05 } : {}}
            >
              NOSSAS{' '}
              <motion.span className="gradient-text relative">
                UNIDADES
                <motion.div
                  className="absolute bottom-0 left-0 h-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "100%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 2 }}
                />
                
                {/* Enhanced floating elements */}
                {isClient && (
                  <>
                    <motion.div
                      className="absolute -top-6 -right-6 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"
                      animate={{
                        scale: [0, 1.2, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                      className="absolute -bottom-4 -left-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-lg"
                      animate={{
                        scale: [0, 1.2, 0],
                        rotate: [360, 180, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                    />
                  </>
                )}
              </motion.span>
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Escolha a unidade mais próxima e comece sua transformação
          </motion.p>

          {/* Stats Section */}
          <UnitsStats isClient={isClient} isMobile={isMobile} />
        </motion.div>

        {/* Enhanced Desktop Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <ResponsiveUnitsGrid 
            isClient={isClient} 
            isMobile={isMobile} 
            unitsData={unitsData} 
          />
        </motion.div>

        {/* Enhanced CTA */}
        <EnhancedCTA isClient={isClient} isMobile={isMobile} />
      </div>

      {/* Enhanced background decorative elements */}
      {isClient && isVisible && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 opacity-5"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 40, repeat: Infinity }}
          >
            <img 
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt=""
              className="h-24 w-auto object-contain filter grayscale"
              loading="lazy"
            />
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 opacity-5"
            animate={{
              rotate: [360, 0],
              scale: [1.3, 1, 1.3]
            }}
            transition={{ duration: 35, repeat: Infinity }}
          >
            <img 
              src="/images/units/alphaville/flex-logo-navbar.png"
              alt=""
              className="h-16 w-auto object-contain filter grayscale"
              loading="lazy"
            />
          </motion.div>

          {/* Enhanced floating location pins */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: unitsData.length + 2 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-4xl opacity-10 filter drop-shadow-lg"
                style={{
                  left: `${10 + (index * 18)}%`,
                  top: `${15 + (index * 12)}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.05, 0.2, 0.05],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 8 + index * 0.5,
                  repeat: Infinity,
                  delay: index * 1.2
                }}
              >
                📍
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}