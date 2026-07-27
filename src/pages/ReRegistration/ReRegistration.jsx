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

      <div className="relative z-10 flex h-full flex-col overflow-hidden px-6 lg:px-16">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden py-4 lg:flex-row lg:items-start lg:gap-0">
          {isSubmitted ? (
            <div className="min-h-0 w-full">
              <SuccessCard />
            </div>
          ) : (
            <>
              <div className="min-h-0 lg:flex-[1.4]">
                <ReRegistrationForm onSubmitSuccess={() => setIsSubmitted(true)} />
              </div>
              <div className="min-h-0 lg:flex-1 lg:mr-30">
                <ContactPersonCard />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}