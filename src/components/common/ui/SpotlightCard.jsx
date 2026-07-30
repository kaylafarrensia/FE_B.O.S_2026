import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function SpotlightCard({ children, className = '', ...props }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - rect.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      data-cursor-hover
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[16px] sm:rounded-[20px] md:rounded-[24px]"
        style={{
          backgroundImage:
            'radial-gradient(400px circle at var(--x) var(--y), rgba(68,137,212,0.16), transparent 70%)',
        }}
      />

      <div className="pointer-events-none absolute -inset-px z-0 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_30%,rgba(68,137,212,0.6)_50%,transparent_70%)] bg-[length:200%_100%] animate-[shimmer_2.5s_linear_infinite]" />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  )
}
