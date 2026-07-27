'use client'

import { motion } from 'framer-motion'
import Badge from '../ComingSoon/Badge.jsx'
import PatternTop from '../common/effects/PatternTop.jsx'
import PatternBottom from '../common/effects/PatternBottom.jsx'
import BlueGlow from '../common/effects/BlueGlow.jsx'

const floatIdle = (delay = 0) => ({
  y: [0, -6, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
})

const dragTimes = [0, 0.15, 0.45, 0.6, 0.9, 1]
const dragDuration = 6
const dragRepeatDelay = 2.5

const badgeDrag = {
  x: [0, 0, 18, 22, 8, 0],
  y: [0, 0, -12, -16, -6, 0],
  transition: {
    duration: dragDuration,
    repeat: Infinity,
    repeatDelay: dragRepeatDelay,
    times: dragTimes,
    ease: 'easeInOut',
  },
}

const handlePulse = {
  scale: [1, 1, 1.3, 1.3, 1, 1],
  boxShadow: [
    '0 0 0 rgba(36,116,192,0)',
    '0 0 0 rgba(36,116,192,0)',
    '0 0 14px rgba(36,116,192,0.55)',
    '0 0 14px rgba(36,116,192,0.55)',
    '0 0 0 rgba(36,116,192,0)',
    '0 0 0 rgba(36,116,192,0)',
  ],
  transition: {
    duration: dragDuration,
    repeat: Infinity,
    repeatDelay: dragRepeatDelay,
    times: dragTimes,
    ease: 'easeInOut',
  },
}

function CornerHandle({ className, active = false }) {
  return (
    <motion.span
      animate={active ? handlePulse : undefined}
      className={`
        absolute
        h-3 w-3 sm:h-4 sm:w-4
        border-2
        border-[#2474C0]
        bg-white
        ${className}
      `}
    />
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7FAFE] flex flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32vh] sm:h-[36vh] lg:h-[40vh] overflow-hidden z-0">
        <PatternTop className="absolute inset-x-0 top-0 h-full" />
        <div className="absolute inset-x-0 top-0 h-10 sm:h-16 bg-gradient-to-b from-[#F7FAFE] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56 bg-gradient-to-t from-[#F7FAFE] via-[#F7FAFE]/70 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh] sm:h-[54vh] lg:h-[50vh] overflow-hidden z-0">
        <PatternBottom className="absolute inset-x-0 bottom-0 h-full opacity-80" />
        <div className="absolute inset-x-0 top-0 h-32 sm:h-52 bg-gradient-to-b from-[#F7FAFE] via-[#F7FAFE]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-[#F7FAFE] to-transparent" />
      </div>

      <BlueGlow className="-left-32 -top-32 h-[280px] w-[280px] sm:-left-40 sm:top-0 sm:h-[420px] sm:w-[420px] lg:-left-[300px] lg:top-[50px] lg:h-[700px] lg:w-[700px] z-0" />
      <BlueGlow className="-right-32 -top-32 h-[280px] w-[280px] sm:-right-40 sm:top-0 sm:h-[420px] sm:w-[420px] lg:-right-[300px] lg:top-[50px] lg:h-[700px] lg:w-[700px] z-0" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6 mt-2 mb-6 sm:mt-4 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-sm border border-white/30 bg-primary/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(68,137,212,0.15)] ring-1 ring-white/20 px-5 py-1.5 sm:px-10 sm:py-2"
          >
            <p className="text-sm sm:text-xl lg:text-2xl font-semibold tracking-wide bg-gradient-to-r from-[#0A2745] from-0% to-[#2474C0] to-100% bg-clip-text text-transparent">
              BINA NUSANTARA COMPUTER CLUB
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-[8ch] sm:max-w-[10ch] lg:max-w-none text-center text-balance text-5xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#0A2745] via-[#105EA9] to-[#ACD6FF] bg-clip-text text-transparent"
          >
            OPENING SEASON
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative py-4 sm:py-6"
          >
            <div className="relative border-2 border-[#2474C0] px-6 sm:px-16 lg:px-26 py-2">
              <CornerHandle className="-left-2 -top-2" />
              <CornerHandle className="-right-2 -top-2" />
              <CornerHandle className="-left-2 -bottom-2" />
              <CornerHandle className="-right-2 -bottom-2" />
              <span className="pointer-events-none block text-[80px] sm:text-[110px] lg:text-[180px] font-bold leading-none bg-gradient-to-br from-[#0A2745] to-[#4489D4] bg-clip-text text-transparent">
                2026
              </span>
            </div>

            <motion.div
              animate={floatIdle(0)}
              className="pointer-events-none absolute left-[-100px] -top-4 -translate-y-1/2 scale-[0.55] origin-left sm:left-[-115px] sm:top-[-30px] sm:scale-[0.65] md:left-[-150px] md:top-[-30px] md:scale-75 lg:left-[-290px] lg:top-1/4 lg:scale-80 xl:left-[-320px]"
            >
              <Badge
                text="Networking & Community"
                color="pink"
                flagPosition="right"
              />
            </motion.div>

            <motion.div
              animate={badgeDrag}
              className="pointer-events-none absolute right-[-100px] -top-4 -translate-y-1/2 scale-[0.55] origin-right sm:right-[-120px] sm:top-[-30px] sm:scale-[0.65] md:right-[-150px] md:top-[-30px] md:scale-75 lg:right-[-290px] lg:top-1/4 lg:scale-80 xl:right-[-320px]"
            >
              <Badge text="Tech & Digital Exploration" color="yellow" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-poppins text-base sm:text-lg lg:text-2xl font-medium text-secondary mb-8 sm:mb-4 px-4"
          >
            Shape the Future,
            <br className="sm:hidden" /> Spark the Movement
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex flex-col items-center gap-3"
          >
            <p className="text-secondary font-regular text-sm sm:text-lg">
              Interested in joining us?
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#signup"
              className="inline-flex items-center justify-center rounded-md bg-[linear-gradient(135deg,#0C4076_0%,#4489D4_100%)] text-white font-semibold text-sm transition-all duration-300 hover:brightness-105 px-10 py-3 sm:px-14 sm:py-3.5"
            >
              SIGN UP NOW!
            </motion.a>

            <motion.div
              animate={floatIdle(1)}
              className="pointer-events-none absolute left-1/2 -translate-x-[130%] top-[-100px] scale-[0.55] origin-center sm:left-[-180px] sm:translate-x-0 sm:top-[-15px] sm:scale-[0.65] md:left-[-250px] md:scale-75 lg:left-[-380px] lg:top-1/7 lg:scale-90 xl:left-[-450px]"
            >
              <Badge
                text="Hands-on Experience"
                color="red"
                flagPosition="right"
              />
            </motion.div>

            <motion.div
              animate={floatIdle(1.5)}
              className="pointer-events-none absolute left-1/2 translate-x-[50%] top-[-52px] scale-[0.55] origin-center sm:right-[-180px] sm:left-auto sm:translate-x-0 sm:top-[-15px] sm:scale-[0.65] md:right-[-250px] md:scale-75 lg:right-[-440px] lg:top-1/7 lg:scale-90 xl:right-[-450px]"
            >
              <Badge text="Skill Development" color="green" />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        href="https://www.instagram.com/bnccbinus"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-16 right-4 sm:bottom-28 sm:right-14 lg:bottom-20 lg:right-20 z-20 flex items-center gap-3 sm:gap-4 lg:gap-5 rounded-xl bg-primary pl-2.5 pr-2 py-1 sm:pl-4 sm:pr-3 sm:py-2 lg:pl-5 lg:pr-4 lg:py-2.5 text-[10px] sm:text-sm lg:text-md font-regular text-white"
      >
        #VIVABNCC
        <span className="rounded-md bg-[#1D4D81] px-1.5 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 text-[10px] sm:text-xs lg:text-sm shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
          Love
        </span>
      </motion.a>
    </section>
  )
}
