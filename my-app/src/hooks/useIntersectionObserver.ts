import { useEffect, useRef, useState } from 'react'

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export const useIntersectionObserver = (options?: Options) => {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options || {}
  
  const [ref, setRef] = useState<Element | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  const frozen = useRef(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (frozen.current) return
        
        setIsIntersecting(entry.isIntersecting)
        
        if (entry.isIntersecting && freezeOnceVisible) {
          frozen.current = true
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold, root, rootMargin, freezeOnceVisible])

  return [setRef, isIntersecting] as const
}