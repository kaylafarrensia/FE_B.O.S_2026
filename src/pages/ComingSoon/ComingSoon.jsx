import { motion } from 'framer-motion'
import Badge from '../../components/ComingSoon/Badge'
import EmailForm from '../../components/ComingSoon/EmailForm'
import SocialLinks from '../../components/ComingSoon/SocialLinks'
import CountdownTimer from '../../components/ComingSoon/CountdownTimer'
import Footer from '../../components/ComingSoon/Footer'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'
import Typewriter from '../../components/ComingSoon/Typewriter'

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-blue-100 flex flex-col z-10">
      <PerspectiveGrid className="absolute inset-x-0 -top-40 sm:-top-60 md:h-320 h-200" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        {/* Glow images: disembunyikan di mobile, ukuran diperkecil di tablet, full di desktop */}
        <img
          src="/public/images/img-glow-tl.svg"
          alt="color-dodge"
          className="pointer-events-none absolute top-0 left-0 hidden sm:block sm:w-[320px] sm:h-[260px] md:w-[440px] md:h-[360px] lg:w-[580px] lg:h-[460px] opacity-100 z-20"
        />
        <img
          src="/public/images/img-glow-mid.svg"
          alt="color-dodge"
          className="pointer-events-none absolute top-80 -right-10 hidden sm:block sm:w-[360px] sm:h-[300px] md:w-[500px] md:h-[420px] lg:top-140 md:top-150 lg:-right-20 lg:w-[680px] lg:h-[560px] opacity-100 z-20"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-5xl rounded-2xl md:rounded-2xl md:max-w-4xl border-2 border-[#99BDDF] bg-gradient-to-br from-[#DFEFFF] via-[#DFEFFF] to-[#5393CF4D] p-6 sm:p-8 md:p-10 backdrop-blur-md shadow-xl md:mb-50 mb-30 min-h-[550px] md:min-h-[700px] lg:min-h-[650px]"
        >
          {/* cursor desktop */}
          <Badge
            text="Tech & Digital Exploration"
            color="green"
            className="absolute right-4 top-24 -translate-y-1/2 hidden lg:block lg:-right-20 lg:top-100"
          />
          <Badge
            text="Networking & Community"
            color="pink"
            flagPosition="right"
            className="absolute left-4 top-40 -translate-y-1/2 hidden lg:block lg:-left-30 lg:top-130"
          />
          
          {/* cursor tablet & mobile */}
          <Badge
            text="Tech & Digital Exploration"
            color="green"
            flagPosition='right'
            className="absolute -left-3 top-58 -translate-y-1/2 block md:block lg:hidden md:left-0 md:top-70"
          />
          <Badge
            text="Networking & Community"
            color="pink"
            flagPosition="left"
            className="absolute -right-2 top-123 md:right-4 md:top-155 -translate-y-1/2 block md:block lg:hidden"
          />

          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <h1 className="rounded-[10px] border border-white bg-white/20 px-4 py-2 sm:px-6 text-xs md:text-xl font-bold shadow-[inset_0_2px_12px_rgba(68,137,212,0.3)] backdrop-blur-md">
              <span className="bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
                BNCC OPENING SEASON 2026
              </span>
            </h1>

            <h1 className="px-2 sm:px-6 py-2 min-h-[4em] sm:min-h-[1.6em] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#0A2745] to-[#4489D4] bg-clip-text text-transparent">
              <Typewriter text="COMING SOON" speed={120} startDelay={300} />
            </h1>

            <p className="max-w-xs lg:max-w-xl font-poppins text-black text-xs sm:text-lg mt-10 md:mt-10">
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
          className="mt-16 mb-12 sm:mt-24 sm:mb-16 lg:mt-55 lg:mb-30 flex flex-col items-center gap-6 sm:gap-8 text-center z-10 px-4"
        >
          <h2 className="text-sm md:text-2xl lg:text-3xl font-semibold leading-[1.3] pb-1 bg-linear-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
            Brace yourself. It's coming.
          </h2>
          <CountdownTimer targetDate="2026-07-31T00:00:00" />
        </motion.div>
      </main>

      <img
        src="/public/images/img-glow-bl.svg"
        alt="color-dodge"
        className="pointer-events-none absolute bottom-0 left-0 hidden sm:block sm:w-[360px] sm:h-[300px] md:w-[500px] md:h-[420px] lg:top-220 lg:left-0 lg:w-[680px] lg:h-[560px] opacity-100 z-20"
      />
      <Footer />
    </div>
  )
}