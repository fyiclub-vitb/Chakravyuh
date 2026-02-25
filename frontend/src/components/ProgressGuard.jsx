import React from 'react'
import { useProgressCheck } from '../hooks/useProgressCheck'

const ProgressGuard = ({ children }) => {
    const { isChecking } = useProgressCheck()

    if (isChecking) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold">Checking Progress...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default ProgressGuard
