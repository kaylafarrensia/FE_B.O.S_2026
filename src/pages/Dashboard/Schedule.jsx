import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query' // Pastikan terimport
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import IconSchedule from '../../assets/icons/IconSchedule.svg'
import IconTime from '../../assets/icons/IconTime.svg'
import { formatDate, formatStartEndTime } from '../../utils/index.js'
import Calendar from './Schedule/Calendar.jsx'
import ScheduleDropdown from './Schedule/ScheduleDropdown.jsx'
import SavedPopup from './Schedule/SavedPopup.jsx'
import ContactPerson from './Japres/ContactPerson.jsx'
import { getLinksByRegionAndSchedule } from '../../services/admin.js'

// ── Dummy Data Fallback ───────────────────────────────────────────────────────
const DUMMY_SCHEDULES = [
  {
    id: 1,
    title: '',
    startTime: '',
    endTime: '',
  },
]

const getToken = () =>
  localStorage.getItem('token') || localStorage.getItem('accessToken')

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [popupOpen, setPopupOpen] = useState(false)
  const [tempSchedule, setTempSchedule] = useState(null)
  const { userSchedule, setUserSchedule, setUserStatus } = useOutletContext()
  const [availableSchedules, setAvailableSchedules] = useState([])
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [userRegionId, setUserRegionId] = useState(null)

  // Loading state to prevent stale schedule flicker on page refresh
  const [loadingSchedule, setLoadingSchedule] = useState(true)

  // Fetch schedules with safe region handling and fallback
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoadingSchedule(true)
      const token = getToken()
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'

        let regionId = null
        let profileData = null
        if (token) {
          const profileRes = await fetch(`${apiUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (profileRes.ok) {
            const profileJson = await profileRes.json()
            profileData = profileJson?.data
            regionId =
              profileData?.registration?.regionId ||
              profileData?.registration?.region?.id
            setUserRegionId(regionId)
          }
        }

        // Sync userSchedule with backend truth
        const currentSchedule =
          profileData?.registration?.schedule || profileData?.schedule || null
        if (currentSchedule) {
          setUserSchedule(currentSchedule)
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
      } finally {
        setLoadingSchedule(false)
      }
    }
    fetchSchedules()
  }, [setUserSchedule])

  const schedulesToUse =
    availableSchedules.length > 0 ? availableSchedules : DUMMY_SCHEDULES

  const handleConfirm = async () => {
    if (!tempSchedule) return

    setSaveError('')
    const token = getToken()

    if (!token) {
      console.error('[Schedule] No token found — cannot save schedule')
      setSaveError('Sesi login kamu habis. Silakan login ulang.')
      return
    }

    setSaving(true)
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'

      const res = await fetch(`${apiUrl}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scheduleId: Number(tempSchedule.id),
        }),
      })

      const body = await res.json().catch(() => null)
      console.log('[Schedule] PATCH /reschedule status:', res.status, body)

      if (!res.ok) {
        setSaveError(
          body?.message || 'Gagal menyimpan jadwal. Silakan coba lagi.',
        )
        return
      }

      // Update local state on success
      setUserSchedule(body?.data ?? tempSchedule)
      setTempSchedule(null)
      setPopupOpen(true)
    } catch (err) {
      console.error('[Schedule] Error updating schedule in backend:', err)
      setSaveError('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const regionToUse =
    userRegionId || userSchedule?.regionId || userSchedule?.region?.id || null

  // 1. Fetch data link dari API via TanStack Query
  const { data: linksData, isLoading: loadingLinks } = useQuery({
    queryKey: ['links', regionToUse, userSchedule?.id],
    queryFn: () =>
      getLinksByRegionAndSchedule({
        regionId: regionToUse,
        scheduleId: userSchedule?.id,
      }),
    enabled: !!userSchedule, // Hanya fetch jika userSchedule sudah ada
  })

  // 2. Cari link Zoom yang cocok dengan region user
  const joinLink = useMemo(() => {
    if (!userSchedule || !linksData) return null

    // Normalisasi array atau object response dari backend
    const dataContent = linksData?.data ?? linksData?.links ?? linksData

    // If it's a string, return it directly
    if (typeof dataContent === 'string') return dataContent

    // Jika dataContent berupa array, cari link yang regionId-nya cocok dan tag-nya ZOOM (atau link pertama yang cocok)
    if (Array.isArray(dataContent)) {
      const targetRegionId = Number(regionToUse)
      const targetScheduleId = Number(userSchedule?.id)
      const matchedLink = dataContent.find(
        (link) =>
          Number(link?.regionId) === targetRegionId &&
          (!link?.scheduleId || Number(link.scheduleId) === targetScheduleId) &&
          (link?.tag === 'ZOOM' ||
            !link?.tag ||
            link?.name?.toUpperCase()?.includes('ZOOM')),
      )
      return matchedLink ? matchedLink.url : null
    }

    // Jika dataContent berupa object, kembalikan field zoom atau url
    if (dataContent && typeof dataContent === 'object') {
      if (dataContent.zoom) {
        return typeof dataContent.zoom === 'object'
          ? dataContent.zoom.url
          : dataContent.zoom
      }
      if (dataContent.url) return dataContent.url
      // Iterasi key object untuk mencari key yang mengandung kata 'zoom'
      for (const key of Object.keys(dataContent)) {
        const val = dataContent[key]
        if (key.toLowerCase().includes('zoom')) {
          return typeof val === 'object' ? val?.url : val
        }
      }
    }

    return null
  }, [userSchedule, linksData, regionToUse])

  // Window akses: tombol join baru bisa digunakan maksimal 30 menit sebelum event
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const isRealHttpsLink =
    !!joinLink && joinLink.trim().toLowerCase().startsWith('https://')

  const joinWindowOpen = (() => {
    if (!userSchedule?.startTime) return false
    const start = new Date(userSchedule.startTime).getTime()
    if (!Number.isFinite(start)) return false
    return now >= start - 30 * 60 * 1000
  })()

  const canJoin =
    isRealHttpsLink && joinWindowOpen && !loadingSchedule && !loadingLinks

  // 3. Handler saat tombol "Join Now!" diklik
  const handleJoinNow = () => {
    if (!canJoin) return
    // Buka link Zoom di tab baru
    window.open(joinLink, '_blank', 'noopener,noreferrer')
    if (setUserStatus) {
      setUserStatus('registration')
    }
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
                    {loadingSchedule ? (
                      <span className="animate-pulse text-gray-400">
                        Loading schedule...
                      </span>
                    ) : userSchedule ? (
                      formatDate(userSchedule.startTime)
                    ) : (
                      'No schedule selected yet.'
                    )}
                  </p>
                </li>
                <li className="flex flex-row items-center gap-3">
                  <img
                    src={IconTime}
                    alt="Clock"
                    className="w-[15px] sm:w-[30px]"
                  />
                  <p className="font-bold text-xs sm:text-lg">
                    {loadingSchedule ? (
                      <span className="animate-pulse text-gray-400">
                        Loading time...
                      </span>
                    ) : userSchedule ? (
                      formatStartEndTime(
                        userSchedule.startTime,
                        userSchedule.endTime,
                      )
                    ) : (
                      'No schedule selected yet.'
                    )}
                  </p>
                </li>
              </ul>
              <div className="flex justify-center xl:block">
                <Button
                  className={!canJoin ? 'opacity-50 cursor-not-allowed' : ''}
                  disabled={!canJoin}
                  onClick={handleJoinNow}
                >
                  {loadingLinks ? 'Loading link...' : 'Join Now!'}
                </Button>
              </div>
            </Card>

            {/* Change Schedule Card */}
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
                selectedSchedule={tempSchedule}
              />
              {saveError && (
                <p className="text-red-500 text-xs sm:text-sm pb-2">
                  {saveError}
                </p>
              )}
              <div className="flex justify-start xl:block">
                <Button
                  className={!tempSchedule || saving ? 'opacity-50' : ''}
                  onClick={handleConfirm}
                  disabled={!tempSchedule || saving}
                >
                  {saving ? 'Saving...' : 'Submit'}
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
