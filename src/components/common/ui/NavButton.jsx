import { useState } from 'react'
import { motion } from 'framer-motion'
import icArrow from '../../../assets/icons/ic-arrow.svg'

const ARROW_ROTATION = { prev: 0, next: 180 }

export default function NavButton({
  direction,
  onClick,
  label,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={label}
      className={`group relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-[62px] lg:w-[62px] shrink-0 items-center justify-center ${className}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute rounded-full backdrop-blur-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[90px] lg:h-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)',
        }}
        animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 1 : 0.85 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      <motion.span
        className="relative flex h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-[50px] lg:w-[50px] items-center justify-center rounded-full"
        animate={{
          backgroundColor: isHovered ? '#4489D4' : '#FFFFFF',
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          boxShadow: `
            0 0 50px 0 rgba(16,94,169,0.3),
            0 0 60px 20px rgba(172,214,255,0.8)
          `,
        }}
      >
        <img
          src={icArrow}
          alt=""
          className="h-2 w-2 sm:h-4 sm:w-4 md:h-5 md:w-5"
          style={{
            transform: `rotate(${ARROW_ROTATION[direction]}deg)`,
            filter: isHovered ? 'brightness(0) invert(1)' : 'none',
            transition: 'filter 0.25s ease-out',
          }}
        />
      </motion.span>
    </button>
  )
}
