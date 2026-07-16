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
    <div className="relative rounded-2xl border-2 border-blue-400 bg-blue-50/60 px-10 py-8">
      {/* dekorasi kotak di 4 sudut, kayak di desain */}
      {['-top-1.5 -left-1.5', '-top-1.5 -right-1.5', '-bottom-1.5 -left-1.5', '-bottom-1.5 -right-1.5'].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-3 w-3 border-2 border-blue-500 bg-white`} />
      ))}

      <div className="flex items-center justify-center gap-6">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-blue-950">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="mt-1 text-blue-400">{unit.label}</div>
            </div>
            {i < units.length - 1 && <span className="text-3xl font-bold text-blue-950">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}