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
      className="fixed inset-0 z-50 bg-[rgba(8,7,6,0.88)] backdrop-blur-[10px] flex flex-col items-center justify-center animate-slide-up"
      style={{
        paddingTop:    'max(24px, calc(24px + var(--sat)))',
        paddingBottom: 'max(24px, calc(24px + var(--sab)))',
        paddingLeft:   'max(24px, calc(24px + var(--sal)))',
        paddingRight:  'max(24px, calc(24px + var(--sar)))',
      }}
    >
      <div
        className="font-display font-extrabold text-[clamp(34px,12vw,56px)] uppercase tracking-[0.02em] leading-[0.9] text-center transition-colors duration-200"
        style={{ color: isDone ? 'var(--good)' : color }}
      >
        {phase}
      </div>

      {subLabel && (
        <div className="text-[12px] text-muted tracking-[0.18em] uppercase mt-2">
          {subLabel}
        </div>
      )}

      <div className="relative w-[min(70vw,260px)] aspect-square my-[26px]">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#2c2820" strokeWidth="7" />
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
        <div className="absolute inset-0 grid place-items-center font-display font-black text-[clamp(56px,20vw,92px)]">
          {isDone ? '✓' : secondsLeft}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClose}
          className="border border-line bg-card text-chalk rounded-full px-[26px] py-[13px] text-[12px] tracking-[0.08em] uppercase"
        >
          Close
        </button>
        {isActive && (
          <button
            onClick={togglePause}
            className="border border-chalk bg-chalk text-black rounded-full px-[26px] py-[13px] text-[12px] font-semibold tracking-[0.08em] uppercase"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}
