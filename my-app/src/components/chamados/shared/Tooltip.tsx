'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  text: string
  children?: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [mobileShow, setMobileShow] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setMobileShow(false)
      }
    }
    if (mobileShow) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileShow])

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent',
  }

  const isVisible = show || mobileShow

  return (
    <div className="relative inline-flex" ref={tooltipRef}>
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => {
          e.preventDefault()
          setMobileShow(!mobileShow)
        }}
        className="inline-flex items-center justify-center p-0.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors focus:outline-none"
        aria-label="Ajuda"
      >
        {children || <HelpCircle className="w-3.5 h-3.5" />}
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 max-w-[220px] leading-relaxed shadow-lg whitespace-normal">
            {text}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  )
}
