import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

interface StreakDotsProps {
  days: boolean[]
  todayIndex: number
  accent?: AccentKey
}

export function StreakDots({ days, todayIndex, accent = 'griplab' }: StreakDotsProps) {
  const color = ACCENT_HEX[accent]
  return (
    <div className="flex gap-2 items-center justify-center py-2">
      {days.map((active, i) => {
        const isToday = i === todayIndex
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-200"
              style={{
                background: active ? color : '#2c2820',
                boxShadow: active && isToday ? `0 0 8px ${color}` : 'none',
                transform: isToday ? 'scale(1.25)' : 'scale(1)',
              }}
            />
            <span className="text-[9px] tracking-[0.08em] uppercase" style={{ color: isToday ? color : '#8a8273' }}>
              {DAY_LABELS[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
