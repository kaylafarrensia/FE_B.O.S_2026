import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Card from './Card'

export default function SuccessCard({
  title = 'Re-registration Successful!',
  message = "Thank you for joining our family! You're now officially a BNCC member.",
}) {
  return (
    <Card className="flex w-full max-w-[560px] mx-auto min-h-[220px] flex-col items-center justify-center p-5 text-center md:min-h-[260px] md:p-6 lg:h-full lg:min-h-[500px] lg:w-full lg:max-w-none lg:p-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0C8E28] to-[#65EC82] shadow-lg md:mb-5 md:h-14 md:w-14 lg:mb-8 lg:h-40 lg:w-40"
      >
        <Check strokeWidth={3} className="text-white w-[22px] h-[22px] md:w-6 md:h-6 lg:w-20 lg:h-20" />
      </motion.div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-base font-semibold leading-relaxed text-[#0A2745] overflow-visible md:text-lg lg:text-6xl"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-2 max-w-sm text-xs text-slate-600 md:mt-3 md:text-sm lg:mt-6 lg:max-w-2xl lg:text-2xl"
      >
        {message}
      </motion.p>
    </Card>
  )
}