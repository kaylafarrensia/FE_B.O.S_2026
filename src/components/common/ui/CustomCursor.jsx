'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import cursorArrow from '../../../assets/icons/ic-cursor-arrow.svg'

function getIsTouch() {
  if (typeof window === 'undefined') return true
  return !window.matchMedia('(pointer: fine)').matches
}

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(getIsTouch)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    const handleChange = () => setIsTouch(!mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isTouch) return

    const moveHandler = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const leaveHandler = () => setIsVisible(false)

    const overHandler = (e) => {
      const interactive = e.target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]',
      )
      setIsHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', moveHandler)
    window.addEventListener('mouseover', overHandler)
    document.addEventListener('mouseleave', leaveHandler)

    return () => {
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseover', overHandler)
      document.removeEventListener('mouseleave', leaveHandler)
    }
  }, [isTouch, cursorX, cursorY])

  if (isTouch) return null

  return (
    <motion.img
      src={cursorArrow}
      alt=""
      draggable={false}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-7 w-8 select-none"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
      animate={{ scale: isHovering ? 1.5 : 1 }}
      transition={{ duration: 0.15 }}
    />
  )
}
