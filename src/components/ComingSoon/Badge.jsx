import { motion } from 'framer-motion'

export default function Badge({
  text,
  color = 'blue',
  showFlag = true,
  flagPosition = 'left', // 'left' | 'right'
  className = '',
}) {
  const colors = {
    pink: 'bg-pink-600 text-white',
    green: 'bg-green-700 text-white',
    blue: 'bg-blue-50 text-blue-900 border border-blue-200',
  }

  const flagColors = {
    pink: 'fill-pink-600',
    green: 'fill-green-600',
    blue: 'fill-blue-500',
  }

  const isRight = flagPosition === 'right'

  const cornerClass = isRight
    ? 'rounded-tl-full rounded-br-full rounded-bl-full rounded-tr-none'
    : 'rounded-tr-full rounded-br-full rounded-bl-full rounded-tl-none'

  const flagPositionClass = isRight ? '-top-5 -right-5' : '-top-5 -left-5'

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`inline-block ${className}`}
    >
      <span
        className={`relative inline-block whitespace-nowrap ${cornerClass} px-8 py-3 text-base font-regular shadow-md ${colors[color]}`}
      >
        {text}

        {showFlag && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={`absolute ${flagPositionClass} ${flagColors[color]}`}
            style={{ transform: isRight ? 'scaleX(-1)' : undefined }}
          >
            <path d="M2 2 L22 9 L13 13 L9 22 Z" />
          </svg>
        )}
      </span>
    </motion.div>
  )
}