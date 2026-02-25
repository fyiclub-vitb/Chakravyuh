import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Disqualify = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Clear any game progress data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        if (!userData.userId) {
            // If no user data, redirect to home
            navigate('/')
        }
    }, [navigate])

    const handleBackToHome = () => {
        localStorage.removeItem('userData')
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-950 to-black flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border border-red-900/50 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-900/40 to-red-950/40 border-b border-red-900/50 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-700">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-red-400">Mission Terminated</h1>
                                <p className="text-sm text-gray-400 mt-1">Disqualification Notice</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Main Message */}
                        <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-6">
                            <p className="text-lg text-gray-200 leading-relaxed">
                                Your assessment of the intelligence data was <span className="text-red-400 font-bold">incorrect</span>. 
                                The operation you identified was not the primary attack target under investigation.
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-gray-300 font-semibold">Critical Analysis Error</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Intelligence operatives must demonstrate sound judgment when analyzing threat data. 
                                        Misidentifying operations can lead to mission failure and compromised security.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-gray-300 font-semibold">Mission Status</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Your participation in Operation Chakravyuh has been terminated. You are unable to continue with the investigation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-yellow-600 font-semibold text-sm">Important Note</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        All progress has been recorded. Thank you for your participation in the game.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleBackToHome}
                                className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-lg"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Session terminated • Progress saved
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Disqualify