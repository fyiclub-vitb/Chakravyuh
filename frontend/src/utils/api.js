import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Sends a player's answer to the backend for checking. The correct answers
// never exist in the browser.
//
// Resolves to { correct, disqualified } for every normal outcome (right,
// wrong, or disqualified). Network/server errors are thrown so the calling
// page can show its own error message.
export const verifyAnswer = async (city, answers) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')

    let data
    try {
        const response = await axios.post(`${API_URL}/game/verify`, {
            userId: userData.userId,
            city,
            answers
        })
        data = response.data
    } catch (error) {
        // The server answers 403 + disqualified:true for disqualified or timed-out players
        if (error.response?.data?.disqualified) {
            data = error.response.data
        } else {
            throw error
        }
    }

    if (data.disqualified) {
        userData.isDisqualified = true
        localStorage.setItem('userData', JSON.stringify(userData))
    }

    return { correct: data.correct === true, disqualified: data.disqualified === true }
}

// User-facing text for a failed verify request (network/server error or rate limit)
export const verifyErrorMessage = (error, fallback) =>
    error?.response?.status === 429
        ? 'Error: too many attempts. Wait a minute and try again.'
        : fallback
