import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Schedule from './pages/Dashboard/Schedule.jsx'
import Japres from './pages/Dashboard/Japres.jsx'
import Profile from './pages/Dashboard/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="schedule" element={<Schedule />} />
        <Route path="japres" element={<Japres />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
