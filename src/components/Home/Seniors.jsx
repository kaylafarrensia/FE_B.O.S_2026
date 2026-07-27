import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GridBackground from '../common/effects/GridBackground.jsx'
import GlassCard from '../common/ui/GlassCard.jsx'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import BlueGlow from '../common/effects/BlueGlow.jsx'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import CarouselShell from '../common/ui/CarouselShell.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useWindowedCarousel } from '../../hooks/useCarousel.js'

const seniors = [
  {
    name: 'Matius Kelvin',
    role: 'Co-founder',
    company: ['Accelist', 'Lentera Indonesia'],
    photo: '/images/img-seniors-matius-kelvin.jpg',
  },
  {
    name: 'Yosua Omimaru',
    role: 'COO',
    company: ['C-channel Indonesia'],
    photo: '/images/img-seniors-yosua-omimaru.jpg',
  },
  {
    name: 'Juliana Cen',
    role: 'President Director',
    company: ['HP'],
    photo: '/images/img-seniors-juliana-cen.jpg',
  },
  {
    name: 'Ericko Sanders',
    role: 'Agency Director',
    company: ['PT. Prudential Life Assurance'],
    photo: '/images/img-seniors-ericko-sanders.png',
  },
  {
    name: 'Calvin Leonardo',
    role: 'COO',
    company: ['codingstudio'],
    photo: '/images/img-seniors-calvin-leonardo.jpg',
  },
]

const VISIBLE_DESKTOP = 4
const VISIBLE_COMPACT = 2
const COMPACT_BREAKPOINT = 1024

function useIsCompact() {
  const [isCompact, setIsCompact] = useState(
    typeof window !== 'undefined' && window.innerWidth < COMPACT_BREAKPOINT,
  )

  useEffect(() => {
    const handleResize = () =>
      setIsCompact(window.innerWidth < COMPACT_BREAKPOINT)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isCompact
}

export default function Seniors() {
  const isCompact = useIsCompact()
  const visibleCount = isCompact ? VISIBLE_COMPACT : VISIBLE_DESKTOP
  const { start, direction, visible, next, prev } = useWindowedCarousel(
    seniors,
    visibleCount,
  )

  const headingVariants = useScrollReveal(24, 0.6)
  const carouselVariants = useScrollReveal(32, 0.6)
  const navButtonVariants = useScrollReveal(16, 0.5)
  const footerTextVariants = useScrollReveal(20, 0.5)

  const slideVariants = {
    enter: (dir) => ({ x: dir >= 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir >= 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <section className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14">
      <GridBackground />

      <BlueGlow className="-left-24 top-1/2 h-[220px] w-[220px] sm:-left-40 sm:h-[400px] sm:w-[400px] lg:-left-[320px] lg:h-[650px] lg:w-[650px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={headingVariants}
        >
          <SectionHeading>Our Seniors</SectionHeading>
        </motion.div>
        <CarouselShell
          onPrev={prev}
          onNext={next}
          prevLabel="Previous seniors"
          nextLabel="Next seniors"
          navButtonVariants={navButtonVariants}
          cardVariants={carouselVariants}
          prevButtonClassName="sm:-mr-6 md:-mr-9 lg:-mr-12"
          nextButtonClassName="sm:-ml-6 md:-ml-9 lg:-ml-12"
          overlayOnMobile
        >
          <GlassCard
            rounded="rounded-[20px] sm:rounded-[28px]"
            className="w-full min-w-0 p-3 sm:px-20 sm:py-10"
          >
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={start}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className={`grid gap-2 sm:gap-6 ${
                    isCompact ? 'grid-cols-2' : 'grid-cols-4'
                  }`}
                >
                  {visible.map((s, i) => (
                    <div
                      key={i}
                      className="relative flex flex-col items-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl bg-[#EAF5FF] backdrop-blur-sm p-2.5 sm:p-6 transition-transform hover:scale-[1.02]"
                    >
                      <GradientBorder variant="subtle" />
                      <div className="relative h-14 w-14 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-full">
                        <img
                          src={s.photo}
                          alt={s.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="relative font-poppins">
                        <p className="font-medium text-secondary text-[0.75rem] sm:text-lg leading-tight">
                          {s.name}
                        </p>
                        <p className="text-[0.65rem] sm:text-[1rem] font-regular text-secondary-2 mt-0.5 sm:mt-1 leading-tight">
                          {s.role}
                        </p>
                        {s.company.map((line) => (
                          <p
                            key={line}
                            className="text-[0.65rem] sm:text-[1rem] font-regular text-secondary leading-tight sm:leading-snug"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://bcaf.bncc.net"
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-4 sm:mt-8 inline-block rounded-lg bg-gradient-to-r from-[#12376B] to-[#1E5FA8] px-4 sm:px-7 py-1.5 sm:py-2 text-xs md:text-lg font-poppins font-medium text-base-2"
            >
              Learn more
            </motion.a>
          </GlassCard>
        </CarouselShell>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={footerTextVariants}
          className="mt-10 text-lg sm:text-2xl md:text-3xl font-semibold gradient-text"
        >
          And Many More!
        </motion.p>
      </div>
    </section>
  )
}
