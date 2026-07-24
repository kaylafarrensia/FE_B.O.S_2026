import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import { formatDate, formatStartEndTime } from '../../../utils/index.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TODAY_GLASS_STYLE = {
  '--glass-from': 'rgba(10, 39, 69, 0.1)',
  '--glass-to': 'rgba(255, 255, 255, 0)',
};

const EVENT_GLASS_STYLE = {
  '--glass-from': 'rgba(12, 64, 118, 0.9)',
  '--glass-to': 'rgba(68, 137, 212, 0.9)',
};

const SELECTED_GLASS_STYLE = {
  '--glass-from': 'rgba(234, 178, 8, 0.73)',
  '--glass-to': 'rgba(250, 204, 21, 0.84)',
};

export default function Calendar({ schedules, userScheduleId }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getEventsForDay = (day) =>
    schedules.filter((s) => {
      const d = new Date(s.startTime);
      return (
        d.getUTCDate() === day &&
        d.getUTCMonth() === month &&
        d.getUTCFullYear() === year
      );
    });

  return (
    <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 border-b pb-2">
        <h2 className="text-2xl font-bold w-fit">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            className="p-1 rounded-full hover:bg-lavender-white text-persian-indigo"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft />
          </button>
          <button
            className="p-1 rounded-full hover:bg-lavender-white text-persian-indigo"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 text-center justify-items-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div
            key={day}
            className={`w-10 h-8 flex items-center justify-center font-medium text-sm md:text-base text-center ${i === 0 ? 'text-red-500' : 'text-persian-indigo'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-2 text-center justify-items-center">
        {/* Tanggal dari bulan sebelumnya, sebagai pengisi sebelum tanggal 1 */}
        {[...Array(firstDayWeekday)].map((_, i) => {
          const trailingDay = prevMonthDays - firstDayWeekday + i + 1;
          const isSunday = i === 0;
          return (
            <div
              key={`prev-${i}`}
              className={`w-10 h-10 flex items-center justify-center text-center rounded-lg ${isSunday ? 'text-red-300' : 'text-gray-300'}`}
            >
              {trailingDay}
            </div>
          );
        })}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const weekday = (firstDayWeekday + i) % 7;
          const isSunday = weekday === 0;
          const events = getEventsForDay(day);
          const isUserDay = events.some((e) => e.id === userScheduleId);

          let cls = '';
          let stl = {};

          if (isToday(day)) {
            cls = 'font-semibold glassmorphism';
            stl = TODAY_GLASS_STYLE;
          } else if (isUserDay) {
            cls = 'font-semibold text-white glassmorphism';
            stl = SELECTED_GLASS_STYLE;
          } else if (events.length > 0) {
            cls = 'font-semibold text-white glassmorphism';
            stl = EVENT_GLASS_STYLE;
          } else {
            cls = `hover:bg-lavender-white hover:shadow-sm hover:rounded-lg ${isSunday ? 'text-red-500' : 'text-persian-indigo'}`;
          }

          return (
            <div
              key={day}
              className={`w-10 h-10 flex items-center justify-center text-center rounded-lg cursor-pointer ${cls}`}
              style={stl}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-5 text-xs sm:text-sm text-persian-indigo">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md shadow-sm glassmorphism" style={TODAY_GLASS_STYLE} />
          <span className="font-semibold">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md shadow-sm glassmorphism" style={EVENT_GLASS_STYLE} />
          <span className="font-semibold">BNCC Launching</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md shadow-sm glassmorphism" style={SELECTED_GLASS_STYLE} />
          <span className="font-semibold">Your Selected Schedule</span>
        </div>
      </div>
    </Card>
  );
}