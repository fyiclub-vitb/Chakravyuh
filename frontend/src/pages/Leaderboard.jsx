import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('active')
    const navigate = useNavigate()

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
            const response = await axios.get(`${apiUrl}/game/leaderboard`)
            
            if (response.data.success) {
                setLeaderboardData(response.data.data)
                setError(null)
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error)
            setError('Failed to load leaderboard data')
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const getRankBadge = (rank) => {
        return `#${rank}`
    }

    const getRankStyle = (rank) => {
        if (rank === 1) return 'text-yellow-400 font-bold'
        if (rank === 2) return 'text-gray-300 font-bold'
        if (rank === 3) return 'text-orange-400 font-bold'
        return 'text-gray-400'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <div className="text-white text-xl font-semibold">Loading Leaderboard Data</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-red-400 text-xl">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                                CHAKRAVYUH LEADERBOARD
                            </h1>
                            <p className="text-slate-400 text-sm">Real-time Game Statistics & Rankings</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate('/')}
                                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition font-medium text-sm"
                            >
                                ← Back to Home
                            </button>
                            <button 
                                onClick={fetchLeaderboard}
                                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition flex items-center gap-2 font-medium text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Total Players</div>
                        <div className="text-3xl font-bold text-white">
                            {leaderboardData?.statistics?.totalPlayers || 0}
                        </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-green-900/50 rounded-lg p-5 hover:border-green-700 transition">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Currently Playing</div>
                        <div className="text-3xl font-bold text-green-400">
                            {leaderboardData?.statistics?.activePlayers || 0}
                        </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-blue-900/50 rounded-lg p-5 hover:border-blue-700 transition">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Completed</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {leaderboardData?.statistics?.completedPlayers || 0}
                        </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-red-900/50 rounded-lg p-5 hover:border-red-700 transition">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Disqualified</div>
                        <div className="text-3xl font-bold text-red-400">
                            {leaderboardData?.statistics?.disqualifiedPlayers || 0}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-2.5 rounded-md font-medium transition text-sm ${
                            activeTab === 'active'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Active Players
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`flex-1 py-2.5 rounded-md font-medium transition text-sm ${
                            activeTab === 'leaderboard'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Top 10 Rankings
                    </button>
                </div>

                {activeTab === 'active' && (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-5 bg-slate-800/80 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Currently Playing</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Live stats of players still in the game
                            </p>
                        </div>
                        {leaderboardData?.activePlayers?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-900/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Player Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Remaining</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {leaderboardData.activePlayers.map((player) => (
                                            <tr key={player.userId} className="hover:bg-slate-700/30 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-white font-medium">{player.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-slate-400 text-sm font-mono">{player.userId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`font-mono text-base font-semibold ${
                                                        player.timeRemainingSeconds < 600 ? 'text-red-400' : 'text-green-400'
                                                    }`}>
                                                        {formatTime(player.timeRemainingSeconds)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[120px]">
                                                            <div 
                                                                className="bg-cyan-500 h-2 rounded-full transition-all"
                                                                style={{ width: `${(player.citiesCompleted / 6) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-white text-sm font-medium min-w-[40px]">
                                                            {player.citiesCompleted}/6
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                No active players at the moment.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-5 bg-slate-800/80 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Top 10 Rankings</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Ranked by points (faster completion = higher points)
                            </p>
                        </div>
                        {leaderboardData?.leaderboard?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-900/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-20">Rank</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Player Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Points</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Taken</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {leaderboardData.leaderboard.map((player, index) => (
                                            <tr 
                                                key={player.userId} 
                                                className={`hover:bg-slate-700/30 transition ${index < 3 ? 'bg-slate-700/20' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-2xl font-bold ${getRankStyle(index + 1)}`}>
                                                        {getRankBadge(index + 1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-white font-medium">{player.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-slate-400 text-sm font-mono">{player.userId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-xl font-bold text-cyan-400">
                                                        {player.points.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-slate-300 font-mono text-sm">
                                                        {formatTime(player.timeTaken)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[120px]">
                                                            <div 
                                                                className="bg-cyan-500 h-2 rounded-full transition-all"
                                                                style={{ width: `${(player.citiesCompleted / 6) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-white text-sm font-medium min-w-[40px]">
                                                            {player.citiesCompleted}/6
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                No players have completed the game yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Leaderboard
