import { useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import Navbar from '../../components/ReRegistration/Navbar'
import ReRegistrationForm from '../../components/ReRegistration/ReRegistrationForm'
import ContactPersonCard from '../../components/ReRegistration/ContactPersonCard'
import SuccessCard from '../../components/ReRegistration/SuccessCard'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'

export default function ReRegistration() {
  const [activeTab, setActiveTab] = useState('reregist')
  const [localSubmitted, setLocalSubmitted] = useState(false)
  const location = useLocation()
  const isInsideDashboard = location.pathname.startsWith('/dashboard')

  const outletContext = useOutletContext() || {}
  const { 
    reRegistrationInputs, 
    setReRegistrationInputs,
    reRegistrationSubmitted,
    setReRegistrationSubmitted
  } = outletContext

  const isSubmitted = reRegistrationSubmitted !== undefined ? reRegistrationSubmitted : localSubmitted
  const setIsSubmitted = setReRegistrationSubmitted !== undefined ? setReRegistrationSubmitted : setLocalSubmitted

  const formContent = (
    <main className="w-full px-6 sm:px-[10vw] pt-3 pb-8 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-start lg:justify-center flex-1 overflow-y-auto">
      {isSubmitted ? (
        <div className="w-full max-w-4xl mx-auto">
          <SuccessCard />
        </div>
      ) : (
        <>
          <div className="w-full lg:flex-[1.3] min-w-0">
            <ReRegistrationForm
              onSubmitSuccess={() => setIsSubmitted(true)}
              reRegistrationInputs={reRegistrationInputs}
              setReRegistrationInputs={setReRegistrationInputs}
            />
          </div>
          <div className="w-full lg:flex-1 min-w-0">
            <ContactPersonCard />
          </div>
        </>
      )}
    </main>
  )

  if (isInsideDashboard) {
    return formContent
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-50 to-blue-100">
      <PerspectiveGrid className="pointer-events-none absolute inset-x-0 -top-40 sm:-top-60 md:h-320 h-200" />

      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden px-6 md:px-10 lg:px-16">
          <main className="flex flex-1 min-h-0 flex-col items-center justify-start gap-4 overflow-y-auto pt-4 pb-2 md:gap-8 md:pt-6 md:pb-3 lg:flex-row lg:items-start lg:justify-start lg:gap-0 lg:overflow-hidden lg:py-4">
            {isSubmitted ? (
              <div className="w-full max-w-[520px] md:max-w-3xl lg:min-h-0 lg:max-w-none">
                <SuccessCard />
              </div>
            ) : (
              <>
                <div className="w-full max-w-[520px] md:max-w-3xl lg:min-h-0 lg:max-w-none lg:flex-[1.4]">
                  <ReRegistrationForm
                    onSubmitSuccess={() => setIsSubmitted(true)}
                    reRegistrationInputs={reRegistrationInputs}
                    setReRegistrationInputs={setReRegistrationInputs}
                  />
                </div>
                <div className="w-full max-w-[520px] md:max-w-3xl lg:min-h-0 lg:max-w-none lg:mr-30 lg:flex-1">
                  <ContactPersonCard />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}