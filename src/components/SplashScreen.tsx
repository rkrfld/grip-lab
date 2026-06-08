import { useEffect, useState } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const hide = setTimeout(() => setHiding(true), 1800)
    const done = setTimeout(() => onDone(), 2300)
    return () => { clearTimeout(hide); clearTimeout(done) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{
        transition: 'opacity 0.5s ease',
        opacity: hiding ? 0 : 1,
        pointerEvents: hiding ? 'none' : 'all',
      }}
    >
      {/* pulsing background glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,74,28,0.18) 0%, transparent 70%)',
          animation: 'splashGlow 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,74,28,0.28) 0%, transparent 65%)',
          animation: 'splashGlow 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
          animationDelay: '-0.7s',
        }} />
      </div>

      {/* static G — matches PWA icon font */}
      <span
        className="relative text-accent select-none"
        style={{
          fontFamily: "'Arial Black', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(120px, 40vw, 200px)',
          lineHeight: 1,
        }}
      >
        G
      </span>
    </div>
  )
}
