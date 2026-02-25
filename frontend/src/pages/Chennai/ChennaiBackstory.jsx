import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ChennaiBackstory = () => {
  const [showButton, setShowButton] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    navigate('/chennai/game')
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-4">CHENNAI</h1>
          <p className="text-2xl text-gray-300">Gateway to South India</p>
        </div>
      </div>
      
      {showButton && (
        <button
          onClick={handleNext}
          className="absolute bottom-8 right-8 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg"
        >
          Next
        </button>
      )}
    </div>
  )
}

export default ChennaiBackstory