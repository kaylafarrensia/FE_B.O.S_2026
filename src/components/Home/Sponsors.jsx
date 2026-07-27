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
          'is an AI academy providing industry-relevant education from scratch, focusing on real project portfolios and competition success',
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

function SponsorCard({ sponsor, logoSize }) {
  return (
    <div className="group relative w-full min-h-[110px] sm:min-h-[220px] md:min-h-[350px] overflow-hidden rounded-xl sm:rounded-2xl">
      <div
        className="
          absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl
          bg-[radial-gradient(120%_120%_at_0%_0%,rgba(153,196,244,0.12)_0%,rgba(153,196,244,0.05)_100%)]
          backdrop-blur-[28px]
          px-4 py-4 sm:px-6 sm:py-8 md:p-12
          transition-all duration-500 ease-out
          group-hover:-translate-x-10 group-hover:-translate-y-10 group-hover:opacity-0
        "
      >
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className={`${logoSize} w-auto max-w-full object-contain`}
        />
      </div>

      <div
        className="
          absolute inset-0 flex flex-col justify-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl
          bg-[linear-gradient(135deg,rgba(225,240,255,0.55)_0%,rgba(111,157,207,0.55)_100%)]
          backdrop-blur-[28px]
          px-4 py-4 sm:px-8 sm:py-12 md:p-20
          translate-x-10 translate-y-10 opacity-0 pointer-events-none
          transition-all duration-500 ease-out
          group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto
        "
      >
        <p className="text-sm sm:text-xl md:text-2xl text-secondary leading-relaxed text-start">
          <strong className="font-bold">{sponsor.name.split('.')[0]}</strong>{' '}
          {sponsor.description}
        </p>
        <a
          href={sponsor.link}
          target="_blank"
          className="inline-block w-fit rounded-md btn-gradient px-4 py-1.5 sm:px-8 sm:py-3 text-xs sm:text-lg md:text-xl font-medium text-base-2 transition-transform hover:scale-105"
        >
          Learn more
        </a>

        <GradientBorder variant="hover" className="rounded-2xl" />
      </div>
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
          viewport={{ once: false, amount: 0.4 }}
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
                viewport={{ once: false, amount: 0.5 }}
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
                    viewport={{ once: false, amount: 0.3 }}
                    variants={cardVariants}
                  >
                    <SponsorCard sponsor={sponsor} logoSize={tier.logoSize} />
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
