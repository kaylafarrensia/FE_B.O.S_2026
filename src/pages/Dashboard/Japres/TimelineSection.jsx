'use client';

import { useEffect, useRef, useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Glass from '../../../components/ui/Glass.jsx';

const timelineEvents = [
  { compareDate: '2026-08-12', displayDate: 'August 12, 2026', description: 'Submission Deadline' },
  { compareDate: '2026-08-17', displayDate: 'August 17, 2026', description: 'Result Announcement' },
  { compareDate: '2026-08-19', displayDate: 'August 19-21, 2026', description: 'Interview' },
  { compareDate: '2026-08-25', displayDate: 'August 25, 2026', description: 'Final Result' },
];

const GLASS_FILLED_STYLE = {
  '--glass-from': 'rgba(12, 64, 118, 0.9)',
  '--glass-to': 'rgba(68, 137, 212, 0.9)',
};

const GLASS_FILLED_STYLE_DOT = {
  '--glass-from': 'rgba(12, 64, 118, 0.5)',
  '--glass-to': 'rgba(68, 137, 212, 0.5)',
};

const GLASS_UNFILLED_STYLE_DOT = {
  '--glass-from': 'rgba(192, 224, 236, 1)',
  '--glass-to': 'rgba(178, 204, 211, 1)',
};

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getFallbackPercent(index) {
  return (index / (timelineEvents.length - 1)) * 100;
}

function getReachedIndex(today) {
  let lastReached = -1;
  for (let i = 0; i < timelineEvents.length; i++) {
    if (today >= parseLocalDate(timelineEvents[i].compareDate)) {
      lastReached = i;
    } else {
      break;
    }
  }
  return lastReached;
}

function getProgressPercent(reachedIndex, dotPercents) {
  if (reachedIndex === -1) return 0;
  if (reachedIndex === timelineEvents.length - 1) return 100;
  return dotPercents[reachedIndex] ?? 0;
}

function TimelineTrack({ progressPercent }) {
  return (
    <div
      className="glassmorphism inset-y-0 w-2 md:w-4 -translate-x-1/2 rounded-full pointer-events-none left-1/2 -z-30"
      style={{ position: 'absolute' }}
    >
      <div
        className="glassmorphism w-full rounded-full transition-all duration-700 ease-out"
        style={{ ...GLASS_FILLED_STYLE, height: `${progressPercent}%` }}
      />
    </div>
  );
}

function TimelineDot({ isReached, dotRef }) {
  return (
    <div
      ref={dotRef}
      className={`glassmorphism relative rounded-full size-5 sm:size-7 md:size-10 overflow-hidden shrink-0 transition-all duration-500 ${isReached ? 'shadow-md shadow-[#2474C0]/40' : ''}`}
      style={isReached ? GLASS_FILLED_STYLE_DOT : GLASS_UNFILLED_STYLE_DOT}
    >
      <Glass className="rounded-full" />
    </div>
  );
}

function TimelineEvent({ displayDate, description, isReached, dotRef }) {
  return (
    <div className="flex items-center justify-between w-full font-medium">
      <p className="text-xs sm:text-lg xl:text-xl text-right basis-2/5">{displayDate}</p>
      <TimelineDot isReached={isReached} dotRef={dotRef} />
      <p className="text-xs sm:text-lg xl:text-xl basis-2/5">{description}</p>
    </div>
  );
}

export default function TimelineSection({ overrideToday } = {}) {
  const today = overrideToday ? new Date(overrideToday) : new Date();
  today.setHours(0, 0, 0, 0);

  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const [dotPercents, setDotPercents] = useState(
    timelineEvents.map((_, i) => getFallbackPercent(i))
  );

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      if (containerRect.height === 0) return;

      const percents = dotRefs.current.map((dotEl) => {
        if (!dotEl) return 0;
        const dotRect = dotEl.getBoundingClientRect();
        const dotCenterY = dotRect.top + dotRect.height / 2 - containerRect.top;
        return (dotCenterY / containerRect.height) * 100;
      });

      setDotPercents(percents);
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const reachedIndex = getReachedIndex(today);
  const progressPercent = getProgressPercent(reachedIndex, dotPercents);

  return (
    <Card className="flex flex-col px-7 py-6 sm:px-14 sm:py-10 xl:px-16 xl:py-12 rounded-xl border-white border-[3px]">
      <div className="space-y-4 sm:space-y-12">
        <h2 className="text-lg font-bold sm:text-3xl w-fit">JaPres Timeline</h2>

        <div ref={containerRef} className="flex flex-col gap-y-14 relative py-10 md:py-20">
          <TimelineTrack progressPercent={progressPercent} />

          {timelineEvents.map((event, i) => (
            <TimelineEvent
              key={event.compareDate}
              displayDate={event.displayDate}
              description={event.description}
              isReached={today >= parseLocalDate(event.compareDate)}
              dotRef={(el) => { dotRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}