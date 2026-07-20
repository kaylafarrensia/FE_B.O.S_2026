import { useState } from 'react'
import { X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: string }
  const [closing, setClosing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/coming-soon/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        showToast('success', 'Email received! Exciting things are coming your way!')
        setEmail('')
      } else {
        showToast('error', data.message || 'Terjadi kesalahan, coba lagi.')
      }
    } catch (err) {
      console.error('Subscribe error:', err)
      showToast('error', 'Gagal terhubung ke server. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, message) => {
    setClosing(false)
    setToast({ type, message })
  }

  const closeToast = () => {
    setClosing(true)
    setTimeout(() => {
      setToast(null)
      setClosing(false)
    }, 250)
  }

  return (
    <div className="w-full sm:w-[70%] flex flex-col items-center gap-3 sm:gap-4 px-4 py-6 sm:p-8">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(10px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(10px) scale(0.96); }
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
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-xl bg-gradient-to-br from-[#0C4076] to-[#4489D4] px-4 py-2 text-sm sm:px-6 sm:text-base font-medium text-white cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 hover:shadow-lg hover:shadow-blue-900/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {toast && (
        <div
          style={{
            animation: closing
              ? 'toastOut 0.25s ease-in forwards'
              : 'toastIn 0.3s ease-out forwards',
          }}
          className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6 z-30 flex items-center gap-2 sm:gap-3 rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm shadow-lg backdrop-blur-sm ${
            toast.type === 'success'
              ? 'border-blue-100 bg-white/80 text-slate-700'
              : 'border-red-200 bg-red-50/90 text-red-700'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={closeToast}
            aria-label="Tutup notifikasi"
            className="shrink-0 transition-transform duration-200 hover:scale-110"
          >
            <X size={14} className="sm:hidden opacity-70 hover:opacity-100" />
            <X size={16} className="hidden sm:block opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  )
}