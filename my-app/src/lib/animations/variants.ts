export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -60 }
  }
  
  export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }
  
  export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
  
  export const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  }
  
  export const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }
  
  export const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  export const textReveal = {
    initial: { 
      opacity: 0,
      y: 20,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)'
    },
    animate: { 
      opacity: 1,
      y: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      transition: {
        duration: 0.8,
        ease: [0.65, 0, 0.35, 1]
      }
    }
  }