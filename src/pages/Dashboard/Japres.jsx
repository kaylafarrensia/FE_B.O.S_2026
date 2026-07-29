import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card.jsx';
import IconTrophy from '../../assets/icons/IconTrophy.svg';
import GuidelineSection from './Japres/GuidelineSection.jsx';
import DocumentSubmission from './Japres/DocumentSubmission.jsx';
import TimelineSection from './Japres/TimelineSection.jsx';
import ApplicationStatus from './Japres/ApplicationStatus.jsx';
import ContactPerson from './Japres/ContactPerson.jsx';

// ── Dummy Data (replace with API when backend is ready) ───────────────────────
const DUMMY_JAPRES_STATUS = {
  status: 'Not Submitted',
  submittedAt: null,
};

const REASONS = [
  { num: '01', text: 'Get 100% or 75% discount on registration' },
  { num: '02', text: 'Recognize and reward your achievements' },
  { num: '03', text: 'Stand out and secure your BNCC spot' },
];

const HOVER_GLASS_STYLE = {
  '--glass-from': 'rgba(27, 79, 140, 0.95)',
  '--glass-to': 'rgba(46, 109, 180, 0.9)',
  '--glass-stroke': 'rgba(255, 255, 255, 0.35)',
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Japres() {
  const [hasReadGuideline, setHasReadGuideline] = useState(false);
  const [japresUrl, setJapresUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState(DUMMY_JAPRES_STATUS);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleSubmit = () => {
    if (!japresUrl.trim()) return;
    if (!hasReadGuideline) {
      alert('Please read and check the JaPres guideline first!');
      return;
    }
    setCurrentStatus({ status: 'Pending', submittedAt: new Date().toISOString() });
    setJapresUrl('');
  };

  return (
    <div className="relative z-0">
      <main className="relative px-6 pt-3 pb-16 sm:px-12 sm:py-24 xl:px-[10vw] xl:py-32 overflow-x-clip">
        {/* ── Page Header ── */}
        <header className="flex flex-col items-center justify-center gap-6 sm:gap-9 xl:gap-10 mb-14 sm:mb-[88px] xl:mb-24 text-center">
          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut', times: [0, 0.2, 0.4], delay: 3 }}
          >
            <Card className="py-2 px-7 sm:px-12 sm:py-4 rounded-xl border-white border-[3px] w-fit">
              <h2 className="text-sm font-semibold sm:text-[22px] xl:text-2xl">
                BNCC OPENING SEASON 2026
              </h2>
            </Card>
          </motion.div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-[62px] font-bold font-outfit text-persian-indigo text-center select-none max-w-full">
            {/* Left Cursor */}
            <span
              className="inline-block relative shrink-0 align-middle w-[0.12em] sm:w-[0.16em] h-[1.6em] bg-[#2474C0] rounded-full"
              style={{ marginRight: '0px' }}
            >
              <span
                className="w-[0.36em] h-[0.36em] sm:w-[0.55em] sm:h-[0.55em]"
                style={{
                  position: 'absolute',
                  top: '-0.14em',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2474C0',
                  borderRadius: '50%',
                }}
              />
            </span>

            {/* Text Highlight Block */}
            <span
              className="inline px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl"
              style={{
                backgroundColor: 'rgba(36, 116, 192, 0.15)',
                lineHeight: '1.6em',
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
              }}
            >
              BNCC Achievement Track (JaPres)
            </span>

            {/* Right Cursor */}
            <span
              className="inline-block relative shrink-0 align-middle w-[0.12em] sm:w-[0.16em] h-[1.6em] bg-[#2474C0] rounded-full"
              style={{ marginLeft: '0px' }}
            >
              <span
                className="w-[0.36em] h-[0.36em] sm:w-[0.55em] sm:h-[0.55em]"
                style={{
                  position: 'absolute',
                  bottom: '-0.14em',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2474C0',
                  borderRadius: '50%',
                }}
              />
            </span>
          </h1>
        </header>

        {/* ── About JaPres Section ── */}
        <Card className="relative mb-14 sm:mb-20 flex flex-col items-start p-8 gap-7 sm:px-16 sm:py-14 xl:px-24 xl:py-20 md:gap-8 sm:gap-10 xl:gap-15 rounded-xl border-white border-[3px]">
          <div className="flex flex-col items-start gap-4 sm:gap-7 xl:gap-8">
            <header className="flex items-center justify-center gap-2 xl:gap-6">
              <img src={IconTrophy} className="relative w-5 sm:w-9 xl:w-12" alt="Trophy Icon" />
              <h2 className="text-xl font-bold sm:text-4xl  w-fit">
                Get to Know JaPres!
              </h2>
            </header>
            <p className="relative text-xs leading-5 sm:leading-10 sm:text-lg xl:text-xl">
              The Achievement Track (Jalur Prestasi or JaPres) is a special selection
              pathway for prospective BNCC members who have shown outstanding skills,
              portfolios, or achievements in the fields of technology, design, leadership,
              or community involvement. Successful applicants will receive a{' '}
              <span className="font-bold">discount of up to 100%</span> on the BNCC
              registration fee.
            </p>
          </div>

          <div className="relative z-10 flex flex-col-reverse items-center justify-between w-full gap-7 sm:gap-10 xl:flex-row lg:px-24">
            <ol className="flex flex-col gap-4 sm:gap-5 list-none w-full">
              {REASONS.map(({ num, text }, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <li key={num}>
                    <Card
                      className="flex items-center gap-4 sm:gap-6 rounded-xl px-5 sm:px-7 py-4 sm:py-5 transition-colors duration-300"
                      style={isHovered ? HOVER_GLASS_STYLE : undefined}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <Card
                        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-sm sm:text-base shrink-0 transition-colors duration-300"
                        style={{
                          ...(isHovered ? HOVER_GLASS_STYLE : {}),
                          color: isHovered ? '#fff' : '#1B3B6F',
                        }}
                      >
                        {num}
                      </Card>
                      <p
                        className="text-base sm:text-lg xl:text-xl transition-colors duration-300"
                        style={{ color: isHovered ? '#fff' : '#1B3B6F' }}
                      >
                        {text}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ol>
            <div className="flex flex-col items-center w-1/2 gap-4 sm:gap-7 md:w-full md:justify-center">
              <h1 className="text-[120px] leading-[120px] sm:text-[180px] sm:leading-[180px] xl:text-[210px] xl:leading-[210px] font-semibold">
                3
              </h1>
              <h3 className="text-center w-full text-base sm:text-2xl xl:text-3xl md:w-2/3 font-semibold">
                Reasons to Apply Through JaPres
              </h3>
            </div>
          </div>
        </Card>

        {/* ── Main 2-Column Grid ── */}
        <section className="grid w-full grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
          {/* Left: Guideline + Submission */}
          <div className="space-y-4 sm:space-y-6">
            <GuidelineSection
              hasReadGuideline={hasReadGuideline}
              setHasReadGuideline={setHasReadGuideline}
            />
            <DocumentSubmission
              japresUrl={japresUrl}
              setJapresUrl={setJapresUrl}
              hasReadGuideline={hasReadGuideline}
              status={currentStatus.status}
              submittedAt={currentStatus.submittedAt}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right: Timeline + Status + Contact */}
          <div className="space-y-4 sm:space-y-6">
            <TimelineSection overrideToday="2026-08-17" />  {/* testing: pura-pura hari ini 18 Agustus */}
            <ApplicationStatus status={currentStatus.status} />
            <ContactPerson />
          </div>
        </section>
      </main>
    </div>
  );
}