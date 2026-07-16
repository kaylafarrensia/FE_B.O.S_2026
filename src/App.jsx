import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App