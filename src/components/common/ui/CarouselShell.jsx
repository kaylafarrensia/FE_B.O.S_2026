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
      className={`relative flex flex-row items-center justify-center w-full ${wrapperClassName}`}
    >
      {/* Desktop Left Button */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={navButtonVariants}
        className={`hidden lg:block shrink-0 ${prevButtonClassName}`}
      >
        <NavButton
          direction="prev"
          onClick={onPrev}
          label={prevLabel}
        />
      </motion.div>

      {/* Card wrapper container */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        className="relative w-full min-w-0"
      >
        {/* Mobile/Tablet Left Button (Overlay on Card Border) */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 lg:hidden ${prevButtonClassName}`}>
          <NavButton
            direction="prev"
            onClick={onPrev}
            label={prevLabel}
          />
        </div>

        {children}

        {/* Mobile/Tablet Right Button (Overlay on Card Border) */}
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 lg:hidden ${nextButtonClassName}`}>
          <NavButton
            direction="next"
            onClick={onNext}
            label={nextLabel}
          />
        </div>
      </motion.div>

      {/* Desktop Right Button */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={navButtonVariants}
        className={`hidden lg:block shrink-0 ${nextButtonClassName}`}
      >
        <NavButton
          direction="next"
          onClick={onNext}
          label={nextLabel}
        />
      </motion.div>
    </div>
  )
}
