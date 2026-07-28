import { useMemo } from 'react'

export function useScrollReveal(distance = 24, duration = 0.6, delay = 0) {
  return useMemo(() => ({
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: [0.22, 1, 0.36, 1], delay },
    },
  }), [distance, duration, delay])
}

export function useStaggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return useMemo(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }), [staggerChildren, delayChildren])
}
