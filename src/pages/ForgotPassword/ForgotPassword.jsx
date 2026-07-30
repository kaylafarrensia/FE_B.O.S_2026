import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuthMutation from '@/hooks/mutations/useAuthMutation'
import AuthBackground from '@/components/AuthBackground'

const selectionHandlePositions = {
  'top-left': 'top-0 left-0 -translate-x-[55%] -translate-y-[55%]',
  'top-right': 'top-0 right-0 translate-x-[55%] -translate-y-[55%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[55%] translate-y-[55%]',
  'bottom-right': 'right-0 bottom-0 translate-x-[55%] translate-y-[55%]',
}

const inputClass =
  'w-full rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#0A2745] placeholder-[#81A8CE]/80 outline-none transition-all bg-[#EBF5FF]/50 border border-[#99C4F4] focus:bg-[#EBF5FF]/70 focus:border-[#207CDB] focus:ring-2 focus:ring-[#207CDB]/20'

const focusRingClasses =
  'focus-visible:outline-[3px] focus-visible:outline-[#0c65b7] focus-visible:outline-offset-[3px]'

function ArrowLeftIcon() {
  return (
    <svg
      className="size-[1.6rem] sm:size-[1.9rem] fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path d="M27 16H6M14 7l-9 9 9 9" />
    </svg>
  )
}

function SelectionHandle({ position }) {
  return (
    <span
      className={`absolute size-3 sm:size-4 border-2 border-[#207CDB] bg-[#f9fcff] ${selectionHandlePositions[position]}`}
      aria-hidden="true"
    />
  )
}

function BoundingBox({ children }) {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 border-2 border-[#207CDB]" aria-hidden="true">
        <SelectionHandle position="top-left" />
        <SelectionHandle position="top-right" />
        <SelectionHandle position="bottom-left" />
        <SelectionHandle position="bottom-right" />
      </div>
      {children}
    </div>
  )
}

function BnccMark() {
  return (
    <img
      className="mt-6 mb-2 h-9 sm:h-11 w-auto object-contain"
      src="/images/bncc-logo.png"
      alt="Bina Nusantara Computer Club"
    />
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { forgotPasswordMutation } = useAuthMutation()
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = (data) => {
    setErrorMsg('')
    forgotPasswordMutation.mutate(
      { email: String(data.email || '').trim() },
      {
        onSuccess: () => setSuccessVisible(true),
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Something went wrong. Please try again.'
          setErrorMsg(message)
        },
      }
    )
  }

  return (
    <AuthBackground>
      {/* Back button — absolute top-left */}
      <button
        className={`absolute top-4 left-4 sm:top-6 sm:left-8 z-[10] grid size-10 sm:size-13 cursor-pointer place-items-center rounded-[7px] border-2 border-white/85 bg-[rgb(249_252_255_/_58%)] p-0 text-[#0d3154] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[rgb(255_255_255_/_78%)] active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
        type="button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon />
      </button>

      {/* Main section — flow-based layout */}
      <section
        className="relative z-1 mx-auto flex min-h-svh w-full max-w-[52rem] flex-col items-center px-4 pt-14 sm:pt-16 lg:pt-20 pb-4 justify-between"
        aria-labelledby="forgot-password-title"
      >
        <div className="w-full flex flex-col items-center flex-1 justify-center lg:justify-start">

          {/* Badge — in flow, centered */}
          <header className="relative z-[3] flex items-center justify-center whitespace-nowrap rounded-[5px] border-2 border-white/85 border-b-white/40 bg-[rgb(249_252_255_/_58%)] px-3.5 sm:px-5 py-1.5 sm:py-2 text-center font-outfit text-xs sm:text-sm leading-tight font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px]">
            <span className="text-[#0A2745]">BNCC OPENING&nbsp;</span>
            <strong className="font-bold text-[#2474C0]">SEASON 2026</strong>
          </header>

          {/* FORGOT — left-aligned, z-0, sits behind card */}
          <div className="relative z-0 mt-3 sm:mt-4 w-full pointer-events-none">
            <BoundingBox>
              <h1
                id="forgot-password-title"
                className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-3 sm:px-6 py-1 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(3.8rem,16vw,10rem)]"
              >
                FORGOT
              </h1>
            </BoundingBox>
          </div>

          {/* Card — narrower than FORGOT, overlaps its bottom */}
          <form
            className="relative z-[2] -mt-2 min-[400px]:-mt-4 sm:-mt-8 w-[82%] max-w-[19rem] min-[400px]:max-w-[21rem] sm:max-w-[24rem] lg:max-w-[26rem] flex flex-col rounded-[15px] border-[2.5px] border-white/90 bg-white/35 backdrop-blur-lg px-5 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6 text-[#0A2745] space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Label */}
            <label
              className="block text-xs sm:text-sm font-bold text-[#0A2745] leading-snug"
              htmlFor="email"
            >
              Enter your registered email address
            </label>

            {/* Email input */}
            <div className="-mt-2">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={inputClass}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            {errorMsg && (
              <p className="text-center text-[10px] text-red-500 font-semibold">{errorMsg}</p>
            )}

            {/* Send button */}
            <button
              disabled={forgotPasswordMutation.isPending}
              className={`w-full py-2.5 rounded-lg text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 ${focusRingClasses}`}
              style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
              type="submit"
            >
              {forgotPasswordMutation.isPending ? 'Sending…' : 'Send'}
            </button>

            {/* Sign in link */}
            <p className="text-center text-xs sm:text-sm font-medium pb-1">
              Remember your password?{' '}
              <span
                onClick={() => navigate('/auth/signin')}
                className={`cursor-pointer font-bold text-[#1476bc] underline underline-offset-2 hover:opacity-80 transition-opacity ${focusRingClasses}`}
              >
                Sign in here
              </span>
            </p>
          </form>

          {/* PASS — right-aligned, z-0, overlaps card bottom */}
          <div className="relative z-0 -mt-4 min-[400px]:-mt-5 sm:-mt-9 lg:-mt-10 w-full flex justify-end pointer-events-none">
            <BoundingBox>
              <span className="block font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-3 sm:px-6 py-1 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(3.8rem,16vw,10rem)]">
                PASS
              </span>
            </BoundingBox>
          </div>

        </div>

        <BnccMark />
      </section>

      {/* ════ SUCCESS POPUP ════ */}
      {successVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(15, 35, 65, 0.30)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setSuccessVisible(false)}
          />
          <div
            className="relative z-10 w-full max-w-[22rem] sm:max-w-[26rem] rounded-[22px] border border-white/90 bg-white/40 backdrop-blur-2xl px-6 sm:px-9 py-8 sm:py-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(10,39,69,0.25)]"
          >
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#22C55E] flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(34,197,94,0.35)]">
              <svg className="w-10 h-10 text-white stroke-current stroke-[3.5] fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0A2745] mb-2.5 tracking-tight">
              Instructions have been sent to your email!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#386496] leading-relaxed mb-8">
              Please check your email and click the verification link.
              <br />
              If you didn't receive the email, please try again.
            </p>

            <button
              onClick={() => navigate('/auth/signin')}
              className="w-full max-w-[170px] py-3 rounded-xl text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
              type="button"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </AuthBackground>
  )
}
