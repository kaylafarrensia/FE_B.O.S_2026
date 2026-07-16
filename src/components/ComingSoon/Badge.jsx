import { motion } from 'framer-motion'

export default function Badge({ text, color = 'blue', showFlag = false, className = '' }) {
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

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative inline-block ${className}`}
    >
      {showFlag && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className={`absolute -top-3 -left-3 ${flagColors[color]}`}
        >
          <path d="M2 2 L22 9 L13 13 L9 22 Z" />
        </svg>
      )}

      <span
        className={`inline-block rounded-full px-5 py-2 text-sm font-medium shadow-md ${colors[color]}`}
      >
        {text}
      </span>
    </motion.div>
  )
}