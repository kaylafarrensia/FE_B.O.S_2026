import Card from './Card'
import cpIcon from '../../../public/icons/ic-cp.svg'
import lineIcon from '../../../public/icons/ic-line.svg'

export default function ContactPersonCard({
  username = 'johndowney123',
  name = 'John Downey',
  onContactClick,
}) {
  return (
    <Card className="relative w-full overflow-hidden p-6 sm:p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent md:text-2xl">
            Contact Person
          </h2>

          <div className="mt-5 flex items-center gap-2.5">
            <img
              src={lineIcon}
              alt="LINE"
              className="h-6 w-6 shrink-0"
            />
            <span className="text-xs font-medium text-slate-700 sm:text-sm">
              {username} ({name})
            </span>
          </div>

          <button
            type="button"
            onClick={onContactClick}
            className="mt-5 rounded-[10px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-6 py-2.5 text-xs font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 sm:text-sm"
          >
            Contact Us
          </button>
        </div>

        <img
          src={cpIcon}
          alt="contact person illustration"
          className="hidden h-28 w-28 shrink-0 sm:block md:h-32 md:w-32"
        />
      </div>
    </Card>
  )
}