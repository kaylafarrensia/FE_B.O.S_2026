import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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

// ── Utility: Helper to extract and sanitize a valid Zoom URL ──────────────────
const extractZoomUrl = (input) => {
  if (!input || typeof input !== 'string') return null

  // 1. Direct Regex Match for Zoom URLs
  const zoomRegex = /(https?:\/\/[a-zA-Z0-9-]+\.zoom\.us\/[^\s"'>]+)/i
  const directMatch = input.match(zoomRegex)
  if (directMatch) return directMatch[0]

  // 2. Fallback: Parse URL params if Zoom link is wrapped
  try {
    const parsed = new URL(input)
    for (const [, val] of parsed.searchParams.entries()) {
      const innerMatch = val.match(zoomRegex)
      if (innerMatch) return innerMatch[0]
    }
  } catch (e) {
    // String is not a full URL
  }

  // 3. Fallback: Check if string is any valid HTTPS URL
  if (input.trim().toLowerCase().startsWith('https://')) {
    return input.trim()
  }

  return null
}

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

export default function Schedule() {
  const [popupOpen, setPopupOpen] = useState(false)
  const [tempSchedule, setTempSchedule] = useState(null)
  const { userSchedule, setUserSchedule, setUserStatus } = useOutletContext()
  const [availableSchedules, setAvailableSchedules] = useState([])
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [userRegionId, setUserRegionId] = useState(null)
  const [loadingSchedule, setLoadingSchedule] = useState(true)

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

        const currentSchedule =
          profileData?.registration?.schedule || profileData?.schedule || null
        if (currentSchedule) {
          setUserSchedule(currentSchedule)
        }

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
      if (!res.ok) {
        setSaveError(
          body?.message || 'Gagal menyimpan jadwal. Silakan coba lagi.',
        )
        return
      }

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

  // Fetch links data from API
  const { data: linksData, isLoading: loadingLinks } = useQuery({
    queryKey: ['links', regionToUse, userSchedule?.id],
    queryFn: () =>
      getLinksByRegionAndSchedule({
        regionId: regionToUse,
        scheduleId: userSchedule?.id,
      }),
    enabled: !!userSchedule,
  })

  // Parse strictly the Zoom link from the backend response
  const joinLink = useMemo(() => {
    if (!linksData) return null

    const dataContent = linksData?.data ?? linksData?.links ?? linksData

    if (typeof dataContent === 'string') {
      return extractZoomUrl(dataContent)
    }

    if (Array.isArray(dataContent)) {
      const targetRegionId = Number(regionToUse)
      const targetScheduleId = Number(userSchedule?.id)

      const matchedLink = dataContent.find((link) => {
        const matchRegion =
          !link?.regionId || Number(link?.regionId) === targetRegionId
        const matchSchedule =
          !link?.scheduleId || Number(link?.scheduleId) === targetScheduleId
        const isZoom =
          link?.tag === 'ZOOM' ||
          !link?.tag ||
          link?.name?.toUpperCase()?.includes('ZOOM') ||
          String(link?.url || link?.link).includes('zoom.us')

        return matchRegion && matchSchedule && isZoom
      })

      return extractZoomUrl(matchedLink?.url || matchedLink?.link)
    }

    if (dataContent && typeof dataContent === 'object') {
      const candidate =
        dataContent.zoom?.url ||
        dataContent.zoom ||
        dataContent.url ||
        Object.values(dataContent).find(
          (val) => typeof val === 'string' && val.includes('zoom.us'),
        )

      return extractZoomUrl(candidate)
    }

    return null
  }, [userSchedule, linksData, regionToUse])

  // Real-time time clock, updates every 30 seconds
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

  const hasValidLink = !!joinLink && isRealHttpsLink
  const canJoin =
    hasValidLink && joinWindowOpen && !loadingSchedule && !loadingLinks

  const handleJoinNow = () => {
    if (!canJoin || !joinLink) return
    window.open(joinLink, '_blank', 'noopener,noreferrer')
    if (setUserStatus) {
      setUserStatus('registration')
    }
  }

  // Guidance subtext for the user
  const getSubtext = () => {
    if (loadingSchedule || loadingLinks) return null
    if (!hasValidLink && joinWindowOpen) {
      return 'Please kindly wait for the meeting room as it is under preparation.'
    }
    if (!joinWindowOpen) {
      return 'Link opens 30 minutes before the event'
    }
    return null
  }

  return (
    <>
      {popupOpen && <SavedPopup setIsOpen={setPopupOpen} />}

      <div className="relative">
        <div className="flex flex-col xl:flex-row justify-center w-full pt-3 pb-8 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
          {/* Left Column */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
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
              <div className="flex flex-col items-center xl:items-start gap-2">
                <Button
                  className={!canJoin ? 'opacity-50 cursor-not-allowed' : ''}
                  disabled={!canJoin}
                  onClick={handleJoinNow}
                >
                  {loadingLinks ? 'Loading link...' : 'Join Now!'}
                </Button>

                {!canJoin && getSubtext() && (
                  <p className="text-xs text-gray-500 pt-1 text-center xl:text-left">
                    {getSubtext()}
                  </p>
                )}
              </div>
            </Card>

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

          {/* Right Column */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
            <Calendar
              schedules={schedulesToUse}
              userScheduleId={userSchedule?.id}
            />
            <ContactPerson />
          </div>
        </div>
      </div>
    </>
  )
}
