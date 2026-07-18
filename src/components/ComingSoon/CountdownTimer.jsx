import { useState, useEffect } from 'react'

function getTimeLeft(targetDate) {
  const diff = +new Date(targetDate) - +new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
}

export default function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000 * 30)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
  ]

  return (
    <div className="relative border-2 sm:border-3 border-[#2474C0] bg-blue-50/60 px-3 py-3 sm:px-4 sm:py-4 mx-4">
      {['-top-2 -left-2 sm:-top-3 sm:-left-3', '-top-2 -right-2 sm:-top-3 sm:-right-3', '-bottom-2 -left-2 sm:-bottom-3 sm:-left-3', '-bottom-2 -right-2 sm:-bottom-3 sm:-right-3'].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-4 w-4 sm:h-6 sm:w-6 border-2 border-[#2474C0] bg-white`} />
      ))}

      <div className="border-2 border-[#99C4F4] px-4 py-6 sm:px-10 sm:py-8 md:px-16 md:py-10 lg:px-20 lg:py-12 rounded-xl bg-linear-to-br from-[#F7F7F599] via-[#F7F7F599] via-60% to-[#7ED6F94D] z-10">
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 lg:gap-12">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3 sm:gap-6 md:gap-10 lg:gap-12">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-blue-950 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-lg md:text-xl lg:text-2xl text-[#8dbdf5]">
                  {unit.label}
                </div>
              </div>
              {i < units.length - 1 && (
                <span className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-blue-950">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}