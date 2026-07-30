'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SHOW_THRESHOLD = 400
const GUTTER = 20

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [bottomOffset, setBottomOffset] = useState(GUTTER)

  useEffect(() => {
    const footer =
      document.getElementById('site-footer') || document.querySelector('footer')

    let ticking = false

    const update = () => {
      setVisible(window.scrollY > SHOW_THRESHOLD)

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top
        const viewportHeight = window.innerHeight
        const overlap = viewportHeight - footerTop
        setBottomOffset(overlap > 0 ? overlap + GUTTER : GUTTER)
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          data-cursor-hover
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ bottom: bottomOffset }}
          className="
            fixed right-5 sm:right-8 z-50
            flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center
            rounded-full shadow-[0_4px_20px_rgba(16,94,169,0.35)]
            bg-gradient-to-br from-[#105EA9] to-[#73BAFF]
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
