import { motion } from 'framer-motion'
import SocialLinks from '../ComingSoon/SocialLinks.jsx'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import {
  useScrollReveal,
  useStaggerContainer,
} from '../../hooks/useScrollReveal.js'
import icWhatsApp from '../../assets/icons/ic-whatsapp.svg'

const branches = [
  {
    name: 'Kemanggisan',
    contacts: [{ name: 'BNCC', phone: '085178100246' }],
  },
  {
    name: 'Alam Sutera',
    contacts: [
      { name: 'Keane Areliano', phone: '08113389929' },
      { name: 'Keihaen A V', phone: '08989177830' },
    ],
  },
  {
    name: 'Bandung',
    contacts: [
      { name: 'M. Abiyyu R. R', phone: '082128347298' },
      { name: 'Gregory L', phone: '0895620061212' },
    ],
  },
  {
    name: 'Malang',
    contacts: [
      { name: 'Nariswari S H', phone: '089671706374' },
      { name: 'Kadek K N V', phone: '081337354700' },
    ],
  },
]

function waLink(phone) {
  const digits = phone.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${intl}`
}

function ContactEntry({ name, phone }) {
  return (
    <div className="min-w-0">
      <p className="font-bold text-secondary text-[clamp(0.9rem,2.6vw,1.5rem)] truncate">
        {name}
      </p>
      <div className="mt-1 flex items-center gap-1.5 sm:gap-2 text-[clamp(0.7rem,1.6vw,0.875rem)] text-secondary min-w-0">
        <img
          src={icWhatsApp}
          alt="WhatsApp"
          className="shrink-0"
          style={{
            width: 'clamp(1.1rem, 3vw, 1.875rem)',
            height: 'clamp(1.1rem, 3vw, 1.875rem)',
          }}
        />
        <span className="text-secondary text-[clamp(0.8rem,2.1vw,1.25rem)] font-poppins break-all">
          {phone}
        </span>
      </div>
      <a
        href={waLink(phone)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 sm:mt-3 block w-full rounded-lg btn-gradient px-2 sm:px-3 py-2 sm:py-3 text-center text-[clamp(0.75rem,1.9vw,1.125rem)] font-regular font-poppins text-base-2 transition-transform hover:scale-[1.03]"
      >
        Contact Us
      </a>
    </div>
  )
}

function BranchCard({ branch }) {
  return (
    <div
      className="
        flex h-full min-w-0 flex-col gap-3 sm:gap-6 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-left
        border sm:border-2 border-[#99C4F4]
        bg-[linear-gradient(135deg,#F0F5FA_0%,#A6D1FF_100%)]
        backdrop-blur-[20px]
        shadow-[0_0_120px_rgba(153,196,244,0.35)]
      "
    >
      <h3 className="text-[clamp(0.85rem,2.2vw,1.5rem)] font-regular text-secondary-2 truncate">
        {branch.name}
      </h3>
      {branch.contacts.map((contact) => (
        <ContactEntry key={contact.name} {...contact} />
      ))}
    </div>
  )
}

export default function ContactUs() {
  const headingVariants = useScrollReveal(24, 0.6)
  const cardVariants = useScrollReveal(28, 0.55)
  const socialVariants = useScrollReveal(20, 0.5)
  const gridVariants = useStaggerContainer(0.08)

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 md:py-36 px-6 sm:px-12 md:px-14"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={headingVariants}
        >
          <SectionHeading className="mb-12 sm:mb-8 md:mb-10">
            Contact Us
          </SectionHeading>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={gridVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {branches.map((branch) => (
            <motion.div key={branch.name} variants={cardVariants}>
              <BranchCard branch={branch} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={socialVariants}
          className="mt-8 sm:mt-15"
        >
          <SocialLinks />
        </motion.div>
      </div>
    </section>
  )
}
