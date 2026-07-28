import { motion } from 'framer-motion'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import GlassCard from '../common/ui/GlassCard.jsx'
import SpotlightCard from '../common/ui/SpotlightCard.jsx'
import cursorArrow from '../../assets/icons/ic-cursor-arrow.svg'
import {
  useStaggerContainer,
  useScrollReveal,
} from '../../hooks/useScrollReveal.js'

export default function AboutUs() {
  const containerVariants = useStaggerContainer(0.15, 0.05)
  const itemVariants = useScrollReveal(24, 0.6)

  return (
    <section
      id="about"
      className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SectionHeading className="mb-4 sm:mb-6 md:mb-8">
            About Us
          </SectionHeading>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SpotlightCard>
            <GlassCard
              bg="center"
              rounded="rounded-[16px] sm:rounded-[20px] md:rounded-[24px]"
              className="p-8 sm:p-10 md:p-16 lg:p-20 text-left relative"
            >
              <motion.p
                variants={itemVariants}
                className="mb-4 sm:mb-6 md:mb-8 text-secondary font-semibold text-[clamp(0.8rem,2.2vw,1.4rem)] leading-[1.5] sm:leading-[1.55] md:leading-[1.6]"
              >
                BNCC (Bina Nusantara Computer Club) is an organization that
                focuses on the field of technology at Bina Nusantara University.
                BNCC has successfully educated Binus students through a wide
                variety of IT courses, engaging and innovative events,
                problem-solving products, research activities, and many more
                impactful initiatives.
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="italic text-secondary font-normal text-[clamp(0.75rem,2vw,1.125rem)] leading-[1.5] sm:leading-[1.55] md:leading-8"
              >
                As BNCC enters its 37th year of establishment, we are more than
                ready to face new challenges on our journey. We warmly invite
                you to become a part of BNCC, where we will learn and grow
                together, and achieve success side by side!
              </motion.p>
              <img
                src={cursorArrow}
                alt=""
                className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 md:-bottom-6 md:-right-6 lg:-bottom-7 lg:-right-7 w-8 h-7 sm:w-12 sm:h-11 md:w-16 md:h-14 lg:w-20 lg:h-18 select-none pointer-events-none z-20"
              />
            </GlassCard>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
