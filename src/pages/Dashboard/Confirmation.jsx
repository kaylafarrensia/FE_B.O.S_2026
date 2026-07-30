import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import IconSchedule from '../../assets/icons/IconSchedule.svg'
import IconTime from '../../assets/icons/IconTime.svg'
import { formatDate, formatStartEndTime } from '../../utils/index.js'
import Calendar from './Schedule/Calendar.jsx'
import ContactPerson from './Japres/ContactPerson.jsx'

export default function Confirmation() {
  const navigate = useNavigate()
  const { setUserStatus } = useOutletContext()
  const [schedule, setSchedule] = useState({
    id: 2,
    startTime: '2026-08-25T12:00:00Z',
    endTime: '2026-08-25T14:00:00Z',
  })
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
          if (json?.data?.registration?.schedule) {
            setSchedule(json.data.registration.schedule)
          }
        }
      } catch (err) {
        console.warn('Failed to load profile schedule:', err)
      }
    }
    fetchProfile()
  }, [])

  const handleNext = async () => {
    if (!checked) return
    setLoading(true)
    try {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken')
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        'https://staging-launching-api.bncc.net/api'
      const res = await fetch(`${apiUrl}/user/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'confirm_launching' }),
      })
      if (res.ok) {
        setUserStatus('confirm_launching')
        navigate('/dashboard/registration')
      }
    } catch (err) {
      console.warn('Failed to update status:', err)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const schedulesToUse = schedule ? [schedule] : []

  return (
    <div className="relative">
      <div className="flex flex-col xl:flex-row items-start justify-center w-full pt-3 pb-8 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
        {/* ── Left Column ── */}
        <div className="flex flex-col w-full gap-4 xl:gap-5 h-fit">
          <Card className="flex flex-col p-8 sm:p-10 rounded-xl border-white border-[3px] h-fit">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl w-fit text-slate-900">
                Confirmation of{' '}
                <span className="text-[#2474C0]">Attendance</span>
              </h1>

              <div className="pt-6">
                <p className="text-base sm:text-xl font-medium text-slate-800">
                  BNCC Launching Schedule
                </p>
                <ul className="flex flex-col gap-3 pt-2 pb-5">
                  <li className="flex flex-row items-center gap-3">
                    <img
                      src={IconSchedule}
                      alt="Schedule"
                      className="w-[18px] sm:w-[24px]"
                    />
                    <p className="font-bold text-base sm:text-xl text-slate-800">
                      {schedule
                        ? formatDate(schedule.startTime)
                        : 'No schedule selected yet.'}
                    </p>
                  </li>
                  <li className="flex flex-row items-center gap-3">
                    <img
                      src={IconTime}
                      alt="Clock"
                      className="w-[18px] sm:w-[24px]"
                    />
                    <p className="font-bold text-base sm:text-xl text-slate-800">
                      {schedule
                        ? formatStartEndTime(
                            schedule.startTime,
                            schedule.endTime,
                          )
                        : 'No schedule selected yet.'}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="py-2">
                {/* ── Changed mb-4 to mb-2 and fixed sm:text-l to sm:text-lg ── */}
                <p className="text-base sm:text-lg font-medium text-slate-800 mb-2">
                  Were you able to attend the schedule above?
                </p>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-400 text-[#2474C0] focus:ring-[#2474C0] cursor-pointer"
                  />
                  {/* ── Fixed sm:text-l to sm:text-lg here too ── */}
                  <span className="font-medium text-base sm:text-lg text-slate-900">
                    Yes, I was.
                  </span>
                </label>

                <p className="text-sm sm:text-base font-medium text-gray-500 mt-6">
                  If you weren't able to, please contact the person in charge.
                </p>
              </div>
            </div>

            <div className="pt-8 flex justify-start xl:block">
              <Button
                variant="ocean"
                size="md"
                disabled={!checked || loading}
                loading={loading}
                onClick={handleNext}
                className="w-32 uppercase font-bold"
              >
                NEXT
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col w-full gap-4 xl:gap-5">
          <Calendar schedules={schedulesToUse} userScheduleId={schedule?.id} />
          <ContactPerson />
        </div>
      </div>
    </div>
  )
}
