import { motion } from 'framer-motion'

export default function Badge({
  text,
  color = 'blue',
  showFlag = true,
  flagPosition = 'left', // 'left' | 'right'
  className = '',
}) {
  const colors = {
    pink: 'bg-[#D7139F] text-white',
    green: 'bg-[#00914E] text-white',
    blue: 'bg-blue-50 text-blue-900 border border-blue-200',
  }

  const flagColors = {
    pink: 'fill-[#D7139F]',
    green: 'fill-[#00914E]',
    blue: 'fill-blue-500',
  }

  const isRight = flagPosition === 'right'

  const cornerClass = isRight
    ? 'rounded-tl-full rounded-br-full rounded-bl-full rounded-tr-none'
    : 'rounded-tr-full rounded-br-full rounded-bl-full rounded-tl-none'

  const flagPositionClass = isRight
    ? '-top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-5 lg:-right-5'
    : '-top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-5 lg:-left-5'

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      <span
        className={`relative inline-block whitespace-nowrap ${cornerClass} px-4 py-2 text-[8px] sm:px-6 sm:py-2.5 sm:text-sm lg:px-8 lg:py-3 lg:text-base font-regular shadow-md ${colors[color]}`}
      >
        {text}

        {showFlag && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={`absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${flagPositionClass} ${flagColors[color]}`}
            style={{ transform: isRight ? 'scaleX(-1)' : undefined }}
          >
            <path d="M2 2 L22 9 L13 13 L9 22 Z" />
          </svg>
        )}
      </span>
    </motion.div>
  )
}