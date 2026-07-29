import { Routes, Route, Navigate } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import ReRegistration from './pages/ReRegistration/ReRegistration.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Schedule from './pages/Dashboard/Schedule.jsx'
import Registration from './pages/Dashboard/Registration.jsx'
import Japres from './pages/Dashboard/Japres.jsx'
import Profile from './pages/Dashboard/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/re-registration" element={<Navigate to="/dashboard/re-registration" replace />} />
      <Route path="/registration" element={<Navigate to="/dashboard/registration" replace />} />
      
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="schedule" element={<Schedule />} />
        <Route path="registration" element={<Registration />} />
        <Route path="re-registration" element={<ReRegistration />} />
        <Route path="japres" element={<Japres />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
