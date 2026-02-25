import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>अआइईकखगघङचछजझटठडढणतथदधन'

// ── Matrix Rain (minimal) ─────────────────────────────────────────────────────
const MatrixRain = () => {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const FS = 13
        let animId
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
        resize()
        window.addEventListener('resize', resize)
        const cols = () => Math.floor(canvas.width / FS)
        let drops = Array.from({ length: cols() }, () => Math.random() * -80)
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.06)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.font = `${FS}px monospace`
            const n = cols()
            if (drops.length !== n) drops = Array.from({ length: n }, () => Math.random() * -80)
            for (let i = 0; i < drops.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)]
                ctx.fillStyle = '#00aa44'
                ctx.globalAlpha = 0.4 + Math.random() * 0.3
                ctx.fillText(char, i * FS, drops[i] * FS)
                if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0
                drops[i] += 0.4
            }
            ctx.globalAlpha = 1
            animId = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.35 }} />
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const show = setTimeout(() => setVisible(true), 10)
        const hide = setTimeout(() => { setVisible(false); setTimeout(onDone, 400) }, 4000)
        return () => { clearTimeout(show); clearTimeout(hide) }
    }, [onDone])

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded border border-red-700 bg-black px-5 py-4 max-w-sm"
            style={{
                boxShadow: '0 0 24px rgba(220,38,38,0.4)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
            }}
        >
            <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
            <div>
                <p className="font-mono text-red-400 text-xs tracking-widest uppercase mb-1">Transmission Failed</p>
                <p className="font-mono text-red-600 text-xs leading-relaxed">{message}</p>
            </div>
        </div>
    )
}

// ── Success Screen ────────────────────────────────────────────────────────────
const SuccessScreen = ({ isNew, agentName, onProceed }) => (
    <div className="flex flex-col items-center gap-6 text-center py-4">
        <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: '#22c55e', boxShadow: '0 0 24px rgba(34,197,94,0.5)' }}
        >
            <span className="text-green-400 text-2xl">✓</span>
        </div>
        <div>
            <p className="font-mono text-green-400 font-bold tracking-[0.2em] text-lg uppercase">
                {isNew ? 'Clearance Granted' : 'Identity Confirmed'}
            </p>
            <p className="font-mono text-green-700 text-xs tracking-widest mt-1 uppercase">
                {isNew ? 'Agent registered successfully' : 'Resuming existing progress'}
            </p>
        </div>
        <p className="font-mono text-green-600 text-sm">
            Welcome, <span className="text-green-300 font-semibold">{agentName}</span>.<br />
            {isNew
                ? 'Your identity has been logged. Prepare for deployment.'
                : 'Your mission record has been retrieved. Pick up where you left off.'}
        </p>
        <button
            onClick={onProceed}
            className="font-mono text-white font-bold tracking-[0.25em] uppercase px-10 py-3 text-sm bg-red-700 hover:bg-red-600 active:scale-95 rounded mt-2"
            style={{ boxShadow: '0 0 20px rgba(220,38,38,0.5)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 36px rgba(220,38,38,0.85)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.5)'}
        >
            ▶ Enter Mission
        </button>
    </div>
)

// ── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ label, hint, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
            <label className="font-mono text-xs text-green-700 tracking-[0.25em] uppercase">{label}</label>
            {hint && <span className="font-mono text-xs text-gray-700">{hint}</span>}
        </div>
        {children}
        {error && (
            <p className="font-mono text-xs text-red-500 tracking-wide">{error}</p>
        )}
    </div>
)

// ── Register Page ─────────────────────────────────────────────────────────────
const REG_NO_RE  = /^\d{2}[A-Z]{3}\d{5}$/
const EMAIL_SUFFIX = '@vitbhopal.ac.in'

const Register = () => {
    const navigate = useNavigate()

    const [form, setForm]       = useState({ agentId: '', name: '', email: '' })
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)
    const [toast, setToast]     = useState(null)   // { message }
    const [success, setSuccess] = useState(null)   // { isNew, agentName }

    const set = (field) => (e) => {
        const val = field === 'agentId' ? e.target.value.toUpperCase() : e.target.value
        setForm(f => ({ ...f, [field]: val }))
        setErrors(er => ({ ...er, [field]: undefined }))
    }

    const validate = () => {
        const errs = {}
        if (!REG_NO_RE.test(form.agentId))
            errs.agentId = 'Format must be 23BAI10234 (2 digits + 3 letters + 5 digits)'
        if (!form.name.trim())
            errs.name = 'Agent name is required'
        if (!form.email.endsWith(EMAIL_SUFFIX))
            errs.email = `Email must end with ${EMAIL_SUFFIX}`
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
            const res = await axios.post(`${apiUrl}/auth/register`, {
                userId: form.agentId,
                name:   form.name.trim(),
                email:  form.email.trim(),
            })

            if (res.data.success) {
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(res.data.data))
                localStorage.setItem('userId', res.data.data.userId)
                
                // Redirect directly to Mumbai Backstory
                navigate('/mumbai/backstory')
            } else {
                setToast({ message: res.data.message || 'Registration failed. Please try again.' })
            }
        } catch (err) {
            console.error('Registration error:', err)
            const errorMsg = err.response?.data?.message || 'Connection error. Please check if backend is running.'
            setToast({ message: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = (hasError) => ({
        background: 'rgba(0,0,0,0.8)',
        border: `1px solid ${hasError ? '#dc2626' : '#14532d'}`,
        boxShadow: hasError ? '0 0 8px rgba(220,38,38,0.2)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    })

    return (
        <>
            <style>{`
                .spy-input:focus {
                    outline: none;
                    border-color: #22c55e !important;
                    box-shadow: 0 0 10px rgba(34,197,94,0.25) !important;
                }
            `}</style>

            <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4 py-10">

                <MatrixRain />

                {/* Vignette */}
                <div className="pointer-events-none absolute inset-0 z-10" style={{
                    background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(0,0,0,0.88) 25%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                }} />
                {/* Scanlines */}
                <div className="pointer-events-none absolute inset-0 z-10" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                }} />

                {/* Card */}
                <div
                    className="relative z-20 w-full max-w-md flex flex-col gap-7 rounded p-8"
                    style={{
                        background: 'rgba(0,0,0,0.75)',
                        border: '1px solid #14532d',
                        boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 1px rgba(34,197,94,0.3)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    {/* Header */}
                    <div>
                        <p className="font-mono text-xs text-green-800 tracking-[0.35em] uppercase mb-3">
                            ▪ Clearance Portal
                        </p>
                        <h1
                            className="font-mono font-bold text-green-400 tracking-widest"
                            style={{
                                fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
                                textShadow: '0 0 16px rgba(74,222,128,0.6)',
                            }}
                        >
                            AGENT IDENTIFICATION
                        </h1>
                        <p className="font-mono text-green-800 text-xs tracking-widest mt-1 uppercase">
                            Operation Chakravyuh — Field Enrolment
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full" style={{
                        background: 'linear-gradient(to right, #7f1d1d, #dc2626, #16a34a, #14532d)',
                    }} />

                    {/* Form or Success */}
                    {success ? (
                        <SuccessScreen
                            isNew={success.isNew}
                            agentName={success.agentName}
                            onProceed={() => navigate('/')}
                        />
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

                            <Field label="Agent ID" hint="e.g. 23BAI10234" error={errors.agentId}>
                                <input
                                    className="spy-input font-mono text-green-300 text-sm tracking-widest w-full rounded px-4 py-3 placeholder-green-900"
                                    style={inputStyle(!!errors.agentId)}
                                    type="text"
                                    placeholder="23BAI10234"
                                    value={form.agentId}
                                    onChange={set('agentId')}
                                    maxLength={10}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </Field>

                            <Field label="Agent Name" error={errors.name}>
                                <input
                                    className="spy-input font-mono text-green-300 text-sm tracking-widest w-full rounded px-4 py-3 placeholder-green-900"
                                    style={inputStyle(!!errors.name)}
                                    type="text"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={set('name')}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </Field>

                            <Field label="Agent Email" hint={`@vitbhopal.ac.in`} error={errors.email}>
                                <input
                                    className="spy-input font-mono text-green-300 text-sm tracking-widest w-full rounded px-4 py-3 placeholder-green-900"
                                    style={inputStyle(!!errors.email)}
                                    type="email"
                                    placeholder="agent@vitbhopal.ac.in"
                                    value={form.email}
                                    onChange={set('email')}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={loading}
                                className="font-mono text-white font-bold tracking-[0.25em] uppercase px-10 py-4 text-sm bg-red-700 hover:bg-red-600 active:scale-95 rounded disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                                style={{
                                    boxShadow: '0 0 20px rgba(220,38,38,0.45)',
                                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                                }}
                                onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 0 36px rgba(220,38,38,0.85)')}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.45)'}
                            >
                                {loading ? '▷ Uplink in Progress...' : '▶ Start Mission'}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    {!success && (
                        <p className="font-mono text-green-950 text-xs tracking-widest text-center">
                            VIT Bhopal — Authorised Personnel Only
                        </p>
                    )}
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    onDone={() => setToast(null)}
                />
            )}
        </>
    )
}

export default Register
