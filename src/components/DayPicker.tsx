import { useEffect, useRef } from 'react'

const SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

const ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  days: string[]
  selected: string
  today: string
  onSelect: (day: string) => void
}

export function DayPicker({ days, selected, today, onSelect }: Props) {
  const sorted = ORDER.filter(d => days.includes(d))
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selected])

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
      {sorted.map(name => {
        const isActive = name === selected
        const isToday = name === today
        return (
          <button
            key={name}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(name)}
            className={[
              'flex-none flex items-center gap-1 rounded-full px-3.5 py-2 text-[12px] tracking-[0.08em] uppercase transition-all duration-[180ms]',
              isActive
                ? 'bg-chalk text-black border border-chalk font-semibold'
                : 'bg-bg2 text-muted border border-line font-medium',
            ].join(' ')}
          >
            {SHORT[name] ?? name}
            {isToday && (
              <span className="text-accent text-sm leading-none">•</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
