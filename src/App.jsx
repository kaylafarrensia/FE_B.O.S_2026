import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Overview from './pages/Admin/Overview.jsx'
import Japres from './pages/Admin/Japres.jsx'
import User from './pages/Admin/Users.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/admin" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<User />} />
        <Route path="japres" element={<Japres />} />
      </Route>
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App
