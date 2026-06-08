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

  return (
    <div style={{
      display: 'flex', gap: 6, overflowX: 'auto', padding: '0 0 4px',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {sorted.map(name => {
        const isActive = name === selected
        const isToday = name === today
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            style={{
              flex: '0 0 auto',
              border: `1px solid ${isActive ? 'var(--chalk)' : 'var(--line)'}`,
              background: isActive ? 'var(--chalk)' : 'var(--bg2)',
              color: isActive ? '#000' : 'var(--muted)',
              borderRadius: 99,
              padding: '9px 14px',
              fontSize: 12,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'background 0.18s, color 0.18s, border-color 0.18s',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {SHORT[name] ?? name}
            {isToday && (
              <span style={{ color: isActive ? 'var(--accent)' : 'var(--accent)', fontSize: 14, lineHeight: 1 }}>•</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
