import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Schedule from './pages/Dashboard/Schedule.jsx'
import Japres from './pages/Dashboard/Japres.jsx'
import Profile from './pages/Dashboard/Profile.jsx'
import SignIn from './pages/SignIn/SignIn.jsx'
import SignUp from './pages/SignUp/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="schedule" element={<Schedule />} />
        <Route path="japres" element={<Japres />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App
