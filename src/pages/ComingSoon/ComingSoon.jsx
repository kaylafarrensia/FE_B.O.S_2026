import { motion } from 'framer-motion'
import Badge from '../../components/ComingSoon/Badge'
import EmailForm from '../../components/ComingSoon/EmailForm'
import SocialLinks from '../../components/ComingSoon/SocialLinks'
import CountdownTimer from '../../components/ComingSoon/CountDownTimer'
import Footer from '../../components/ComingSoon/Footer'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'
import Typewriter from '../../components/ComingSoon/Typewriter'

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-blue-100 flex flex-col z-10">
      <PerspectiveGrid className="absolute inset-x-0 -top-60" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <img
          src="/public/images/img-glow-tl.svg"
          alt="color-dodge"
          className="absolute top-0 left-0 w-[580px] h-[460px] opacity-100 z-20"
        />
        <img
          src="/public/images/img-glow-mid.svg"
          alt="color-dodge"
          className="absolute top-140 -right-20 w-[680px] h-[560px] opacity-100 z-20"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-5xl rounded-3xl border-2 border-[#99BDDF] bg-white/40 p-10 backdrop-blur-md shadow-xl"
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
            <h1 className="rounded-[10px] border border-white bg-white/20 px-6 py-2 text-xl font-bold shadow-[inset_0_2px_12px_rgba(68,137,212,0.3)] backdrop-blur-md">
              <span className="bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
                BNCC OPENING SEASON 2026
              </span>
            </h1>

            <h1 className="px-6 py-2 text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#0A2745] to-[#4489D4] bg-clip-text text-transparent lg:text-8xl">
              <Typewriter text="COMING SOON" speed={120} startDelay={300} />
            </h1>

            <p className="max-w-s font-poppins text-black text-lg">
              Drop your email and be the first to catch the wave of our latest
              updates!
            </p>

            <EmailForm />
            <SocialLinks />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-55 mb-30 flex flex-col items-center gap-8 text-center z-10"
        >
          <h2 className="text-4xl font-semibold leading-[1.3] pb-1 bg-linear-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
            Brace yourself. It's coming.
          </h2>
          <CountdownTimer targetDate="2026-08-01T00:00:00" />
        </motion.div>
      </main>

      <img
        src="/public/images/img-glow-bl.svg"
        alt="color-dodge"
        className="absolute top-220 left-0 w-[680px] h-[560px] opacity-100 z-20"
      />
      <Footer />
    </div>
  )
}