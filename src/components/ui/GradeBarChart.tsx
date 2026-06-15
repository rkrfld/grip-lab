import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface GradeBar { grade: string; count: number }

interface GradeBarChartProps {
  data: GradeBar[]
  highlightGrade?: string
  accent?: AccentKey
}

export function GradeBarChart({ data, highlightGrade, accent = 'griplab' }: GradeBarChartProps) {
  const color = ACCENT_HEX[accent]
  const max = Math.max(...data.map(d => d.count), 1)

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-[12px] text-muted">No data yet</div>
    )
  }

  return (
    <div className="flex items-end gap-2 h-[120px]">
      {data.map(bar => {
        const pct = (bar.count / max) * 100
        const isHighlight = bar.grade === highlightGrade
        return (
          <div key={bar.grade} className="flex-1 flex flex-col items-center gap-1">
            {bar.count > 0 && (
              <span className="text-[10px] text-muted">{bar.count}</span>
            )}
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-[4px] transition-all duration-300"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  background: isHighlight ? color : `${color}55`,
                }}
              />
            </div>
            <span className="text-[10px] tracking-[0.04em]" style={{ color: isHighlight ? color : '#8a8273' }}>
              {bar.grade}
            </span>
          </div>
        )
      })}
    </div>
  )
}
