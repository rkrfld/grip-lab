import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface ProgressBarProps {
  current: number
  total: number
  accent?: AccentKey
}

export function ProgressBar({ current, total, accent = 'griplab' }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0
  const color = ACCENT_HEX[accent]
  return (
    <div className="flex items-center gap-2.5 mb-4 text-[12px] text-muted">
      <span>{current} / {total}</span>
      <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.3,1,0.4,1)]"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
