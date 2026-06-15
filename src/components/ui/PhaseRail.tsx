import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface Phase { key: string; label: string }

interface PhaseRailProps {
  phases: Phase[]
  active: string
  done: string[]
  onChange: (key: string) => void
  accent?: AccentKey
}

export function PhaseRail({ phases, active, done, onChange, accent = 'griplab' }: PhaseRailProps) {
  const accentColor = ACCENT_HEX[accent]
  return (
    <div className="flex border-b border-line mb-4">
      {phases.map(phase => {
        const isDone = done.includes(phase.key)
        const isActive = phase.key === active
        return (
          <button
            key={phase.key}
            onClick={() => onChange(phase.key)}
            className="flex-1 flex flex-col items-center gap-1 pb-2.5 pt-2 text-[11px] tracking-[0.1em] uppercase transition-colors duration-150"
            style={{ color: isDone ? '#9fd17a' : isActive ? accentColor : '#8a8273' }}
          >
            {isDone && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9fd17a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 13 9 18 20 6" />
              </svg>
            )}
            {phase.label}
            <div
              className="h-[2px] w-full rounded-full mt-0.5"
              style={{
                background: isDone ? '#9fd17a' : isActive ? accentColor : 'transparent',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
