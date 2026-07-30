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

const labelClass = 'block text-[11px] sm:text-xs font-semibold text-[#0A2745] mb-1.5'

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

function EyeIcon({ open }) {
  return (
    <svg
      className="size-[1.1rem] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      ) : (
        <>
          <path d="M3.5 4.5 20.5 19.5" />
          <path d="M9.4 6.8c.8-.2 1.7-.3 2.6-.3 6.1 0 9.5 5.5 9.5 5.5a16 16 0 0 1-2.4 3" />
          <path d="M14.7 17.1c-.9.3-1.8.4-2.7.4-6.1 0-9.5-5.5-9.5-5.5a17 17 0 0 1 3-3.4" />
        </>
      )}
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

export default function AdminSignIn() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loginMutation } = useAuthMutation()

  const onSubmit = (formData) => {
    setLoginError('')
    loginMutation.mutate(
      {
        email: String(formData.email || '').trim(),
        password: String(formData.password || ''),
      },
      {
        onError: (err) => {
          const errorMsg =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            'Incorrect email or password'
          setLoginError(errorMsg)
        },
        onSuccess: () => {
          navigate('/admin/overview')
        },
      }
    )
  }

  return (
    <div className="auth-page">
      <AuthBackground>
        {/* Back button — fixed top-left */}
        <button
          className={`absolute top-4 left-4 sm:top-6 sm:left-8 z-[10] grid size-10 sm:size-13 cursor-pointer place-items-center rounded-[7px] border-2 border-white/85 bg-[rgb(249_252_255_/_58%)] p-0 text-[#0d3154] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[rgb(255_255_255_/_78%)] active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon />
        </button>

        {/* Main layout */}
        <section
          className="relative z-1 mx-auto flex min-h-svh w-full max-w-[52rem] flex-col items-center px-4 pt-14 sm:pt-16 lg:pt-20 pb-4 justify-between"
          aria-labelledby="sign-in-title"
        >
          <div className="w-full flex flex-col items-center flex-1 justify-center lg:justify-start">

            {/* Badge — in flow, centered above title */}
            <header className="relative z-[3] flex items-center justify-center whitespace-nowrap rounded-[5px] border-2 border-white/85 border-b-white/40 bg-[rgb(249_252_255_/_58%)] px-3.5 sm:px-5 py-1.5 sm:py-2 text-center font-outfit text-xs sm:text-sm leading-tight font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px]">
              <span className="text-[#0A2745]">BNCC OPENING&nbsp;</span>
              <strong className="font-bold text-[#2474C0]">SEASON 2026</strong>
            </header>

            {/* SIGN IN title with bounding box — sits BEHIND the card */}
            <div className="relative z-0 mt-3 sm:mt-4 flex items-center justify-center w-full">
              <BoundingBox>
                <h1
                  className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-3 sm:px-6 py-1 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(3.8rem,16vw,10rem)]"
                  id="sign-in-title"
                >
                  ADMIN SIGN IN
                </h1>
              </BoundingBox>
            </div>

            {/* Glass card — narrower than title so bounding handles poke out the sides */}
            <form
              className="relative z-[2] -mt-5 min-[400px]:-mt-7 sm:-mt-8 w-[82%] max-w-[19rem] min-[400px]:max-w-[21rem] sm:max-w-[24rem] lg:max-w-[26rem] flex flex-col rounded-[15px] border-[2.5px] border-white/90 bg-white/35 backdrop-blur-lg px-5 sm:px-8 pt-7 sm:pt-9 pb-6 sm:pb-7 text-[#0A2745] space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Admin Email */}
              <div>
                <label className={labelClass} htmlFor="email">Admin Email</label>
                <input
                  {...register('email', {
                    required: 'Admin Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={inputClass}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your admin email"
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Admin Password */}
              <div>
                <label className={labelClass} htmlFor="password">Admin Password</label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Admin Password is required' })}
                    className={`${inputClass} pr-10`}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your admin password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#4C88C7] hover:text-[#0D2A4E] transition-colors"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] text-red-500">{errors.password.message}</p>
                )}
              </div>

              {loginError && (
                <p className="text-center text-[10px] text-red-500 font-semibold">{loginError}</p>
              )}

              {/* Sign In Button */}
              <button
                disabled={loginMutation.isPending}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
                type="submit"
              >
                {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <BnccMark />
        </section>
      </AuthBackground>
    </div>
  )
}
