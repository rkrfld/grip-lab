import { useEffect } from 'react'
import { useTimer, type TimerConfig } from '../hooks/useTimer'

interface Settings {
  soundEnabled: boolean
  hapticEnabled: boolean
}

interface Props {
  config: TimerConfig | null
  settings: Settings
  onClose: () => void
}

const RING_CIRC = 2 * Math.PI * 44

export function TimerOverlay({ config, settings, onClose }: Props) {
  const { state, togglePause, stop } = useTimer(config, settings, onClose)

  useEffect(() => {
    if (config) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [config])

  if (!config) return null

  const { secondsLeft, totalSeconds, isPaused, phase, subLabel, color, isActive } = state
  const frac = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const dashOffset = RING_CIRC * (1 - frac)
  const isDone = phase === 'DONE'

  function handleClose() {
    stop()
    onClose()
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(8,7,6,.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
        paddingBottom: `max(24px, calc(24px + env(safe-area-inset-bottom)))`,
        animation: 'slideUp 0.28s cubic-bezier(0.3,1,0.4,1) both',
      }}
    >
      <div style={{
        fontFamily: "'Big Shoulders Display', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(34px, 12vw, 56px)',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        lineHeight: 0.9,
        textAlign: 'center',
        color: isDone ? 'var(--good)' : color,
        transition: 'color 0.2s',
      }}>
        {phase}
      </div>

      {subLabel && (
        <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 8 }}>
          {subLabel}
        </div>
      )}

      <div style={{
        position: 'relative',
        width: 'min(70vw, 260px)',
        aspectRatio: '1',
        margin: '26px 0',
      }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={isDone ? 'var(--good)' : color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={isDone ? 0 : dashOffset}
            style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.2s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', placeItems: 'center',
          fontFamily: "'Big Shoulders Display', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(56px, 20vw, 92px)',
        }}>
          {isDone ? '✓' : secondsLeft}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleClose}
          style={{
            border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--chalk)',
            borderRadius: 99, padding: '13px 26px',
            fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          Close
        </button>
        {isActive && (
          <button
            onClick={togglePause}
            style={{
              border: '1px solid var(--chalk)', background: 'var(--chalk)', color: '#000',
              borderRadius: 99, padding: '13px 26px',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}
