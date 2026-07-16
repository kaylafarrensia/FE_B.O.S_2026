import { useState } from 'react'
import { X } from 'lucide-react'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // TODO: sambungkan ke API/backend di sini
    setShowToast(true)
    setEmail('')
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md overflow-hidden rounded-xl border border-[#2474C0] bg-transparent backdrop-blur-sm"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your E-mail Here"
          className="flex-1 bg-transparent px-5 py-3 text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-poppins"
          required
        />
        <button
          type="submit"
          className="bg-blue-900 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
        >
          Send
        </button>
      </form>

      {showToast && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur-sm">
          <span>Email received — exciting things are coming your way!</span>
          <button onClick={() => setShowToast(false)} aria-label="Tutup notifikasi">
            <X size={16} className="text-slate-500 hover:text-slate-700" />
          </button>
        </div>
      )}
    </div>
  )
}