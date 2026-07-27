import { useState } from 'react'
import Navbar from '../../components/ReRegistration/Navbar'
import ReRegistrationForm from '../../components/ReRegistration/ReRegistrationForm'
import ContactPersonCard from '../../components/ReRegistration/ContactPersonCard'
import SuccessCard from '../../components/ReRegistration/SuccessCard'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'

export default function ReRegistration() {
  const [activeTab, setActiveTab] = useState('reregist')
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-50 to-blue-100">
      <PerspectiveGrid className="pointer-events-none absolute inset-x-0 -top-40 sm:-top-60 md:h-320 h-200" />

      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden px-6 md:px-10 lg:px-16">
          <main className="flex flex-1 min-h-0 flex-col items-center justify-center gap-2 overflow-y-auto py-2 md:gap-3 md:py-3 lg:flex-row lg:items-start lg:justify-start lg:gap-0 lg:overflow-hidden lg:py-4">
            {isSubmitted ? (
              <div className="w-full max-w-[520px] lg:min-h-0 lg:max-w-none">
                <SuccessCard />
              </div>
            ) : (
              <>
                <div className="w-full max-w-[520px] lg:min-h-0 lg:max-w-none lg:flex-[1.4]">
                  <ReRegistrationForm onSubmitSuccess={() => setIsSubmitted(true)} />
                </div>
                <div className="w-full max-w-[520px] lg:min-h-0 lg:max-w-none lg:mr-30 lg:flex-1">
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