import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import IconUpload from '../../../assets/icons/IconUpload.svg';
import IconTime from '../../../assets/icons/IconTime.svg';
import IconSchedule from '../../../assets/icons/IconSchedule.svg';
import { formatToWIB } from '../../../utils/index.js';

const STATUS_STYLES = {
  'Not Submitted': 'bg-red-500 text-white',
  Pending: 'bg-yellow-500 text-white',
  Rejected: 'bg-red-600 text-white',
  'Accepted Gold': 'bg-yellow-400 text-black',
  'Accepted Silver': 'bg-gray-400 text-white',
};

function getStatusStyling(status) {
  return STATUS_STYLES[status] || STATUS_STYLES['Not Submitted'];
}

const SECTION_TITLE_CLASS = 'font-poppins text-xs sm:text-lg xl:text-xl font-semibold';

export default function DocumentSubmission({
  japresUrl,
  setJapresUrl,
  hasReadGuideline,
  status,
  submittedAt,
  onSubmit,
}) {
  return (
    <Card className="flex flex-col px-7 py-6 sm:px-14 sm:py-10 xl:px-16 xl:py-12 rounded-xl border-white border-[3px]">
      <div className="flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col gap-4 sm:gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between w-full gap-3">
              <h2 className="text-lg font-bold sm:text-3xl w-fit">
                Submit Your Documents
              </h2>
              <span
                className={`text-xs sm:text-lg leading-none w-fit min-w-fit h-fit px-3 py-2 md:px-5 rounded-full ${getStatusStyling(status)}`}
              >
                {status}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <img src={IconSchedule} alt="" className="size-4 sm:size-6" />
              <p className="text-xs sm:text-lg">
                Due: August 7, 2026 at 23:59 WIB
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h3 className={SECTION_TITLE_CLASS}>Note</h3>
            <ul className="text-xs sm:text-lg xl:text-xl list-disc pl-5">
              <li>
                Ensure your Google Drive link is{' '}
                <span className="font-bold">accessible</span> without request access.
              </li>
              <li>
                Accepted File Type{' '}
                <span className="font-bold">ONLY Google Drive link</span>{' '}
                (Portfolio and CV).
              </li>
            </ul>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <h3 className={SECTION_TITLE_CLASS}>Google Drive Link</h3>
            <div className="relative">
              <input
                value={japresUrl}
                onChange={(e) => setJapresUrl(e.target.value)}
                className="w-full px-6 py-3 text-[11px] sm:text-sm rounded-lg border border-white bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#2474C0]"
                placeholder="e.g. https://drive.google.com/..."
              />
              <img
                src={IconUpload}
                alt="Upload"
                className="absolute -translate-y-1/2 top-1/2 right-4 size-3 sm:size-5"
              />
            </div>
          </div>

          {/* Last Upload Status */}
          <div className="space-y-2">
            <h3 className={SECTION_TITLE_CLASS}>Status Display</h3>
            <div className="flex items-center gap-4">
              <img src={IconTime} alt="" className="size-4 sm:size-6" />
              <p className="text-xs sm:text-lg xl:text-xl">
                Last uploaded: {submittedAt ? formatToWIB(submittedAt) : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="self-center">
          <Button
            onClick={onSubmit}
            disabled={!japresUrl.trim() || !hasReadGuideline}
            className="px-8 py-2 sm:px-10 sm:py-3 mx-auto w-fit"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </Card>
  );
}