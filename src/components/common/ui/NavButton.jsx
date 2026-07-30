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
      className={`group relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 lg:h-[62px] lg:w-[62px] shrink-0 items-center justify-center ${className}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute rounded-full backdrop-blur-xl hidden lg:block lg:w-[90px] lg:h-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)',
        }}
        animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 1 : 0.85 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      <motion.span
        className="relative flex h-8 w-8 sm:h-10 sm:w-10 lg:h-[50px] lg:w-[50px] items-center justify-center rounded-full"
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
          className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
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
