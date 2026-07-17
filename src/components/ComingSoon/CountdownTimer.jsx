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
    <div className="relative border-3 border-[#2474C0] bg-blue-50/60 px-4 py-4">
      {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-6 w-6 border-2 border-[#2474C0] bg-white`} />
      ))}

      <div className="border-2 border-[#99C4F4] px-20 py-12 rounded-xl bg-linear-to-br from-[#F7F7F599] via-[#F7F7F599] via-60% to-[#7ED6F94D] z-10">
        <div className="flex items-center justify-center gap-12">
        {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-12">
              <div className="text-center">
                <div className="text-8xl font-extrabold text-blue-950">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="mt-2 text-2xl text-[#8dbdf5]">{unit.label}</div>
              </div>
              {i < units.length - 1 && <span className="text-8xl font-bold text-blue-950">:</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}