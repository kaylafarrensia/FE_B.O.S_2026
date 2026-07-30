import { motion } from 'framer-motion'

export default function GridBackground({
  opacity = 0.4,
  size = 64,
  duration = 24,
  className = '',
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(#ffffff55 1px, transparent 1px), linear-gradient(90deg, #ffffff55 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
      }}
      animate={{
        backgroundPosition: ['0px 0px', `${size}px ${size}px`],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}
