import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconSchedule from '../../../assets/icons/IconSchedule.svg';
import { formatDate, formatStartEndTime } from '../../../utils/index.js';

const DATE_LABEL_CLASS = 'font-semibold text-xs sm:text-lg text-[#251369]';
const TIME_LABEL_CLASS = 'text-xs sm:text-lg text-gray-500';

export default function ScheduleDropdown({ schedules, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (schedule) => {
    setSelected(schedule);
    onSelect(schedule);
    setOpen(false);
  };

  return (
    <div className="relative w-full text-left py-5">
      <div className="w-full rounded-xl border border-white/60 bg-gradient-to-r from-blue-50 to-blue-100/60 divide-y divide-white/70 overflow-hidden shadow-[8px_8px_8px_rgba(0,0,0,0.05)]">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center px-5 py-4 hover:brightness-95 transition"
        >
          <img src={IconSchedule} alt="" className="w-5 mr-3" />
          {selected ? (
            <div className="flex-1 flex items-center justify-between text-left">
              <span className={DATE_LABEL_CLASS}>{formatDate(selected.startTime)}</span>
              <span className={`${TIME_LABEL_CLASS} mr-2`}>
                {formatStartEndTime(selected.startTime, selected.endTime)}
              </span>
            </div>
          ) : (
            <span className="flex-1 text-left text-xs sm:text-lg text-gray-400">
              Select new schedule
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[#251369] transform transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="divide-y divide-white/70 overflow-hidden"
            >
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  onClick={() => handleSelect(schedule)}
                  className="flex items-center px-5 py-4 cursor-pointer hover:bg-white/40 transition-colors duration-200"
                >
                  <img src={IconSchedule} alt="" className="w-5 mr-3" />
                  <span className={`flex-1 text-left ${DATE_LABEL_CLASS}`}>
                    {formatDate(schedule.startTime)}
                  </span>
                  <span className={TIME_LABEL_CLASS}>
                    {formatStartEndTime(schedule.startTime, schedule.endTime)}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}