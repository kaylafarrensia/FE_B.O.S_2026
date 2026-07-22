import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Overview from './pages/Admin/Overview.jsx'
import Japres from './pages/Admin/Japres.jsx'
import User from './pages/Admin/Users.jsx'
import Documents from './pages/Admin/Documents.jsx'
import Payment from './pages/Admin/Payment.jsx'
import Subscription from './pages/Admin/Subscription.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/admin" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<User />} />
        <Route path="documents" element={<Documents />} />
        <Route path="payment" element={<Payment />} />
        <Route path="japres" element={<Japres />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App
