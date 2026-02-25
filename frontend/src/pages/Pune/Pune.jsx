import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import puneReportImage from '../../assets/Pune_game.jpeg'

const Pune = () => {
    const [formData, setFormData] = useState({
        deviceId: '',
        frequencyBand: '',
        signalStrength: '',
        delayOffset: ''
    })
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
        
        const correctDeviceId = import.meta.env.VITE_PUNE_DEVICE_ID
        const correctFrequencyBand = import.meta.env.VITE_PUNE_FREQUENCY_BAND
        const correctSignalStrength = import.meta.env.VITE_PUNE_SIGNAL_STRENGTH
        const correctDelayOffset = import.meta.env.VITE_PUNE_DELAY_OFFSET

        if (
            formData.deviceId.trim() === correctDeviceId &&
            formData.frequencyBand.trim() === correctFrequencyBand &&
            formData.signalStrength.trim() === correctSignalStrength &&
            formData.delayOffset.trim() === correctDelayOffset
        ) {
            setMessage('✓ FULL SYNCHRONISATION ACHIEVED')
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}')
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                const response = await axios.post(`${apiUrl}/game/update-progress`, {
                    userId: userData.userId,
                    city: 'Pune'
                })
                if (response.data.success) {
                    setTimeout(() => navigate('/chennai/backstory'), 1500)
                }
            } catch (error) {
                console.error('Error:', error)
                setMessage('Error updating progress')
                setTimeout(() => setMessage(''), 3000)
            }
        } else {
            setMessage('❌ SYNCHRONISATION FAILED - Check Parameters')
            setTimeout(() => setMessage(''), 3000)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            <div className="w-4/5 h-full flex items-center justify-center bg-gray-900">
                <img src={puneReportImage} alt="Device Synchronisation Report" className="max-w-full max-h-full object-contain" />
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
                        Analyze the technical report and extract the <span className="text-yellow-400 font-semibold">synchronisation parameters</span> to proceed.
                    </p>
                </div>

                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-purple-400 font-semibold mb-3">CURRENT TASK</p>
                    <div className="bg-[#121826] p-4 rounded-lg border border-purple-500/30">
                        <p className="text-base font-semibold text-white">🔐 Full Synchronisation</p>
                        <p className="text-xs text-gray-400 mt-1">Enter all required parameters from the report.</p>
                    </div>
                </div>

                <div className="px-6 py-6 flex-1 bg-[#0b0f1a] border-t border-gray-800">
                    <div className="mb-5">
                        <p className="text-[11px] tracking-widest text-cyan-400 font-semibold">SYNCHRONISATION PARAMETERS</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-2">Device ID:</label>
                            <input
                                type="text"
                                value={formData.deviceId}
                                onChange={(e) => handleInputChange('deviceId', e.target.value)}
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-sm text-white transition focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="Enter Device ID"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-2">Frequency Band: (in GHz)</label>
                            <input
                                type="text"
                                value={formData.frequencyBand}
                                onChange={(e) => handleInputChange('frequencyBand', e.target.value)}
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-sm text-white transition focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="Enter Frequency Band"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-2">Signal Strength:</label>
                            <input
                                type="text"
                                value={formData.signalStrength}
                                onChange={(e) => handleInputChange('signalStrength', e.target.value)}
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-sm text-white transition focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="Enter Signal Strength"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-2">Delay Offset (Hours):</label>
                            <input
                                type="text"
                                value={formData.delayOffset}
                                onChange={(e) => handleInputChange('delayOffset', e.target.value)}
                                className="w-full px-3 py-2 bg-[#0b0f1a] border border-gray-700 rounded-lg text-sm text-white transition focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="Enter Delay Offset"
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!formData.deviceId || !formData.frequencyBand || !formData.signalStrength || !formData.delayOffset}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            VERIFY PARAMETERS
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-4 text-center text-xs font-semibold ${message.includes("FAILED") || message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Pune
