import { useState } from 'react'
import {
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ReRegistration/Card'
import ContactPersonCard from '../../components/ReRegistration/ContactPersonCard'

const TODAY_GLASS_STYLE = {
  '--glass-from': 'rgba(10, 39, 69, 0.1)',
  '--glass-to': 'rgba(255, 255, 255, 0)',
}

const DUE_DATE_GLASS_STYLE = {
  '--glass-from': 'rgba(220, 38, 38, 0.9)',
  '--glass-to': 'rgba(239, 68, 68, 0.9)',
}

export default function Registration() {
  const navigate = useNavigate()
  const location = useLocation()
  const context = useOutletContext()
  const setUserStatus = context?.setUserStatus

  const outcome = new URLSearchParams(location.search).get('outcome') || 'initial'
  const [binusianCard, setBinusianCard] = useState(null)
  const [memberLetter, setMemberLetter] = useState(null)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/docs/MemberLetter_Template.docx'
    link.download = 'MemberLetter_Template.docx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!binusianCard || !memberLetter) {
      alert('Please upload both files before submitting.')
      return
    }
    navigate('?outcome=pending')
  }

  const handleNavigateToReRegist = () => {
    if (setUserStatus) {
      setUserStatus('done_launching')
    }
    navigate('/dashboard/re-registration')
  }

  const handleBinusianCardChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Only JPG and PNG files are allowed.')
      e.target.value = ''
      setBinusianCard(null)
      return
    }
    setBinusianCard(file)
  }

  const handleMemberLetterChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate type
    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
    ]
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Only JPG, PNG, and PDF files are allowed.')
      e.target.value = ''
      setMemberLetter(null)
      return
    }

    // Validate size (10 MB limit)
    const maxSizeBytes = 10 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert('File size exceeds the 10 MB limit. Please select a smaller file.')
      e.target.value = ''
      setMemberLetter(null)
      return
    }

    setMemberLetter(file)
  }

  const renderInitialForm = () => (
    <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-center flex-1">
      {/* Left Column: Registration Form */}
      <div className="w-full lg:flex-[1.3] min-w-0">
        <Card className="w-full">
          <h2 className="text-xl font-bold sm:text-3xl text-[#0A2745] font-poppins">
            Registration <span className="text-[#2474C0]">Form</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#0A2745]/70 font-poppins">
                Binusian Card
              </label>
              <div className="relative">
                <label className="w-full flex items-center justify-between px-4 py-3.5 text-xs sm:text-sm rounded-lg border border-[#99C4F4] bg-[#EBF5FF]/50 text-slate-400 font-medium cursor-pointer hover:bg-[#EBF5FF]/70 transition-all">
                  <span
                    className={
                      binusianCard ? 'text-slate-700' : 'text-slate-400'
                    }
                  >
                    {binusianCard
                      ? binusianCard.name
                      : 'Upload your Binusian Card (.jpg or .png)'}
                  </span>
                  <Upload size={18} className="text-slate-500" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleBinusianCardChange}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-semibold text-[#0A2745] font-poppins">
                  Member Letter
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Download the Member Letter template below, then fill in the
                  required information by typing it in and including your
                  signature, either handwritten or digital.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full bg-[#1E5FA8] hover:bg-[#12376B] text-white py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={18} /> Download Template
              </button>

              <div>
                <label className="mb-2 block text-xs sm:text-xs font-semibold text-[#0A2745]/70 font-poppins">
                  Upload the completed Member Letter you have filled out.
                </label>
                <label className="w-full flex items-center justify-between px-4 py-3.5 text-xs sm:text-sm rounded-lg border border-[#99C4F4] bg-[#EBF5FF]/50 text-slate-400 font-medium cursor-pointer hover:bg-[#EBF5FF]/70 transition-all">
                  <span
                    className={
                      memberLetter ? 'text-slate-700' : 'text-slate-400'
                    }
                  >
                    {memberLetter ? memberLetter.name : 'Upload Member Letter'}
                  </span>
                  <Upload size={18} className="text-slate-500" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    className="hidden"
                    onChange={handleMemberLetterChange}
                    required
                  />
                </label>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500">
                  <AlertTriangle
                    size={14}
                    className="text-slate-400 shrink-0"
                  />
                  <span>
                    The Member Letter must be in pdf format and must not exceed
                    10 MB
                  </span>
                </div>
              </div>
            </div>

            <div className="self-center mt-4">
              <button
                type="submit"
                className="bg-[#1E5FA8] hover:bg-[#12376B] text-white px-10 py-2.5 rounded-lg text-sm sm:text-base font-semibold shadow-md transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Right Column: Calendar + Contact Person */}
      <div className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-8">
        <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-5 border-b pb-2">
            <h2 className="text-2xl font-bold w-fit text-[#0A2745] font-poppins">
              September 2026
            </h2>
            <div className="flex space-x-2">
              <button className="p-1 rounded-full hover:bg-slate-100 text-[#0A2745] cursor-pointer">
                <ChevronLeft />
              </button>
              <button className="p-1 rounded-full hover:bg-slate-100 text-[#0A2745] cursor-pointer">
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 text-center justify-items-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div
                key={day}
                className={`w-10 h-8 flex items-center justify-center font-medium text-sm md:text-base text-center ${i === 0 ? 'text-red-500' : 'text-[#0A2745]'}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-2 text-center justify-items-center">
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg text-red-300">30</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg text-gray-300">31</div>
            <div
              className="w-10 h-10 flex items-center justify-center text-center rounded-lg font-semibold glassmorphism text-[#0A2745] cursor-pointer"
              style={TODAY_GLASS_STYLE}
            >
              1
            </div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">2</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">3</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">4</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">5</div>

            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-red-500 font-medium cursor-pointer">6</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">7</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">8</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">9</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">10</div>
            <div
              className="w-10 h-10 flex items-center justify-center text-center rounded-lg font-semibold text-white glassmorphism cursor-pointer"
              style={DUE_DATE_GLASS_STYLE}
            >
              11
            </div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">12</div>

            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-red-500 font-medium cursor-pointer">13</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">14</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">15</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">16</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">17</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">18</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">19</div>

            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-red-500 font-medium cursor-pointer">20</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">21</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">22</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">23</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">24</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">25</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">26</div>

            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-red-500 font-medium cursor-pointer">27</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">28</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">29</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg hover:bg-slate-100/50 text-[#0A2745] font-medium cursor-pointer">30</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg text-slate-300 font-medium">1</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg text-slate-300 font-medium">2</div>
            <div className="w-10 h-10 flex items-center justify-center text-center rounded-lg text-slate-300 font-medium">3</div>
          </div>

          {/* Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-5 text-xs sm:text-sm text-[#0A2745]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md shadow-sm glassmorphism" style={TODAY_GLASS_STYLE} />
              <span className="font-semibold">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md shadow-sm glassmorphism" style={DUE_DATE_GLASS_STYLE} />
              <span className="font-semibold">Due Date Registration</span>
            </div>
          </div>
        </Card>

        <ContactPersonCard />
      </div>
    </div>
  )

  // Outcome 1: Verification Pending with exact design
  const renderPending = () => (
    <Card className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-16 rounded-xl border-white border-[3px] bg-white/40 glassmorphism relative gap-6">
      <div className="relative">
        <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#EBF5FF] text-[#2474C0] border-2 border-white shadow-sm">
          <Clock size={48} className="animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A2745] font-poppins mt-4">
        Your registration is being verified!
      </h2>
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl font-poppins font-medium">
        Thank you for registering to be part of our family! Your registration is<br />
        currently under review and will be verified within 24 hours. Please<br />
        check back periodically for updates on your verification status.
      </p>
    </Card>
  )

  // Outcome 2: Verification Error with contact design
  const renderError = () => (
    <Card className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-16 rounded-xl border-white border-[3px] bg-white/40 glassmorphism relative gap-6">
      <div className="relative">
        <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-100 text-red-500 border-2 border-white shadow-sm">
          <AlertTriangle size={48} />
        </div>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A2745] font-poppins mt-4">
        There was an error verifying your registration!
      </h2>
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl font-poppins font-medium">
        Please contact the person listed below for assistance with your <br />
        registration verification.
      </p>

      <div className="mt-6 flex flex-row items-start gap-4 text-left">
        <img
          src="/icons/ic-cp.svg"
          alt="BNCC Team"
          className="h-[92px] w-auto shrink-0 object-contain self-start mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-bold text-[#0A2745] font-poppins">BNCC</h4>
          <div className="mt-3 flex flex-col gap-2.5 text-xs sm:text-base font-semibold text-[#0A2745]/85">
            <div className="flex items-center gap-3">
              <img
                src="/icons/ic-line.svg"
                alt="LINE"
                className="w-5 h-5 sm:w-7 sm:h-7 shrink-0"
              />
              <span>@yviluo (Yovi Gracia Lo)</span>
            </div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 shrink-0">
                <path
                  d="M12.008.01a11.95 11.95 0 00-10.42 17.846L0 24l6.303-1.654A11.95 11.95 0 1012.008.01z"
                  fill="#0A2745"
                />
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"
                  fill="#FFFFFF"
                />
              </svg>
              <span>085178100246</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  // Outcome 3: Verification Success
  const renderSuccess = () => (
    <Card className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-16 rounded-xl border-white border-[3px] bg-white/40 glassmorphism relative gap-6">
      <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-100 text-green-500 border-2 border-white shadow-sm">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A2745] font-poppins">
        Registration Successful!
      </h2>
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl font-poppins font-medium">
        Thank you for registering and becoming part of our family! Let's move on<br />
        to re-registration.
      </p>

      <button
        onClick={handleNavigateToReRegist}
        className="mt-6 bg-[#1E5FA8] hover:bg-[#12376B] text-white px-8 py-3 rounded-lg text-sm sm:text-base font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
      >
        Re-Registration &rarr;
      </button>
    </Card>
  )

  const isOutcome = outcome !== 'initial'

  return (
    <main
      className={`w-full flex flex-col flex-1 min-h-0 ${
        isOutcome
          ? 'px-6 sm:px-[10vw] pt-6 pb-20'
          : 'px-6 sm:px-[10vw] py-8 overflow-y-auto'
      }`}
    >
      {outcome === 'initial' && renderInitialForm()}
      {outcome === 'pending' && renderPending()}
      {outcome === 'error' && renderError()}
      {outcome === 'success' && renderSuccess()}
    </main>
  )
}
