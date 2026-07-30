import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'

export default function SuccessCard({
  title = 'Re-registration Successful!',
  message = "Thank you for joining our family! You're now officially a BNCC member.",
}) {
  const navigate = useNavigate()

  return (
    <Card className="flex w-full max-w-[560px] mx-auto min-h-[520px] flex-col items-center justify-center p-5 text-center md:max-w-[660px] md:min-h-[460px] md:p-6 lg:h-full lg:min-h-[500px] lg:w-full lg:max-w-none lg:p-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0C8E28] to-[#65EC82] shadow-lg md:mb-5 md:h-14 md:w-14 lg:mb-8 lg:h-30 lg:w-30"
      >
        <Check strokeWidth={3} className="text-white w-[22px] h-[22px] md:w-6 md:h-6 lg:w-15 lg:h-15" />
      </motion.div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-base font-semibold leading-relaxed text-[#0A2745] overflow-visible md:text-lg lg:text-[48px] bg-none [-webkit-text-fill-color:#0A2745] [background-clip:unset] [-webkit-background-clip:unset]"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-2 max-w-sm text-xs text-slate-600 md:mt-3 md:text-sm lg:mt-6 lg:max-w-2xl lg:text-lg"
      >
        {message}
      </motion.p>

      <motion.button
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        onClick={() => navigate('/dashboard/profile')}
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-6 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
      >
        Go to Profile
      </motion.button>
    </Card>
  )
}