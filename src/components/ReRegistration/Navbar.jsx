import { RefreshCcw, Trophy, User } from 'lucide-react'

const TABS = [
  { key: 'reregist', label: 'Re-Regist', icon: RefreshCcw },
  { key: 'japres', label: 'Japres', icon: Trophy },
  { key: 'profile', label: 'Profile', icon: User },
]

export default function Navbar({ activeTab = 'reregist', onTabChange, logoSrc }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6">
      {/* Logo */}
      <div className="flex flex-col leading-none">
        {logoSrc ? (
          <img src={logoSrc} alt="BNCC" className="h-8 sm:h-10" />
        ) : (
          <>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1B9DE0]">
              BNCC
            </span>
            <span className="text-[8px] sm:text-[9px] font-semibold tracking-wide text-slate-700">
              BINA NUSANTARA COMPUTER CLUB
            </span>
          </>
        )}
      </div>

      {/* Tab group */}
      <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/70 p-2 shadow-md backdrop-blur-md sm:gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange?.(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold tracking-wide transition sm:px-7 sm:py-3.5 sm:text-sm ${
                isActive
                  ? 'bg-gradient-to-br from-[#0A2745] to-[#2474C0] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-slate-600'} />
              <span className="hidden sm:inline uppercase">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}