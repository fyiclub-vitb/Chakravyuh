import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<div className="text-white p-8">Register page coming soon.</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
