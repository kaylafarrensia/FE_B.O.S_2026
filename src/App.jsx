import { Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon/ComingSoon.jsx'
import Home from './pages/Home/Home.jsx'

function App() {
  return (
    <Routes>
      <Route path="/comingsoon" element={<ComingSoon />} />
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<Home />} /> */}
      {/* nanti tambah route lain di sini, misal: */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App
