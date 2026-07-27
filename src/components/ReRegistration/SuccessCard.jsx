import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Card from './Card'

export default function SuccessCard({
  title = 'Re-registration Successful!',
  message = "Thank you for joining our family! You're now officially a BNCC member.",
}) {
  return (
    <Card className="flex h-full min-h-[420px] w-full flex-col items-center justify-center p-8 text-center md:min-h-[520px] md:p-12 lg:min-h-[500px]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0C8E28] to-[#65EC82] shadow-lg md:h-32 md:w-32 lg:h-40 lg:w-40"
      >
        <Check size={48} strokeWidth={3} className="text-white md:size-16 lg:size-20" />
      </motion.div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-3xl font-semibold text-[#0A2745] md:text-5xl lg:text-6xl overflow-visible leading-relaxed"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-4 max-w-2xl text-base text-slate-600 md:mt-6 md:text-xl lg:text-2xl"
      >
        {message}
      </motion.p>
    </Card>
  )
}