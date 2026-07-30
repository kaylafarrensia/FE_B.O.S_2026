import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card.jsx';
import ContactPerson from './Japres/ContactPerson.jsx';
import IconSchedule from '../../assets/icons/IconSchedule.svg';
import IconTime from '../../assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '../../utils/index.js';

/* ─── Mini Calendar ─────────────────────────────────────────────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function MiniCalendar({ highlightDate }) {
  const target = highlightDate ? new Date(highlightDate) : new Date();
  const [viewYear, setViewYear] = useState(target.getFullYear());
  const [viewMonth, setViewMonth] = useState(target.getMonth()); // 0-indexed

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const highlightStr = highlightDate
    ? (() => {
        const d = new Date(highlightDate);
        // Convert to Jakarta local date
        const jakartaStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
        const [y, m, day] = jakartaStr.split('-').map(Number);
        return `${y}-${m - 1}-${day}`;
      })()
    : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build grid: 6 rows × 7 cols
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + 1 + i, cur: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, cur: true });
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false });
  }

  return (
    <Card className="p-5 sm:p-7 rounded-xl border-white border-[3px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-[#0A2745]">
          <span>{MONTHS[viewMonth]}</span>{' '}
          <span className="text-[#2474C0]">{viewYear}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 transition text-[#0A2745]"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 transition text-[#0A2745]"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] sm:text-xs font-semibold pb-1 ${i === 0 || i === 6 ? 'text-red-400' : 'text-[#0A2745]/60'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, idx) => {
          const isHighlight =
            cell.cur &&
            highlightStr === `${viewYear}-${viewMonth}-${cell.day}`;
          const isToday =
            cell.cur &&
            todayStr === `${viewYear}-${viewMonth}-${cell.day}`;
          const isSun = idx % 7 === 0;
          const isSat = idx % 7 === 6;

          return (
            <div
              key={idx}
              className={`
                flex items-center justify-center h-7 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all
                ${!cell.cur ? 'text-[#0A2745]/25' : ''}
                ${cell.cur && (isSun || isSat) && !isHighlight ? 'text-red-400' : ''}
                ${cell.cur && !isSun && !isSat && !isHighlight && !isToday ? 'text-[#0A2745]' : ''}
                ${isToday && !isHighlight ? 'border border-[#2474C0] text-[#2474C0]' : ''}
                ${isHighlight ? 'bg-gradient-to-br from-[#113E7E] to-[#2B73C4] text-white font-bold shadow-md' : ''}
              `}
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] sm:text-xs text-[#0A2745]/70">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-[#2474C0]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#113E7E] to-[#2B73C4]" />
          <span>BNCC Launching</span>
        </div>
      </div>
    </Card>
  );
}

/* ─── Main Confirmation Page ─────────────────────────────────────── */
export default function Confirmation() {
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch user's schedule from profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://staging-launching-api.bncc.net/api';
        const res = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.registration?.schedule) {
            setSchedule(json.data.registration.schedule);
          }
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleNext = async () => {
    if (!checked) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://staging-launching-api.bncc.net/api';
      await fetch(`${apiUrl}/user/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'confirm_launching' }),
      });
    } catch (err) {
      console.warn('Failed to update status:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-8 xl:px-12 pt-24 xl:pt-12 pb-12 w-full max-w-7xl mx-auto">

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success State ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#113E7E] to-[#2474C0] flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2745]">Attendance Confirmed!</h2>
            <p className="text-sm sm:text-base text-[#0A2745]/70 max-w-sm">
              Your attendance has been recorded. We'll see you at the BNCC Launching event!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col xl:flex-row gap-6"
          >
            {/* ── Left: Confirmation Card ── */}
            <div className="xl:w-[420px] shrink-0">
              <Card className="flex flex-col gap-5 p-7 sm:p-10 rounded-xl border-white border-[3px]">
                <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-[#0A2745]">
                  Confirmation of{' '}
                  <span className="text-[#2474C0]">Attendance</span>
                </h1>

                {/* Schedule info */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm xl:text-base text-[#0A2745]/70 font-medium">
                    BNCC Launching Schedule
                  </p>
                  <div className="flex items-center gap-2.5">
                    <img src={IconSchedule} alt="" className="w-4 sm:w-5 xl:w-6 shrink-0" />
                    <p className="font-bold text-sm sm:text-base xl:text-lg text-[#0A2745]">
                      {schedule ? formatDate(schedule.startTime) : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img src={IconTime} alt="" className="w-4 sm:w-5 xl:w-6 shrink-0" />
                    <p className="font-bold text-sm sm:text-base xl:text-lg text-[#0A2745]">
                      {schedule
                        ? formatStartEndTime(schedule.startTime, schedule.endTime)
                        : '—'}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#0A2745]/10" />

                {/* Checkbox */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs sm:text-sm xl:text-base text-[#0A2745]/80">
                    Is the schedule above in line with your availability?
                  </p>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <div
                      onClick={() => setChecked(c => !c)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0
                        ${checked
                          ? 'bg-gradient-to-br from-[#113E7E] to-[#2474C0] border-[#2474C0]'
                          : 'border-[#0A2745]/30 bg-white group-hover:border-[#2474C0]'
                        }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => setChecked(c => !c)}
                      className={`text-xs sm:text-sm xl:text-base font-semibold transition-colors ${checked ? 'text-[#113E7E]' : 'text-[#0A2745]/60'}`}
                    >
                      Yes, it matches.
                    </span>
                  </label>
                  <p className="text-[10px] sm:text-xs xl:text-sm text-[#0A2745]/50 mt-0.5">
                    If it doesn't, please contact the person in charge.
                  </p>
                </div>

                {/* NEXT button */}
                <motion.button
                  whileHover={checked ? { scale: 1.03 } : {}}
                  whileTap={checked ? { scale: 0.97 } : {}}
                  onClick={handleNext}
                  disabled={!checked || loading}
                  className={`mt-2 px-8 py-3 rounded-xl font-bold text-sm sm:text-base xl:text-lg tracking-wider transition-all duration-300
                    ${checked
                      ? 'bg-gradient-to-r from-[#113E7E] to-[#2B73C4] text-white shadow-md cursor-pointer'
                      : 'bg-[#0A2745]/10 text-[#0A2745]/30 cursor-not-allowed'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting…
                    </span>
                  ) : 'NEXT'}
                </motion.button>
              </Card>
            </div>

            {/* ── Right: Calendar + Contact ── */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              <MiniCalendar highlightDate={schedule?.startTime} />
              <ContactPerson />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
