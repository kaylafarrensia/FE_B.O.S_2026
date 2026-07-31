import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import IconDownload from '../../assets/icons/IconDownload.svg'
import { useOutletContext } from 'react-router-dom'
import { formatDate } from '../../utils/index.js'

// ── DUMMY DATA ─────────────────────────────────────────────────────────────────
const DUMMY_USER = {
  name: 'John Doe',
  email: 'johndoe123@gmail.com',
  registration: {
    whatsappNumber: '0831-0050-1534',
    lineId: 'johndoeline',
    nim: '2602345678',
    bnccId: null,
    schedule: {
      startTime: '2026-08-15T09:00:00Z',
      endTime: '2026-08-15T12:00:00Z',
    },
    lntCourse: { title: 'Front-End' },
    faculty: { name: 'School of Computer Science' },
    major: { name: 'Computer Science' },
    region: { name: 'Jakarta' },
    suratMember: 'null',
    binusianCard: 'null',
    linkedinUrl: '',
    githubUrl: '',
  },
}

function formatTime(startIso, endIso) {
  if (!startIso) return '-'
  const s = new Date(startIso)
  const e = new Date(endIso)
  const fmt = (d) =>
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
  return `${fmt(s)} – ${fmt(e)} WIB`
}

function renderEmail(email) {
  if (!email) return ''
  const parts = email.split('@')
  if (parts.length === 2) {
    return (
      <>
        {parts[0]}@<wbr />
        {parts[1]}
      </>
    )
  }
  return email
}

function Profile() {
  const [user, setUser] = useState(DUMMY_USER)
  const [loading, setLoading] = useState(false)
  const { userSchedule } = useOutletContext()

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken')

      // If no token exists, don't attempt request
      if (!token) return

      setLoading(true)
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://launching-api.bncc.net/api'
        const res = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Handle Expired or Invalid Token (401 / 403)
        if (res.status === 401 || res.status === 403) {
          console.warn('Session expired. Clearing storage...')
          localStorage.removeItem('token')
          localStorage.removeItem('accessToken')
          // Redirect to login page if using react-router
          window.location.href = '/login'
          return
        }

        if (res.ok) {
          const json = await res.json()
          const data = json?.data || json

          const fetchedBinusEmail =
            data.binusEmail ||
            data.binus_email ||
            data.emailBinus ||
            data.binusianEmail ||
            data.registration?.binusEmail ||
            data.registration?.binus_email ||
            data.registration?.emailBinus ||
            ''

          setUser({
            name: data.fullName || data.name || DUMMY_USER.name,
            email: data.email || DUMMY_USER.email,
            binusEmail: fetchedBinusEmail,
            registration: {
              ...DUMMY_USER.registration,
              ...data.registration,
              whatsappNumber:
                data.registration?.whatsappNumber ||
                DUMMY_USER.registration.whatsappNumber,
              lineId:
                data.registration?.lineId || DUMMY_USER.registration.lineId,
              nim: data.registration?.nim || DUMMY_USER.registration.nim,
              bnccId: data.registration?.bnccId ?? null,
              lntCourse:
                data.registration?.lntCourse ||
                DUMMY_USER.registration.lntCourse,
              faculty:
                data.registration?.faculty || DUMMY_USER.registration.faculty,
              major: data.registration?.major || DUMMY_USER.registration.major,
              region:
                data.registration?.region || DUMMY_USER.registration.region,
              linkedinUrl:
                data.registration?.linkedinUrl ||
                DUMMY_USER.registration.linkedinUrl,
              githubUrl:
                data.registration?.githubUrl ||
                DUMMY_USER.registration.githubUrl,
            },
          })
        }
      } catch (err) {
        console.warn('Failed to load profile from backend:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="relative">
      <div className="flex justify-center w-full pt-3 pb-8 xl:py-15 px-6 xl:px-[10vw]">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-5 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-4 xl:gap-5 w-full">
              {/* Personal Information */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center">
                  PERSONAL INFORMATION
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">WhatsApp Number</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.whatsappNumber}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Line ID</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.lineId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {renderEmail(user.email)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* BNCC Registration */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center">
                  BNCC REGISTRATION
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      BNCC Launching Schedule
                    </p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {formatDate(userSchedule.startTime)}
                      <br />
                      {formatTime(userSchedule.startTime, userSchedule.endTime)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">LnT Course</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {user.registration.lntCourse.title}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 xl:gap-5 w-full">
              {/* Student Credentials */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center text-">
                  STUDENT CREDENTIALS
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">NIM</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.nim || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Campus Region</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.region.name || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">BNCC ID</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.bnccId || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Faculty</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.faculty.name || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Binus Email</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {renderEmail(user.binusEmail)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Major</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.major.name || '-'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Re-Registration */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-10 text-lg sm:text-2xl text-center">
                  RE-REGISTRATION
                </h1>
                <div className="flex flex-col gap-5 justify-start w-full">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">LinkedIn URL</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.linkedinUrl &&
                      user.registration.linkedinUrl !== 'https://' &&
                      user.registration.linkedinUrl !== 'null' &&
                      user.registration.linkedinUrl.trim() !== ''
                        ? user.registration.linkedinUrl
                        : '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Github URL</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.githubUrl &&
                      user.registration.githubUrl !== 'https://' &&
                      user.registration.githubUrl !== 'null' &&
                      user.registration.githubUrl.trim() !== ''
                        ? user.registration.githubUrl
                        : '-'}
                    </p>
                  </div>
                  <div className="gap-2 flex flex-col w-full">
                    <p className="text-sm text-gray-500">Member Letter</p>
                    {user.registration.suratMember &&
                    user.registration.suratMember !== 'null' &&
                    user.registration.suratMember.trim() !== '' ? (
                      <Button
                        className="w-full"
                        onClick={() =>
                          window.open(
                            user.registration.suratMember,
                            '_blank',
                            'noopener,noreferrer',
                          )
                        }
                      >
                        <img
                          src={IconDownload}
                          alt="Download"
                          className="w-6 h-6 mr-2"
                        />
                        <p className="text-xs sm:text-sm text-white">
                          Download Latest Submission
                        </p>
                      </Button>
                    ) : (
                      <button
                        disabled
                        style={{ color: '#FFFFFF' }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 sm:py-3 px-8 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#84A4C9] to-[#A3C7EE] text-white cursor-not-allowed select-none shadow-sm"
                      >
                        <img
                          src={IconDownload}
                          alt="Download"
                          className="w-6 h-6 mr-2 text-white"
                        />
                        <p className="text-xs sm:text-sm text-white">
                          Download Latest Submission
                        </p>
                      </button>
                    )}
                  </div>
                  <div className="gap-2 flex flex-col w-full">
                    <p className="text-sm text-gray-500">Binusian Card</p>
                    {user.registration.binusianCard &&
                    user.registration.binusianCard !== 'null' &&
                    user.registration.binusianCard.trim() !== '' ? (
                      <Button
                        className="w-full"
                        onClick={() =>
                          window.open(
                            user.registration.binusianCard,
                            '_blank',
                            'noopener,noreferrer',
                          )
                        }
                      >
                        <img
                          src={IconDownload}
                          alt="Download"
                          className="w-6 h-6 mr-2"
                        />
                        <p className="text-xs sm:text-sm text-white">
                          Download Binusian Card
                        </p>
                      </Button>
                    ) : (
                      <button
                        disabled
                        style={{ color: '#FFFFFF' }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 sm:py-3 px-8 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#84A4C9] to-[#A3C7EE] text-white cursor-not-allowed select-none shadow-sm"
                      >
                        <img
                          src={IconDownload}
                          alt="Download"
                          className="w-6 h-6 mr-2 text-white"
                        />
                        <p className="text-xs sm:text-sm text-white">
                          Download Binusian Card
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
