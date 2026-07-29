import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUsers } from 'react-icons/fa'
import { IoEye, IoEyeOff, IoCheckmarkCircle } from 'react-icons/io5'
import { usePopup, useLookupQuery, useLinkQuery, useAuthMutation } from '@/hooks'
import { heardFromOptions } from '@/lib/types'
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

const FIELD_STYLE = {
  background: 'rgba(224, 237, 252, 0.70)',
  border: '1.5px solid #9EC3E8',
}
const FIELD_FOCUS = {
  borderColor: '#3B82F6',
  background: 'rgba(224, 237, 252, 0.95)',
}
const FIELD_BLUR = {
  borderColor: '#9EC3E8',
  background: 'rgba(224, 237, 252, 0.70)',
}

const inputClass =
  'w-full rounded-lg px-4 py-2.5 text-sm text-[#0D2A4E] placeholder-[#81A8CE] outline-none transition-all'
const labelClass = 'block font-semibold text-[#0D2A4E] text-sm mb-1.5'
const selectClass =
  'w-full rounded-lg px-4 py-2.5 text-sm text-[#0D2A4E] outline-none transition-all appearance-none cursor-pointer'

const TOTAL_STEPS = 4

/* ═══════════════════════════════════════════════════════════════ */
export default function SignUp() {
  const navigate = useNavigate()
  const { isOpen, config, showPopup, hidePopup, handleButtonClick } = usePopup()

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
  const [heardFrom, setHeardFrom] = useState('')
  const [heardFromOther, setHeardFromOther] = useState('')
  const [successVisible, setSuccessVisible] = useState(false)
  const [expoCode, setExpoCode] = useState('')
  const [showExpoCode, setShowExpoCode] = useState(false)

  const watchedPassword = watch('password', '')
  const watchedRegionId = watch('regionId')
  const watchedFacultyId = watch('facultyId')

  const { regionQuery, facultyQuery, majorQuery, lntCourseQuery, scheduleQuery } =
    useLookupQuery(watchedRegionId, watchedFacultyId)
  const { registerMutation } = useAuthMutation()

  const { linkQuery } = useLinkQuery(watchedRegionId)

  const isPasswordValid =
    watchedPassword.length >= 8 &&
    /[A-Z]/.test(watchedPassword) &&
    /[a-z]/.test(watchedPassword)

  const regions = regionQuery.data || []
  const faculties = (facultyQuery.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(watchedRegionId)
  )
  const majors = (majorQuery.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(watchedFacultyId)
  )
  const lntCourses = (lntCourseQuery.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(watchedRegionId)
  )
  const schedules = (scheduleQuery.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(watchedRegionId)
  )

  const selectedRegion = regions.find(
    (r) => Number(r.id) === Number(watchedRegionId)
  )

  /* ── navigation ── */
  const onNext = async () => {
    if (currentStep === 1) {
      const ok = await trigger(['fullName', 'lineId', 'whatsappNumber', 'nim', 'regionId', 'facultyId', 'majorId'])
      const regOpen = selectedRegion?.isRegistrationOpen
      if (ok && (regOpen === undefined || regOpen === true)) setCurrentStep(2)
    } else if (currentStep === 2) {
      const ok = await trigger(['email', 'binusEmail', 'password', 'confirmPassword', 'lntCourseId', 'scheduleId'])
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
    if (currentStep < 3) { onNext(); return }
    if (!waChecked) {
      showPopup({ type: 'error', heading: 'Confirmation Required', message: 'Please confirm you have joined the WhatsApp group.' })
      return
    }
    if (!isPasswordValid) {
      showPopup({ type: 'error', heading: 'Invalid Password', message: 'Password must be at least 8 chars with 1 uppercase and 1 lowercase letter.' })
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
        const errorMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
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

  /* ── step titles ── */
  const stepTitle = currentStep === 1
    ? <>Personal <span style={{ color: '#2368C4' }}>Information</span></>
    : currentStep === 2
    ? <>BNCC <span style={{ color: '#2368C4' }}>Registration</span></>
    : currentStep === 3
    ? <>BNCC <span style={{ color: '#2368C4' }}>Community</span></>
    : <>Get your <span style={{ color: '#2368C4' }}>Expo Code</span></>

  const progressPct = (currentStep / TOTAL_STEPS) * 100

  /* ══════════════════════════ RENDER ═══════════════════════════ */
  /* ══════════════════════════ RENDER ═══════════════════════════ */
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
        className="relative z-1 mx-auto flex min-h-svh w-full max-w-[52rem] flex-col items-center px-4 pt-4 sm:pt-8 lg:pt-12 pb-4 lg:pb-16 justify-between"
        aria-labelledby="sign-up-title"
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
                className="font-outfit font-bold tracking-[0.04rem] leading-none whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-b from-[#4489D4] to-[#EAF5FF] bg-clip-text text-transparent text-[clamp(3.5rem,14vw,8.5rem)]"
                id="sign-up-title"
              >
                REGIST
              </h1>
            </BoundingBox>
          </div>

          {/* ══ Glassmorphism Card ══ */}
          <div
            className="relative z-2 -mt-6 min-[400px]:-mt-8 sm:-mt-9 lg:-mt-7 flex w-full max-w-[22rem] min-[400px]:max-w-[26rem] sm:max-w-[32rem] lg:max-w-[36rem] flex flex-col rounded-[15px] border-[3px] border-white/90 bg-white/30 backdrop-blur-lg px-5 min-[400px]:px-7 sm:px-10 pt-6 sm:pt-8 lg:pt-9 pb-5 sm:pb-6 text-[#0A2745]"
          >
            {/* Card heading */}
            <h2 className="font-bold text-lg sm:text-xl text-center text-[#0D2A4E] mb-5">
              {stepTitle}
            </h2>

            {/* ─── FORM ─── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

              {/* ══ STEP 1: Personal Info ══ */}
              {currentStep === 1 && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                    <input
                      {...register('fullName', {
                        required: 'Full name is required',
                        minLength: { value: 3, message: 'Full name length must be at least 3 characters long' },
                      })}
                      type="text"
                      placeholder="Enter your full name"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Line ID */}
                  <div>
                    <label className={labelClass}>Line ID <span className="text-red-400">*</span></label>
                    <input
                      {...register('lineId', { required: 'Line ID is required' })}
                      type="text"
                      placeholder="Enter your Line ID"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.lineId && <p className="text-xs text-red-500 mt-1">{errors.lineId.message}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className={labelClass}>WhatsApp Number <span className="text-red-400">*</span></label>
                    <input
                      {...register('whatsappNumber', {
                        required: 'WhatsApp number is required',
                        validate: (v) => (v && v.length >= 9 && v.length <= 12 && /^\d+$/.test(v)) || 'WhatsApp number must be 9–12 digits',
                      })}
                      type="text"
                      placeholder="e.g. 087723780836"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.whatsappNumber && <p className="text-xs text-red-500 mt-1">{errors.whatsappNumber.message}</p>}
                  </div>

                  {/* NIM */}
                  <div>
                    <label className={labelClass}>NIM <span className="text-red-400">*</span></label>
                    <input
                      {...register('nim', {
                        required: 'NIM is required',
                        validate: (v) => /^\d{10}$/.test(v) || 'NIM harus 10 angka',
                      })}
                      type="text"
                      placeholder="Masukkan NIM Anda"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.nim && <p className="text-xs text-red-500 mt-1">{errors.nim.message}</p>}
                  </div>

                  {/* Region Kampus */}
                  <Controller
                    name="regionId"
                    control={control}
                    rules={{ required: 'Region Kampus is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Region Kampus <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              field.onChange(val)
                              setValue('facultyId', '', { shouldValidate: true })
                              setValue('majorId', '', { shouldValidate: true })
                              setValue('lntCourseId', '', { shouldValidate: true })
                              setValue('scheduleId', '', { shouldValidate: true })
                            }}
                            className={selectClass}
                            style={FIELD_STYLE}
                          >
                            <option value="" disabled>Pilih region kampus Anda</option>
                            {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7]">▾</div>
                        </div>
                        {errors.regionId && <p className="text-xs text-red-500 mt-1">{errors.regionId.message}</p>}
                      </div>
                    )}
                  />

                  {/* Fakultas */}
                  <Controller
                    name="facultyId"
                    control={control}
                    rules={{ required: 'Fakultas is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Fakultas <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            disabled={!watchedRegionId}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              field.onChange(val)
                              setValue('majorId', '', { shouldValidate: true })
                            }}
                            className={selectClass}
                            style={{ ...FIELD_STYLE, opacity: !watchedRegionId ? 0.6 : 1 }}
                          >
                            <option value="" disabled>{!watchedRegionId ? 'Pilih region kampus Anda terlebih dahulu' : 'Pilih fakultas Anda'}</option>
                            {faculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7]">▾</div>
                        </div>
                        {errors.facultyId && <p className="text-xs text-red-500 mt-1">{errors.facultyId.message}</p>}
                      </div>
                    )}
                  />

                  {/* Jurusan */}
                  <Controller
                    name="majorId"
                    control={control}
                    rules={{ required: 'Jurusan is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Jurusan <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            disabled={!watchedFacultyId}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className={selectClass}
                            style={{ ...FIELD_STYLE, opacity: !watchedFacultyId ? 0.6 : 1 }}
                          >
                            <option value="" disabled>{!watchedFacultyId ? 'Pilih fakultas Anda terlebih dahulu' : 'Pilih jurusan Anda'}</option>
                            {majors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7]">▾</div>
                        </div>
                        {errors.majorId && <p className="text-xs text-red-500 mt-1">{errors.majorId.message}</p>}
                      </div>
                    )}
                  />
                </>
              )}

              {/* ══ STEP 2: BNCC Registration ══ */}
              {currentStep === 2 && (
                <>
                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Must be a valid email' },
                      })}
                      type="text"
                      placeholder="Enter your email"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* BINUS Email */}
                  <div>
                    <label className={labelClass}>Email (@binus.ac.id) <span className="text-red-400">*</span></label>
                    <input
                      {...register('binusEmail', {
                        required: 'BINUS email is required',
                        pattern: { value: /binus\.ac\.id$/i, message: 'Email must contain binus.ac.id' },
                      })}
                      type="text"
                      placeholder="Enter your BINUS email"
                      className={inputClass}
                      style={FIELD_STYLE}
                      onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                      onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                    />
                    {errors.binusEmail && <p className="text-xs text-red-500 mt-1">{errors.binusEmail.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className={labelClass}>Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          validate: (v) =>
                            (v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v)) ||
                            'Min 8 chars with uppercase & lowercase',
                        })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`${inputClass} pr-11`}
                        style={FIELD_STYLE}
                        onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                        onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7] hover:text-[#0D2A4E] transition-colors cursor-pointer"
                      >
                        {showPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={labelClass}>Confirm Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (v) => v === watchedPassword || 'Passwords do not match',
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`${inputClass} pr-11`}
                        style={FIELD_STYLE}
                        onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                        onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7] hover:text-[#0D2A4E] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                  {/* LnT Course */}
                  <Controller
                    name="lntCourseId"
                    control={control}
                    rules={{ required: 'LnT Course is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>LnT Course <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className={selectClass}
                            style={FIELD_STYLE}
                          >
                            <option value="" disabled>Pilih LnT Course yang Anda inginkan</option>
                            {lntCourses.map((c) => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7]">▾</div>
                        </div>
                        {errors.lntCourseId && <p className="text-xs text-red-500 mt-1">{errors.lntCourseId.message}</p>}
                      </div>
                    )}
                  />

                  {/* Jadwal BNCC Launching */}
                  <Controller
                    name="scheduleId"
                    control={control}
                    rules={{ required: 'Jadwal BNCC Launching is required' }}
                    render={({ field }) => (
                      <div>
                        <label className={labelClass}>Jadwal BNCC Launching <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <select
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className={selectClass}
                            style={FIELD_STYLE}
                          >
                            <option value="" disabled>Pilih jadwal yang dapat kamu hadiri</option>
                            {schedules.map((s) => <option key={s.id} value={s.id}>{formatScheduleDisplay(s)}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4C88C7]">▾</div>
                        </div>
                        {errors.scheduleId && <p className="text-xs text-red-500 mt-1">{errors.scheduleId.message}</p>}
                      </div>
                    )}
                  />
                </>
              )}

              {/* ══ STEP 3: Community ══ */}
              {currentStep === 3 && (
                <>
                  <div className="text-[#0D2A4E]">
                    <h3 className="text-base font-bold mb-2">Join Our WhatsApp Group</h3>
                    <p className="text-xs sm:text-sm leading-relaxed mb-4 text-[#2D4F77]">
                      BNCC has a dedicated WhatsApp Group for updates on upcoming activities and events.
                      It's also a place to connect with new friends, share interests, and enjoy meaningful
                      experiences together with the BNCC community.
                    </p>
                    <a
                      href={linkQuery?.wa_info || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        type="button"
                        className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-95 transition-opacity text-sm"
                        style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
                      >
                        <FaUsers className="text-base" />
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
                      {showExpoCode ? (expoCode || 'EXBC01001') : 'XXXXXXXXX'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowExpoCode(!showExpoCode)}
                      className="px-3.5 py-2 rounded-lg text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
                    >
                      {showExpoCode ? <IoEyeOff className="text-base" /> : <IoEye className="text-base" />}
                      <span>{showExpoCode ? 'Hide Code' : 'Show Code'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#386496] leading-snug px-2 mb-2">
                    This <strong className="font-bold text-[#0D2A4E]">Expo Code</strong> will be required on the official BINUS University website during registration.
                  </p>
                </div>
              )}

              {/* ── Progress Bar ── */}
              <div className="pt-2 pb-1">
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(180,210,240,0.55)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, #1B5198, #3B82F6)',
                    }}
                  />
                </div>
              </div>

              {/* ── Buttons ── */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 max-w-[140px] py-2.5 rounded-xl border-2 font-semibold text-sm transition-all cursor-pointer hover:opacity-80"
                    style={{ borderColor: '#1B5198', color: '#1B5198' }}
                  >
                    Back
                  </button>
                )}
                <button
                  type={currentStep === 3 ? 'submit' : 'button'}
                  onClick={currentStep !== 3 ? handleSubmit(onSubmit) : undefined}
                  disabled={currentStep === 3 && (registerMutation.isPending || !waChecked)}
                  className="flex-1 max-w-[140px] py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
                >
                  {currentStep === 3
                    ? (registerMutation.isPending ? 'Submitting...' : 'Submit')
                    : 'Next'}
                </button>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-4 text-center text-xs sm:text-sm text-[#0D2A4E]">
              <span>Already have an account? </span>
              <span
                onClick={() => navigate('/signin')}
                className="font-bold text-[#1D5CB5] underline cursor-pointer hover:opacity-80 transition-opacity"
              >
                Sign in here
              </span>
            </div>
          </div>
        </div>

        {/* BNCC Logo — relative bottom in scroll flow */}
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
          {/* Blurred overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(15, 35, 65, 0.30)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />
          {/* Glassmorphism Popup Card */}
          <div
            className="relative z-10 w-full max-w-[22rem] sm:max-w-[26rem] rounded-[22px] border border-white/90 bg-white/40 backdrop-blur-2xl px-6 sm:px-9 py-8 sm:py-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(10,39,69,0.25)]"
          >
            {/* Green Checkmark Badge */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#22C55E] flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(34,197,94,0.35)]">
              <svg className="w-10 h-10 text-white stroke-current stroke-[3.5] fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0A2745] mb-2.5 tracking-tight">
              Registration successful!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#386496] leading-relaxed mb-8">
              Please check your email for verification.
            </p>

            <button
              onClick={() => navigate('/signin')}
              className="w-full max-w-[170px] py-3 rounded-xl text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
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
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
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
            <h3 className="text-base font-bold text-[#0D2A4E] mb-2">{config.heading}</h3>
            <p className="text-sm text-[#3D6080] mb-6">{config.message}</p>
            <button
              onClick={hidePopup}
              className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AuthBackground>
  )
}
