import Card from './Card'
import PersonIllustration from './PersonIllustration'

export default function ContactPersonCard({
  username = 'johndowney123',
  name = 'John Downey',
  onContactClick,
}) {
  return (
    <Card className="relative w-full overflow-hidden">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold text-[#0A2745] sm:text-3xl md:text-4xl">
            Contact <span className="text-[#2474C0]">Person</span>
          </h2>

          <div className="mt-8 flex items-center gap-3">
            {/* badge LINE */}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A2745] text-[7px] font-bold leading-none text-white">
              LINE
            </span>
            <span className="text-sm font-medium text-slate-700 sm:text-base">
              {username} ({name})
            </span>
          </div>

          <button
            type="button"
            onClick={onContactClick}
            className="mt-8 rounded-xl bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 sm:text-base"
          >
            Contact Us
          </button>
        </div>

        <PersonIllustration className="hidden h-40 w-40 shrink-0 sm:block md:h-48 md:w-48" />
      </div>
    </Card>
  )
}