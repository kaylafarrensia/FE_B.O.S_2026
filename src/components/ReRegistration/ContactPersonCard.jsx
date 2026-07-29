import Card from './Card'
import cpIcon from '../../../public/icons/ic-cp.svg'
import lineIcon from '../../../public/icons/ic-line.svg'
import waIcon from '../../../public/icons/ic-wa4.svg'

export default function ContactPersonCard({
  username = '@yviluo',
  name = 'Yovi Gracia Lo',
  usernameWa = 'Bina Nusantara Computer Club',
  onContactClick,
}) {
  const lineUrl = `https://line.me/R/ti/p/~yviluo`
  const waUrl = `https://wa.me/+6285178100246`

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick()
    } else {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="relative w-full max-w-[520px] mx-auto overflow-hidden p-0 sm:p-4 md:p-4 lg:mx-0 lg:max-w-none lg:p-8">
      <div className="flex items-center justify-between gap-0">
        <div className="min-w-0">
          <h1 className="text-[15px] font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent sm:text-base md:text-[23px] lg:text-4xl">
            Contact Person
          </h1>

          <div className='flex flex-col'>
            <div className="mt-2 flex items-center gap-1.5 sm:mt-3 lg:mt-5 lg:gap-2.5">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 lg:gap-2.5"
              >
                <span className="flex w-3.5 shrink-0 items-center justify-center sm:w-4 lg:w-6">
                  <img
                    src={lineIcon}
                    alt="LINE"
                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-6 lg:w-6"
                  />
                </span>
                <span className="text-[8px] font-medium text-slate-700 sm:text-[10px] lg:text-sm hover:underline">
                  {username} ({name})
                </span>
              </a>
            </div>
            <div className="mt-2 flex items-center gap-1.5 sm:mt-3 lg:mt-5 lg:gap-2.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 lg:gap-2.5"
              >
                <span className="flex w-3.5 shrink-0 items-center justify-center sm:w-4 lg:w-6">
                  <img
                    src={waIcon}
                    alt="WhatsApp"
                    className="h-4.5 w-4.5 shrink-0 sm:h-5 sm:w-5 lg:h-7 lg:w-7"
                  />
                </span>
                <span className="text-[8px] font-medium text-slate-700 sm:text-[10px] lg:text-sm hover:underline">
                  {usernameWa}
                </span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContactClick}
            className="mt-2 rounded-[5px] md:rounded-[8px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-3 py-1.5 text-[11px] font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer sm:mt-3 sm:px-4 sm:py-2 sm:text-[15px] lg:mt-5 lg:px-6 lg:py-2.5 lg:text-lg"
          >
            Contact Us
          </button>
        </div>

        <img
          src={cpIcon}
          alt="contact person illustration"
          className="h-20 w-20 shrink-0 sm:block md:h-35 md:w-35 lg:h-40 lg:w-40"
        />
      </div>
    </Card>
  )
}