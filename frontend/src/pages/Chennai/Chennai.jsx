import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Chennai = () => {
    const [ngoName, setNgoName] = useState('')
    const [message, setMessage] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        
        // Check if user is disqualified
        if (userData.isDisqualified === true) {
            navigate('/disqualify')
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

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const correctNgoName = import.meta.env.VITE_CHENNAI_NGO_NAME
        
        // Normalize both strings: lowercase and remove all spaces
        const normalizedCorrect = correctNgoName.toLowerCase().replace(/\s+/g, '')
        const normalizedEntered = ngoName.trim().toLowerCase().replace(/\s+/g, '')

        if (normalizedEntered === normalizedCorrect) {
            setMessage('✓ PRIMARY FINANCIAL COVER ENTITY IDENTIFIED')
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}')
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                const response = await axios.post(`${apiUrl}/game/update-progress`, {
                    userId: userData.userId,
                    city: 'Chennai'
                })
                if (response.data.success) {
                    setTimeout(() => navigate('/jammu/backstory'), 1500)
                }
            } catch (error) {
                console.error('Error:', error)
                setMessage('Error updating progress')
                setTimeout(() => setMessage(''), 3000)
            }
        } else {
            setMessage('❌ INCORRECT ENTITY - Review Documents')
            setTimeout(() => setMessage(''), 3000)
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            <div className="w-4/5 h-full relative bg-gradient-to-br from-gray-950 via-neutral-950 to-black p-12 overflow-auto">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(75,85,99,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(75,85,99,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Subtle radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gray-700/3 rounded-full blur-[120px]"></div>
                
                <div className="relative max-w-5xl mx-auto text-white space-y-10">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-gray-950/95 to-neutral-900/95 backdrop-blur-sm border border-gray-800/60 rounded-xl p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
                            <div>
                                <p className="text-xs tracking-[0.3em] text-gray-500 font-semibold mb-2 uppercase">Intelligence Report</p>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                                    Southern Region Intelligence Cluster
                                </h1>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="grid gap-6">
                        {/* Key Points */}
                        <div className="bg-neutral-950/70 backdrop-blur-sm border border-gray-800/40 rounded-xl p-8 shadow-xl">
                            <div className="space-y-5 text-base leading-relaxed">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-gray-200">Logistics requires funding.</span><br />
                                        <span className="text-gray-500">Funding leaves trails.</span>
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-300">
                                        A cluster of charitable transfers has been flagged across the southern region.
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-gray-200">Individually compliant.</span><br />
                                        <span className="text-gray-500">Structurally aligned.</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-800/40">
                                <div className="bg-gradient-to-r from-amber-950/20 to-yellow-950/20 border border-amber-900/30 rounded-lg p-4">
                                    <p className="text-amber-600 font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Financial routing may conceal operational assets.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Documents Section */}
                        <div className="bg-gradient-to-br from-neutral-950/90 to-gray-950/90 backdrop-blur-sm border border-gray-800/40 rounded-xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-5">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg font-bold text-gray-400">Documents Recovered</p>
                            </div>
                            <ul className="space-y-3">
                                {['Financial Ledger', 'Vendor Supply Summary', 'Internal Email Extracts'].map((doc, idx) => (
                                    <li key={idx} className="flex items-center gap-3 bg-neutral-900/50 border border-gray-800/30 rounded-lg px-4 py-3 hover:border-gray-700/50 transition-colors">
                                        <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-500 font-mono text-sm">
                                            {idx + 1}
                                        </div>
                                        <span className="text-gray-300">{doc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Warning Box */}
                        <div className="bg-gradient-to-br from-red-950/30 to-red-900/30 backdrop-blur-sm border border-red-950/50 rounded-xl p-6 shadow-xl">
                            <div className="flex items-start gap-4">
                                <svg className="w-6 h-6 text-red-700 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-red-700 font-bold mb-2 uppercase text-sm tracking-wider">Critical Advisory</p>
                                    <p className="text-red-800/90 leading-relaxed">
                                        Correlate across sources.<br />
                                        Do not rely on a single document.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-1/5 h-full bg-[#0b0f1a] text-white flex flex-col border-l border-gray-800 overflow-y-auto">
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

                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-blue-400 font-semibold mb-3">MISSION BRIEF</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Investigate recovered documents to identify the <span className="text-yellow-400 font-semibold">primary financial cover entity</span> supporting the operation.
                    </p>
                </div>

                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-purple-400 font-semibold mb-3">CURRENT TASK</p>
                    <div className="bg-[#121826] p-4 rounded-lg border border-purple-500/30">
                        <p className="text-base font-semibold text-white">🔍 Financial Investigation</p>
                        <p className="text-xs text-gray-400 mt-1">Cross-reference all documents to identify the NGO.</p>
                    </div>
                </div>

                <div className="px-6 py-6 flex-1 bg-[#0b0f1a] border-t border-gray-800">
                    <div className="mb-5">
                        <p className="text-[11px] tracking-widest text-cyan-400 font-semibold mb-1">ENTER PRIMARY FINANCIAL</p>
                        <p className="text-[11px] tracking-widest text-cyan-400 font-semibold">COVER ENTITY</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-2">NGO Name:</label>
                            <input
                                type="text"
                                value={ngoName}
                                onChange={(e) => setNgoName(e.target.value)}
                                className="w-full px-3 py-3 bg-[#0b0f1a] border border-gray-700 rounded-lg text-sm text-white transition focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="Enter NGO Name"
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!ngoName.trim()}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            VERIFY ENTITY
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-4 text-center text-xs font-semibold ${message.includes("INCORRECT") || message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chennai
