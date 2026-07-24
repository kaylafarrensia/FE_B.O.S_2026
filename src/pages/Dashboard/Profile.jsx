import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import IconDownload from '../../assets/icons/IconDownload.svg';

// ── DUMMY DATA ─────────────────────────────────────────────────────────────────
const DUMMY_USER = {
  name: 'John Doe',
  email: 'johndoe123@gmail.com',
  registration: {
    whatsappNumber: '0821-0000-1234',
    lineId: 'johndoeline',
    nim: '2602345678',
    bnccId: 'BNCC2602345',
    schedule: {
      startTime: '2026-08-15T09:00:00Z',
      endTime: '2026-08-15T12:00:00Z',
    },
    lntCourse: { title: 'Front-End' },
    faculty: { name: 'School of Computer Science' },
    major: { name: 'Computer Science' },
    region: { name: 'Jakarta' },
    suratMember: 'null',
    binusianCard: 'null',
    linkedinUrl: 'https://linkedin.com/in/john-doe',
    githubUrl: 'https://github.com/johndoe',
  },
};

function formatDate(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTime(startIso, endIso) {
  if (!startIso) return '-';
  const s = new Date(startIso);
  const e = new Date(endIso);
  const fmt = (d) =>
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
  return `${fmt(s)} – ${fmt(e)} WIB`;
}

function Profile() {
  const user = DUMMY_USER;

  return (
    <div className="relative">
      <div className="flex justify-center w-full py-5 xl:py-15 px-6 xl:px-[10vw]">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-5 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-4 xl:gap-5 w-full">
              {/* Personal Information */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center">
                  PERSONAL INFORMATION
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Whatsapp Number</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.whatsappNumber}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Line ID</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.lineId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Card>

              {/* BNCC Registration */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center">
                  BNCC REGISTRATION
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">BNCC Launching Schedule</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {formatDate(user.registration.schedule.startTime)}
                      <br />
                      {formatTime(
                        user.registration.schedule.startTime,
                        user.registration.schedule.endTime
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">LnT Course</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {user.registration.lntCourse.title}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 xl:gap-5 w-full">
              {/* Student Credentials */}
              <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                <h1 className="font-bold pb-8 text-lg sm:text-3xl text-center text-">
                  STUDENT CREDENTIALS
                </h1>
                <div className="grid grid-cols-2 gap-5 justify-start items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">NIM</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.nim || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Campus Region</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.region.name || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">BNCC ID</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.bnccId || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Faculty</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.faculty.name || '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Binus Email</p>
                    <p className="text-sm sm:text-lg font-semibold break-words">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Major</p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {user.registration.major.name || '-'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Re-Registration (only shown when files available) */}
              {user.registration.suratMember && user.registration.binusianCard && (
                <Card className="border-white border-2 rounded-2xl px-6 sm:px-10 py-10">
                  <h1 className="font-bold pb-10 text-lg sm:text-2xl text-center">
                    RE-REGISTRATION
                  </h1>
                  <div className="flex flex-col gap-5 justify-start items-start">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500">LinkedIn URL</p>
                      <p className="text-sm sm:text-lg font-semibold">
                        {user.registration.linkedinUrl || 'https://'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500">Github URL</p>
                      <p className="text-sm sm:text-lg font-semibold">
                        {user.registration.githubUrl || 'https://'}
                      </p>
                    </div>
                    <div className="gap-2 flex flex-col">
                      <p className="text-sm text-gray-500">Member Letter</p>
                      <Button>
                        <img src={IconDownload} alt="Download" className="w-6 h-6 mr-2" />
                        <p className='text-xs sm:text-sm'>Download Latest Submission</p>
                      </Button>
                    </div>
                    <div className="gap-2 flex flex-col">
                      <p className="text-sm text-gray-500">Binusian Card</p>
                      <Button>
                        <img src={IconDownload} alt="Download" className="w-6 h-6 mr-2" />
                        <p className='text-xs sm:text-sm'>Download Binusian Card</p>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
