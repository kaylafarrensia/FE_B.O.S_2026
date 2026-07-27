import Card from './Card.jsx';
import IconLine from '../../assets/icons/IconLine.svg';
import Team from '../../assets/images/Team.svg';

export default function ContactPersonCard({
  username = '@yviluo',
  name = 'Yovi Gracia Lo',
  wa = '6285178100246',
  onContactClick,
}) {
  const lineUrl = `https://line.me/R/ti/p/~yviluo`;
  const openWhatsApp = (number) => {
    const formatted = number.startsWith('0') ? number.slice(1) : number;
    window.open(`https://wa.me/${formatted}`, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      openWhatsApp(wa);
    }
  };

  return (
    <Card className="relative w-full max-w-[520px] mx-auto overflow-hidden p-0 sm:p-4 md:p-4 lg:mx-0 lg:max-w-none lg:p-8">
      <div className="flex items-center justify-between gap-0 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-bold leading-[1.3] bg-gradient-to-r from-[#0A2745] to-[#2474C0] bg-clip-text text-transparent sm:text-base md:text-[23px] lg:text-4xl">
            Contact Person
          </h1>

          <div className="mt-2 flex flex-col gap-1.5 sm:mt-3 lg:mt-5">
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 lg:gap-2.5"
            >
              <img
                src={IconLine}
                alt="LINE"
                className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-6 lg:w-6"
              />
              <span className="text-[8px] font-semibold text-[#0A2745] sm:text-[10px] lg:text-sm hover:underline">
                {username} ({name})
              </span>
            </a>
            <div className="flex items-center gap-1.5 lg:gap-2.5">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-6 lg:w-6">
                <path
                  d="M12.008.01a11.95 11.95 0 00-10.42 17.846L0 24l6.303-1.654A11.95 11.95 0 1012.008.01z"
                  fill="#0A2745"
                />
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"
                  fill="#FFFFFF"
                />
              </svg>
              <span className="text-[8px] font-semibold text-[#0A2745] sm:text-[10px] lg:text-sm">
                085178100246
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContactClick}
            className="mt-4 rounded-[5px] md:rounded-[8px] bg-gradient-to-br from-[#0A2745] to-[#2474C0] px-3 py-1.5 text-[11px] font-medium text-white shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer sm:px-4 sm:py-2 sm:text-[15px] lg:px-6 lg:py-2.5 lg:text-lg"
          >
            Contact Us
          </button>
        </div>
        <div className="flex justify-center items-center shrink-0">
          <img
            src={Team}
            alt="contact person illustration"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
          />
        </div>
      </div>
    </Card>
  );
}