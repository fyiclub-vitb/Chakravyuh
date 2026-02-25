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
            <div className="w-4/5 h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-12">
                <div className="max-w-4xl text-white space-y-8">
                    <div className="border-l-4 border-cyan-500 pl-6">
                        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Southern Region Intelligence Cluster</h1>
                    </div>
                    
                    <div className="space-y-4 text-lg leading-relaxed">
                        <p className="text-gray-300">
                            Logistics requires funding.<br />
                            Funding leaves trails.
                        </p>
                        
                        <p className="text-gray-300">
                            A cluster of charitable transfers has been flagged across the southern region.
                        </p>
                        
                        <p className="text-gray-300">
                            Individually compliant.<br />
                            Structurally aligned.
                        </p>
                        
                        <p className="text-yellow-300 font-semibold">
                            Financial routing may conceal operational assets.
                        </p>
                        
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-8">
                            <p className="text-cyan-400 font-semibold mb-3">Multiple documents recovered:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center">
                                    <span className="text-cyan-500 mr-3">–</span> Financial Ledger
                                </li>
                                <li className="flex items-center">
                                    <span className="text-cyan-500 mr-3">–</span> Vendor Supply Summary
                                </li>
                                <li className="flex items-center">
                                    <span className="text-cyan-500 mr-3">–</span> Internal Email Extracts
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mt-6">
                            <p className="text-red-400 font-semibold">
                                Correlate across sources.<br />
                                Do not rely on a single document.
                            </p>
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
