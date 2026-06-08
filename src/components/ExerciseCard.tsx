import { Figure } from '../assets/figures'
import type { TimerConfig } from '../hooks/useTimer'

export interface Exercise {
  id: string
  title: string
  subtitle?: string
  type: 'reps' | 'timer' | 'repeater'
  seconds?: number
  timerLabel?: string
  hold?: number
  rest?: number
  reps?: number
  figure?: string
}

interface Props {
  exercise: Exercise
  done: boolean
  onToggle: () => void
  onOpenTimer: (config: TimerConfig) => void
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor">
      <path d="M7 5v14l11-7z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#000" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 13 9 18 20 6" />
    </svg>
  )
}

export function ExerciseCard({ exercise, done, onToggle, onOpenTimer }: Props) {
  const { title, subtitle, type, seconds, timerLabel, hold, rest, reps, figure } = exercise

  function handleTimer() {
    if (type === 'timer' && seconds && timerLabel) {
      onOpenTimer({ type: 'countdown', seconds, label: timerLabel })
    } else if (type === 'repeater' && hold && rest && reps) {
      onOpenTimer({ type: 'repeater', hold, rest, reps })
    }
  }

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      border: done ? '1px solid transparent' : '1px solid var(--line)',
      background: done ? 'var(--bg2)' : 'var(--card)',
      borderRadius: 'var(--radius)', padding: 14, marginBottom: 10,
      opacity: done ? 0.5 : 1,
      transition: 'opacity 0.2s, background 0.2s, border-color 0.2s',
      animation: 'slideIn 0.22s ease both',
    }}>
      <button
        onClick={onToggle}
        style={{
          flex: '0 0 auto', width: 28, height: 28,
          borderRadius: 8,
          border: done ? 'none' : '2px solid var(--line)',
          background: done ? 'var(--good)' : 'transparent',
          display: 'grid', placeItems: 'center',
          marginTop: 1,
          transition: 'background 0.18s, border-color 0.18s',
          animation: done ? 'scalePulse 0.3s ease' : 'none',
        }}
      >
        {done && <CheckIcon />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, lineHeight: 1.45,
          textDecoration: done ? 'line-through' : 'none',
          color: done ? 'var(--muted)' : 'var(--chalk)',
          transition: 'color 0.2s',
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
            {subtitle}
          </div>
        )}
        {(type === 'timer' || type === 'repeater') && (
          <button
            onClick={handleTimer}
            style={{
              marginTop: 11, display: 'inline-flex', alignItems: 'center', gap: 7,
              border: '1px solid var(--menucol)', color: 'var(--menucol)',
              background: 'transparent', borderRadius: 99, padding: '7px 13px',
              fontSize: 11.5, fontWeight: 500, letterSpacing: '0.05em',
              textTransform: 'uppercase', transition: 'opacity 0.18s',
            }}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <PlayIcon />
            {type === 'timer'
              ? `${timerLabel} · ${seconds}s`
              : `REPEATER · ${hold}s/${rest}s ×${reps}`}
          </button>
        )}
      </div>

      {figure && (
        <div style={{ opacity: done ? 0.6 : 1, transition: 'opacity 0.2s', alignSelf: 'center' }}>
          <Figure name={figure} />
        </div>
      )}
    </div>
  )
}
