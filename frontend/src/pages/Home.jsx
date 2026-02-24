import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CLASSIFIED_LINES = [
    { text: 'THREAT LEVEL: CRITICAL', color: 'red' },
    { text: 'OPERATION: CHAKRAVYUH', color: 'green' },
    { text: 'TARGETS: 6 CITIES — ACTIVE', color: 'red' },
    { text: 'AUTHORIZATION REQUIRED', color: 'green' },
]

const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>あいうえおअआइईकखगघ' +
    'ङचछजझटठडढणतथदधनपफबभमयरलवशषसह'

const MatrixRain = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const FONT_SIZE = 14
        let animId

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const cols = () => Math.floor(canvas.width / FONT_SIZE)

        // Each column gets a fixed color: ~80% green, ~20% red
        let colColors = []
        const buildColors = (n) =>
            Array.from({ length: n }, () => (Math.random() < 0.2 ? 'red' : 'green'))

        let drops = Array.from({ length: cols() }, () => Math.random() * -100)
        colColors = buildColors(cols())

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.font = `${FONT_SIZE}px monospace`

            const currentCols = cols()
            if (drops.length !== currentCols) {
                drops = Array.from({ length: currentCols }, () => Math.random() * -100)
                colColors = buildColors(currentCols)
            }

            for (let i = 0; i < drops.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)]
                const x = i * FONT_SIZE
                const y = drops[i] * FONT_SIZE
                const isRed = colColors[i] === 'red'
                const isHead = drops[i] > 0 && Math.random() > 0.95

                if (isRed) {
                    ctx.fillStyle = isHead ? '#ffaaaa' : '#cc2200'
                } else {
                    ctx.fillStyle = isHead ? '#ccffcc' : '#00aa44'
                }
                ctx.globalAlpha = isHead ? 1 : 0.55 + Math.random() * 0.3
                ctx.fillText(char, x, y)

                if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
                drops[i] += 0.5
            }

            ctx.globalAlpha = 1
            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.45 }} />
    )
}

const TypewriterLine = ({ text, color = 'green', delay = 0 }) => {
    const [displayed, setDisplayed] = useState('')

    useEffect(() => {
        let timeout
        let i = 0
        timeout = setTimeout(() => {
            const interval = setInterval(() => {
                i++
                setDisplayed(text.slice(0, i))
                if (i >= text.length) clearInterval(interval)
            }, 40)
            return () => clearInterval(interval)
        }, delay)
        return () => clearTimeout(timeout)
    }, [text, delay])

    const colorClass = color === 'red'
        ? 'text-red-500'
        : 'text-green-400'

    return (
        <p className={`font-mono text-sm tracking-widest ${colorClass}`}>
            {displayed}
            <span className="animate-pulse">_</span>
        </p>
    )
}

const Home = () => {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), CLASSIFIED_LINES.length * 600 + 500)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">

            <MatrixRain />

            {/* Dark center vignette */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                }}
            />

            {/* Scanline overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
                }}
            />

            {/* Content */}
            <div className="relative z-20 w-full max-w-2xl flex flex-col items-center gap-8">

                <p className="font-mono text-xs text-green-700 tracking-[0.4em] uppercase">
                    &#x25A0; Classified Transmission &#x25A0;
                </p>

                {/* Title with dual glow */}
                <div className="text-center">
                    <h1
                        className="font-mono text-5xl md:text-7xl font-bold text-green-400 tracking-widest"
                        style={{
                            textShadow:
                                '0 0 18px rgba(74,222,128,0.7), 0 0 40px rgba(220,38,38,0.35)',
                        }}
                    >
                        CHAKRAVYUH
                    </h1>
                    <p className="font-mono text-green-600 text-sm tracking-[0.3em] mt-2 uppercase">
                        Operation: Stop the threat
                    </p>
                </div>

                {/* Red-to-green gradient divider */}
                <div
                    className="w-full h-px"
                    style={{ background: 'linear-gradient(to right, #7f1d1d, #dc2626, #16a34a, #14532d)' }}
                />

                {/* Brief card — left border red, rest of border green */}
                <div className="w-full bg-black/70 border border-green-900 border-l-red-600 rounded p-5 flex flex-col gap-3 backdrop-blur-sm"
                    style={{ borderLeftColor: '#dc2626', borderLeftWidth: '2px' }}
                >
                    <p className="font-mono text-green-700 text-xs tracking-widest mb-1 uppercase">// Incoming Brief</p>
                    {CLASSIFIED_LINES.map((line, i) => (
                        <TypewriterLine key={line.text} text={line.text} color={line.color} delay={i * 600} />
                    ))}
                </div>

                <p className="font-mono text-green-600 text-sm text-center leading-relaxed max-w-lg">
                    Intelligence reports a coordinated terror plot spanning{' '}
                    <span className="text-red-500 font-semibold">6 cities across India</span>.
                    Agents are needed in the field to gather intel, collect evidence, and find out the correct location, time and type of attack.
                    
                </p>

                {/* Red CTA button */}
                <button
                    onClick={() => navigate('/register')}
                    className={`
            font-mono text-white font-bold tracking-widest uppercase px-10 py-4 text-base
            bg-red-700 hover:bg-red-600 active:scale-95 rounded
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                    style={{
                        transition: 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.2s, background 0.2s',
                        boxShadow: '0 0 24px rgba(220,38,38,0.5)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(220,38,38,0.85)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(220,38,38,0.5)'}
                >
                    &#x25B6; Accept Mission
                </button>

                <p className="font-mono text-red-900 text-xs tracking-widest">
                    EYES ONLY — LEVEL 5 CLEARANCE
                </p>
            </div>
        </div>
    )
}

export default Home
