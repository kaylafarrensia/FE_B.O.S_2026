import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthMutation from '@/hooks/mutations/useAuthMutation'
import AuthBackground from '@/components/AuthBackground'

const selectionHandlePositions = {
  'top-left': 'top-0 left-0 -translate-x-[55%] -translate-y-[55%]',
  'top-right': 'top-0 right-0 translate-x-[55%] -translate-y-[55%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[55%] translate-y-[55%]',
  'bottom-right': 'right-0 bottom-0 translate-x-[55%] translate-y-[55%]',
}

const inputClasses =
  'h-[3.2rem] w-full rounded-[10px] border-[1.5px] border-[#207CDB] bg-[rgb(239_247_255_/_60%)] px-4 pr-11 font-outfit text-base sm:text-lg font-normal text-[#0b2c4e] outline-none placeholder:text-[#105EA9]/60 hover:bg-[rgb(246_251_255_/_75%)] focus-visible:bg-[rgb(255_255_255_/_82%)] focus-visible:shadow-[0_0_0_3px_rgb(22_125_225_/_24%)] transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none'

const focusRingClasses =
  'focus-visible:outline-[3px] focus-visible:outline-[#0c65b7] focus-visible:outline-offset-[3px]'

const titleStyle = {
  backgroundImage: 'linear-gradient(180deg, #4489D4 0%, #EAF5FF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

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

function CheckIcon() {
  return (
    <svg
      className="size-8 text-white fill-none stroke-current stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const { getResetPasswordMutation, resetPasswordMutation } = useAuthMutation()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [linkError, setLinkError] = useState('')

  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const newPassword = watch('newPassword', '')
  const isPasswordValid =
    newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)

  useEffect(() => {
    if (!token) {
      setLinkError('Reset password token is missing, invalid, or expired.')
      return
    }
    getResetPasswordMutation.mutate(
      { token },
      {
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            'Reset password token is empty, invalid, or expired.'
          setLinkError(msg)
        },
      }
    )
    // eslint-disable-next-line
  }, [token])

  const onSubmit = (data) => {
    setErrorMsg('')
    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters long with uppercase & lowercase.')
      return
    }
    const payload = {
      token: String(token || '').trim(),
      email: String(email || '').trim(),
      newPassword: String(data.newPassword || ''),
      confirmPassword: String(data.confirmPassword || ''),
    }
    resetPasswordMutation.mutate(payload, {
      onSuccess: () => setSuccessVisible(true),
      onError: (err) => {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Reset password failed. Please try again.'
        setErrorMsg(message)
      },
    })
  }

  return (
    <AuthBackground>
      {/* Back button */}
      <button
        className={`absolute top-3 left-3 sm:top-6 sm:left-8 z-[10] grid size-10 sm:size-13 cursor-pointer place-items-center rounded-[7px] border-2 border-white/85 bg-[rgb(249_252_255_/_58%)] p-0 text-[#0d3154] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[rgb(255_255_255_/_78%)] active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
        type="button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon />
      </button>

      {/* Badge — top center */}
      <header className="absolute z-[5] top-3.5 sm:top-6 left-1/2 -translate-x-1/2 flex items-center justify-center whitespace-nowrap rounded-[5px] border-2 border-white/85 border-b-white/40 bg-[rgb(249_252_255_/_58%)] px-3.5 sm:px-5 py-1.5 sm:py-2 text-center font-outfit text-xs sm:text-lg leading-tight font-semibold tracking-[-0.035em] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px]">
        <span className="bg-gradient-to-r from-20% to-80% from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent">
          BNCC OPENING&nbsp;<strong className="font-bold">SEASON 2026</strong>
        </span>
      </header>

      {/* ── "RESET" — large, positioned behind form top-left ── */}
      <div
        className="absolute z-[1] pointer-events-none left-[2%] sm:left-[6%] lg:left-[9%] top-[27%] min-[450px]:top-[25%] sm:top-[17%] md:top-[14%] lg:top-[11%]"
      >
        <BoundingBox>
          <h1
            id="reset-password-title"
            className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-2 sm:px-4 py-1 sm:py-2 text-[clamp(3.5rem,14vw,16rem)]"
            style={titleStyle}
          >
            RESET
          </h1>
        </BoundingBox>
      </div>

      {/* ── "PASS" — large, positioned behind form bottom-right ── */}
      <div
        className="absolute z-[1] pointer-events-none right-0 sm:right-[5%] lg:right-[8%] top-[57%] min-[450px]:top-[56%] sm:top-[55%] md:top-[52%] lg:top-[49%]"
      >
        <BoundingBox>
          <span
            className="block font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-2 sm:px-4 py-1 sm:py-2 text-[clamp(3.5rem,14vw,16rem)]"
            style={titleStyle}
          >
            PASS
          </span>
        </BoundingBox>
      </div>

      {/* ── Form card — centered, IN FRONT of titles ── */}
      <div
        className="absolute inset-x-0 z-[3] flex justify-center px-4 pointer-events-none top-[47%] md:top-[45%] lg:top-[44%] -translate-y-1/2"
      >
        <form
          className="pointer-events-auto w-full max-w-[22rem] min-[400px]:max-w-[26rem] sm:max-w-[32rem] lg:max-w-[36rem] flex flex-col rounded-[15px] border-[3px] border-white/90 bg-white/30 backdrop-blur-lg px-5 min-[400px]:px-7 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-5 sm:pb-6 text-[#0A2745] gap-3 sm:gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {linkError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600 text-center font-semibold">
              {linkError}{' '}
              <span
                onClick={() => navigate('/forgot-password')}
                className="font-bold underline cursor-pointer hover:opacity-80"
              >
                Request a new link
              </span>
            </div>
          )}

          {/* New Password */}
          <div>
            <label
              className="mb-1.5 block font-outfit text-base sm:text-lg leading-snug font-semibold tracking-[-0.035em]"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                {...register('newPassword', {
                  required: 'New password is required',
                  validate: (v) =>
                    (v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v)) ||
                    'Min 8 chars with uppercase & lowercase',
                })}
                className={inputClasses}
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter your password"
              />
              <button
                className={`absolute right-3 grid size-8 cursor-pointer place-items-center rounded-md text-[#105EA9]/75 transition-colors hover:text-[#0b2c4e] ${focusRingClasses}`}
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 font-medium">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              className="mb-1.5 block font-outfit text-base sm:text-lg leading-snug font-semibold tracking-[-0.035em]"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === newPassword || 'Passwords do not match',
                })}
                className={inputClasses}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm your password"
              />
              <button
                className={`absolute right-3 grid size-8 cursor-pointer place-items-center rounded-md text-[#105EA9]/75 transition-colors hover:text-[#0b2c4e] ${focusRingClasses}`}
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-center text-xs sm:text-sm text-red-500 font-semibold">{errorMsg}</p>
          )}

          <button
            disabled={resetPasswordMutation.isPending || !!linkError}
            className={`mx-auto mt-3 min-h-[3rem] w-[11rem] sm:w-[13rem] cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-20% from-[#0C4076] to-[#4489D4] font-outfit text-base sm:text-lg font-semibold text-white transition-[filter,transform] duration-200 ease-out hover:brightness-108 active:translate-y-px motion-reduce:transition-none disabled:opacity-50 ${focusRingClasses}`}
            type="submit"
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset'}
          </button>
        </form>
      </div>

      {/* BNCC Logo — bottom center */}
      <div className="absolute z-[5] bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2">
        <img
          className="h-9 sm:h-11 w-auto object-contain"
          src="/images/bncc-logo.png"
          alt="Bina Nusantara Computer Club"
        />
      </div>

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

            <h3 className="text-xl sm:text-2xl font-bold text-[#0A2745] mb-8 tracking-tight">
              Password updated!
            </h3>

            <button
              onClick={() => navigate('/signin')}
              className="w-full max-w-[220px] py-3 rounded-xl text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
              type="button"
            >
              Return to Sign In Page
            </button>
          </div>
        </div>
      )}
    </AuthBackground>
  )
}
