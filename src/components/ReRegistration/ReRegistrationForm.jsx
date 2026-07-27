import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Card from './Card'

const LNT_COURSES = [
  'UI/UX Design',
  'Front-End Development',
  'Back-End Development',
  'Java Programming',
  'Mobile Application Development',
  'Machine Learning',
]

export default function ReRegistrationForm() {
  const [form, setForm] = useState({
    linkedin: '',
    github: '',
    course: '',
  })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: sambungkan ke API/backend di sini
    console.log(form)
  }

  const inputClass =
    'w-full rounded-[8px] border-2 border-[#99C4F4] bg-white/50 px-4 py-2.5 text-sm text-[#0A2745] outline-none placeholder:text-slate-400 focus:border-[#207CDB]'

  return (
    <Card className="w-[80%] max-w-[820px] p-6 md:p-7 lg:p-8 lg:ml-30">
      <h1 className="inline-block py-1 text-xl font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent md:text-[36px]">
        Re-Registration Form
      </h1>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={form.linkedin}
            onChange={handleChange('linkedin')}
            placeholder="e.g. https://www.linkedin.com/in/abc-def/"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
            Github URL
          </label>
          <input
            type="url"
            value={form.github}
            onChange={handleChange('github')}
            placeholder="e.g. https://www.github.com/in/abc-def/"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 lg:text-base">
            LnT Course
          </label>
          <div className="relative">
            <select
              value={form.course}
              onChange={handleChange('course')}
              className={`${inputClass} appearance-none pr-10 ${
                form.course === '' ? 'text-slate-400' : 'text-[#0A2745]'
              }`}
            >
              <option value="" disabled>
                Select your desired LnT Course
              </option>
              {LNT_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto mt-2 rounded-[10px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-10 py-2.5 lg:text-lg font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </Card>
  )
}