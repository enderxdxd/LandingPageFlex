'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  parallaxAmount?: number
}

export default function ParallaxImage({ 
  src, 
  alt, 
  className = '', 
  parallaxAmount = 30 
}: ParallaxImageProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [-parallaxAmount, parallaxAmount])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="relative w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover scale-110"
        />
      </motion.div>
    </div>
  )
}