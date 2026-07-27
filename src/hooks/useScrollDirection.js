'use client'

import { useEffect, useState, useRef } from 'react'

export function useScrollDirection() {
  const [direction, setDirection] = useState('down')
  const lastY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastY.current) < 5) return

      setDirection(currentY > lastY.current ? 'down' : 'up')
      lastY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return direction
}
