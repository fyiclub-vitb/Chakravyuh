import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { getNextCity, getCityRoute } from '../utils/progressHelper'

export const useProgressCheck = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkProgress = async () => {
            try {
                // Skip check for home, register, leaderboard, and disqualify pages
                if (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/disqualify' || location.pathname === '/leaderboard') {
                    setIsChecking(false)
                    return
                }

                const userData = JSON.parse(localStorage.getItem('userData') || '{}')

                if (!userData.userId) {
                    // No user data, redirect to register
                    navigate('/register')
                    return
                }

                // Fetch latest user data from server
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                const response = await axios.post(`${apiUrl}/auth/register`, {
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email
                })

                if (response.data.success) {
                    const latestUserData = response.data.data

                    // Update localStorage with latest progress
                    localStorage.setItem('userData', JSON.stringify(latestUserData))

                    // Check if user is disqualified
                    if (latestUserData.isDisqualified) {
                        navigate('/disqualify', { replace: true })
                        setIsChecking(false)
                        return
                    }

                    // Get next city to visit
                    const nextCity = getNextCity(latestUserData.cityProgress)

                    if (!nextCity) {
                        // All cities completed
                        console.log('All cities completed!')
                        setIsChecking(false)
                        return
                    }

                    const nextRoute = getCityRoute(nextCity, true)

                    // Check if user is on the correct route
                    const currentPath = location.pathname.toLowerCase()
                    const nextCityLower = nextCity.toLowerCase()

                    // If user is not on the correct city route, redirect
                    if (!currentPath.includes(nextCityLower)) {
                        console.log(`Redirecting to ${nextRoute}`)
                        navigate(nextRoute, { replace: true })
                    }
                }

                setIsChecking(false)
            } catch (error) {
                console.error('Error checking progress:', error)
                setIsChecking(false)
            }
        }

        checkProgress()
    }, [navigate, location.pathname])

    return { isChecking }
}
