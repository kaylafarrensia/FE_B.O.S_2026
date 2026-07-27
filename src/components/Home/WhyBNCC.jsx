import { motion } from 'framer-motion'
import GridBackground from '../common/effects/GridBackground.jsx'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import BlueGlow from '../common/effects/BlueGlow.jsx'
import { RevealGroup, RevealItem } from '../common/animation/Reveal.jsx'
import icSoftskill from '../../assets/icons/ic-softskill.svg'
import icNetworking from '../../assets/icons/ic-networking.svg'
import icExperiences from '../../assets/icons/ic-experiences.svg'
import icHardskill from '../../assets/icons/ic-hardskill.svg'
import icSatComserve from '../../assets/icons/ic-sat-comserve.svg'
import icTechInsight from '../../assets/icons/ic-tech-insight.svg'

const reasons = [
  {
    id: 'soft-skill',
    icon: icSoftskill,
    title: 'Soft Skill',
    desc: 'Develop your leadership, teamwork, and communication abilities by managing actual projects and leading committees.',
    wide: true,
  },
  {
    id: 'networking',
    icon: icNetworking,
    title: 'Networking',
    desc: 'Build strong connections with fellow tech enthusiasts, experienced alumni, and industry professionals across all BINUS regions.',
    wide: false,
  },
  {
    id: 'experiences',
    icon: icExperiences,
    title: 'Experiences',
    desc: 'Apply your theoretical knowledge into practice by building actual digital products and organizing technology events.',
    wide: false,
  },
  {
    id: 'hard-skill',
    icon: icHardskill,
    title: 'Hard Skill',
    desc: 'Master modern programming languages and design tools directly through our intensive Learning and Training sessions.',
    wide: true,
  },
  {
    id: 'sat-comserv',
    icon: icSatComserve,
    title: 'SAT Point & Comserv',
    desc: 'Fulfill your university graduation requirements easily while contributing directly to society through our social initiatives.',
    wide: true,
  },
  {
    id: 'tech-insight',
    icon: icTechInsight,
    title: 'Tech Insight',
    desc: 'Stay fully updated on the newest technology trends and digital innovations through our exclusive seminars and workshops.',
    wide: false,
  },
]

function Card({ reason }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      data-cursor-hover
      className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 lg:gap-6 rounded-[14px] sm:rounded-[20px] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(153,196,244,0.20)_0%,rgba(153,196,244,0.10)_100%)] backdrop-blur-md p-5 sm:p-7 lg:p-9 h-full col-span-1 ${
        reason.wide ? 'sm:col-span-5' : 'sm:col-span-4'
      }`}
    >
      <div
        className="flex h-10 w-10 sm:h-20 sm:w-20 lg:h-25 lg:w-25 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1E5FA8] to-[#5FA0DE] ring ring-[#4489D4] ring-offset-1 ring-offset-transparent"
        style={{
          boxShadow:
            '0px 0px 10px 4px rgba(120, 195, 250, 0.65), 0px 0px 35px 8px rgba(120, 195, 250, 0.35), 0px 0px 0px 2px rgba(68, 137, 212, 0.6)',
        }}
      >
        <img
          src={reason.icon}
          alt={reason.title}
          className="h-5 w-5 sm:h-9 sm:w-9 lg:h-12 lg:w-12"
        />
      </div>

      <div className="flex-1 text-left min-w-0">
        <h3 className="font-semibold text-primary text-xs sm:text-lg lg:text-xl mb-0.5 sm:mb-1.5">
          {reason.title}
        </h3>
        <p className="text-[10px] sm:text-sm lg:text-[16px] text-secondary font-regular font-poppins leading-snug sm:leading-relaxed">
          {reason.desc}
        </p>
      </div>

      <GradientBorder
        variant="card"
        className="rounded-[16px] sm:rounded-[20px]"
      />
    </motion.div>
  )
}

export default function WhyBNCC() {
  return (
    <section className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14">
      <GridBackground />

      <BlueGlow className="-left-60 -bottom-40 h-[220px] w-[220px] sm:-right-32 sm:-bottom-52 sm:h-[380px] sm:w-[380px] lg:-right-[280px] lg:-bottom-60 lg:h-[700px] lg:w-[700px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 lg:mb-10 leading-none tracking-normal font-outfit gradient-text text-3xl sm:text-4xl lg:text-6xl font-semibold text-center"
        >
          Why BNCC?
        </motion.h2>

        <RevealGroup className="grid grid-cols-2 sm:grid-cols-9 gap-2.5 sm:gap-4 lg:gap-6">
          {reasons.map((reason, index) => (
            <RevealItem
              key={reason.id}
              direction={index % 2 === 0 ? 'left' : 'right'}
              className={reason.wide ? 'sm:col-span-5' : 'sm:col-span-4'}
            >
              <Card reason={reason} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
