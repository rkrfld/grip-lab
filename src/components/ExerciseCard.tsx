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
    <div className={[
      'flex gap-3 items-start rounded-[14px] p-[14px] mb-2.5 transition-all duration-200 animate-slide-in',
      done ? 'opacity-50 border border-transparent bg-bg2' : 'border border-line bg-card',
    ].join(' ')}>
      <button
        onClick={onToggle}
        className={[
          'flex-none w-7 h-7 rounded-lg grid place-items-center mt-[1px] transition-all duration-[180ms]',
          done
            ? 'bg-good border-good animate-scale-pulse'
            : 'border-2 border-line bg-transparent',
        ].join(' ')}
      >
        {done && <CheckIcon />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={[
          'text-[14px] leading-[1.45] transition-colors duration-200',
          done ? 'line-through text-muted' : 'text-chalk',
        ].join(' ')}>
          {title}
        </div>
        {subtitle && (
          <div className="text-[11.5px] text-muted mt-[3px]">{subtitle}</div>
        )}
        {(type === 'timer' || type === 'repeater') && (
          <button
            onClick={handleTimer}
            className="mt-[11px] inline-flex items-center gap-[7px] border border-[var(--menucol)] text-[var(--menucol)] rounded-full px-[13px] py-[7px] text-[11.5px] font-medium tracking-[0.05em] uppercase transition-opacity active:scale-95"
          >
            <PlayIcon />
            {type === 'timer'
              ? `${timerLabel} · ${seconds}s`
              : `REPEATER · ${hold}s/${rest}s ×${reps}`}
          </button>
        )}
      </div>

      {figure && (
        <div className={`${done ? 'opacity-60' : ''} transition-opacity duration-200 self-center`}>
          <Figure name={figure} />
        </div>
      )}
    </div>
  )
}
