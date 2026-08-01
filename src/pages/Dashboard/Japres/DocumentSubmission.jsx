import { useState } from 'react'
import Card from '../../../components/ui/Card.jsx'
import Button from '../../../components/ui/Button.jsx'
import IconUpload from '../../../assets/icons/IconUpload.svg'
import IconTime from '../../../assets/icons/IconTime.svg'

// Helper function to format date + time (e.g., "22 Jul 2026 at 16:15")
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${formattedDate} at ${formattedTime}`
}

export default function DocumentSubmission({
  japresUrl,
  setJapresUrl,
  hasReadGuideline,
  submittedAt,
  onSubmit,
  submitting,
  submitError,
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleFormSubmit = async () => {
    try {
      await onSubmit(japresUrl)
      setShowSuccessModal(true)
    } catch (e) {
      // Error is handled by parent prop submitError
    }
  }

  return (
    <>
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
            <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500 font-medium">
              You must read and understand the guidelines before submitting your
              documents.
            </p>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold mb-1">
              Status Display
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <img src={IconTime} alt="" className="w-4 h-4" />
              <span>
                {submittedAt
                  ? `Last submitted: ${formatDateTime(submittedAt)}`
                  : 'No latest submission'}
              </span>
            </div>
          </div>

          {submitError && (
            <p className="text-red-500 text-xs sm:text-sm">{submitError}</p>
          )}

          <div className="pt-2">
            <Button
              onClick={handleFormSubmit}
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

      {/* Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'rgba(15, 35, 65, 0.30)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative z-10 w-full max-w-[22rem] sm:max-w-[28rem] rounded-[22px] border border-white/90 bg-white/40 backdrop-blur-2xl px-6 sm:px-9 py-8 sm:py-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(10,39,69,0.25)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#22C55E] flex items-center justify-center mb-5 shadow-[0_8px_20px_rgba(34,197,94,0.35)]">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-current stroke-[3.5] fill-none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#0A2745] mb-2 tracking-tight">
              You have successfully submitted your documents
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 font-normal mb-8 leading-relaxed">
              Please kindly wait for the results
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full max-w-[180px] py-2.5 sm:py-3 rounded-xl text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #1B5198 0%, #2A6DC2 100%)',
                color: '#FFFFFF',
              }}
              type="button"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}
