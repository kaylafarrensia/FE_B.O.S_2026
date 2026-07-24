import { useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import IconSchedule from '../../assets/icons/IconSchedule.svg';
import IconTime from '../../assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '../../utils/index.js';
import Calendar from './Schedule/Calendar.jsx';
import ScheduleDropdown from './Schedule/ScheduleDropdown.jsx';
import SavedPopup from './Schedule/SavedPopup.jsx';
import ContactPerson from './Japres/ContactPerson.jsx';

// ── Dummy Data (replace with API when backend is ready) ───────────────────────
const DUMMY_USER = {
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  schedule: {
    id: 2,
    startTime: '2026-08-15T09:00:00Z',
    endTime: '2026-08-15T12:00:00Z',
  },
  region: { id: 2, name: 'Jakarta' },
};

const DUMMY_SCHEDULES = [
  { id: 1, title: 'Session 1', startTime: '2026-08-14T09:00:00Z', endTime: '2026-08-14T12:00:00Z' },
  { id: 2, title: 'Session 2', startTime: '2026-08-15T09:00:00Z', endTime: '2026-08-15T12:00:00Z' },
];

const DUMMY_CONTACT = {
  name: 'Valentina Azalea Kanaya',
  line: 'every1woo',
  wa: '082261395005',
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState(null);
  // null = user belum pernah memilih/mengonfirmasi jadwal apapun
  const [userSchedule, setUserSchedule] = useState(null);

  const handleConfirm = () => {
    if (!tempSchedule) return;
    setUserSchedule(tempSchedule);
    setTempSchedule(null);
    setPopupOpen(true);
  };

  const openWhatsApp = (number) => {
    const formatted = number.startsWith('0') ? number.slice(1) : number;
    window.open(`https://wa.me/62${formatted}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {popupOpen && <SavedPopup setIsOpen={setPopupOpen} />}

      <div className="relative">
        <div className="flex flex-col xl:flex-row justify-center w-full py-5 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
          {/* ── Left Column ── */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
            {/* Current Schedule Info */}
            <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
              <h1 className="text-xl font-bold sm:text-3xl  w-fit">
                Join Our Launch!
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                Save the date and be part of the BNCC Launching!
              </p>
              <ul className="flex flex-col gap-2 py-5">
                <li className="flex flex-row items-center gap-3">
                  <img src={IconSchedule} alt="Schedule" className="w-[15px] sm:w-[30px]" />
                  <p className="font-bold text-xs sm:text-base">
                    {userSchedule ? formatDate(userSchedule.startTime) : 'No schedule selected yet.'}
                  </p>
                </li>
                <li className="flex flex-row items-center gap-3">
                  <img src={IconTime} alt="Clock" className="w-[15px] sm:w-[30px]" />
                  <p className="font-bold text-xs sm:text-base">
                    {userSchedule
                      ? formatStartEndTime(userSchedule.startTime, userSchedule.endTime)
                      : 'No schedule selected yet.'}
                  </p>
                </li>
              </ul>
              <div className="flex justify-center xl:block">
                <Button className="" disabled={!userSchedule}>
                  Join Now!
                </Button>
              </div>
            </Card>

            {/* Change Schedule */}
            <Card className="flex flex-col p-10 mt-0 rounded-xl border-white border-[3px] z-[99]">
              <h1 className="text-xl font-bold sm:text-3xl  w-fit">
                Change Your Schedule?
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg flex flex-col gap-1">
                <span>Having second thoughts?</span>
                <span>No worries! Pick a new schedule that suits you.</span>
              </p>
              <ScheduleDropdown
                schedules={DUMMY_SCHEDULES}
                onSelect={setTempSchedule}
              />
              <div className="flex justify-start xl:block">
                <Button
                  className=""
                  onClick={handleConfirm}
                  disabled={!tempSchedule}
                >
                  Submit
                </Button>
              </div>
            </Card>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col w-full gap-4 xl:gap-5">
            <Calendar schedules={DUMMY_SCHEDULES} userScheduleId={userSchedule?.id} />

            {/* Contact Person */}
            <ContactPerson />
          </div>
        </div>
      </div>
    </>
  );
}