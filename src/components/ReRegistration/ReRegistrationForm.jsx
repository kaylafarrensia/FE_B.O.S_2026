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
    `w-full rounded-[8px] border-2 bg-white/50 px-4 py-2.5 text-sm text-[#0A2745] outline-none placeholder:text-slate-400 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#99C4F4] focus:border-[#207CDB]'
    }`

  return (
    <Card className="w-[80%] max-w-[820px] p-6 md:p-7 lg:p-8 lg:ml-30">
      <h1 className="inline-block py-1 text-xl font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent md:text-[36px]">
        Re-Registration Form
      </h1>

      {generalError && (
        <div className="mt-4 rounded-[8px] border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
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
            <p className="mt-1 text-xs text-red-500">{errors.linkedin}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
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
            <p className="mt-1 text-xs text-red-500">{errors.github}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
            LnT Course
          </label>
          <div className="relative">
            <select
              value={form.course}
              onChange={handleChange('course')}
              className={`${inputClass('course')} appearance-none pr-10 ${
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
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
          {errors.course && (
            <p className="mt-1 text-xs text-red-500">{errors.course}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto mt-2 flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-10 py-2.5 lg:text-lg font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Card>
  )
}