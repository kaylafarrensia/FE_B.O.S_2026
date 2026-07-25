import { useState } from 'react'
import Navbar from '../../components/ReRegistration/Navbar'
import ReRegistrationForm from '../../components/ReRegistration/RegistrationForm'
import ContactPersonCard from '../../components/ReRegistration/ContactPersonCard'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'

export default function ReRegistration() {
  const [activeTab, setActiveTab] = useState('reregist')

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-50 to-blue-100">
      <PerspectiveGrid className="pointer-events-none absolute inset-x-0 -top-40 sm:-top-60 md:h-320 h-200" />

      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 flex-col gap-4 overflow-hidden px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-h-0 lg:flex-[1.4]">
            <ReRegistrationForm />
          </div>
          <div className="min-h-0 lg:flex-1">
            <ContactPersonCard />
          </div>
        </main>
      </div>
    </div>
  )
}