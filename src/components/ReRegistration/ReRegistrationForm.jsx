import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import Card from './Card'

const LNT_COURSES = [
  { id: 1, name: 'UI/UX Design' },
  { id: 2, name: 'Front-End Development' },
  { id: 3, name: 'Back-End Development' },
  { id: 4, name: 'Java Programming' },
  { id: 5, name: 'Mobile Application Development' },
  { id: 6, name: 'Machine Learning' },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function ReRegistrationForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({
    linkedin: '',
    github: '',
    course: '',
  })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        setGeneralError('You must be logged in to continue.')
        setIsSubmitting(false)
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
    } catch (err) {
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

  return (
    <Card className="w-full max-w-[520px] mx-auto p-3.5 md:p-4 lg:mx-0 lg:ml-30 lg:w-[80%] lg:max-w-[820px] lg:p-8">
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
            <select
              value={form.course}
              onChange={handleChange('course')}
              className={`${inputClass('course')} appearance-none pr-8 lg:pr-10 ${
                form.course === '' ? 'text-slate-400' : 'text-[#0A2745]'
              }`}
            >
              <option value="" disabled>
                Select your desired LnT Course
              </option>
              {LNT_COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 lg:right-3.5 lg:h-4 lg:w-4"
            />
          </div>
          {errors.course && (
            <p className="mt-0.5 text-[9px] text-red-500 lg:mt-1 lg:text-xs">{errors.course}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto mt-0.5 flex items-center gap-1.5 rounded-[8px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-5 py-2 text-[11px] font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer lg:mt-2 lg:px-10 lg:py-2.5 lg:text-lg md:text-[15px]"
        >
          {isSubmitting && <Loader2 size={13} className="animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Card>
  )
}