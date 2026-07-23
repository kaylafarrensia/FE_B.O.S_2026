import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import IconCalendar from '../../assets/icons/IconCalendar.svg';
import IconCalendarWhite from '../../assets/icons/IconCalendarWhite.svg';
import IconTrophy from '../../assets/icons/IconTrophy.svg';
import IconTrophyWhite from '../../assets/icons/IconTrophyWhite.svg';
import IconProfile from '../../assets/icons/IconProfile.svg';
import IconProfileWhite from '../../assets/icons/IconProfileWhite.svg';
import IconMenu from '../../assets/icons/IconMenu.svg';
import IconClose from '../../assets/icons/IconClose.svg';
import BNCCBlue from '../../assets/images/BnccBlue.png';
import Card from '../../components/ui/Card.jsx';
import BubbleBackground from '../../components/ui/BubbleBackground.jsx';
import PerspectiveGrid from '../../components/ui/PerspectiveGrid.jsx';

// Dummy user status - bisa diganti saat backend tersedia
const DUMMY_STATUS = 'schedule'; // 'schedule' | 'payment' | 'registration'

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pillWidth = 180;
  const [pillStyle, setPillStyle] = useState({ left: 0 });
  const tabRefs = useRef([]);
  const cardRef = useRef(null);

  const tabs = useMemo(() => {
    return [
      {
        label: 'SCHEDULE',
        icon: IconCalendar,
        iconWhite: IconCalendarWhite,
        path: '/dashboard/schedule',
      },
      {
        label: 'JAPRES',
        icon: IconTrophy,
        iconWhite: IconTrophyWhite,
        path: '/dashboard/japres',
      },
      {
        label: 'PROFILE',
        icon: IconProfile,
        iconWhite: IconProfileWhite,
        path: '/dashboard/profile',
      },
    ];
  }, []);

  const updatePillPosition = (path) => {
    const activeIndex = tabs.findIndex((t) => t.path === path);
    if (activeIndex !== -1) {
      setPillStyle({
        left: activeIndex * pillWidth,
      });
    }
  };

  useEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '');
    if (normalizedPath === '/dashboard') {
      navigate('/dashboard/schedule', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    updatePillPosition(location.pathname);
  }, [location.pathname, tabs]);

  return (
    <div className="relative z-0 min-h-screen overflow-hidden">
      <PerspectiveGrid className="opacity-85" />
      <BubbleBackground />

      {/* Mobile top bar */}
      <div className="xl:hidden flex flex-row justify-between items-center px-8 py-3 border-white border-2">
        <img
          src={BNCCBlue}
          alt="BNCC Logo"
          className="w-20 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <button
          className="cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        >
          <img src={IconMenu} className="w-8" alt="Menu" />
        </button>
      </div>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[998] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed top-0 right-0 h-full w-1/2 max-w-sm border-white border-1 backdrop-blur-md shadow-xl z-[999] lg:hidden bg-white/20"
        initial={{ x: '100%' }}
        animate={{ x: isSidebarOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-end items-center">
          <button className="px-8 py-3" onClick={() => setIsSidebarOpen(false)}>
            <img src={IconClose} alt="Close" className="w-8 h-8" />
          </button>
        </div>
        <nav className="flex flex-col py-6 px-3 space-y-4">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <motion.button
                key={tab.label}
                className={`flex items-center justify-end gap-4 p-4 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-persian-indigo to-[#2474C0] text-white'
                  : 'text-persian-indigo hover:bg-white/30'
                  }`}
                onClick={() => {
                  navigate(tab.path);
                  setIsSidebarOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={isActive ? tab.iconWhite : tab.icon}
                  alt=""
                  className="w-6 sm:w-8"
                />
                <span className="font-outfit text-left text-sm sm:text-lg">
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Desktop Nav */}
      <ul className="hidden xl:flex flex-row justify-between items-center px-[10vw] pt-10 relative">
        <img
          src={BNCCBlue}
          alt="BNCC Logo"
          className="w-30 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div ref={cardRef} className="relative">
          <Card className="flex ml-auto border-white border-2 shadow-xl py-3 rounded-xl relative overflow-visible">
            <motion.div
              layoutId="pill"
              className="absolute inset-0 h-full bg-gradient-to-r from-persian-indigo to-[#2474C0] rounded-xl z-0 shadow-md shadow-persian-indigo/50"
              animate={{
                left: pillStyle.left,
                width: pillWidth,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            {tabs.map((tab, idx) => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <li
                  key={tab.label}
                  ref={(el) => (tabRefs.current[idx] = el)}
                  className={`flex items-center justify-center gap-2 font-outfit tracking-wider relative cursor-pointer text-sm transition-colors duration-200 ${isActive ? 'text-white' : 'text-persian-indigo'
                    }`}
                  style={{ width: pillWidth }}
                  onClick={() => {
                    navigate(tab.path);
                    updatePillPosition(tab.path);
                  }}
                >
                  <img
                    className="w-6"
                    src={isActive ? tab.iconWhite : tab.icon}
                    alt=""
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </li>
              );
            })}
          </Card>
        </div>
      </ul>

      <Outlet />
    </div>
  );
}

export default Dashboard;