import { motion, AnimatePresence } from 'framer-motion'
import GridBackground from '../common/effects/GridBackground.jsx'
import GlassCard from '../common/ui/GlassCard.jsx'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import Glow from '../common/effects/BlueGlow.jsx'
import WhiteGlow from '../common/effects/WhiteGlow.jsx'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import CarouselShell from '../common/ui/CarouselShell.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useCarousel } from '../../hooks/useCarousel.js'

const events = [
  {
    title: 'Technoscape Hackathon',
    badge: 'Hackathon',
    desc: 'TechnoScape Hackathon is an intensive innovation competition that challenges participants to build impactful digital solutions. Developers and designers collaborate under a strict time limit to transform creative ideas into functional prototypes. This event serves as a dynamic platform for solving actual industry problems through technology.',
    photo: '/images/img-events-technoscape-hackathon.jpg',
  },
  {
    title: 'Company Visit BNCC x BCA',
    badge: 'Company Visit',
    desc: 'Our Company Visit program takes members straight into the heart of the professional tech industry. We explore modern workspaces, engage directly with experienced practitioners, and gain practical insights into how digital innovations are built in the real market.',
    photo: '/images/img-events-company-visit-bca.jpg',
  },
  {
    title: 'Company Visit BNCC x Apple Developer Academy',
    badge: 'Company Visit',
    desc: 'Our Company Visit program takes members straight into the heart of the professional tech industry. We explore modern workspaces, engage directly with experienced practitioners, and gain practical insights into how digital innovations are built in the real market.',
    photo: '/images/img-events-company-visit-ada.jpg',
  },
  {
    title: 'BNCC TechDive 2025',
    badge: 'Events',
    desc: 'BNCC TechDive is our flagship technology event designed to explore the latest digital innovations. We bring together industry experts and tech enthusiasts to discuss emerging trends and share practical knowledge. Participants gain a deeper understanding of the modern technology landscape to prepare for future industry challenges.',
    photo: '/images/img-events-btd.jpg',
  },
  {
    title: 'BNCC Birthday Party',
    badge: 'Events',
    desc: 'The BNCC Birthday Party is an annual celebration of our organizational milestones and long-standing legacy in the technology community. We bring together active members, alumni, and partners to reflect on our collective achievements. This event strengthens internal networking and fosters a collaborative culture for future innovations.',
    photo: '/images/img-events-bipar.jpg',
  },
  {
    title: 'Workshop BNCC x Dibimbing',
    badge: 'Workshop',
    desc: 'The BNCC x Dibimbing Workshop is a collaborative initiative aimed at equipping members with industry-relevant digital skills. Led by experienced mentors from Dibimbing, participants engage in hands-on learning sessions and practical case studies. This collaboration actively bridges the gap between academic knowledge and actual career demands in the tech industry.',
    photo: '/images/img-workshop-dibimbing.jpeg',
  },
]

export default function PastEvents() {
  const { current: event, next, prev } = useCarousel(events)

  const headingVariants = useScrollReveal(24, 0.6)
  const descVariants = useScrollReveal(20, 0.6, 0.05)
  const cardVariants = useScrollReveal(32, 0.6)
  const navButtonVariants = useScrollReveal(16, 0.5)
  const footerTextVariants = useScrollReveal(20, 0.5)

  return (
    <section
      id="events"
      className="relative py-16 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14"
    >
      <GridBackground />

      <WhiteGlow className="-left-24 top-1/3 h-[220px] w-[220px] sm:-left-40 sm:h-[600px] sm:w-[600px] lg:-left-[80px] lg:h-[950px] lg:w-[950px] z-0" />
      <Glow
        opacity={0.5}
        className="-right-6 -bottom-10 h-[110px] w-[110px] sm:-right-10 sm:-bottom-14 sm:h-[180px] sm:w-[180px] lg:-right-[70px] lg:-bottom-16 lg:h-[280px] lg:w-[280px] z-0"
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingVariants}
        >
          <SectionHeading>Our Past Events</SectionHeading>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={descVariants}
          className="font-poppins text-secondary mb-8 sm:mb-10 px-0 sm:px-16 md:px-32 text-xs sm:text-base md:text-lg lg:text-xl font-regular"
        >
          Throughout the events we've been part of,{' '}
          <strong>we've learned many new things</strong> and gained a lot of
          meaningful experiences. More than that, we've also built a{' '}
          <strong>strong sense of belonging</strong> within the BNCC family
          through events such as:
        </motion.p>

        <CarouselShell
          onPrev={prev}
          onNext={next}
          prevLabel="Previous event"
          nextLabel="Next event"
          navButtonVariants={navButtonVariants}
          cardVariants={cardVariants}
          prevButtonClassName="lg:-mr-8"
          nextButtonClassName="lg:-ml-8"
        >
          <GlassCard
            rounded="rounded-[16px] sm:rounded-[22px] lg:rounded-[28px]"
            borderVariant="card"
            className="w-full min-w-0 p-4 sm:p-6 lg:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={event.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg aspect-[3/2] overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src={event.photo}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 lg:bottom-3 lg:left-3 rounded-[16px] px-3 sm:px-5 lg:px-7 py-1 sm:py-1.5 lg:py-2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-white backdrop-blur-md shadow-md"
                    style={{
                      backgroundColor: 'rgba(153, 196, 244, 0.23)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {event.badge}
                  </span>
                  <GradientBorder
                    variant="image"
                    className="rounded-xl sm:rounded-2xl"
                  />
                </div>

                <h3 className="mt-3 sm:mt-4 lg:mt-6 font-semibold text-secondary text-sm sm:text-base md:text-lg lg:text-2xl font-poppins">
                  {event.title}
                </h3>
                <p className="mt-1.5 sm:mt-2 lg:mt-3 text-[11px] sm:text-xs md:text-sm lg:text-lg text-secondary leading-relaxed max-w-3xl mx-auto font-poppins">
                  {event.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </CarouselShell>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={footerTextVariants}
          className="mt-10 text-lg sm:text-2xl md:text-3xl font-semibold gradient-text"
        >
          And Many More!
        </motion.p>
      </div>
    </section>
  )
}
