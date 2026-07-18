import { useState } from 'react'
import { X } from 'lucide-react'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [closing, setClosing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // TODO: sambungkan ke API/backend di sini
    setClosing(false)
    setShowToast(true)
    setEmail('')
  }

  const closeToast = () => {
    setClosing(true)
    // tunggu animasi keluar selesai baru unmount
    setTimeout(() => {
      setShowToast(false)
      setClosing(false)
    }, 250)
  }

  return (
    <div className="w-full sm:w-[70%] flex flex-col items-center gap-3 sm:gap-4 px-4 py-6 sm:p-8">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-10px) scale(0.96); }
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl items-center overflow-hidden rounded-xl border border-[#2474C0] bg-transparent p-1 sm:p-1.5"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your E-mail Here"
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm sm:px-5 sm:text-lg text-slate-600 outline-none placeholder:text-slate-500"
          required
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-gradient-to-br from-[#0C4076] to-[#4489D4] px-4 py-2 text-sm sm:px-6 sm:text-base font-medium text-white cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 hover:shadow-lg hover:shadow-blue-900/30 active:scale-95"
        >
          Send
        </button>
      </form>

      {showToast && (
        <div
          style={{
            animation: closing
              ? 'toastOut 0.25s ease-in forwards'
              : 'toastIn 0.3s ease-out forwards',
          }}
          className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white/80 px-3 py-2 sm:px-4 max-w-full text-xs sm:text-sm text-slate-700 shadow-sm backdrop-blur-sm"
        >
          <span className="text-left">Email received! Exciting things are coming your way!</span>
          <button
            onClick={closeToast}
            aria-label="Tutup notifikasi"
            className="shrink-0 transition-transform duration-200 hover:scale-110"
          >
            <X size={16} className="text-slate-500 hover:text-slate-700" />
          </button>
        </div>
      )}
    </div>
  )
}