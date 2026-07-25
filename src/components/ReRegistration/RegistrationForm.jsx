import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Card from './Card'

const LNT_COURSES = [
  'UI/UX Design',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Cyber Security',
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
    'w-full rounded-xl border-2 border-[#99C4F4] bg-white/50 px-5 py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#2474C0] sm:text-base'

  return (
    <Card className="w-full">
      <h1 className="text-2xl font-extrabold text-[#0A2745] sm:text-3xl md:text-4xl">
        Re-Registration <span className="text-[#2474C0]">Form</span>
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
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
          <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
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
          <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
            LnT Course
          </label>
          <div className="relative">
            <select
              value={form.course}
              onChange={handleChange('course')}
              className={`${inputClass} appearance-none pr-12 ${
                form.course === '' ? 'text-slate-400' : 'text-slate-700'
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
              size={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto mt-4 rounded-xl bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-14 py-3.5 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 sm:text-lg"
        >
          Submit
        </button>
      </form>
    </Card>
  )
}