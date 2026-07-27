import { motion, AnimatePresence } from 'framer-motion'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import BlueGlow from '../common/effects/BlueGlow.jsx'
import WhiteGlow from '../common/effects/WhiteGlow.jsx'
import {
  useScrollReveal,
  useStaggerContainer,
} from '../../hooks/useScrollReveal.js'
import { useCarousel } from '../../hooks/useCarousel.js'

import icUiux from '../../assets/icons/ic-uiux.svg'
import icFe from '../../assets/icons/ic-fe.svg'
import icBe from '../../assets/icons/ic-be.svg'
import icJava from '../../assets/icons/ic-java.svg'
import icCprog from '../../assets/icons/ic-cprog.svg'
import icMobile from '../../assets/icons/ic-mobile.svg'
import icMl from '../../assets/icons/ic-ml.svg'

const CARD_BACKGROUND = {
  background:
    'radial-gradient(circle at center, rgba(153,196,244,0.2) 0%, rgba(153,196,244,0.1) 100%)',
}

const BRANCH_BADGE_BACKGROUND = {
  background: 'linear-gradient(170deg, #C3DAF4 0%, #95C6F4 35%, #528CDC 100%)',
}

const NAV_ACTIVE_STYLE = {
  background: 'linear-gradient(135deg, #105EA9 0%, #73BAFF 100%)',
  border: '1.4px solid #4489D4',
}

const CARD_TRANSITION = { duration: 0.35, ease: 'easeOut' }
const HEIGHT_TRANSITION = { duration: 0.4, ease: 'easeInOut' }

const courses = [
  {
    icon: icUiux,
    title: 'UI/UX Design',
    desc: (
      <>
        Focus on creating digital products that users love. You will learn the
        complete{' '}
        <strong>
          design workflow, starting from user research and wireframing to
          high-fidelity prototyping.
        </strong>{' '}
        This course provides hands-on experience using{' '}
        <strong>
          industry standard design tools to build intuitive interfaces.
        </strong>
      </>
    ),
    branches: ['Kemanggisan', 'Alam Sutera', 'Bandung', 'Malang'],
  },
  {
    icon: icFe,
    title: 'Front-End Development',
    desc: (
      <>
        Step into the world of web creation. In this course, you will learn the
        core technologies behind interactive websites, including{' '}
        <strong>HTML, CSS, and JavaScript.</strong> You will practice building
        responsive{' '}
        <strong>
          layouts and translating visual designs into functional web pages.
        </strong>
      </>
    ),
    branches: ['Kemanggisan', 'Alam Sutera', 'Bandung', 'Malang'],
  },
  {
    icon: icBe,
    title: 'Back-End Development',
    desc: (
      <>
        Learn how to build the hidden engine that powers digital products. This
        course covers{' '}
        <strong>
          server-side programming, database management, and API creation.
        </strong>{' '}
        You will understand how to{' '}
        <strong>
          manage data flow securely and connect applications to relational
          databases.
        </strong>
      </>
    ),
    branches: ['Kemanggisan', 'Alam Sutera', 'Bandung', 'Malang'],
  },
  {
    icon: icJava,
    title: 'Java Programming',
    desc: (
      <>
        Build a solid foundation in software engineering. You will learn the
        core{' '}
        <strong>
          yntax of Java, object oriented programming principles, and fundamental
          data structures.
        </strong>{' '}
        This course trains your{' '}
        <strong>logical thinking to solve complex algorithmic </strong> problems
        efficiently.
      </>
    ),
    branches: ['Kemanggisan', 'Alam Sutera', 'Bandung', 'Malang'],
  },
  {
    icon: icCprog,
    title: 'C Programming',
    desc: (
      <>
        Discover the foundational language of modern computer science. You will
        learn core{' '}
        <strong>
          programming logic, memory management, and procedural programming
          concepts.
        </strong>{' '}
        Understanding C <strong>provides a massive advantage</strong> when
        learning other complex computing systems.
      </>
    ),
    branches: ['Alam Sutera'],
  },
  {
    icon: icMobile,
    title: 'Mobile Application Development',
    desc: (
      <>
        Bring your application ideas to the smartphone screen. You will learn
        how to{' '}
        <strong>
          design mobile layouts, manage application lifecycles, and handle user
          interactions.
        </strong>{' '}
        This course guides you step by step to{' '}
        <strong>build functional Android applications.</strong>
      </>
    ),
    branches: ['Kemanggisan'],
  },
  {
    icon: icMl,
    title: 'Machine Learning',
    desc: (
      <>
        Explore the algorithms that drive artificial intelligence. You will
        learn how to{' '}
        <strong>
          process datasets, train predictive models, and evaluate algorithm
          performance
        </strong>{' '}
        using Python. This course provides{' '}
        <strong>practical experience in building intelligent systems</strong>{' '}
        that learn from data.
      </>
    ),
    branches: ['Kemanggisan'],
  },
]

function BranchBadge({ label }) {
  return (
    <span
      style={BRANCH_BADGE_BACKGROUND}
      className="inline-flex items-center justify-center rounded-sm px-[clamp(0.5rem,1.8vw,1.5rem)] py-[clamp(0.1rem,0.6vw,0.5rem)] whitespace-nowrap"
    >
      <span className="gradient-text leading-none text-[clamp(0.625rem,1.6vw,0.9rem)] font-semibold">
        {label}
      </span>
    </span>
  )
}

function CourseIcon({ icon, title, className }) {
  return (
    <div className={className}>
      <img src={icon} alt={title} className="h-full w-full object-contain" />
    </div>
  )
}

function CourseCard({ course }) {
  return (
    <motion.div
      key={course.title}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={CARD_TRANSITION}
      className="relative overflow-hidden rounded-xl backdrop-blur-2xl py-8 px-6 sm:py-10 sm:px-8 md:py-14 md:px-10 lg:py-20 lg:px-15 text-center sm:text-left"
      style={CARD_BACKGROUND}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-6 md:gap-10 lg:gap-12">
        <div className="w-full sm:order-1">
          <h3 className="text-primary mb-2 text-[clamp(1.05rem,3.4vw,1.875rem)] font-semibold">
            {course.title}
          </h3>

          <CourseIcon
            icon={course.icon}
            title={course.title}
            className="sm:hidden flex h-24 w-24 mx-auto items-center justify-center overflow-hidden my-5"
          />

          <p className="text-[clamp(0.75rem,2vw,1.125rem)] text-secondary leading-relaxed">
            {course.desc}
          </p>

          <div className="mt-3 sm:mt-5 flex flex-wrap justify-center sm:justify-start gap-[clamp(0.35rem,1vw,1rem)]">
            {course.branches.map((branch) => (
              <BranchBadge key={branch} label={branch} />
            ))}
          </div>
        </div>

        <CourseIcon
          icon={course.icon}
          title={course.title}
          className="hidden sm:flex sm:order-2 h-32 w-32 md:h-44 md:w-44 lg:h-60 lg:w-60 shrink-0 items-center justify-center overflow-hidden"
        />
      </div>

      <GradientBorder variant="card" className="rounded-xl" />
    </motion.div>
  )
}

function NavButton({ course, variants, active, onClick }) {
  return (
    <motion.button
      variants={variants}
      onClick={onClick}
      aria-label={course.title}
      aria-current={active}
      data-cursor-hover
      animate={{ scale: active ? 1.12 : 1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`flex aspect-square items-center justify-center rounded-md lg:rounded-xl transition-all shrink-0 ${
        active
          ? 'shadow-[0_4px_14px_rgba(16,94,169,0.35)]'
          : 'bg-white hover:bg-primary/10'
      }`}
      style={{
        width: 'clamp(2.25rem, 6vw, 5rem)',
        height: 'clamp(2.25rem, 6vw, 5rem)',
        ...(active ? NAV_ACTIVE_STYLE : {}),
      }}
    >
      <img
        src={course.icon}
        alt={course.title}
        className={`transition-all duration-300 ${
          active ? 'brightness-0 invert' : ''
        }`}
        style={{
          width: 'clamp(1.1rem, 3.2vw, 3rem)',
          height: 'clamp(1.1rem, 3.2vw, 3rem)',
        }}
      />
    </motion.button>
  )
}

export default function Courses() {
  const { index, current: activeCourse, goTo } = useCarousel(courses)

  const headingVariants = useScrollReveal(24, 0.6)
  const cardWrapperVariants = useScrollReveal(32, 0.6)
  const navItemVariants = useScrollReveal(16, 0.4)
  const navContainerVariants = useStaggerContainer(0.08)

  return (
    <section
      id="courses"
      className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14"
    >
      <BlueGlow className="right-0 top-[40%] h-[220px] w-[220px] sm:h-[380px] sm:w-[380px] lg:-right-[60px] lg:top-[60%] lg:h-[480px] lg:w-[480px] z-0" />
      <WhiteGlow className="right-0 top-[68%] h-[220px] w-[220px] sm:h-[380px] sm:w-[380px] lg:-right-[60px] lg:top-[82%] lg:h-[480px] lg:w-[480px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={headingVariants}
          className="mb-4 sm:mb-6 md:mb-8 leading-none tracking-normal font-outfit gradient-text text-[clamp(1.25rem,4.5vw,3rem)] font-semibold"
        >
          Our Courses
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
          variants={cardWrapperVariants}
          layout
        >
          <motion.div
            layout
            transition={HEIGHT_TRANSITION}
            className="relative w-full overflow-hidden rounded-xl"
          >
            <AnimatePresence mode="wait">
              <CourseCard course={activeCourse} />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={navContainerVariants}
          className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"
        >
          {courses.map((course, i) => (
            <NavButton
              key={course.title}
              course={course}
              variants={navItemVariants}
              active={i === index}
              onClick={() => goTo(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
