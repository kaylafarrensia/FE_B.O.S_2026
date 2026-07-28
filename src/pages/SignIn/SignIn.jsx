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

const inputClasses =
  'h-[3.2rem] w-full rounded-[10px] border-[1.5px] border-[#207CDB] bg-[rgb(239_247_255_/_60%)] px-4 font-outfit text-base sm:text-lg font-normal text-[#0b2c4e] outline-none placeholder:text-[#105EA9]/60 hover:bg-[rgb(246_251_255_/_75%)] focus-visible:bg-[rgb(255_255_255_/_82%)] focus-visible:shadow-[0_0_0_3px_rgb(22_125_225_/_24%)] transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none'

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
      className="size-[1.4rem] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
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

export default function SignIn() {
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
          navigate('/')
        },
      }
    )
  }

  return (
    <AuthBackground>
      {/* Back button */}
      <button
        className={`absolute top-4 left-4 sm:top-6 sm:left-8 z-[4] grid size-11 sm:size-13 cursor-pointer place-items-center rounded-[7px] border-2 border-white/85 bg-[rgb(249_252_255_/_58%)] p-0 text-[#0d3154] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[rgb(255_255_255_/_78%)] active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
        type="button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon />
      </button>

      <section
        className="relative z-1 mx-auto flex min-h-svh w-full max-w-[48rem] flex-col items-center px-4 pt-4 sm:pt-8 lg:pt-12 pb-4 justify-between"
        aria-labelledby="sign-in-title"
      >
        <div className="w-full flex flex-col items-center flex-1 justify-center lg:justify-start">
          {/* Header Badge */}
          <header className="relative z-[3] flex items-center justify-center whitespace-nowrap rounded-[5px] border-2 border-white/85 border-b-white/40 bg-[rgb(249_252_255_/_58%)] px-3.5 sm:px-5 py-1.5 sm:py-2 text-center font-outfit text-xs sm:text-lg leading-tight font-semibold tracking-[-0.035em] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px]">
            <span className="bg-gradient-to-r from-20% to-80% from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
              BNCC OPENING&nbsp;<strong className="font-bold">SEASON 2026</strong>
            </span>
          </header>

          {/* Title Box with Bounding Box & Selection Handles */}
          <div className="relative z-0 mt-3 sm:mt-4 lg:mt-2.5 flex items-center justify-center">
            <BoundingBox>
              <h1
                className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(4.2rem,17.5vw,8.5rem)]"
                id="sign-in-title"
              >
                SIGN IN
              </h1>
            </BoundingBox>
          </div>

          {/* Glassmorphism Form Card */}
          <form
            className="relative z-2 -mt-6 min-[400px]:-mt-8 sm:-mt-9 lg:-mt-7 flex w-full max-w-[19.5rem] min-[400px]:max-w-[22.5rem] sm:max-w-[28rem] lg:max-w-[34rem] flex flex-col rounded-[15px] border-[3px] border-white/90 bg-white/30 backdrop-blur-lg px-4 min-[400px]:px-6 sm:px-10 pt-6 sm:pt-8 lg:pt-9 pb-5 sm:pb-6 text-[#0A2745]"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div>
              <label
                className="mb-1.5 block font-outfit text-base sm:text-lg leading-snug font-semibold tracking-[-0.035em]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={inputClasses}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label
                className="mb-1.5 block font-outfit text-base sm:text-lg leading-snug font-semibold tracking-[-0.035em]"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  className={`${inputClasses} pr-12`}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  className={`absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-0 text-[#105EA9]/80 hover:bg-white/45 hover:text-[#155c9e] ${focusRingClasses}`}
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <span
              onClick={() => navigate('/forgot-password')}
              className={`mt-2 self-end cursor-pointer font-outfit text-xs sm:text-sm font-normal text-[#0a2b4c] underline underline-offset-2 hover:text-[#1476bc] transition-colors ${focusRingClasses}`}
            >
              Forgot your password?
            </span>

            {loginError && (
              <p className="mt-2 text-center text-xs sm:text-sm text-red-500 font-semibold">{loginError}</p>
            )}

            {/* Sign In Button */}
            <button
              disabled={loginMutation.isPending}
              className={`mx-auto mt-6 min-h-[3rem] w-[13rem] sm:w-[15rem] cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-20% from-[#0C4076] to-[#4489D4] font-outfit text-base sm:text-lg font-semibold text-white transition-[filter,transform] duration-200 ease-out hover:brightness-108 active:translate-y-px motion-reduce:transition-none disabled:opacity-50 ${focusRingClasses}`}
              type="submit"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Register Link */}
            <p className="mt-4 mb-0 text-center font-outfit text-xs sm:text-sm font-medium">
              Don’t have an account?{' '}
              <span
                onClick={() => navigate('/signup')}
                className={`cursor-pointer font-bold text-[#1476bc] underline underline-offset-2 hover:opacity-80 transition-opacity ${focusRingClasses}`}
              >
                Register here
              </span>
            </p>
          </form>
        </div>

        <BnccMark />
      </section>
    </AuthBackground>
  )
}
