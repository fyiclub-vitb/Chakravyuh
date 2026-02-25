import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import bangaloreImage from '../../assets/Bangalore_story.png'

const BangaloreBackstory = () => {
    const [showButton, setShowButton] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const handleNext = () => {
        navigate('/bangalore/game')
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <img 
                src={bangaloreImage} 
                alt="Bangalore" 
                className="w-full h-full object-cover"
            />
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

export default BangaloreBackstory
