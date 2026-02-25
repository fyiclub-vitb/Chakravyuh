import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import fyiLogo from '../../assets/fyilogo.png'

const Delhi = () => {
    const [city, setCity] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [nodes, setNodes] = useState('')
    const [message, setMessage] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)
    const [terminalLines, setTerminalLines] = useState([])
    const [showCompletion, setShowCompletion] = useState(false)
    const [showFYILogo, setShowFYILogo] = useState(false)
    const navigate = useNavigate()

    const allTerminalLines = [
        'Shipment entered.',
        'Devices divided.',
        'Funding masked.',
        'Signals distorted.',
        '',
        'But patterns repeat.',
        '',
        '"This was not a treasure hunt.',
        'This was intelligence."'
    ]

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        
        // Check if user is disqualified
        if (userData.isDisqualified === true) {
            navigate('/disqualify')
            return
        }
        
        // Check if user has already submitted answers
        if (userData.isSubmitted === true && userData.isDisqualified === false) {
            setShowCompletion(true)
            return
        }

        const timeStart = userData.timeStart ? new Date(userData.timeStart) : new Date()

        const calculateTimeRemaining = () => {
            const currentTime = new Date()
            const elapsedMilliseconds = currentTime - new Date(timeStart)
            const totalGameTime = 90 * 60 * 1000
            const remaining = totalGameTime - elapsedMilliseconds
            if (remaining <= 0) return 0
            return Math.floor(remaining / 1000)
        }

        setTimeRemaining(calculateTimeRemaining())
        const interval = setInterval(() => {
            const remaining = calculateTimeRemaining()
            setTimeRemaining(remaining)
            if (remaining <= 0) clearInterval(interval)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleTimeOut = async () => {
            if (timeRemaining === 0) {
                try {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                    
                    await axios.post(`${apiUrl}/game/disqualify`, {
                        userId: userData.userId
                    })
                    
                    userData.isDisqualified = true
                    localStorage.setItem('userData', JSON.stringify(userData))
                    
                    navigate('/disqualify')
                } catch (error) {
                    console.error('Error disqualifying user:', error)
                }
            }
        }
        handleTimeOut()
    }, [timeRemaining, navigate])

    useEffect(() => {
        if (!showTerminal || terminalLines.length >= allTerminalLines.length) return

        const timer = setTimeout(() => {
            setTerminalLines(prev => [...prev, allTerminalLines[prev.length]])
        }, 800)

        return () => clearTimeout(timer)
    }, [showTerminal, terminalLines])

    useEffect(() => {
        if (terminalLines.length === allTerminalLines.length) {
            const timer = setTimeout(() => {
                setShowCompletion(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [terminalLines])

    useEffect(() => {
        if (showCompletion) {
            const timer = setTimeout(() => {
                setShowFYILogo(true)
            }, 10000)
            return () => clearTimeout(timer)
        }
    }, [showCompletion])

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isProcessing) return
        setIsProcessing(true)
        
        // Normalize inputs
        const normalizedCity = city.trim().toLowerCase()
        
        // Normalize date: remove ordinal suffixes (st, nd, rd, th) and spaces
        const normalizedDate = date.trim().toLowerCase()
            .replace(/(\d+)(st|nd|rd|th)/g, '$1') // Remove ordinal suffixes
            .replace(/\s+/g, '') // Remove all spaces
        
        // Normalize time: remove spaces, colons, and convert to lowercase
        const normalizedTime = time.trim().toLowerCase()
            .replace(/[\s:]+/g, '') // Remove spaces and colons
        
        const normalizedNodes = nodes.trim()

        // Get correct values from env
        const correctCity = import.meta.env.VITE_DELHI_CITY.toLowerCase()
        const correctDate = import.meta.env.VITE_DELHI_DATE.toLowerCase()
            .replace(/(\d+)(st|nd|rd|th)/g, '$1')
            .replace(/\s+/g, '')
        const correctTime = import.meta.env.VITE_DELHI_TIME.toLowerCase()
            .replace(/[\s:]+/g, '')
        const correctNodes = import.meta.env.VITE_DELHI_PLACES

        if (normalizedCity === correctCity && 
            normalizedDate === correctDate && 
            normalizedTime === correctTime && 
            normalizedNodes === correctNodes) {
            
            setMessage('✓ Pattern Identified')
            
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}')
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                
                // Submit final answers
                const submitResponse = await axios.post(`${apiUrl}/game/submit-answers`, {
                    userId: userData.userId,
                    city: city.trim(),
                    date: date.trim(),
                    time: time.trim(),
                    places: nodes.trim()
                })

                if (submitResponse.data.success) {
                    // Update progress for Delhi
                    const progressResponse = await axios.post(`${apiUrl}/game/update-progress`, {
                        userId: userData.userId,
                        city: 'Delhi'
                    })
                    
                    if (progressResponse.data.success) {
                        // Update localStorage with submission status
                        userData.isSubmitted = true
                        localStorage.setItem('userData', JSON.stringify(userData))
                        
                        setTimeout(() => {
                            setShowTerminal(true)
                        }, 1500)
                    }
                }
            } catch (error) {
                console.error('Error:', error)
                setMessage('Error updating progress')
                setIsProcessing(false)
            }
        } else {
            setMessage('✗ Incorrect Assessment - Disqualified')
            
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}')
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                
                await axios.post(`${apiUrl}/game/disqualify`, {
                    userId: userData.userId
                })
                
                // Update localStorage with disqualification status
                userData.isDisqualified = true
                localStorage.setItem('userData', JSON.stringify(userData))
                
                setTimeout(() => {
                    navigate('/disqualify')
                }, 1500)
            } catch (error) {
                console.error('Error:', error)
                setMessage('Error processing request')
                setIsProcessing(false)
            }
        }
    }

    if (showFYILogo) {
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <img 
                        src={fyiLogo} 
                        alt="FYI Club Logo" 
                        className="w-96 h-96 object-contain mx-auto "
                    />
                    <p className="text-4xl text-white font-bold mt-8">FYI Club</p>
                </div>
            </div>
        )
    }

    if (showCompletion) {
        return (
            <div className="w-screen h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex items-center justify-center">
                <div className="text-center px-12">
                    <div className="mb-8">
                        <svg className="w-32 h-32 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-4">Mission Complete</h1>
                    <p className="text-2xl text-gray-300 mb-8">All intelligence gathered successfully</p>
                    <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 max-w-2xl mx-auto">
                        <p className="text-3xl text-cyan-400 font-semibold mb-4">Look at leaderboard to know the results</p>
                        <p className="text-gray-400 mb-6">Your performance has been recorded and ranked</p>
                        
                        <div className="mt-8 pt-6 border-t border-cyan-500/20">
                            <p className="text-white text-lg font-semibold mb-2">This event was organised by</p>
                            <p className="text-cyan-400 text-2xl font-bold">FYI Club</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showTerminal) {
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="max-w-4xl px-12">
                    <div className="font-mono text-2xl space-y-4">
                        {terminalLines.map((line, index) => (
                            <div key={index} className={`${
                                line.includes('"') ? 'text-cyan-400 text-3xl font-bold' :
                                line.includes('patterns') ? 'text-gray-400' :
                                line === '' ? 'h-4' :
                                'text-green-400'
                            }`}>
                                {line}
                                {index === terminalLines.length - 1 && <span className="animate-pulse">█</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            {/* Investigation Panel - 80% */}
            <div className="w-[80%] h-full bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-8">
                    <div className="max-w-3xl w-full my-8">
                        <div className="mb-10 text-center">
                            {/* <svg className="w-24 h-24 mx-auto text-yellow-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg> */}
                            <h1 className="text-6xl font-bold text-white mb-5">Public Events Investigation</h1>
                            <div className="h-1 w-64 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 backdrop-blur-sm">
                            <div className="mb-6">
                                <div className="inline-block bg-yellow-900/30 px-5 py-2 rounded-lg border border-yellow-700/50">
                                    <p className="text-yellow-400 text-lg font-semibold">⚠ INTELLIGENCE BRIEFING</p>
                                </div>
                            </div>

                            <div className="space-y-5 text-gray-300 text-xl leading-relaxed">
                                <p>
                                    There are <span className="text-white font-bold">many public events</span> going on.
                                </p>
                                <p>
                                    A <span className="text-cyan-400 font-bold">list of events</span> has been <span className="text-cyan-400 font-bold">shared with you</span>.
                                </p>
                                <p className="text-2xl text-red-400 font-bold mt-8">
                                    Investigate it for any clues.
                                </p>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-700">
                                <p className="text-gray-500 text-base italic">
                                    Submit your findings using the control panel →
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Panel - 20% */}
            <div className="w-[20%] h-full bg-[#0b0f1a] text-white flex flex-col border-l border-gray-800 overflow-y-auto">
                {/* Timer */}
                <div className="px-6 py-6 border-b border-gray-800 bg-black">
                    <p className="text-[11px] tracking-widest text-red-400 font-semibold mb-2">MISSION TIMER</p>
                    <div className={`text-4xl font-mono font-bold ${timeRemaining < 600 ? "text-red-500 animate-pulse" : "text-green-400"}`}>
                        {formatTime(timeRemaining)}
                    </div>
                    <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${timeRemaining < 600 ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${(timeRemaining / (90 * 60)) * 100}%` }} />
                    </div>
                </div>

                {/* Current Task */}
                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-purple-400 font-semibold mb-3">CURRENT TASK</p>
                    <div className="bg-[#121826] p-4 rounded-lg border border-purple-500/30">
                        <p className="text-base font-semibold text-white mb-2">Pattern Analysis</p>
                        <p className="text-xs text-gray-400">
                            Identify city, date, time, and number of locations with matching patterns
                        </p>
                    </div>
                </div>

                {/* Input Form */}
                <div className="px-6 py-6 mt-auto bg-[#0b0f1a] border-t border-gray-800">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[11px] tracking-widest text-cyan-400 font-semibold">SUBMIT FINDINGS</p>
                        <span className="text-[10px] text-gray-500 tracking-widest">ANALYSIS</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={isProcessing}
                                placeholder="Enter city"
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Date</label>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={isProcessing}
                                placeholder="e.g., 15th August or 15 August"
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Time</label>
                            <input
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                disabled={isProcessing}
                                placeholder="e.g., 11 PM or 11:00 PM"
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Locations</label>
                            <input
                                type="text"
                                value={nodes}
                                onChange={(e) => setNodes(e.target.value)}
                                disabled={isProcessing}
                                placeholder="Number of locations"
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!city || !date || !time || !nodes || isProcessing}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            {isProcessing ? 'PROCESSING...' : 'SUBMIT ANALYSIS'}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-4 text-center text-sm font-semibold ${
                            message.includes('✗') ? 'text-red-400' : 'text-green-400'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Delhi