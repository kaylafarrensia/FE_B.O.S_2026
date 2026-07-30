import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import IconSchedule from '../../assets/icons/IconSchedule.svg';
import IconTime from '../../assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '../../utils/index.js';
import Calendar from './Schedule/Calendar.jsx';
import ContactPerson from './Japres/ContactPerson.jsx';

export default function Confirmation() {
  const [schedule, setSchedule] = useState({
    id: 2,
    startTime: '2026-08-25T12:00:00Z',
    endTime: '2026-08-25T14:00:00Z',
  });
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        console.warn('Failed to load profile schedule:', err);
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

  const schedulesToUse = schedule ? [schedule] : [];

  return (
    <div className="relative">
      <div className="flex flex-col xl:flex-row justify-center w-full pt-3 pb-8 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
        {/* ── Left Column ── */}
        <div className="flex flex-col w-full gap-4 xl:gap-5">
          <Card className="flex flex-col p-10 rounded-xl border-white border-[3px] h-full justify-between">
            <div>
              <h1 className="text-xl font-bold sm:text-3xl w-fit">
                Confirmation of <span className="text-[#2474C0]">Attendance</span>
              </h1>

              <div className="pt-2 xl:pt-5">
                <p className="text-xs sm:text-lg font-medium text-gray-700">
                  BNCC Launching Schedule
                </p>
                <ul className="flex flex-col gap-2 py-4">
                  <li className="flex flex-row items-center gap-3">
                    <img src={IconSchedule} alt="Schedule" className="w-[15px] sm:w-[30px]" />
                    <p className="font-bold text-xs sm:text-lg">
                      {schedule ? formatDate(schedule.startTime) : 'No schedule selected yet.'}
                    </p>
                  </li>
                  <li className="flex flex-row items-center gap-3">
                    <img src={IconTime} alt="Clock" className="w-[15px] sm:w-[30px]" />
                    <p className="font-bold text-xs sm:text-lg">
                      {schedule
                        ? formatStartEndTime(schedule.startTime, schedule.endTime)
                        : 'No schedule selected yet.'}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200/60 my-4" />

              <div className="py-2">
                <p className="text-xs sm:text-base font-medium text-gray-800 mb-3">
                  Is the schedule above in line with your availability?
                </p>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-persian-indigo focus:ring-persian-indigo cursor-pointer"
                  />
                  <span className="font-bold text-xs sm:text-base text-gray-900">
                    Yes, it matches.
                  </span>
                </label>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  If it doesn't, please contact the person in charge.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-start xl:block">
              <Button
                variant="ocean"
                size="md"
                disabled={!checked || loading}
                loading={loading}
                onClick={handleNext}
                className="w-32 uppercase font-bold"
              >
                NEXT
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col w-full gap-4 xl:gap-5">
          <Calendar schedules={schedulesToUse} userScheduleId={schedule?.id} />
          <ContactPerson />
        </div>
      </div>
    </div>
  );
}
