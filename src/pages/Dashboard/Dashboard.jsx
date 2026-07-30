import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import IconCalendar from '../../assets/icons/IconCalendar.svg'
import IconCalendarWhite from '../../assets/icons/IconCalendarWhite.svg'
import IconTrophy from '../../assets/icons/IconTrophy.svg'
import IconTrophyWhite from '../../assets/icons/IconTrophyWhite.svg'
import IconProfile from '../../assets/icons/IconProfile.svg'
import IconProfileWhite from '../../assets/icons/IconProfileWhite.svg'
import IconMenu from '../../assets/icons/IconMenu.svg'
import IconClose from '../../assets/icons/IconClose.svg'
import BNCCBlue from '../../assets/images/BnccBlue.png'
import Card from '../../components/ui/Card.jsx'
import BubbleBackground from '../../components/ui/BubbleBackground.jsx'
import PerspectiveGrid from '../../components/ui/PerspectiveGrid.jsx'

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token =
      localStorage.getItem('token') || localStorage.getItem('accessToken')
    if (import.meta.env.PROD && !token) {
      navigate('/auth/signin', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) return
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          'https://staging-launching-api.bncc.net/api'
        const res = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const json = await res.json()
          const data = json?.data

          if (data?.registration?.schedule) {
            setUserSchedule(data.registration.schedule)
          }

          const apiStatus =
            data?.status ?? data?.registration?.status ?? data?.userStatus
          if (apiStatus) {
            setUserStatus(apiStatus)
          }
        }
      } catch (err) {
        console.warn('Failed to load profile:', err)
      }
    }
    fetchProfile()
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userSchedule, setUserSchedule] = useState({
    id: 2,
    startTime: '2026-08-15T09:00:00Z',
    endTime: '2026-08-15T12:00:00Z',
  })
  const [registrationFiles, setRegistrationFiles] = useState({
    binusianCard: null,
    memberLetter: null,
  })
  const [reRegistrationInputs, setReRegistrationInputs] = useState({
    linkedin: '',
    github: '',
    course: '',
  })
  const [registrationOutcome, setRegistrationOutcome] = useState('initial')
  const [reRegistrationSubmitted, setReRegistrationSubmitted] = useState(false)
  const pillWidth = 180
  const [pillStyle, setPillStyle] = useState({ left: 0 })
  const tabRefs = useRef([])
  const cardRef = useRef(null)

  const [userStatus, setUserStatus] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('status') || 'schedule'
  })

  // Enforce status-based routing guards
  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/dashboard/confirm') && userStatus !== 'done_launching') {
      if (userStatus === 'confirm_launching') {
        navigate('/dashboard/registration', { replace: true })
      } else if (userStatus === 'letter_verified' || userStatus === 'done_reregist') {
        navigate('/dashboard/re-registration', { replace: true })
      } else {
        navigate('/dashboard/schedule', { replace: true })
      }
    } else if (path.startsWith('/dashboard/registration') && userStatus !== 'confirm_launching') {
      if (userStatus === 'done_launching') {
        navigate('/dashboard/confirm', { replace: true })
      } else if (userStatus === 'letter_verified' || userStatus === 'done_reregist') {
        navigate('/dashboard/re-registration', { replace: true })
      } else {
        navigate('/dashboard/schedule', { replace: true })
      }
    } else if (
      path.startsWith('/dashboard/re-registration') &&
      userStatus !== 'letter_verified' &&
      userStatus !== 'done_reregist'
    ) {
      if (userStatus === 'done_launching') {
        navigate('/dashboard/confirm', { replace: true })
      } else if (userStatus === 'confirm_launching') {
        navigate('/dashboard/registration', { replace: true })
      } else {
        navigate('/dashboard/schedule', { replace: true })
      }
    }
  }, [location.pathname, userStatus, navigate])

  const tabs = useMemo(() => {
    let firstTab
    const path = location.pathname

    // Explicitly map paths to their proper navbar label and destination
    if (
      path.startsWith('/dashboard/confirm') ||
      path.startsWith('/dashboard/schedule')
    ) {
      firstTab = {
        label: 'SCHEDULE',
        icon: IconCalendar,
        iconWhite: IconCalendarWhite,
        path: path.startsWith('/dashboard/confirm')
          ? '/dashboard/confirm'
          : '/dashboard/schedule',
      }
    } else if (path.startsWith('/dashboard/registration')) {
      firstTab = {
        label: 'REGIST',
        icon: IconCalendar,
        iconWhite: IconCalendarWhite,
        path: '/dashboard/registration',
      }
    } else if (path.startsWith('/dashboard/re-registration')) {
      firstTab = {
        label: 'RE-REGIST',
        icon: IconCalendar,
        iconWhite: IconCalendarWhite,
        path: '/dashboard/re-registration',
      }
    } else {
      // Fallback based on user status
      if (userStatus === 'done_launching') {
        firstTab = {
          label: 'SCHEDULE',
          icon: IconCalendar,
          iconWhite: IconCalendarWhite,
          path: '/dashboard/confirm',
        }
      } else if (userStatus === 'confirm_launching') {
        firstTab = {
          label: 'REGIST',
          icon: IconCalendar,
          iconWhite: IconCalendarWhite,
          path: '/dashboard/registration',
        }
      } else if (userStatus === 'letter_verified' || userStatus === 'done_reregist') {
        firstTab = {
          label: 'RE-REGIST',
          icon: IconCalendar,
          iconWhite: IconCalendarWhite,
          path: '/dashboard/re-registration',
        }
      } else {
        firstTab = {
          label: 'SCHEDULE',
          icon: IconCalendar,
          iconWhite: IconCalendarWhite,
          path: '/dashboard/schedule',
        }
      }
    }

    return [
      firstTab,
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
    ]
  }, [userStatus, location.pathname])

  const updatePillPosition = (path) => {
    const activeIndex = tabs.findIndex((t) => path.startsWith(t.path))
    if (activeIndex !== -1) {
      setPillStyle({
        left: activeIndex * pillWidth,
      })
    }
  }

  useEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '')
    if (normalizedPath === '/dashboard') {
      let defaultPath = '/dashboard/schedule'
      if (userStatus === 'done_launching') {
        defaultPath = '/dashboard/confirm'
      } else if (userStatus === 'confirm_launching') {
        defaultPath = '/dashboard/registration'
      } else if (userStatus === 'letter_verified' || userStatus === 'done_reregist') {
        defaultPath = '/dashboard/re-registration'
      }
      navigate(defaultPath, { replace: true })
    }
  }, [location.pathname, navigate, userStatus])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    updatePillPosition(location.pathname)
  }, [location.pathname, tabs])

  return (
    <div className="dashboard-page relative z-0 min-h-screen flex flex-col overflow-hidden">
      <PerspectiveGrid className="opacity-85" />
      <BubbleBackground />

      {/* Mobile top bar */}
      <div className="xl:hidden fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10">
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
            const isActive = location.pathname.startsWith(tab.path)
            return (
              <motion.button
                key={tab.label}
                className={`flex items-center justify-end gap-4 p-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-persian-indigo to-[#2474C0] text-white'
                    : 'text-persian-indigo hover:bg-white/30'
                }`}
                onClick={() => {
                  navigate(tab.path)
                  setIsSidebarOpen(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={isActive ? tab.iconWhite : tab.icon}
                  alt=""
                  className="w-6 sm:w-8"
                />
                <span
                  className={`font-outfit text-left text-sm sm:text-lg ${isActive ? 'text-white' : ''}`}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </nav>
      </motion.div>

      {/* Desktop Nav */}
      <ul className="hidden xl:flex fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center px-[10vw] py-4 bg-white/5 backdrop-blur-lg border-b border-white/10">
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
              const isActive = location.pathname.startsWith(tab.path)
              return (
                <li
                  key={tab.label}
                  ref={(el) => (tabRefs.current[idx] = el)}
                  className={`flex items-center justify-center gap-2 font-outfit tracking-wider relative z-10 cursor-pointer text-sm transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-persian-indigo'
                  }`}
                  style={{ width: pillWidth }}
                  onClick={() => {
                    navigate(tab.path)
                    updatePillPosition(tab.path)
                  }}
                >
                  <img
                    className="w-6"
                    src={isActive ? tab.iconWhite : tab.icon}
                    alt=""
                  />
                  <span
                    className={`whitespace-nowrap ${isActive ? 'text-white' : 'text-persian-indigo'}`}
                  >
                    {tab.label}
                  </span>
                </li>
              )
            })}
          </Card>
        </div>
      </ul>

      <div className="flex-grow flex flex-col pt-[72px] xl:pt-28 min-h-0 overflow-y-auto">
        <Outlet
          context={{
            userSchedule,
            setUserSchedule,
            userStatus,
            setUserStatus,
            registrationFiles,
            setRegistrationFiles,
            reRegistrationInputs,
            setReRegistrationInputs,
            registrationOutcome,
            setRegistrationOutcome,
            reRegistrationSubmitted,
            setReRegistrationSubmitted,
          }}
        />
      </div>
    </div>
  )
}

export default Dashboard
