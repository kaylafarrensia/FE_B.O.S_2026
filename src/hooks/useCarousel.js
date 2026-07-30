import { useState } from 'react'

export function useCarousel(items) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = () => {
    setDirection(1)
    setIndex((i) => (i + 1) % items.length)
  }

  const prev = () => {
    setDirection(-1)
    setIndex((i) => (i - 1 + items.length) % items.length)
  }

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }

  return {
    index,
    direction,
    current: items[index],
    next,
    prev,
    goTo,
  }
}

export function useWindowedCarousel(items, visibleCount) {
  const [start, setStart] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = () => {
    setDirection(1)
    setStart((s) => (s + 1) % items.length)
  }

  const prev = () => {
    setDirection(-1)
    setStart((s) => (s - 1 + items.length) % items.length)
  }

  const visible = Array.from(
    { length: visibleCount },
    (_, i) => items[(start + i) % items.length],
  )

  return { start, direction, visible, next, prev }
}
