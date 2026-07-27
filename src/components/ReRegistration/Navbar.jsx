import { RefreshCcw, Trophy, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bnccLogo from '../../assets/images/BnccBlue.png';

const TABS = [
  { key: 'reregist', label: 'RE-REGIST', icon: RefreshCcw, path: '/re-registration' },
  { key: 'japres', label: 'JAPRES', icon: Trophy, path: '/dashboard/japres' },
  { key: 'profile', label: 'PROFILE', icon: User, path: '/dashboard/profile' },
];

export default function Navbar({ activeTab = 'reregist', onTabChange }) {
  const navigate = useNavigate();

  return (
    <nav className="flex shrink-0 items-center justify-between px-6 py-4 sm:px-[10vw] sm:py-6">
      <img
        src={bnccLogo}
        alt="BNCC"
        className="h-8 sm:h-10 cursor-pointer"
        onClick={() => navigate('/')}
      />

      <div className="flex items-center gap-1 rounded-xl border border-white/40 bg-white/20 p-1.5 shadow-sm backdrop-blur-md">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onTabChange?.(tab.key);
                navigate(tab.path);
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-wide transition sm:px-6 sm:py-2.5 sm:text-sm cursor-pointer ${
                isActive
                  ? 'bg-[#1E5FA8] text-white shadow-sm'
                  : 'text-[#0A2745] hover:bg-[#1E5FA8]/10'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-[#0A2745]'} />
              <span className="uppercase">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}