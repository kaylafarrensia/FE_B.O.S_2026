import { useState } from 'react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconSchedule from '@/assets/icons/IconSchedule.svg';
import IconTime from '@/assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '@/utils/index.js';
import Calendar from './Calendar.jsx';
import RegistrationTypeDropdown from './RegistrationTypeDropdown.jsx';
import ContactPerson from '@/pages/Dashboard/Japres/ContactPerson.jsx';
import IndividualForm from './IndividualForm.jsx';
import IconSad from '@/assets/icons/IconSad.svg';
import { useNavigate } from 'react-router-dom';

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
    type: 'Individual'
  }
]

const DUMMY_CONTACT = {
  name: 'Valentina Azalea Kanaya',
  line: 'every1woo',
  wa: '082261395005',
};
const REGISTRATION_DUEDATE = "2026-09-18";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Schedule() {
  const today = new Date();
  const deadline = new Date(REGISTRATION_DUEDATE);

  const isRegistrationClosed = today > deadline;
  const [tempType, setTempType] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!tempType) return;
    setUserType(tempType);
    if (tempType.type === 'Individual') {
      navigate('/payment/individual-form');
    }
    setTempType(null);
  };

  const openWhatsApp = (number) => {
    const formatted = number.startsWith('0') ? number.slice(1) : number;
    window.open(`https://wa.me/62${formatted}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="relative">
        {isRegistrationClosed ? (
          <Card className="flex flex-col justify-center items-center text-center p-10 rounded-xl border-[#0088FF] border-[3px] mx-6 xl:mx-[5vw] my-8 w-auto min-h-[420px]">
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src={IconSad}
                alt="Sad Icon"
                className="w-16 h-16 sm:w-24 sm:h-24"
              />

              <h1 className="text-xl sm:text-3xl font-bold text-[#0A2745]">
                Registration is now closed!
              </h1>

              <p className="text-xs sm:text-lg text-[#0A2745] max-w-3xl">
                We&#x27;re sorry, BNCC membership registration is no longer available.
                See you next year!
              </p>
            </div>
          </Card>

        ) : (
          <div className="flex flex-col xl:flex-row justify-center w-full py-5 xl:py-15 px-6 xl:px-[10vw] gap-4 xl:gap-5">
            {/* ── Left Column ── */}
            <div className="flex flex-col w-full gap-4 xl:gap-5">
              {/* Current Schedule Info */}
              <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
                <h1 className="text-xl font-bold sm:text-3xl  w-fit">
                  Hello, {DUMMY_USER.name}!
                </h1>
                <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                  Thank you for attending the BNCC Launching! Don&#x27;t forget to complete your{' '}
                  <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745]">
                    payment
                  </span>{' '}
                  on time so you can officially become part of the{' '}
                  <span className="font-bold">BNCC family</span>.
                </p>
              </Card>

              <Card className="flex flex-col p-10 mt-0 rounded-xl border-white border-[3px] z-[99]">
                {userType && userType.type === 'Group (3 People)' ? (
                  <GroupCode />
                ) : (
                  <>
                    <h1 className="text-xl font-bold sm:text-3xl w-fit">
                      <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745]">
                        Payment
                      </span> Submission
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
                        onClick={handleConfirm}
                        disabled={!tempType}
                      >
                        NEXT
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </div>

            {/* ── Right Column ── */}
            <div className="flex flex-col w-full gap-4 xl:gap-5">
              <Calendar schedules={DUMMY_SCHEDULES} />

              {/* Contact Person */}
              <ContactPerson />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
