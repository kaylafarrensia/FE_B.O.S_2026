import { useState } from 'react'
import { motion } from 'framer-motion'
import GridBackground from '../common/effects/GridBackground.jsx'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import WhiteGlow from '../common/effects/WhiteGlow.jsx'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import IchAIppy from '../../assets/icons/ic-hAIppy-logo.svg'
// import IcWordpress from '../../assets/icons/ic-wordpress.svg'

const tiers = [
  {
    label: 'Gold Sponsor',
    active: true,
    logoSize: 'h-16 sm:h-42 md:h-56',
    sponsors: [
      {
        name: 'hAIppy',
        logo: IchAIppy,
        description:
          'is an AI academy providing industry-relevant education from scratch, focusing on real project portfolios and competition success.',
        link: 'https://haippy.co/',
      },
    ],
  },
  // ganti/tambah data sponsor disini
  // {
  //   label: 'Silver Sponsor',
  //   active: false,
  //   logoSize: 'h-10 sm:h-20 md:h-28',
  //   sponsors: [
  //     {
  //       name: 'WordPress.com',
  //       logo: IcWordpress,
  //       description:
  //         'adalah sistem manajemen konten (Content Management System/CMS) yang digunakan untuk membuat dan mengelola website dengan mudah. Platform ini mendukung berbagai jenis website, mulai dari blog, company profile, portofolio, hingga toko online.',
  //       link: '#',
  //     },
  //   ],
  // },
  // {
  //   label: 'Bronze Sponsor',
  //   active: false,
  //   logoSize: 'h-9 sm:h-18 md:h-24',
  //   sponsors: [
  //     {
  //       name: 'WordPress.com',
  //       logo: IcWordpress,
  //       description:
  //         'adalah sistem manajemen konten (Content Management System/CMS) yang digunakan untuk membuat dan mengelola website dengan mudah. Platform ini mendukung berbagai jenis website, mulai dari blog, company profile, portofolio, hingga toko online.',
  //       link: '#',
  //     },
  //   ],
  // },
]

function SponsorCard({ sponsor, logoSize, isGold }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    if (window.innerWidth < 1024) {
      setIsFlipped((prev) => !prev)
    }
  }

  return (
    <div className="relative w-full">
      <div
        onClick={handleCardClick}
        className="group relative w-full min-h-[180px] sm:min-h-[220px] md:min-h-[350px] overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer"
      >
        <div
          className={`
            absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl
            bg-[radial-gradient(120%_120%_at_0%_0%,rgba(153,196,244,0.12)_0%,rgba(153,196,244,0.05)_100%)]
            backdrop-blur-[28px]
            px-4 py-4 sm:px-6 sm:py-8 md:p-12
            transition-all duration-500 ease-out
            lg:group-hover:-translate-x-10 lg:group-hover:-translate-y-10 lg:group-hover:opacity-0
            ${isFlipped ? '-translate-x-10 -translate-y-10 opacity-0 pointer-events-none' : ''}
          `}
        >
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className={`${logoSize} w-auto max-w-full object-contain`}
          />
        </div>

        <div
          className={`
            absolute inset-0 flex flex-col justify-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl
            bg-[linear-gradient(135deg,rgba(225,240,255,0.55)_0%,rgba(111,157,207,0.55)_100%)]
            backdrop-blur-[28px]
            p-5 sm:px-8 sm:py-12 md:p-20
            transition-all duration-500 ease-out
            lg:group-hover:translate-x-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto
            ${isFlipped ? 'translate-x-0 translate-y-0 opacity-100 pointer-events-auto' : 'translate-x-10 translate-y-10 opacity-0 pointer-events-none'}
          `}
        >
          <p className="text-sm sm:text-xl md:text-2xl text-secondary leading-relaxed text-start">
            <strong className="font-bold">{sponsor.name.split('.')[0]}</strong>{' '}
            {sponsor.description}
          </p>
          <a
            href={sponsor.link}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="inline-block w-fit rounded-md btn-gradient px-4 py-1.5 sm:px-8 sm:py-3 text-xs sm:text-lg md:text-xl font-medium text-base-2 transition-transform hover:scale-105"
          >
            Learn more
          </a>

          <GradientBorder variant="hover" className="rounded-2xl" />
        </div>
      </div>

      {isGold && (
        <div
          className={`
            absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 md:-bottom-6 md:-right-6 lg:-bottom-7 lg:-right-7
            pointer-events-none z-20 select-none
            transition-all duration-500 ease-out
            lg:group-hover:opacity-0 lg:group-hover:translate-x-[-40px] lg:group-hover:translate-y-[-40px]
            ${isFlipped ? 'opacity-0 translate-x-[-40px] translate-y-[-40px]' : 'opacity-100'}
          `}
        >
          <svg width="54" height="50" viewBox="0 0 54 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            {/* Click rays */}
            <line x1="8" y1="16" x2="2" y2="16" stroke="#4489D4" strokeWidth="3" strokeLinecap="round"/>
            <line x1="10.3" y1="10.3" x2="4.7" y2="4.7" stroke="#4489D4" strokeWidth="3" strokeLinecap="round"/>
            <line x1="16" y1="8" x2="16" y2="2" stroke="#4489D4" strokeWidth="3" strokeLinecap="round"/>
            <line x1="21.7" y1="10.3" x2="27.3" y2="4.7" stroke="#4489D4" strokeWidth="3" strokeLinecap="round"/>
            <line x1="10.3" y1="21.7" x2="4.7" y2="27.3" stroke="#4489D4" strokeWidth="3" strokeLinecap="round"/>

            {/* Cursor Arrow offset by (16, 16) */}
            <g transform="translate(16, 16)">
              <path d="M0.519588 1.58797L19.0708 32.7078C19.1898 32.9072 19.3645 33.0867 19.5711 33.2215C19.7776 33.3563 20.0058 33.4399 20.2246 33.4609C20.4433 33.4819 20.6419 33.4392 20.7931 33.3388C20.9443 33.2383 21.0408 33.0849 21.0694 32.8996L23.3019 18.3921C23.3366 18.1675 23.4708 17.9913 23.6782 17.8982L37.0687 11.889C37.2392 11.8121 37.361 11.6784 37.4175 11.5062C37.474 11.334 37.4624 11.1316 37.3843 10.9267C37.3062 10.7218 37.1655 10.5243 36.9812 10.3611C36.7969 10.1979 36.5781 10.077 36.3546 10.0148L1.42379 0.400789C1.23157 0.348417 1.04366 0.341655 0.879233 0.381192C0.714802 0.420729 0.579736 0.50515 0.487812 0.625843C0.395888 0.746536 0.350396 0.899181 0.355979 1.06821C0.361561 1.23723 0.418017 1.41659 0.519588 1.58797Z" fill="url(#paint0_linear_click)" stroke="#EAF5FF" strokeWidth="0.71" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_click" x1="-4" y1="-4" x2="33" y2="-14" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B5D9FF"/>
                <stop offset="1" stopColor="#0061CB"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  )
}

export default function Sponsors() {
  const headingVariants = useScrollReveal(24, 0.6)
  const tierLabelVariants = useScrollReveal(18, 0.5)
  const cardVariants = useScrollReveal(28, 0.55)

  const visibleTiers = tiers.filter((tier) => tier.active)

  return (
    <section
      id="sponsorship"
      className="relative py-12 sm:py-24 md:py-36 px-6 sm:px-12 md:px-14"
    >
      <GridBackground />

      <WhiteGlow
        opacity={0.4}
        className="left-[90%] top-[17%] -translate-x-1/2 -translate-y-1/2 h-[240px] w-[240px] sm:h-[420px] sm:w-[420px] lg:h-[760px] lg:w-[760px] z-0"
      />
      <WhiteGlow
        opacity={0.4}
        className="left-[10%] top-[40%] -translate-x-1/2 -translate-y-1/2 h-[240px] w-[240px] sm:h-[420px] sm:w-[420px] lg:h-[760px] lg:w-[760px] z-0"
      />
      <WhiteGlow
        opacity={0.4}
        className="left-[90%] top-[51%] -translate-x-1/2 -translate-y-1/2 h-[170px] w-[170px] sm:h-[300px] sm:w-[300px] lg:h-[540px] lg:w-[540px] z-0"
      />
      <WhiteGlow
        opacity={0.4}
        className="left-[10%] top-[82%] -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] sm:h-[460px] sm:w-[460px] lg:h-[1000px] lg:w-[1000px] z-0"
      />
      <WhiteGlow
        opacity={0.4}
        className="left-[95%] top-[100%] -translate-x-1/2 -translate-y-1/2 h-[120px] w-[120px] sm:h-[220px] sm:w-[220px] lg:h-[420px] lg:w-[420px] z-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingVariants}
        >
          <SectionHeading size="sm" className="mb-6 sm:mb-6 md:mb-8">
            Our Sponsors
          </SectionHeading>
        </motion.div>

        <div className="space-y-8 sm:space-y-16 mt-6 sm:mt-16">
          {visibleTiers.map((tier) => (
            <div key={tier.label}>
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={tierLabelVariants}
                className="text-base sm:text-2xl md:text-4xl font-semibold gradient-text mb-3 sm:mb-8"
              >
                {tier.label}
              </motion.h3>
              <div className="space-y-3 sm:space-y-6">
                {tier.sponsors.map((sponsor) => (
                  <motion.div
                    key={sponsor.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={cardVariants}
                  >
                    <SponsorCard
                      sponsor={sponsor}
                      logoSize={tier.logoSize}
                      isGold={tier.label === 'Gold Sponsor'}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
