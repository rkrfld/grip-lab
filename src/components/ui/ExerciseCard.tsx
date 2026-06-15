import type { ReactNode } from 'react'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

export type ExerciseTimerType = 'none' | 'countdown' | 'repeater'

export interface CountdownConfig { seconds: number; label: string }
export interface RepeaterConfig { hold: number; rest: number; reps: number }
export type ExerciseTimerConfig = CountdownConfig | RepeaterConfig

interface ExerciseCardProps {
  title: string
  subtitle?: string
  done: boolean
  onToggle: () => void
  timerType?: ExerciseTimerType
  timerConfig?: ExerciseTimerConfig
  onOpenTimer?: (config: ExerciseTimerConfig) => void
  illustration?: ReactNode
  accent?: AccentKey
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#000" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 13 9 18 20 6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor">
      <path d="M7 5v14l11-7z" />
    </svg>
  )
}

function timerButtonLabel(timerType: ExerciseTimerType, config?: ExerciseTimerConfig): string {
  if (timerType === 'countdown') {
    const c = config as CountdownConfig
    return `${c.label} · ${c.seconds}s`
  }
  if (timerType === 'repeater') {
    const c = config as RepeaterConfig
    return `REPEATER · ${c.hold}s/${c.rest}s ×${c.reps}`
  }
  return ''
}

export function ExerciseCard({
  title, subtitle, done, onToggle,
  timerType = 'none', timerConfig, onOpenTimer,
  illustration, accent = 'griplab',
}: ExerciseCardProps) {
  const color = ACCENT_HEX[accent]
  const hasTimer = timerType !== 'none' && timerConfig && onOpenTimer

  return (
    <div className={[
      'flex gap-3 items-start rounded-[14px] p-[14px] mb-2.5 transition-all duration-200 animate-slide-in',
      done ? 'opacity-50 border border-transparent bg-bg2' : 'border border-line bg-card',
    ].join(' ')}>
      <button
        onClick={onToggle}
        className={[
          'flex-none w-7 h-7 rounded-[8px] grid place-items-center mt-[1px] transition-all duration-[180ms]',
          done ? 'animate-scale-pulse' : 'border-2 border-line bg-transparent',
        ].join(' ')}
        style={done ? { background: '#9fd17a', border: '1px solid #9fd17a' } : undefined}
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
        {hasTimer && (
          <button
            onClick={() => onOpenTimer!(timerConfig!)}
            className="mt-[11px] inline-flex items-center gap-[7px] rounded-full px-[13px] py-[7px] text-[11.5px] font-medium tracking-[0.05em] uppercase transition-opacity active:scale-95"
            style={{ border: `1px solid ${color}`, color }}
          >
            <PlayIcon />
            {timerButtonLabel(timerType, timerConfig)}
          </button>
        )}
      </div>

      {illustration && (
        <div className={`${done ? 'opacity-60' : ''} transition-opacity duration-200 self-center`}>
          {illustration}
        </div>
      )}
    </div>
  )
}
