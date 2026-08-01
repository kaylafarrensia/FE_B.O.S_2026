import { Routes, Route, Navigate } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Home from './pages/Home/Home.jsx'
import ReRegistration from './pages/ReRegistration/ReRegistration.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Schedule from './pages/Dashboard/Schedule.jsx'
import Registration from './pages/Dashboard/Registration.jsx'
import Japres from './pages/Dashboard/Japres.jsx'
import Profile from './pages/Dashboard/Profile.jsx'
import Confirmation from './pages/Dashboard/Confirmation.jsx'
import SignIn from './pages/SignIn/SignIn.jsx'
import SignUp from './pages/SignUp/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx'
import CustomCursor from './components/ui/CustomCursor.jsx'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import AdminSignIn from './pages/Admin/SignIn.jsx'
import Overview from './pages/Admin/Overview.jsx'
import AdminJapres from './pages/Admin/Japres.jsx'
import User from './pages/Admin/Users.jsx'
import Documents from './pages/Admin/Documents.jsx'
import Payment from './pages/Admin/Payment.jsx'
import Links from './pages/Admin/Links.jsx'
import Subscription from './pages/Admin/Subscription.jsx'

function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
      {/* User / Landing routes */}
      <Route path="/comingsoon" element={<ComingSoon />} />
      <Route path="/" element={<Home />} />
      <Route path="/re-registration" element={<Navigate to="/dashboard/re-registration" replace />} />
      <Route path="/registration" element={<Navigate to="/dashboard/registration" replace />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="schedule" element={<Schedule />} />
        <Route path="registration" element={<Registration />} />
        <Route path="re-registration" element={<ReRegistration />} />
        <Route path="japres" element={<Japres />} />
        <Route path="profile" element={<Profile />} />
        <Route path="confirm" element={<Confirmation />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/admin/signin" element={<AdminSignIn />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<User />} />
        <Route path="documents" element={<Documents />} />
        <Route path="payment" element={<Payment />} />
        <Route path="japres" element={<AdminJapres />} />
        <Route path="links" element={<Links />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
