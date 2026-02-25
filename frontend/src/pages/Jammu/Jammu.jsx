import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LOGS = [
    "[02:08:11] Initial sector sweep complete. Northern corridor stable.",
    "[02:09:42] Temporary holding unit activated near ridge access.",
    "[02:10:05] Environmental scan nominal. Wind factor acceptable.",
    "[02:11:17] Unit Alpha positioned.",
    "[02:11:58] Border transit window confirmed.",
    "[02:12:33] Civilian movement density moderate.",
    "[02:13:09] Shipment 990 arrival acknowledged.",
    "[02:13:44] Dock supervisor cleared entry.",
    "[02:14:02] Documentation filed under emergency relief classification.",
    "[02:14:51] Media presence probability moderate.",
    "[02:15:37] External surveillance grid calibrated.",
    "[02:16:04] Temporary storage bay active.",
    "[02:16:49] Unit Bravo awaiting trigger alignment.",
    "[02:17:22] Secondary communication channel open.",
    "[02:18:05] Ridge checkpoint secured.",
    "[02:18:47] Northern deployment rehearsal successful.",
    "[02:19:31] Transit lane diversion complete.",
    "[02:20:08] Frequency diagnostic incomplete.",
    "[02:20:42] Signal integrity unstable at 2.4 band.",
    "[02:21:19] Activation rehearsal green.",
    "[02:21:54] Civilian density projection revised upward.",
    "[02:22:33] Financial confirmation received.",
    "[02:23:11] Equipment labeled as humanitarian supplies.",
    "[02:23:58] Border access route maintained.",
    "[02:24:27] Weather stability confirmed.",
    "[02:25:02] Shipment manifest cross-reference pending.",
    "[02:25:39] Thermal activity within acceptable threshold.",
    "[02:26:14] Command awaiting clearance.",
    "[02:26:52] Synchronisation protocol not verified.",
    "[02:27:31] Local assembly window tentative.",
    "[02:28:10] Transmission latency exceeds safe threshold.",
    "[02:28:46] Unit Charlie in standby.",
    "[02:29:20] Activation window unresolved.",
    "[02:29:59] Northern rehearsal phase complete.",
    "[02:30:41] Border sector ready for demonstration.",
    "[02:31:07] Alignment discrepancy detected.",
    "[02:31:55] Await updated routing directive.",
    "[02:32:34] Signal segmentation incomplete.",
    "[02:33:12] Equipment configuration unverified.",
    "[02:33:48] Command awaiting structural validation.",
    "[02:34:29] External broadcast interference noted.",
    "[02:35:02] Shipment classification mismatch flagged.",
    "[02:35:41] Deployment team holding position.",
    "[02:36:08] Delay offset data unavailable.",
    "[02:36:44] Trigger calibration incomplete.",
    "[02:37:10] Border phase alignment unstable.",
    "[02:37:49] Await synchronisation clearance.",
    "[02:38:23] Phase integrity compromised.",
    "[02:39:01] Re-evaluating activation route.",
    "[02:39:42] Transmission rerouted through secondary grid.",
    "[02:40:15] Node identification unresolved.",
    "[02:40:59] Sector readiness downgraded to provisional.",
    "[02:41:28] Reconfirm funding pathway.",
    "[02:42:04] Deployment integrity uncertain.",
    "[02:42:39] External instruction pending.",
    "[02:43:08] Northern corridor flagged as unstable.",
    "[02:43:51] Signal rerouted to central node.",
    "[02:44:16] Await final synchronisation directive.",
    "[02:44:57] Northern activation sequence suspended."
]

const Jammu = () => {
    const [visibleLogs, setVisibleLogs] = useState([])
    const [message, setMessage] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const logContainerRef = useRef(null)
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

    useEffect(() => {
        let currentIndex = 0
        const timers = []

        const displayNextLog = () => {
            if (currentIndex < LOGS.length) {
                setVisibleLogs(prev => [...prev, LOGS[currentIndex]])
                currentIndex++
                
                // Random delay between 1-3 seconds
                const randomDelay = Math.random() * 2000 + 1000
                const timer = setTimeout(displayNextLog, randomDelay)
                timers.push(timer)
            }
        }

        // Start displaying logs
        displayNextLog()

        return () => {
            timers.forEach(timer => clearTimeout(timer))
        }
    }, [])

    useEffect(() => {
        // Auto-scroll to bottom when new logs appear
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [visibleLogs])

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleYes = async () => {
        if (isProcessing) return
        setIsProcessing(true)
        setMessage('❌ Incorrect Assessment - Disqualified')
        
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
            
            const response = await axios.post(`${apiUrl}/game/disqualify`, {
                userId: userData.userId
            })
            
        } catch (error) {
            console.error('Error:', error)
            setMessage('Error processing request')
            setIsProcessing(false)
        }
    }

    const handleNo = async () => {
        if (isProcessing) return
        setIsProcessing(true)
        setMessage('✓ Correct Assessment - Proceeding')
        
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
            
            const response = await axios.post(`${apiUrl}/game/update-progress`, {
                userId: userData.userId,
                city: 'Jammu'
            })
            
            if (response.data.success) {
                setTimeout(() => navigate('/delhi/backstory'), 1500)
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('Error updating progress')
            setTimeout(() => setMessage(''), 3000)
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            {/* Left side - Logs Display */}
            <div className="w-4/5 h-full bg-gradient-to-br from-gray-950 via-neutral-950 to-black p-8 overflow-hidden flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs tracking-[0.3em] text-green-500 font-semibold uppercase">Live Transmission Feed</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-400">Northern Sector Command Log</h2>
                </div>
                
                <div 
                    ref={logContainerRef}
                    className="flex-1 bg-black/50 border border-gray-800 rounded-lg p-6 overflow-y-auto font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                >
                    {visibleLogs.map((log, index) => (
                        <div 
                            key={index} 
                            className="text-green-400/90 hover:text-green-300 transition-colors animate-fadeIn"
                        >
                            {log}
                        </div>
                    ))}
                    {visibleLogs.length > 0 && (
                        <div className="text-green-500 animate-pulse">▌</div>
                    )}
                </div>
            </div>

            {/* Right side - Control Panel */}
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
                        Analyze the intercepted transmission logs and determine if this is the <span className="text-yellow-400 font-semibold">primary attack operation</span> you are investigating.
                    </p>
                </div>

                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-purple-400 font-semibold mb-3">CURRENT TASK</p>
                    <div className="bg-[#121826] p-4 rounded-lg border border-purple-500/30">
                        <p className="text-base font-semibold text-white">📡 Log Analysis</p>
                        <p className="text-xs text-gray-400 mt-1">Review transmission data carefully before making your assessment.</p>
                    </div>
                </div>

                <div className="px-6 py-6 flex-1 bg-[#0b0f1a] border-t border-gray-800 flex flex-col justify-center">
                    <div className="mb-6">
                        <p className="text-[11px] tracking-widest text-amber-400 font-semibold mb-3">CRITICAL DECISION</p>
                        <div className="bg-amber-950/30 border border-amber-900/40 rounded-lg p-4">
                            <p className="text-base font-bold text-white mb-2">Is this the attack you are investigating?</p>
                            <p className="text-xs text-gray-400">Choose carefully. Incorrect assessment will result in mission failure.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleYes}
                            disabled={isProcessing}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-bold tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-lg"
                        >
                            YES
                        </button>
                        
                        <button
                            onClick={handleNo}
                            disabled={isProcessing}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 rounded-lg font-bold tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-lg"
                        >
                            NO
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-5 text-center text-xs font-semibold p-3 rounded-lg ${
                            message.includes("Disqualified") || message.includes("Error") 
                                ? "bg-red-900/30 text-red-400 border border-red-700" 
                                : "bg-green-900/30 text-green-400 border border-green-700"
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jammu
