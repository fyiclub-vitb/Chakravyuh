import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import puneStoryImage from '../../assets/Pune_story.png'

const PuneBackstory = () => {
    const [showButton, setShowButton] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)
    const [displayedText, setDisplayedText] = useState('')
    const navigate = useNavigate()

    const fullText = `Distribution Pattern Confirmed: SPLIT
Cargo was divided across multiple deployment nodes.
Decentralized movement increases synchronization complexity.
Synchronization tests were conducted before distribution.
Multiple configurations failed.
One configuration succeeded.
That configuration defines the activation delay.
ATTENTION: Few Devices Found in Bangalore warehouse`

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!showTerminal) return

        let index = 0
        const typingTimer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayedText(fullText.slice(0, index + 1))
                index++
            } else {
                clearInterval(typingTimer)
            }
        }, 50)

        return () => clearInterval(typingTimer)
    }, [showTerminal])

    useEffect(() => {
        if (!showTerminal) return

        const gameStartTimer = setTimeout(() => {
            navigate('/pune/game')
        }, 28000)

        return () => clearTimeout(gameStartTimer)
    }, [showTerminal, navigate])

    const handleNext = () => {
        setShowTerminal(true)
    }

    if (showTerminal) {
        return (
            <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
                <div className="bg-black p-12 rounded-lg font-mono text-3xl max-w-4xl">
                    <div className="text-green-500 whitespace-pre-wrap">
                        $ spy_intel: {displayedText}
                        {displayedText.length < fullText.length && <span className="animate-pulse">█</span>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <img src={puneStoryImage} alt="Pune Story" className="w-full h-full object-cover" />

            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-9xl font-bold text-white tracking-wider" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}>
                    PUNE
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

export default PuneBackstory