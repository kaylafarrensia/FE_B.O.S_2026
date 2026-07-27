import { motion } from 'framer-motion'
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
  return (
    <nav className="flex shrink-0 items-center justify-between px-6 py-4 lg:px-30 lg:py-2">
      <img src={bnccLogo} alt="BNCC" className="h-8 lg:h-35" />

      <div className="flex items-center gap-1 rounded-[10px] border border-[#99C4F4] bg-gradient-to-br from-[#F7F7F5] via-[#F7F7F5] to-[#7ed6f97a] p-0 shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-md sm:gap-2">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange?.(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center gap-2 overflow-hidden rounded-[10px] px-4 py-2.5 font-outfit text-xs font-regular tracking-[0.15em] sm:px-7 sm:py-3.5 sm:text-xs ${
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
    </nav>
  )
}