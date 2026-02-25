import React, { useState, useEffect, useRef } from 'react'

const Mumbai = () => {
    const [code, setCode] = useState(['', '', ''])
    const [message, setMessage] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0)
    const inputRefs = [useRef(null), useRef(null), useRef(null)]

    useEffect(() => {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const timeStart = userData.timeStart ? new Date(userData.timeStart) : new Date()

        // Calculate time remaining (90 minutes total)
        const calculateTimeRemaining = () => {
            const currentTime = new Date()
            const elapsedMilliseconds = currentTime - new Date(timeStart)
            const totalGameTime = 90 * 60 * 1000 // 90 minutes in milliseconds
            const remaining = totalGameTime - elapsedMilliseconds

            if (remaining <= 0) {
                return 0
            }
            return Math.floor(remaining / 1000) // Convert to seconds
        }

        // Set initial time
        setTimeRemaining(calculateTimeRemaining())

        // Update timer every second
        const interval = setInterval(() => {
            const remaining = calculateTimeRemaining()
            setTimeRemaining(remaining)

            if (remaining <= 0) {
                clearInterval(interval)
            }
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

    const handleSubmit = (e) => {
        e.preventDefault()

        const correctPasscode = import.meta.env.VITE_MUMBAI_PASSCODE
        const enteredCode = code.join('')

        if (enteredCode === correctPasscode) {
            setMessage('Correct! Proceeding...')
            // TODO: API call to update progress will be integrated later
            console.log('Correct passcode entered!')
        } else {
            setMessage('Incorrect Passcode')
            setTimeout(() => setMessage(''), 3000)
        }

        setCode(['', '', ''])
        inputRefs[0].current?.focus()
    }

    const handleDigitChange = (index, value) => {
        // Only allow single digit
        if (!/^\d?$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 2) {
            inputRefs[index + 1].current?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            {/* Game Section - 80% */}
            <div className="w-4/5 h-full">
                <iframe
                    src="/game/index.html"
                    className="w-full h-full border-none"
                    title="Mumbai Game"
                />
            </div>


            {/* Side Panel - 20% */}
            <div className="w-1/5 h-full bg-[#0b0f1a] text-white flex flex-col border-l border-gray-800 overflow-y-auto">

                {/* ===== TIMER ===== */}
                <div className="px-6 py-6 border-b border-gray-800 bg-black">
                    <p className="text-[11px] tracking-widest text-red-400 font-semibold mb-2">
                        MISSION TIMER
                    </p>

                    <div className={`text-4xl font-mono font-bold ${timeRemaining < 600 ? "text-red-500 animate-pulse" : "text-green-400"
                        }`}>
                        {formatTime(timeRemaining)}
                    </div>

                    <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${timeRemaining < 600 ? "bg-red-500" : "bg-green-500"
                                }`}
                            style={{ width: `${(timeRemaining / (90 * 60)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* ===== MISSION BRIEF ===== */}
                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-blue-400 font-semibold mb-3">
                        MISSION BRIEF
                    </p>

                    <p className="text-sm text-gray-300 leading-relaxed">
                        Gather intelligence and determine the
                        <span className="text-yellow-400 font-semibold"> City</span>,
                        <span className="text-yellow-400 font-semibold"> Time</span>,
                        <span className="text-yellow-400 font-semibold"> Date</span>,
                        and
                        <span className="text-yellow-400 font-semibold"> Nodes</span>
                        of the planned attack.
                    </p>
                </div>

                {/* ===== CURRENT TASK ===== */}
                <div className="px-6 py-6 border-b border-gray-800">
                    <p className="text-[11px] tracking-widest text-purple-400 font-semibold mb-3">
                        CURRENT TASK
                    </p>

                    <div className="bg-[#121826] p-4 rounded-lg border border-purple-500/30">
                        <p className="text-base font-semibold text-white">
                            Locate 3-Digit Access Code
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Search the environment carefully. Clues are embedded.
                        </p>
                    </div>
                </div>


                {/* ===== PASSCODE ENTRY ===== */}
                <div className="px-6 py-6 mt-auto bg-[#0b0f1a] border-t border-gray-800">

                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[11px] tracking-widest text-cyan-400 font-semibold">
                            ENTER PASSCODE
                        </p>
                        <span className="text-[10px] text-gray-500 tracking-widest">
                            3-DIGIT ACCESS
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Digit Boxes */}
                        <div className="flex justify-center gap-4">
                            {[0, 1, 2].map((i) => (
                                <input
                                    key={i}
                                    ref={inputRefs[i]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={code[i]}
                                    onChange={(e) => handleDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="
                        w-16 h-16
                        bg-[#0b0f1a]
                        border border-gray-700
                        rounded-lg
                        text-center
                        text-2xl
                        font-mono
                        text-white
                        transition
                        focus:outline-none
                        focus:border-cyan-500
                        focus:ring-2
                        focus:ring-cyan-500/20
                    "
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={code.filter(d => d !== '').length !== 3}
                            className="
                w-full py-3
                bg-gradient-to-r from-cyan-600 to-blue-600
                hover:from-cyan-700 hover:to-blue-700
                rounded-lg
                font-semibold
                tracking-wide
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
            "
                        >
                            VERIFY CODE
                        </button>
                    </form>

                    {/* Status Message */}
                    {message && (
                        <div className={`mt-4 text-center text-sm font-semibold ${message.includes("Incorrect")
                                ? "text-red-400"
                                : "text-green-400"
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Mumbai