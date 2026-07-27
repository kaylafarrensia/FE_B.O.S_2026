import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/ReRegistration/Navbar'
import ReRegistrationForm from '../../components/ReRegistration/RegistrationForm'
import ContactPersonCard from '../../components/ReRegistration/ContactPersonCard'
import PerspectiveGrid from '../../components/ComingSoon/PerspectiveGrid'

export default function ReRegistration() {
  const [activeTab, setActiveTab] = useState('reregist')
  const location = useLocation()
  const isInsideDashboard = location.pathname.startsWith('/dashboard')

  const formContent = (
    <main className="w-full px-6 sm:px-[10vw] py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-center flex-1 overflow-y-auto">
      <div className="w-full lg:flex-[1.3] min-w-0">
        <ReRegistrationForm />
      </div>
      <div className="w-full lg:flex-1 min-w-0">
        <ContactPersonCard />
      </div>
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
        {formContent}
      </div>
    </div>
  )
}