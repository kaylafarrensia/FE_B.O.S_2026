'use client'

import { motion } from 'framer-motion'
import BlueGlow from '../common/effects/BlueGlow.jsx'
import icBnccFact1 from '../../assets/icons/ic-bncc-fact1.svg'
import icBnccFact2 from '../../assets/icons/ic-bncc-fact2.svg'
import icBnccFact3 from '../../assets/icons/ic-bncc-fact3.svg'

const CARD_BACKGROUND = {
  background:
    'radial-gradient(120% 120% at 0% 0%, rgba(153,196,244,0.20) 0%, rgba(153,196,244,0.10) 100%)',
}

const CARD_BORDER_MASK = {
  padding: '2px',
  background: `
    linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(153,196,244,0.4) 100%),
    radial-gradient(circle at center, rgba(21,21,21,0.5) 0%, rgba(21,21,21,0) 100%),
    linear-gradient(180deg, rgba(153,196,244,0.3) 0%, rgba(153,196,244,0) 100%),
    radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)
  `,
  WebkitMask:
    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const FACTS = [
  {
    icon: icBnccFact1,

    text: (
      <>
        <span className="text-[#2474C0] font-semibold">
          BNCC has four branches
        </span>{' '}
        located in Kemanggisan, Alam Sutera, Bandung, and Malang.
      </>
    ),
  },
  {
    icon: icBnccFact2,
    text: (
      <>
        BNCC is{' '}
        <span className="text-[#2474C0] font-semibold">
          the only student organization
        </span>{' '}
        at BINUS University that{' '}
        <span className="text-[#2474C0] font-semibold">
          has its own software house.
        </span>
      </>
    ),
  },
  {
    icon: icBnccFact3,
    text: (
      <>
        One of BNCC's social media accounts, @filetechno, has{' '}
        <span className="text-[#2474C0] font-semibold">
          more than 8,000 followers.
        </span>
      </>
    ),
  },
]

function FactCard({ icon, text }) {
  return (
    <motion.div
      variants={cardVariants}
      data-cursor-hover
      whileHover={{ scale: 1.0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-full max-w-none sm:max-w-[340px] mx-auto min-h-[260px]
        overflow-hidden rounded-[20px] backdrop-blur-[28px]
        p-6 sm:p-7 lg:p-8
        flex flex-col items-center justify-center
        transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(36,116,192,0.2)]"
      style={CARD_BACKGROUND}
    >
      <div
        className="mb-4 flex items-center justify-center shrink-0"
        style={{
          width: 'clamp(4.5rem, 11vw, 7rem)',
          height: 'clamp(4.5rem, 11vw, 7rem)',
        }}
      >
        <img src={icon} alt="" className="h-full w-full object-contain" />
      </div>

      <p className="text-[clamp(0.95rem,2.4vw,1.125rem)] text-regular text-secondary leading-relaxed">
        {text}
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={CARD_BORDER_MASK}
      />
    </motion.div>
  )
}

export default function FunFacts() {
  return (
    <section className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14">
      <BlueGlow className="-left-20 -top-40 h-[220px] w-[220px] sm:-left-32 sm:-top-52 sm:h-[380px] sm:w-[380px] lg:-left-[280px] lg:-top-70 lg:h-[650px] lg:w-[650px] z-0" />
      <BlueGlow className="-right-20 -bottom-40 h-[220px] w-[220px] sm:-right-32 sm:-bottom-52 sm:h-[380px] sm:w-[380px] lg:-right-[280px] lg:-bottom-90 lg:h-[700px] lg:w-[700px] z-0" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          variants={headingVariants}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <div className="gradient-text leading-none tracking-normal font-outfit text-[clamp(1.15rem,3vw,2.25rem)] font-semibold">
            BNCC
          </div>

          <div className="gradient-text leading-none tracking-normal font-outfit uppercase sm:normal-case text-[clamp(1.8rem,5vw,3rem)] font-semibold mt-1">
            Fun Facts
          </div>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 place-items-stretch">
          {FACTS.map((fact) => (
            <FactCard key={fact.icon} icon={fact.icon} text={fact.text} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
