import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GradientBorder from '../common/effects/GradientBorder.jsx'
import WhiteGlow from '../common/effects/WhiteGlow.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import icArrow from '../../assets/icons/ic-arrow.svg'

const faqs = [
  {
    question: 'What is Bina Nusantara Computer Club?',
    answer:
      'Bina Nusantara Computer Club (BNCC) is a student organization at BINUS University with a legacy of over 37 years. Our organization focuses on technology and computer science development.',
  },
  {
    question: 'Do I need to be from a specific major to join?',
    answer:
      'Not at all. Students from all majors are completely welcome to join and become BNCC members.',
  },
  {
    question: 'Where are the BNCC branches located?',
    answer:
      'Currently, BNCC operates across 4 campus regions: Kemanggisan, Bandung, Malang, and Alam Sutera.',
  },
  {
    question: 'What is Learning and Training (LnT)?',
    answer:
      'Learning and Training (LnT) are specialized IT courses offered by BNCC. Through LnT, you can learn and enhance your technical skills in various fields, such as:',
    list: [
      'UI/UX Design',
      'Front End Development',
      'Back End Development',
      'Mobile Application Development',
      'Java Programming',
      'C Programming',
      'Machine Learning',
    ],
  },
]

function FAQItem({ item, isOpen, onClick, variants }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={variants}
      className="relative rounded-xl sm:rounded-2xl bg-[linear-gradient(135deg,rgba(153,196,244,0.28)_0%,rgba(153,196,244,0.12)_100%)] backdrop-blur-md overflow-hidden font-poppins font-medium"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-12 py-3.5 sm:py-5"
      >
        <span className="text-secondary text-[clamp(0.8rem,2.1vw,1.3rem)] text-left">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : -90 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <img
            src={icArrow}
            alt=""
            style={{
              width: 'clamp(0.6rem, 1.4vw, 1rem)',
              height: 'clamp(0.6rem, 1.4vw, 1rem)',
            }}
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3.5 sm:px-12 sm:pb-5">
              <div className="border-t border-secondary pt-3 sm:pt-4">
                <p className="text-secondary leading-relaxed text-left text-[clamp(0.8rem,2vw,1.125rem)]">
                  {item.answer}
                </p>
                {item.list && (
                  <ul className="mt-2 sm:mt-3 list-disc pl-5 sm:pl-7 text-left text-secondary text-[clamp(0.8rem,2vw,1.125rem)] leading-relaxed space-y-0.5 sm:space-y-1">
                    {item.list.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GradientBorder variant="faq" className="rounded-xl sm:rounded-2xl" />
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1)

  const headingVariants = useScrollReveal(20, 0.6)
  const itemVariants = useScrollReveal(16, 0.5)

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14"
    >
      <WhiteGlow className="-left-32 -top-32 h-[380px] w-[380px] sm:-left-40 sm:top-0 sm:h-[560px] sm:w-[560px] lg:-left-[100px] lg:top-[50px] lg:h-[1000px] lg:w-[1000px] z-0" />
      <WhiteGlow className="-right-32 -top-32 h-[380px] w-[380px] sm:-right-40 sm:top-0 sm:h-[560px] sm:w-[560px] lg:-right-[300px] lg:top-[100px] lg:h-[500px] lg:w-[500px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
          className="mb-4 sm:mb-8 md:mb-10 leading-tight sm:leading-none tracking-normal font-outfit gradient-text text-[clamp(1.25rem,4.5vw,3rem)] font-semibold"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="flex flex-col gap-2.5 sm:gap-4">
          {faqs.map((item, index) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              variants={itemVariants}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
