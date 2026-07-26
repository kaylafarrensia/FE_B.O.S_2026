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
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-xs font-bold tracking-wide transition sm:px-7 sm:py-3.5 sm:text-sm ${
                isActive
                  ? 'border border-[#99C4F4] bg-gradient-to-br from-[#0A2745] to-[#2474C0] text-white shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-md'
                  : 'border border-transparent text-slate-700 hover:bg-slate-100'
              }`}
            >
              <img
                src={tab.icon}
                alt=""
                className={`h-4 w-4 ${
                  isActive
                    ? 'brightness-0 invert'
                    : tab.key === 'reregist'
                    ? 'brightness-0 opacity-70'
                    : ''
                }`}
              />
              <span className="hidden sm:inline uppercase">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}