import { motion } from 'framer-motion'
import NavButton from './NavButton.jsx'

export default function CarouselShell({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  navButtonVariants,
  cardVariants,
  prevButtonClassName = '',
  nextButtonClassName = '',
  wrapperClassName = '',
  overlayOnMobile = false,
  children,
}) {
  const navWrapperClass = overlayOnMobile
    ? 'absolute left-0 top-1/2 -translate-y-1/2 z-10 sm:static sm:translate-y-0'
    : ''
  const navWrapperClassRight = overlayOnMobile
    ? 'absolute right-0 top-1/2 -translate-y-1/2 z-10 sm:static sm:translate-y-0'
    : ''

  return (
    <div
      className={`relative flex items-center justify-center ${wrapperClassName}`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={navButtonVariants}
        className={navWrapperClass}
      >
        <NavButton
          direction="prev"
          onClick={onPrev}
          label={prevLabel}
          className={prevButtonClassName}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={cardVariants}
        className="w-full min-w-0"
      >
        {children}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={navButtonVariants}
        className={navWrapperClassRight}
      >
        <NavButton
          direction="next"
          onClick={onNext}
          label={nextLabel}
          className={nextButtonClassName}
        />
      </motion.div>
    </div>
  )
}
