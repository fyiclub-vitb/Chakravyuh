import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import delhiStoryImage from '../../assets/delhi_story.png'

const DelhiBackstory = () => {
    const [showButton, setShowButton] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)
    const [displayedText, setDisplayedText] = useState('')
    const navigate = useNavigate()

    const fullText = 'With peripheral movements accounted for, central traffic patterns are now under review.\nThe final operational layer may be closer than anticipated.'

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
            navigate('/delhi/game')
        }, 10000)

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
            <img
                src={delhiStoryImage}
                alt="Delhi"
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

export default DelhiBackstory