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

      {/* ── "FORGOT" — large, positioned behind form top-left ── */}
      <div
        className="absolute z-[1] pointer-events-none left-[2%] sm:left-[6%] lg:left-[9%] top-[27%] min-[450px]:top-[25%] sm:top-[17%] md:top-[14%] lg:top-[11%]"
      >
        <BoundingBox>
          <h1
            id="forgot-password-title"
            className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-2 sm:px-4 py-1 sm:py-2 text-[clamp(3.5rem,14vw,16rem)]"
            style={titleStyle}
          >
            FORGOT
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
          className="pointer-events-auto w-full max-w-[22rem] min-[400px]:max-w-[26rem] sm:max-w-[32rem] lg:max-w-[36rem] flex flex-col rounded-[15px] border-[3px] border-white/90 bg-white/30 backdrop-blur-lg px-5 min-[400px]:px-7 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-5 sm:pb-6 text-[#0A2745]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              className="mb-2 block font-outfit text-base sm:text-lg leading-snug font-semibold tracking-[-0.035em]"
              htmlFor="email"
            >
              Enter your registered email address
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

          {errorMsg && (
            <p className="mt-2 text-center text-xs sm:text-sm text-red-500 font-semibold">{errorMsg}</p>
          )}

          <button
            disabled={forgotPasswordMutation.isPending}
            className={`mx-auto mt-6 min-h-[3rem] w-[11rem] sm:w-[13rem] cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-20% from-[#0C4076] to-[#4489D4] font-outfit text-base sm:text-lg font-semibold text-white transition-[filter,transform] duration-200 ease-out hover:brightness-108 active:translate-y-px motion-reduce:transition-none disabled:opacity-50 ${focusRingClasses}`}
            type="submit"
          >
            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send'}
          </button>

          <p className="mt-4 mb-0 text-center font-outfit text-xs sm:text-sm font-medium">
            Remember your password?{' '}
            <span
              onClick={() => navigate('/signin')}
              className={`cursor-pointer font-bold text-[#1476bc] underline underline-offset-2 hover:opacity-80 transition-opacity ${focusRingClasses}`}
            >
              Sign in here
            </span>
          </p>
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
            className="absolute inset-0 bg-[#0B2C4E]/25 backdrop-blur-md"
            onClick={() => setSuccessVisible(false)}
          />
          <div className="relative z-10 w-full max-w-[28rem] flex flex-col items-center text-center rounded-[15px] border-[3px] border-white/90 bg-white/80 backdrop-blur-xl px-6 sm:px-8 py-8 shadow-2xl">
            <div className="size-14 sm:size-16 rounded-full bg-[#23C45E] flex items-center justify-center mb-4 shadow-md">
              <CheckIcon />
            </div>
            <h3 className="font-outfit text-lg sm:text-xl font-bold text-[#0A2745] mb-2 leading-snug">
              Instructions have been sent to your email!
            </h3>
            <p className="font-outfit text-xs sm:text-sm text-[#0A2745]/80 mb-6 leading-relaxed">
              Please check your email and click the verification link.
              <br />
              If you didn't receive the email, please try again.
            </p>
            <button
              onClick={() => navigate('/signin')}
              className={`min-h-[2.8rem] w-[9rem] sm:w-[10rem] cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-20% from-[#0C4076] to-[#4489D4] font-outfit text-base font-semibold text-white transition-[filter,transform] duration-200 ease-out hover:brightness-108 active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
              type="button"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </AuthBackground>
  )
}
