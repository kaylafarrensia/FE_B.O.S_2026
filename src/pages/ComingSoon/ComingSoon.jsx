import { motion } from 'framer-motion'
import Badge from '../../components/ComingSoon/Badge'
import EmailForm from '../../components/ComingSoon/EmailForm'
import SocialLinks from '../../components/ComingSoon/SocialLinks'
import CountdownTimer from '../../components/ComingSoon/CountDownTimer'
import Footer from '../../components/ComingSoon/Footer'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-100 flex flex-col">
      <PerspectiveGrid className="absolute inset-x-0 -top-60" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-3xl rounded-3xl border border-white/60 bg-white/40 p-10 backdrop-blur-md shadow-xl"
        >
          {/* Tag mengambang di kiri & kanan, sesuai desain */}
          <Badge
            text="Networking & Community"
            color="pink"
            className="absolute -left-6 top-1/2 hidden -translate-y-1/2 md:block"
          />
          <Badge
            text="Tech & Digital Exploration"
            color="green"
            className="absolute -right-6 top-1/3 hidden -translate-y-1/2 md:block"
          />

          <div className="flex flex-col items-center gap-6 text-center">
            <Badge text="BNCC OPENING SEASON 2026" color="blue" />

            <h1 className="border-y-4 border-blue-500 px-6 py-2 text-5xl font-extrabold tracking-tight text-blue-950 sm:text-6xl">
              COMING SOON
            </h1>

            <p className="max-w-md text-slate-600">
              Drop your email and be the first to catch the wave of our latest updates!
            </p>

            <EmailForm />
            <SocialLinks />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 flex flex-col items-center gap-8 text-center"
        >
          <h2 className="text-3xl font-bold text-blue-950">
            Brace yourself. It's <span className="text-blue-500">coming.</span>
          </h2>
          <CountdownTimer targetDate="2026-08-01T00:00:00" />
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}