import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import IconSchedule from '../../assets/icons/IconSchedule.svg'
import IconTime from '../../assets/icons/IconTime.svg'
import { formatDate, formatStartEndTime } from '../../utils/index.js'
import Calendar from './Schedule/Calendar.jsx'
import ScheduleDropdown from './Schedule/ScheduleDropdown.jsx'
import SavedPopup from './Schedule/SavedPopup.jsx'
import ContactPerson from './Japres/ContactPerson.jsx'

// ── Dummy Data Fallback ───────────────────────────────────────────────────────
const DUMMY_SCHEDULES = [
  {
    id: 1,
    title: 'Session 1',
    startTime: '2026-08-14T09:00:00Z',
    endTime: '2026-08-14T12:00:00Z',
  },
  {
    id: 2,
    title: 'Session 2',
    startTime: '2026-08-15T09:00:00Z',
    endTime: '2026-08-15T12:00:00Z',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Schedule() {
  const navigate = useNavigate()
  const [popupOpen, setPopupOpen] = useState(false)
  const [tempSchedule, setTempSchedule] = useState(null)
  const { userSchedule, setUserSchedule, setUserStatus } = useOutletContext()
  const [availableSchedules, setAvailableSchedules] = useState([])
  const [joinLink, setJoinLink] = useState('')

  // Fetch the link from the /links API endpoint
  useEffect(() => {
    const fetchLinks = async () => {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) return

      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'

        const res = await fetch(`${apiUrl}/links`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const json = await res.json()
          if (json?.data?.zoom) {
            setJoinLink(json.data.zoom)
          }
        }
      } catch (err) {
        console.warn('Failed to fetch links:', err)
      }
    }
    fetchLinks()
  }, [])

  // Fetch schedules with safe region handling and fallback
  useEffect(() => {
    const fetchSchedules = async () => {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken')
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'

        let regionId = null
        if (token) {
          const profileRes = await fetch(`${apiUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (profileRes.ok) {
            const profileJson = await profileRes.json()
            regionId =
              profileJson?.data?.registration?.regionId ||
              profileJson?.data?.registration?.region?.id
          }
        }

        // Build URL safely: only append regionId if it exists to avoid 400 errors
        const schedulesUrl = regionId
          ? `${apiUrl}/lookup/schedules?regionId=${regionId}`
          : `${apiUrl}/lookup/schedules`

        const schedulesRes = await fetch(schedulesUrl)
        if (schedulesRes.ok) {
          const schedulesJson = await schedulesRes.json()
          const list = schedulesJson?.data || schedulesJson
          if (Array.isArray(list) && list.length > 0) {
            setAvailableSchedules(list)
            return
          }
        }
        setAvailableSchedules(DUMMY_SCHEDULES)
      } catch (err) {
        console.warn('Failed to fetch schedules, using fallback:', err)
        setAvailableSchedules(DUMMY_SCHEDULES)
      }
    }
    fetchSchedules()
  }, [])

  const schedulesToUse =
    availableSchedules.length > 0 ? availableSchedules : DUMMY_SCHEDULES

  const handleConfirm = async () => {
    if (!tempSchedule) return

    const token =
      localStorage.getItem('token') || localStorage.getItem('accessToken')
    if (token) {
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'
        const res = await fetch(`${apiUrl}/user/schedule`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduleId: Number(tempSchedule.id),
          }),
        })
        if (!res.ok) {
          console.warn('Failed to update schedule in backend')
        }
      } catch (err) {
        console.warn('Error updating schedule in backend:', err)
      }
    }

    setUserSchedule(tempSchedule)
    setTempSchedule(null)
    setPopupOpen(true)
  }

  const handleJoinNow = () => {
    if (!joinLink) return

    if (setUserStatus) {
      setUserStatus('registration')
    }
    window.open(joinLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {popupOpen && <SavedPopup setIsOpen={setPopupOpen} />}

      <div className="relative">
        <div className="flex flex-col xl:flex-row justify-center w-full pt-3 pb-8 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
          {/* ── Left Column ── */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
            {/* Current Schedule Info */}
            <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
              <h1 className="text-xl font-bold sm:text-3xl w-fit">
                Join Our Launch!
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                Save the date and be part of the BNCC Launching!
              </p>
              <ul className="flex flex-col gap-2 py-5">
                <li className="flex flex-row items-center gap-3">
                  <img
                    src={IconSchedule}
                    alt="Schedule"
                    className="w-[15px] sm:w-[30px]"
                  />
                  <p className="font-bold text-xs sm:text-lg">
                    {userSchedule
                      ? formatDate(userSchedule.startTime)
                      : 'No schedule selected yet.'}
                  </p>
                </li>
                <li className="flex flex-row items-center gap-3">
                  <img
                    src={IconTime}
                    alt="Clock"
                    className="w-[15px] sm:w-[30px]"
                  />
                  <p className="font-bold text-xs sm:text-lg">
                    {userSchedule
                      ? formatStartEndTime(
                          userSchedule.startTime,
                          userSchedule.endTime,
                        )
                      : 'No schedule selected yet.'}
                  </p>
                </li>
              </ul>
              <div className="flex justify-center xl:block">
                <Button
                  className={!joinLink ? 'opacity-50' : ''}
                  disabled={!userSchedule || !joinLink}
                  onClick={handleJoinNow}
                >
                  Join Now!
                </Button>
              </div>
            </Card>

            {/* Change Schedule */}
            <Card className="flex flex-col p-10 mt-0 rounded-xl border-white border-[3px] z-[99]">
              <h1 className="text-xl font-bold sm:text-3xl w-fit">
                Change Your Schedule?
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg flex flex-col gap-1">
                <span>Having second thoughts?</span>
                <span>No worries! Pick a new schedule that suits you.</span>
              </p>
              <ScheduleDropdown
                schedules={schedulesToUse}
                onSelect={setTempSchedule}
              />
              <div className="flex justify-start xl:block">
                <Button
                  className=""
                  onClick={handleConfirm}
                  disabled={!tempSchedule}
                >
                  Submit
                </Button>
              </div>
            </Card>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
            <Calendar
              schedules={schedulesToUse}
              userScheduleId={userSchedule?.id}
            />

            {/* Contact Person */}
            <ContactPerson />
          </div>
        </div>
      </div>
    </>
  )
}
