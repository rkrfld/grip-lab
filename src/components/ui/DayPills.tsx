import { useEffect, useRef } from 'react'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

export interface DayItem {
  key: string
  label: string
  isToday: boolean
}

interface DayPillsProps {
  days: DayItem[]
  active: string
  onChange: (key: string) => void
  accent?: AccentKey
}

export function DayPills({ days, active, onChange, accent = 'griplab' }: DayPillsProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
      {days.map(day => {
        const isActive = day.key === active
        return (
          <button
            key={day.key}
            ref={isActive ? activeRef : undefined}
            onClick={() => onChange(day.key)}
            className={[
              'flex-none flex items-center gap-1 rounded-full px-3.5 py-2 text-[12px] tracking-[0.08em] uppercase transition-all duration-[180ms]',
              isActive
                ? 'bg-chalk text-black border border-chalk font-semibold'
                : 'bg-bg2 text-muted border border-line font-medium',
            ].join(' ')}
          >
            {day.label}
            {day.isToday && (
              <span className="text-sm leading-none" style={{ color: ACCENT_HEX[accent] }}>•</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
