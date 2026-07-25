import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import ReRegistration from './pages/ReRegistration/ReRegistration.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/re-registration" element={<ReRegistration />} />
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App
