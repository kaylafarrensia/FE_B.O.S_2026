'use client'

import { motion } from 'framer-motion'
import { useScrollDirection } from '../../../hooks/useScrollDirection'

const buildVariants = (direction) => {
  const offset = {
    up: { y: 28, x: 0 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
  }[direction] ?? { y: 28, x: 0 }

  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as = 'div',
}) {
  const Component = motion[as] ?? motion.div
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={buildVariants(direction)}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  )
}

export function RevealGroup({ children, stagger = 0.15, className = '' }) {
  const scrollDirection = useScrollDirection()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            staggerDirection: scrollDirection === 'up' ? -1 : 1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, direction = 'up', className = '' }) {
  return (
    <motion.div variants={buildVariants(direction)} className={className}>
      {children}
    </motion.div>
  )
}
