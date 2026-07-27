import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import bnccLogo from '../../../public/images/img-BNCC.png'
import icReregist from '../../../public/icons/ic-reregist.svg'
import icJapres from '../../../public/icons/ic-japres.svg'
import icProfile from '../../../public/icons/ic-profile.svg'

const TABS = [
  { key: 'reregist', label: 'Re-Regist', icon: icReregist },
  { key: 'japres', label: 'Japres', icon: icJapres },
  { key: 'profile', label: 'Profile', icon: icProfile },
]

export default function Navbar({ activeTab = 'reregist', onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleTabClick = (key) => {
    onTabChange?.(key)
    setMenuOpen(false)
  }

  return (
    <nav className="flex w-full shrink-0 items-center justify-between bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5] to-[#7ED6F9] px-6 py-4 md:px-10 lg:bg-none lg:px-30 lg:py-2">
      <img src={bnccLogo} alt="BNCC" className="h-9 sm:h-11 md:h-14 lg:h-35" />

      {/* Desktop pill tabs */}
      <div className="hidden items-center gap-1 rounded-[10px] border border-[#99C4F4] bg-gradient-to-br from-[#F7F7F5] via-[#F7F7F5] to-[#7ed6f97a] p-0 shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-md lg:flex lg:gap-2">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center gap-2 overflow-hidden rounded-[10px] px-7 py-3.5 font-outfit text-xs font-regular tracking-[0.15em] ${
                isActive ? 'text-white' : 'text-slate-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navbar-active-pill"
                  className="pointer-events-none absolute inset-0 rounded-[10px] border border-[#99C4F4] bg-gradient-to-br from-[#0A2745] to-[#2474C0] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              {!isActive && (
                <span className="pointer-events-none absolute inset-0 rounded-[10px] border border-transparent transition-colors duration-300 hover:bg-slate-100" />
              )}

              <img
                src={tab.icon}
                alt=""
                className={`relative z-10 h-4 w-4 transition-[filter] duration-300 ${
                  isActive
                    ? 'brightness-0 invert'
                    : tab.key === 'reregist'
                    ? 'brightness-0 opacity-70'
                    : ''
                }`}
              />
              <span className="relative z-10 hidden uppercase transition-colors duration-300 sm:inline">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Hamburger trigger (mobile & tablet) — thicker bars */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] sm:h-11 sm:w-11 md:h-14 md:w-14 md:gap-2 lg:hidden"
      >
        <span className="h-[3.5px] w-6 rounded-full bg-gradient-to-r from-[#0C4076] to-[#4489D4] sm:w-7 md:h-[4.5px] md:w-9" />
        <span className="h-[3.5px] w-6 rounded-full bg-gradient-to-r from-[#0C4076] to-[#4489D4] sm:w-7 md:h-[4.5px] md:w-9" />
        <span className="h-[3.5px] w-6 rounded-full bg-gradient-to-r from-[#0C4076] to-[#4489D4] sm:w-7 md:h-[4.5px] md:w-9" />
      </button>

      {/* Mobile/tablet drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop: invisible, click-to-close only — no blur/dark on main page */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              style={{
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
              }}
              className="fixed inset-y-0 right-0 z-50 flex w-[70%] max-w-xs flex-col border-l border-white/40 bg-white/10 px-8 py-6 shadow-[inset_1px_0_0_rgba(255,255,255,0.4),-8px_0_30px_rgba(0,0,0,0.1)] sm:w-[55%] sm:max-w-sm md:w-[45%] md:max-w-md md:px-12 md:py-10 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="ml-auto flex h-12 w-12 items-center justify-center text-[#0A2745] md:h-14 md:w-14"
              >
                <X size={34} className="md:h-10 md:w-10" />
              </button>

              <div className="flex flex-1 flex-col items-end justify-start gap-10 pt-6 md:gap-14 md:pt-10">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabClick(tab.key)}
                    className="flex items-center gap-3 font-outfit text-base font-semibold uppercase tracking-[0.15em] md:gap-4 md:text-lg"
                  >
                    <img
                      src={tab.icon}
                      alt=""
                      className={`h-5 w-5 shrink-0 md:h-6 md:w-6 ${
                        tab.key === 'reregist' ? 'brightness-0 opacity-70' : ''
                      }`}
                    />
                    <span className="text-[#0A2745]">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}