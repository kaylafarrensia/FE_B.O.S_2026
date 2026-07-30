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
    <Card className="relative w-full overflow-hidden p-6 sm:p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-[#0A2745] sm:text-2xl md:text-3xl">
            Contact <span className="text-[#2474C0]">Person</span>
          </h2>

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
                <span className="text-xs font-medium text-slate-700 sm:text-sm lg:text-base xl:text-lg hover:underline">
                  {username} ({name})
                </span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContactClick}
            className="mt-5 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 xl:px-6 xl:py-3 rounded-lg bg-gradient-to-r from-[#113E7E] to-[#2B73C4] text-white font-semibold text-xs xl:text-base shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-white shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            <span>Contact Us</span>
          </button>
        </div>

        <img
          src={cpIcon}
          alt="contact person illustration"
          className="hidden h-28 w-28 shrink-0 sm:block md:h-32 md:w-32 lg:h-40 lg:w-40"
        />
      </div>
    </Card>
  )
}
