import { useState, useEffect } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const MOCK_COURSES = [
  { id: 1, name: 'UI/UX Design' },
  { id: 2, name: 'Front-End Development' },
  { id: 3, name: 'Back-End Development' },
  { id: 4, name: 'Java Programming' },
  { id: 5, name: 'Mobile Application Development' },
  { id: 6, name: 'Machine Learning' },
]

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function ReRegistrationForm({
  onSubmitSuccess,
  reRegistrationInputs,
  setReRegistrationInputs,
}) {
  const [localForm, setLocalForm] = useState({
    linkedin: '',
    github: '',
    course: '',
  })

  const form = reRegistrationInputs || localForm
  const setForm = setReRegistrationInputs || setLocalForm
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [setRegion] = useState(null)
  const [courses, setCourses] = useState([])
  const [isLoadingInit, setIsLoadingInit] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        // No token: fallback to mock courses so form is default and testable
        setCourses(MOCK_COURSES)
        setIsLoadingInit(false)
        return
      }

      try {
        const profileRes = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const profileJson = await profileRes.json()

        if (!profileRes.ok) {
          setCourses(MOCK_COURSES)
          setIsLoadingInit(false)
          return
        }

        const registration = profileJson?.data?.registration
        const userRegion = registration?.region

        if (!userRegion?.id) {
          setCourses(MOCK_COURSES)
          setIsLoadingInit(false)
          return
        }

        setRegion(userRegion)

        setForm((prev) => ({
          ...prev,
          linkedin: registration.linkedinUrl || '',
          github: registration.githubUrl || '',
          course: registration.lntCourse?.id ? String(registration.lntCourse.id) : '',
        }))

        const coursesRes = await fetch(
          `${API_BASE_URL}/lookup/courses?regionId=${userRegion.id}`
        )
        const coursesJson = await coursesRes.json()

        if (!coursesRes.ok) {
          setCourses(MOCK_COURSES)
          setIsLoadingInit(false)
          return
        }

        setCourses(coursesJson || [])
      } catch {
        setCourses(MOCK_COURSES)
      } finally {
        setIsLoadingInit(false)
      }
    }

    loadData()
  }, [])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (generalError) setGeneralError('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.linkedin.trim()) {
      nextErrors.linkedin = 'LinkedIn URL is required'
    } else if (!isValidUrl(form.linkedin.trim())) {
      nextErrors.linkedin = 'Must be a valid URL'
    } else if (!form.linkedin.toLowerCase().includes('linkedin.com')) {
      nextErrors.linkedin = 'URL must contain "linkedin.com"'
    }

    if (!form.github.trim()) {
      nextErrors.github = 'GitHub URL is required'
    } else if (!isValidUrl(form.github.trim())) {
      nextErrors.github = 'Must be a valid URL'
    } else if (!form.github.toLowerCase().includes('github.com')) {
      nextErrors.github = 'URL must contain "github.com"'
    }

    if (!form.course) {
      nextErrors.course = 'LnT Course ID is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        // Local fallback: Mock successful submit if user is not signed in
        setTimeout(() => {
          setIsSubmitting(false)
          onSubmitSuccess?.({ message: 'Success (Mock)' })
        }, 1000)
        return
      }

      const res = await fetch(`${API_BASE_URL}/reregister/profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          linkedinUrl: form.linkedin.trim(),
          githubUrl: form.github.trim(),
          lntCourseId: Number(form.course),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const message = data?.error || 'Something went wrong. Please try again.'

        if (res.status === 401) {
          setGeneralError('Your session has expired. Please log in again.')
        } else if (res.status === 404) {
          setGeneralError('Registration not found. Please contact the admin.')
        } else if (res.status === 400) {
          if (message.toLowerCase().includes('linkedin')) {
            setErrors((prev) => ({ ...prev, linkedin: message }))
          } else if (message.toLowerCase().includes('github')) {
            setErrors((prev) => ({ ...prev, github: message }))
          } else if (message.toLowerCase().includes('lnt course')) {
            setErrors((prev) => ({ ...prev, course: message }))
          } else {
            setGeneralError(message)
          }
        } else if (res.status === 500) {
          setGeneralError('Server error. Please try again later.')
        } else {
          setGeneralError(message)
        }
        setIsSubmitting(false)
        return
      }

      onSubmitSuccess?.(data)
    } catch {
      setGeneralError('Failed to connect to the server. Please check your connection.')
      setIsSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-[5px] border-1 border-[#207CDB] bg-white/10 px-2.5 py-1 text-[9px] text-[#0A2745] outline-none placeholder:text-slate-400 md:py-2 lg:px-4 lg:py-2.5 lg:text-sm ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#99C4F4] focus:border-[#207CDB]'
    }`

  // --- Loading / hard-error states before the form is usable ---
  if (isLoadingInit) {
    return (
      <Card className="w-full max-w-[520px] mx-auto p-3.5 md:p-4 lg:mx-0 lg:ml-30 lg:w-[80%] lg:max-w-[820px] lg:p-8">
        <div className="flex items-center justify-center gap-2 py-10 text-[#0A2745]">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[12px] lg:text-sm">Loading your registration data...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full p-8">
      <h1 className="inline-block py-0.5 text-[15px] font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent md:text-[23px] lg:text-4xl">
        Re-Registration Form
      </h1>

      {generalError && (
        <div className="mt-1.5 rounded-[8px] border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] text-red-600 lg:mt-4 lg:px-4 lg:py-2.5 lg:text-sm">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-1.5 lg:mt-5 lg:gap-4" noValidate>
        <div>
          <label className="mb-0.5 block text-[10px] font-medium text-[#0a27459b] md:text-[13px] lg:mb-1.5 lg:text-base">
            LinkedIn URL
          </label>
          <input
            type="text"
            value={form.linkedin}
            onChange={handleChange('linkedin')}
            placeholder="e.g. https://www.linkedin.com/in/abc-def/"
            className={inputClass('linkedin')}
          />
          {errors.linkedin && (
            <p className="mt-0.5 text-[9px] text-red-500 lg:mt-1 lg:text-xs">{errors.linkedin}</p>
          )}
        </div>

        <div>
          <label className="mb-0.5 block text-[10px] font-medium text-[#0a27459b] md:text-[13px] lg:mb-1.5 lg:text-base">
            Github URL
          </label>
          <input
            type="text"
            value={form.github}
            onChange={handleChange('github')}
            placeholder="e.g. https://www.github.com/in/abc-def/"
            className={inputClass('github')}
          />
          {errors.github && (
            <p className="mt-0.5 text-[9px] text-red-500 lg:mt-1 lg:text-xs">{errors.github}</p>
          )}
        </div>

        <div>
          <label className="mb-0.5 block text-[10px] font-medium text-[#0a27459b] md:text-[13px] lg:mb-1.5 lg:text-base">
            LnT Course
          </label>
          <div className="relative">
            <button
              type="button"
              disabled={courses.length === 0}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`${inputClass('course')} w-full flex items-center justify-between text-left pr-3 lg:pr-4 cursor-pointer ${
                isDropdownOpen ? 'border-[#207CDB] ring-2 ring-[#207CDB]/20 outline-none' : ''
              } ${form.course === '' ? 'text-slate-400' : 'text-[#0A2745] font-semibold'} disabled:opacity-60`}
            >
              <span>
                {form.course
                  ? courses.find((c) => String(c.id) === form.course)?.name
                  : courses.length === 0
                    ? 'No courses available for your region'
                    : 'Select your desired LnT Course'}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom In-Flow Dropdown Options mapping the backend API courses */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="mt-2 border border-[#99C4F4]/80 rounded-[5px] bg-[#DFEFFF]/20 flex flex-col overflow-hidden"
                >
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, course: String(course.id) }))
                        setIsDropdownOpen(false)
                        if (errors.course) {
                          setErrors((prev) => ({ ...prev, course: '' }))
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-[10px] md:text-xs lg:text-sm hover:bg-[#207CDB]/15 text-[#0A2745] font-medium transition-colors cursor-pointer border-b border-[#99C4F4]/20 last:border-b-0"
                    >
                      {course.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {errors.course && (
            <p className="mt-0.5 text-[9px] text-red-500 lg:mt-1 lg:text-xs">{errors.course}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !form.linkedin.trim() || !form.github.trim() || !form.course}
          className={
            (!form.linkedin.trim() || !form.github.trim() || !form.course)
              ? "mx-auto mt-6 flex items-center gap-1.5 rounded-[8px] bg-gradient-to-r from-[#84A4C9] to-[#A3C7EE] text-white px-5 py-2 text-[11px] font-medium shadow-sm cursor-not-allowed select-none lg:mt-8 lg:px-10 lg:py-2.5 lg:text-lg md:text-[15px]"
              : "mx-auto mt-6 flex items-center gap-1.5 rounded-[8px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-5 py-2 text-[11px] font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer lg:mt-8 lg:px-10 lg:py-2.5 lg:text-lg md:text-[15px]"
          }
        >
          {isSubmitting && <Loader2 size={13} className="animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Card>
  )
}