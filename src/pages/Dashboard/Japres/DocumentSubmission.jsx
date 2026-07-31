import Card from '../../../components/ui/Card.jsx'
import Button from '../../../components/ui/Button.jsx'
import IconUpload from '../../../assets/icons/IconUpload.svg'
import IconTime from '../../../assets/icons/IconTime.svg'
import { formatDate } from '../../../utils/index.js'

export default function DocumentSubmission({
  japresUrl,
  setJapresUrl,
  hasReadGuideline,
  submittedAt,
  onSubmit,
  submitting,
  submitError,
}) {
  return (
    <Card className="flex flex-col p-7 sm:p-14 xl:p-16 rounded-xl border-white border-[3px]">
      <h2 className="text-lg font-bold sm:text-3xl w-fit mb-4">
        Document Submission
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-base font-semibold mb-2">
            Google Drive Link
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={japresUrl}
              onChange={(e) => setJapresUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-white/60 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            />
            <img
              src={IconUpload}
              alt=""
              className="absolute right-3 w-4 sm:w-5 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold mb-1">
            Status Display
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <img src={IconTime} alt="" className="w-4 h-4" />
            <span>
              {submittedAt
                ? `Last submitted: ${formatDate(submittedAt)}`
                : 'No latest submission'}
            </span>
          </div>
        </div>

        {submitError && (
          <p className="text-red-500 text-xs sm:text-sm">{submitError}</p>
        )}

        <div className="pt-2">
          <Button
            onClick={onSubmit}
            disabled={!hasReadGuideline || !japresUrl.trim() || submitting}
            className={
              !hasReadGuideline || !japresUrl.trim() || submitting
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
