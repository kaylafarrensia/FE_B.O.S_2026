import { useState } from 'react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconSchedule from '@/assets/icons/IconSchedule.svg';
import IconTime from '@/assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '@/utils/index.js';
import Calendar from './Calendar.jsx';
import RegistrationTypeDropdown from './RegistrationTypeDropdown.jsx';
import SavedPopup from '@/pages/Dashboard/Schedule/SavedPopup.jsx';
import ContactPerson from '@/pages/Dashboard/Japres/ContactPerson.jsx';

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

const REGISTRATION_TYPES = [
  {
    id: 1,
    type: 'Group (3 People)'
  },
  {
    id: 2,
    type: 'Individual'
  }
]

const DUMMY_CONTACT = {
  name: 'Valentina Azalea Kanaya',
  line: 'every1woo',
  wa: '082261395005',
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [tempType, setTempType] = useState(null);
  // null = user belum pernah memilih/mengonfirmasi jadwal apapun
  const [userSchedule, setUserSchedule] = useState(null);

  const handleConfirm = () => {
    if (!tempType) return;
    setUserSchedule(tempType);
    setTempType(null);
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
                Hello, {DUMMY_USER.name}!
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                Thank you for attending the BNCC Launching! Don&#x27;t forget to complete your payment on time so you can officially become part of the <span className="font-bold">BNCC family</span>.
              </p>
            </Card>

            {/* Change Schedule */}
            <Card className="flex flex-col p-10 mt-0 rounded-xl border-white border-[3px] z-[99]">
              <h1 className="text-xl font-bold sm:text-3xl  w-fit">
                Payment Submission
              </h1>
              <p className="pt-2 xl:pt-5 text-xs sm:text-lg flex flex-col gap-1">
                Registration Type
              </p>
              <RegistrationTypeDropdown
                types={REGISTRATION_TYPES}
                onSelect={setTempType}
              />
              <div className="flex justify-start xl:block">
                <Button
                  className=""
                  onClick={handleConfirm}
                  disabled={!tempType}
                >
                  Next
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
