import Card from './Card'
import cpIcon from '../../../public/icons/ic-cp.svg'
import lineIcon from '../../../public/icons/ic-line.svg'

export default function ContactPersonCard({
  username = 'johndowney123',
  name = 'John Downey',
  onContactClick,
}) {
  return (
    <Card className="relative w-full overflow-hidden p-3.5 sm:p-4 md:p-4 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-sm font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent sm:text-base lg:text-4xl">
            Contact Person
          </h1>

          <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 lg:mt-5 lg:gap-2.5">
            <img
              src={lineIcon}
              alt="LINE"
              className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-6 lg:w-6"
            />
            <span className="text-[9px] font-medium text-slate-700 sm:text-[10px] lg:text-sm">
              {username} ({name})
            </span>
          </div>

          <button
            type="button"
            onClick={onContactClick}
            className="mt-1.5 rounded-[10px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-3 py-1 text-[10px] font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer sm:mt-2 sm:px-4 sm:py-1 sm:text-[11px] lg:mt-5 lg:px-6 lg:py-2.5 lg:text-lg"
          >
            Contact Us
          </button>
        </div>

        <img
          src={cpIcon}
          alt="contact person illustration"
          className="hidden h-10 w-10 shrink-0 sm:block md:h-12 md:w-12 lg:h-40 lg:w-40"
        />
      </div>
    </Card>
  )
}