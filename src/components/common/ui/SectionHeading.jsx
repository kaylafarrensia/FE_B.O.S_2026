import { motion } from 'framer-motion'

const SIZE_CLASSES = {
  sm: 'text-xl sm:text-3xl lg:text-5xl',
  md: 'text-2xl md:text-3xl lg:text-5xl',
  lg: 'text-3xl sm:text-4xl lg:text-6xl',
}

export default function SectionHeading({
  children,
  size = 'md',
  className = 'mb-8 sm:mb-8 md:mb-10',
  leading = 'leading-none',
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${leading} tracking-normal font-outfit gradient-text font-semibold ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </motion.h2>
  )
}
