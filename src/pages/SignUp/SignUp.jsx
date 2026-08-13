import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import {
  usePopup,
  useLookupQuery,
  useLinkQuery,
  useAuthMutation,
} from '@/hooks'
import { formatScheduleDisplay } from '@/lib/utils'
import AuthBackground from '@/components/AuthBackground'

/* ─────────────────────────────── helpers ─────────────────────── */
const selectionHandlePositions = {
  'top-left': 'top-0 left-0 -translate-x-[55%] -translate-y-[55%]',
  'top-right': 'top-0 right-0 translate-x-[55%] -translate-y-[55%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[55%] translate-y-[55%]',
  'bottom-right': 'right-0 bottom-0 translate-x-[55%] translate-y-[55%]',
}

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
      <div
        className="absolute inset-0 border-2 border-[#207CDB]"
        aria-hidden="true"
      >
        <SelectionHandle position="top-left" />
        <SelectionHandle position="top-right" />
        <SelectionHandle position="bottom-left" />
        <SelectionHandle position="bottom-right" />
      </div>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#0A2745] placeholder-[#81A8CE]/80 outline-none transition-all bg-[#EBF5FF]/50 border border-[#99C4F4] focus:bg-[#EBF5FF]/70 focus:border-[#207CDB] focus:ring-2 focus:ring-[#207CDB]/20'
const labelClass =
  'block text-[11px] sm:text-xs font-semibold text-[#0A2745] font-poppins mb-1.5'
const selectClass =
  'w-full rounded-lg px-3.5 py-2 text-xs sm:text-sm outline-none transition-all appearance-none cursor-pointer bg-[#EBF5FF]/50 border border-[#99C4F4] focus:bg-[#EBF5FF]/70 focus:border-[#207CDB] focus:ring-2 focus:ring-[#207CDB]/20'

const TOTAL_STEPS = 4

/* ═══════════════════════════════════════════════════════════════ */
export default function SignUp() {
  const navigate = useNavigate()
  const { isOpen, config, showPopup, hidePopup } = usePopup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    trigger,
    setValue,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      isJapres: false,
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [waChecked, setWaChecked] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [expoCode, setExpoCode] = useState('')
  const [showExpoCode, setShowExpoCode] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  // ── Track if user has clicked "Show Code" ──
  const [hasSeenCode, setHasSeenCode] = useState(false)

  const watchedPassword = watch('password', '')
  const watchedRegionId = watch('regionId')
  const watchedFacultyId = watch('facultyId')

  const {
    regionQuery,
    facultyQuery,
    majorQuery,
    lntCourseQuery,
    scheduleQuery,
  } = useLookupQuery(watchedRegionId, watchedFacultyId)
  const { registerMutation } = useAuthMutation()

  // ── Query Region Links from Links DB ──
  const { linkQuery } = useLinkQuery(watchedRegionId)

  // ── Ultra-Robust WhatsApp URL Matcher ──
  const regionWaGroupUrl = useMemo(() => {
    const rawLinks = linkQuery

    // Safely extract items from any nested structure
    const linksList = Array.isArray(rawLinks)
      ? rawLinks
      : Array.isArray(rawLinks?.data)
        ? rawLinks.data
        : Array.isArray(rawLinks?.links)
          ? rawLinks.links
          : []

    if (!watchedRegionId) return null

    // If it's the mock links object:
    if (rawLinks && !Array.isArray(rawLinks) && rawLinks.wa_info) {
      return rawLinks.wa_info
    }

    if (linksList.length === 0) return null

    const targetRegionId = Number(watchedRegionId)

    // 1. First Pass: Try finding exact match with regionId AND WA_INFO tag/name
    let matchedLink = linksList.find((item) => {
      const itemRegionId = item?.regionId ?? item?.region?.id
      const matchRegion =
        !itemRegionId || Number(itemRegionId) === targetRegionId

      const tagUpper = String(item?.tag || '').toUpperCase()
      const nameLower = String(item?.name || '').toLowerCase()
      const urlLower = String(item?.url || '').toLowerCase()

      const isWA =
        tagUpper === 'WA_INFO' ||
        tagUpper === 'WHATSAPP' ||
        nameLower.includes('whatsapp') ||
        nameLower.includes('wa group') ||
        urlLower.includes('chat.whatsapp.com')

      return matchRegion && isWA
    })

    // 2. Second Pass Fallback: Any link with 'whatsapp' in name/url if region matches
    if (!matchedLink) {
      matchedLink = linksList.find((item) => {
        const nameLower = String(item?.name || '').toLowerCase()
        const urlLower = String(item?.url || '').toLowerCase()
        return (
          nameLower.includes('whatsapp') ||
          urlLower.includes('chat.whatsapp.com')
        )
      })
    }

    return matchedLink?.url || null
  }, [linkQuery, watchedRegionId])

  // Final URL with fallback safety
  const finalWaUrl =
    regionWaGroupUrl ||
    'https://chat.whatsapp.com/K7Gj43szF7DJDBD3vTlGZp?s=sw&p=a&ilr=0'

  const isPasswordValid =
    watchedPassword.length >= 8 &&
    /[A-Z]/.test(watchedPassword) &&
    /[a-z]/.test(watchedPassword)

  const regions = regionQuery.data || []
  const faculties = (facultyQuery.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(watchedRegionId),
  )
  const majors = (majorQuery.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(watchedFacultyId),
  )
  const lntCourses = (lntCourseQuery.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(watchedRegionId),
  )
  const schedules = (scheduleQuery.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(watchedRegionId),
  )

  const selectedRegion = regions.find(
    (r) => Number(r.id) === Number(watchedRegionId),
  )

  /* ── navigation ── */
  const onNext = async () => {
    if (currentStep === 1) {
      const ok = await trigger([
        'fullName',
        'lineId',
        'whatsappNumber',
        'nim',
        'regionId',
        'facultyId',
        'majorId',
      ])
      const regOpen = selectedRegion?.isRegistrationOpen
      if (ok && (regOpen === undefined || regOpen === true)) setCurrentStep(2)
    } else if (currentStep === 2) {
      const ok = await trigger([
        'email',
        'binusEmail',
        'password',
        'confirmPassword',
        'lntCourseId',
        'scheduleId',
      ])
      if (ok) setCurrentStep(3)
    }
  }

  const onBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
    else navigate(-1)
  }

  /* ── submit ── */
  const onSubmit = (data) => {
    if (currentStep === 4) {
      setSuccessVisible(true)
      return
    }
    if (currentStep < 3) {
      onNext()
      return
    }
    if (!waChecked) {
      showPopup({
        type: 'error',
        heading: 'Confirmation Required',
        message: 'Please confirm you have joined the WhatsApp group.',
      })
      return
    }
    if (!isPasswordValid) {
      showPopup({
        type: 'error',
        heading: 'Invalid Password',
        message:
          'Password must be at least 8 chars with 1 uppercase and 1 lowercase letter.',
      })
      return
    }

    const payload = {
      fullName: String(data.fullName || '').trim(),
      lineId: String(data.lineId || '').trim(),
      whatsappNumber: String(data.whatsappNumber || '').trim(),
      nim: String(data.nim || '').trim(),
      regionId: Number(data.regionId),
      facultyId: Number(data.facultyId),
      majorId: Number(data.majorId),
      email: String(data.email || '').trim(),
      binusEmail: String(data.binusEmail || '').trim(),
      password: String(data.password || ''),
      confirmPassword: String(data.confirmPassword || ''),
      lntCourseId: Number(data.lntCourseId),
      scheduleId: Number(data.scheduleId),
      isJapres: 0,
      heardFrom: null,
    }

    registerMutation.mutate(payload, {
      onSuccess: (res) => {
        const code = res?.expoId || res?.data?.expoId || 'EXBC01001'
        setExpoCode(code)
        setCurrentStep(4)
      },
      onError: (err) => {
        const rawMsg =
          err?.response?.data?.message || err?.response?.data?.error
        const backendError = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg

        const errorMsg =
          backendError ||
          err?.message ||
          'Registration failed. Please try again.'

        showPopup({
          type: 'error',
          heading: 'Registration Failed',
          message: errorMsg,
        })
      },
    })
  }

  /* ── Copy to Clipboard Handler ── */
  const handleToggleAndCopy = () => {
    const code = expoCode || 'EXBC01001'
    setShowExpoCode(!showExpoCode)

    setHasSeenCode(true)

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setToastVisible(true)
        setTimeout(() => {
          setToastVisible(false)
        }, 3000)
      })
      .catch((err) => console.error('Failed to copy: ', err))
  }

  /* ── step titles ── */
  const stepTitle =
    currentStep === 1 ? (
      <>
        Personal <span className="text-[#2474C0]">Information</span>
      </>
    ) : currentStep === 2 ? (
      <>
        BNCC <span className="text-[#2474C0]">Registration</span>
      </>
    ) : currentStep === 3 ? (
      <>
        BNCC <span className="text-[#2474C0]">Community</span>
      </>
    ) : (
      <>
        Get your <span className="text-[#2474C0]">Expo Code</span>
      </>
    )

  const progressPct = (currentStep / TOTAL_STEPS) * 100

  return (
    <AuthBackground>
      {/* Back button */}
      <button
        className={`absolute top-3 left-3 sm:top-6 sm:left-8 z-[10] grid size-10 sm:size-13 cursor-pointer place-items-center rounded-[7px] border-2 border-white/85 bg-[rgb(249_252_255_/_58%)] p-0 text-[#0d3154] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[rgb(255_255_255_/_78%)] active:translate-y-px motion-reduce:transition-none ${focusRingClasses}`}
        type="button"
        aria-label="Go back"
        onClick={onBack}
      >
        <ArrowLeftIcon />
      </button>

      <section
        className="relative z-1 mx-auto flex min-h-svh w-full max-w-[52rem] flex-col items-center px-4 pt-14 sm:pt-16 lg:pt-20 pb-4 lg:pb-16 justify-between"
        aria-labelledby="sign-up-title"
      >
        <div className="w-full flex flex-col items-center flex-1 justify-center lg:justify-start">
          {/* Header Badge */}
          <header className="relative z-[3] flex items-center justify-center whitespace-nowrap rounded-[5px] border-2 border-white/85 border-b-white/40 bg-[rgb(249_252_255_/_58%)] px-3.5 sm:px-5 py-1.5 sm:py-2 text-center font-outfit text-xs sm:text-sm leading-tight font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),0_2px_8px_rgb(20_76_130_/_10%)] backdrop-blur-[8px]">
            <span className="text-[#0A2745]">BNCC OPENING&nbsp;</span>
            <strong className="font-bold text-[#2474C0]">SEASON 2026</strong>
          </header>

          {/* Title Box */}
          <div className="relative z-0 mt-3 sm:mt-4 flex items-center justify-center w-full">
            <BoundingBox>
              <h1
                className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-3 sm:px-6 py-1 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(3.8rem,16vw,10rem)]"
                id="sign-up-title"
              >
                REGIST
              </h1>
            </BoundingBox>
          </div>

          {/* ══ Glassmorphism Card ══ */}
          <div className="relative z-2 -mt-5 min-[400px]:-mt-7 sm:-mt-8 w-[82%] max-w-[19rem] min-[400px]:max-w-[21rem] sm:max-w-[24rem] lg:max-w-[26rem] flex flex-col rounded-[15px] border-[2.5px] border-white/90 bg-white/35 backdrop-blur-lg px-5 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6 text-[#0A2745]">
            <h2 className="font-bold text-lg sm:text-xl text-center text-[#0D2A4E] mb-5">
              {stepTitle}
            </h2>

            {/* ─── FORM ─── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* ══ STEP 1: Personal Info ══ */}
              {currentStep === 1 && (
                <>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      {...register('fullName', {
                        required: 'Full name is required',
                        minLength: {
                          value: 3,
                          message:
                            'Full name length must be at least 3 characters long',
                        },
                      })}
                      type="text"
                      placeholder="Enter your name"
                      className={inputClass}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Line ID</label>
                    <input
                      {...register('lineId', {
                        required: 'Line ID is required',
                      })}
                      type="text"
                      placeholder="Enter your Line ID"
                      className={inputClass}
                    />
                    {errors.lineId && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.lineId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input
                      {...register('whatsappNumber', {
                        required: 'WhatsApp number is required',
                        validate: (v) =>
                          (v &&
                            v.length >= 9 &&
                            v.length <= 13 &&
                            /^\d+$/.test(v)) ||
                          'WhatsApp number must be 9–13 digits',
                      })}
                      type="text"
                      placeholder="Enter your WhatsApp number"
                      className={inputClass}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>NIM</label>
                    <input
                      {...register('nim', {
                        required: 'NIM is required',
                        validate: (v) =>
                          /^\d{10}$/.test(v) || 'NIM must be 10 digits',
                      })}
                      type="text"
                      placeholder="Enter your NIM"
                      className={inputClass}
                    />
                    {errors.nim && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.nim.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="regionId"
                    control={control}
                    rules={{ required: 'Campus Region is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Campus Region</label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              field.onChange(val)
                              setValue('facultyId', '', {
                                shouldValidate: true,
                              })
                              setValue('majorId', '', { shouldValidate: true })
                              setValue('lntCourseId', '', {
                                shouldValidate: true,
                              })
                              setValue('scheduleId', '', {
                                shouldValidate: true,
                              })
                            }}
                            className={`${selectClass} ${!field.value ? 'text-[#81A8CE]' : 'text-[#0A2745] font-semibold'}`}
                          >
                            <option
                              value=""
                              disabled
                              className="text-[#81A8CE]"
                            >
                              Select your campus region
                            </option>
                            {regions.map((r) => (
                              <option
                                key={r.id}
                                value={r.id}
                                className="text-[#0A2745] font-normal"
                              >
                                {r.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7]">
                            ▾
                          </div>
                        </div>
                        {errors.regionId && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {errors.regionId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="facultyId"
                    control={control}
                    rules={{ required: 'Faculty is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Faculty</label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            disabled={!watchedRegionId}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              field.onChange(val)
                              setValue('majorId', '', { shouldValidate: true })
                            }}
                            className={`${selectClass} ${!field.value ? 'text-[#81A8CE]' : 'text-[#0A2745] font-semibold'}`}
                            style={{ opacity: !watchedRegionId ? 0.6 : 1 }}
                          >
                            <option
                              value=""
                              disabled
                              className="text-[#81A8CE]"
                            >
                              {!watchedRegionId
                                ? 'Please select your campus region first'
                                : 'Select your faculty'}
                            </option>
                            {faculties.map((f) => (
                              <option
                                key={f.id}
                                value={f.id}
                                className="text-[#0A2745] font-normal"
                              >
                                {f.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7]">
                            ▾
                          </div>
                        </div>
                        {errors.facultyId && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {errors.facultyId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="majorId"
                    control={control}
                    rules={{ required: 'Major is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Major</label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            disabled={!watchedFacultyId}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={`${selectClass} ${!field.value ? 'text-[#81A8CE]' : 'text-[#0A2745] font-semibold'}`}
                            style={{ opacity: !watchedFacultyId ? 0.6 : 1 }}
                          >
                            <option
                              value=""
                              disabled
                              className="text-[#81A8CE]"
                            >
                              {!watchedFacultyId
                                ? 'Please select your faculty first'
                                : 'Select your major'}
                            </option>
                            {majors.map((m) => (
                              <option
                                key={m.id}
                                value={m.id}
                                className="text-[#0A2745] font-normal"
                              >
                                {m.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7]">
                            ▾
                          </div>
                        </div>
                        {errors.majorId && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {errors.majorId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </>
              )}

              {/* ══ STEP 2: BNCC Registration ══ */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Must be a valid email',
                        },
                      })}
                      type="text"
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      BINUS Email (@binus.ac.id)
                    </label>
                    <input
                      {...register('binusEmail', {
                        required: 'BINUS email is required',
                        pattern: {
                          value: /binus\.ac\.id$/i,
                          message: 'Email must contain binus.ac.id',
                        },
                      })}
                      type="text"
                      placeholder="Enter your BINUS email"
                      className={inputClass}
                    />
                    {errors.binusEmail && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.binusEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          validate: (v) =>
                            (v.length >= 8 &&
                              /[A-Z]/.test(v) &&
                              /[a-z]/.test(v)) ||
                            'Min 8 chars with uppercase & lowercase',
                        })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7] hover:text-[#0D2A4E] transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (v) =>
                            v === watchedPassword || 'Passwords do not match',
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7] hover:text-[#0D2A4E] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="lntCourseId"
                    control={control}
                    rules={{ required: 'LnT Course is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>LnT Course</label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={`${selectClass} ${!field.value ? 'text-[#81A8CE]' : 'text-[#0A2745] font-semibold'}`}
                          >
                            <option
                              value=""
                              disabled
                              className="text-[#81A8CE]"
                            >
                              Select your LnT Course
                            </option>
                            {lntCourses.map((c) => (
                              <option
                                key={c.id}
                                value={c.id}
                                className="text-[#0A2745] font-normal"
                              >
                                {c.title || c.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7]">
                            ▾
                          </div>
                        </div>
                        {errors.lntCourseId && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {errors.lntCourseId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="scheduleId"
                    control={control}
                    rules={{ required: 'BNCC Launch Schedule is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>
                          BNCC Launch Schedule
                        </label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={`${selectClass} ${!field.value ? 'text-[#81A8CE]' : 'text-[#0A2745] font-semibold'}`}
                          >
                            <option
                              value=""
                              disabled
                              className="text-[#81A8CE]"
                            >
                              Select your Launch Schedule
                            </option>
                            {schedules.map((s) => (
                              <option
                                key={s.id}
                                value={s.id}
                                className="text-[#0A2745] font-normal"
                              >
                                {formatScheduleDisplay(s)}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C88C7]">
                            ▾
                          </div>
                        </div>
                        {errors.scheduleId && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {errors.scheduleId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </>
              )}

              {/* ══ STEP 3: Community ══ */}
              {currentStep === 3 && (
                <>
                  <div className="text-[#0D2A4E]">
                    <h3 className="text-base font-bold mb-2">
                      Join Our WhatsApp Group
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed mb-4 text-[#2D4F77]">
                      BNCC has a dedicated WhatsApp Group for updates on
                      upcoming activities and events. It's also a place to
                      connect with new friends, share interests, and enjoy
                      meaningful experiences together with the BNCC community.
                    </p>
                    <a
                      href={finalWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        type="button"
                        className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-95 transition-opacity text-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)',
                        }}
                      >
                        <FaUsers
                          className="text-base text-white"
                          color="white"
                        />
                        <span>Join WhatsApp Group</span>
                      </button>
                    </a>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                    <input
                      id="wa-checkbox"
                      type="checkbox"
                      checked={waChecked}
                      onChange={(e) => setWaChecked(e.target.checked)}
                      className="w-4 h-4 accent-[#1B5198] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-[#0D2A4E] font-medium">
                      I have joined the group
                    </span>
                  </label>
                </>
              )}

              {/* ══ STEP 4: Get your Expo Code ══ */}
              {currentStep === 4 && (
                <div className="flex flex-col items-center text-center py-2">
                  <div className="w-full flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl border-2 border-[#94BEE7] bg-[#E8F2FD] mb-4">
                    <span className="font-mono text-base sm:text-lg font-bold text-[#0D2A4E] tracking-widest pl-3">
                      {showExpoCode ? expoCode || 'EXBC01001' : 'XXXXXXXXX'}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleAndCopy}
                      className="px-3.5 py-2 rounded-lg text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow transition-all hover:opacity-90"
                      style={{
                        background:
                          'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)',
                      }}
                    >
                      {showExpoCode ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{showExpoCode ? 'Hide Code' : 'Show Code'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#386496] leading-snug px-2 mb-2">
                    This{' '}
                    <strong className="font-bold text-[#0D2A4E]">
                      Expo Code
                    </strong>{' '}
                    will be required on the official BINUS University website
                    during registration.
                  </p>
                </div>
              )}

              {/* ── Buttons ── */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={
                    (currentStep === 3 &&
                      (registerMutation.isPending || !waChecked)) ||
                    (currentStep === 4 && !hasSeenCode)
                  }
                  className="w-32 py-2 sm:py-2.5 rounded-lg bg-[#1E5FA8] hover:bg-[#12376B] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E5FA8]"
                >
                  {registerMutation.isPending && (
                    <Loader2 size={13} className="animate-spin" />
                  )}
                  {currentStep === 3
                    ? registerMutation.isPending
                      ? 'Submitting...'
                      : 'Submit'
                    : currentStep === 4
                      ? 'Done'
                      : 'Next'}
                </button>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-4 text-center text-xs sm:text-sm text-[#0D2A4E]">
              <span>Already have an account? </span>
              <span
                onClick={() => navigate('/auth/signin')}
                className="font-bold text-[#1D5CB5] underline cursor-pointer hover:opacity-80 transition-opacity"
              >
                Sign in here
              </span>
            </div>
          </div>

          {/* ── Progress Bar ── */}
          {currentStep < 4 && (
            <div className="w-[82%] max-w-[19rem] min-[400px]:max-w-[21rem] sm:max-w-[24rem] lg:max-w-[26rem] mt-6">
              <div className="relative w-full h-7 rounded-[8px] border border-white bg-white/20">
                <div
                  className="absolute -top-[1px] -bottom-[1px] -left-[1px] bg-gradient-to-r from-[#5B94D0] to-[#295A8D] rounded-[8px] transition-all duration-500"
                  style={{ width: `calc(${progressPct}% + 2px)` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* BNCC Logo */}
        <div className="mt-3 sm:mt-4 lg:mt-10 mb-3 sm:mb-4 lg:mb-8 relative z-[5] flex justify-center w-full">
          <img
            className="h-9 sm:h-11 w-auto object-contain"
            src="/images/bncc-logo.png"
            alt="Bina Nusantara Computer Club"
          />
        </div>
      </section>

      {/* ════════════ SUCCESS POPUP ════════════ */}
      {successVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'rgba(15, 35, 65, 0.30)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          <div className="relative z-10 w-full max-w-[22rem] sm:max-w-[26rem] rounded-[22px] border border-white/90 bg-white/40 backdrop-blur-2xl px-6 sm:px-9 py-8 sm:py-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(10,39,69,0.25)]">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#22C55E] flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(34,197,94,0.35)]">
              <svg
                className="w-10 h-10 text-white stroke-current stroke-[3.5] fill-none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0A2745] mb-2.5 tracking-tight">
              Registration successful!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#386496] leading-relaxed mb-8">
              Please check your email for verification.
            </p>

            <button
              onClick={() => navigate('/auth/signin')}
              className="w-full max-w-[170px] py-3 rounded-xl font-bold text-sm sm:text-base text-white shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)',
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Error Popup (via usePopup) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={hidePopup}
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-2xl px-8 py-8 flex flex-col items-center text-center"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.9)',
              boxShadow: '0 8px 32px rgba(15,45,95,0.15)',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-red-500">✕</span>
            </div>
            <h3 className="text-base font-bold text-[#0D2A4E] mb-2">
              {config.heading}
            </h3>
            <p className="text-sm text-[#3D6080] mb-6">{config.message}</p>
            <button
              onClick={hidePopup}
              className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ════════════ TOAST NOTIFICATION ════════════ */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-between gap-4 px-5 py-3 rounded-xl border border-white/60 bg-white/40 backdrop-blur-md shadow-lg w-11/12 max-w-sm transition-all duration-300">
          <span className="text-sm font-medium text-[#0A2745]">
            Copied to clipboard!
          </span>
          <button
            onClick={() => setToastVisible(false)}
            className="text-[#0A2745] hover:opacity-70 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AuthBackground>
  )
}
