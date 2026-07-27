import { motion } from 'framer-motion'

const flagColors = {
  pink: 'fill-[#D7139F] stroke-[#D7139F]',
  green: 'fill-[#00914E] stroke-[#00914E]',
  blue: 'fill-blue-500 stroke-blue-500',
  yellow: 'fill-[#F2BA14] stroke-[#C2930A]',
  red: 'fill-[#C83618] stroke-[#8F230C]',
}

export function Flag({
  color = 'blue',
  flagPosition = 'left',
  className = '',
}) {
  const isRight = flagPosition === 'right'

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: isRight ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M2 2 L22 9 L13 13 L9 22 Z"
        className={flagColors[color]}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function Badge({
  text,
  color = 'blue',
  showFlag = true,
  flagPosition = 'left',
  className = '',
}) {
  const colors = {
    pink: 'bg-[#D7139F] !text-white',
    green: 'bg-[#00914E] !text-white',
    blue: 'bg-blue-500 !text-white',
    yellow: 'bg-[#F2BA14] !text-black',
    red: 'bg-[#C83618] !text-white',
  }

  const isRight = flagPosition === 'right'

  const cornerClass = isRight
    ? 'rounded-tl-full rounded-br-full rounded-bl-full rounded-tr-none'
    : 'rounded-tr-full rounded-br-full rounded-bl-full rounded-tl-none'

  const flagPositionClass = isRight
    ? '-top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-5 lg:-right-5'
    : '-top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-5 lg:-left-5'

  const textClass = 'text-sm sm:text-md lg:text-xl'
  const paddingClass = 'px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3'

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      <span
        className={`relative inline-block whitespace-nowrap font-regular shadow-md ${cornerClass} ${paddingClass} ${textClass} ${colors[color]}`}
      >
        {text}
        {showFlag && (
          <Flag
            color={color}
            flagPosition={flagPosition}
            className={`absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${flagPositionClass}`}
          />
        )}
      </span>
    </motion.div>
  )
}
