import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import MumbaiBackstory from './pages/Mumbai/MumbaiBackstory'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mumbai/backstory" element={<MumbaiBackstory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
