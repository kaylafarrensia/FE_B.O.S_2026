import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import Overview from './pages/Admin/Overview.jsx'
import AdminJapres from './pages/Admin/Japres.jsx'
import User from './pages/Admin/Users.jsx'
import Documents from './pages/Admin/Documents.jsx'
import AdminPayment from './pages/Admin/Payment.jsx'
import Subscription from './pages/Admin/Subscription.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Schedule from './pages/Dashboard/Schedule.jsx'
import Japres from './pages/Dashboard/Japres.jsx'
import Profile from './pages/Dashboard/Profile.jsx'
import Payment from './pages/Payment/Payment.jsx'
import PaymentSchedule from './pages/Payment/Schedule.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<User />} />
        <Route path="documents" element={<Documents />} />
        <Route path="payment" element={<AdminPayment />} />
        <Route path="japres" element={<AdminJapres />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
      
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="schedule" element={<Schedule />} />
        <Route path="japres" element={<Japres />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/payment" element={<Payment />}>
        <Route path="schedule" element={<PaymentSchedule />} />
      </Route>
    </Routes>
  )
}

export default App
