import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import chennaiStoryImage from '../../assets/Chennai_story.png'

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
        <div className="relative w-screen h-screen overflow-hidden">
            <img src={chennaiStoryImage} alt="Chennai Story" className="w-full h-full object-cover" />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-9xl font-bold text-white tracking-wider" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}>
                    CHENNAI
                </h1>
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