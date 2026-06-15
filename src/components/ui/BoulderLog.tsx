import { useState } from 'react'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

type Result = 'send' | 'fall' | 'project'

export interface LogEntry {
  id: string
  grade: string
  result: Result
  timestamp: string
}

interface BoulderLogProps {
  grades?: string[]
  entries: LogEntry[]
  onLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  onDelete: (id: string) => void
  sentGrades?: string[]
  accent?: AccentKey
}

const RESULT_LABEL: Record<Result, string> = { send: '✓ Send', fall: '✗ Fall', project: '◎ Project' }
const RESULT_COLOR: Record<Result, string> = { send: '#9fd17a', fall: '#ff4a1c', project: '#f59e0b' }

export function BoulderLog({
  grades = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7+'],
  entries,
  onLog,
  onDelete,
  sentGrades = [],
  accent = 'griplab',
}: BoulderLogProps) {
  const [grade, setGrade] = useState(grades[0])
  const color = ACCENT_HEX[accent]

  function handleResult(result: Result) {
    onLog({ grade, result })
  }

  return (
    <div>
      {/* Grade selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] mb-3">
        {grades.map(g => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className="flex-none rounded-full px-3.5 py-2 text-[12px] tracking-[0.08em] uppercase font-medium transition-all duration-150"
            style={
              g === grade
                ? { background: color, color: '#0e0d0b' }
                : sentGrades.includes(g)
                  ? { background: '#9fd17a18', border: '1px solid #9fd17a44', color: '#9fd17a' }
                  : { background: '#161410', border: '1px solid #2c2820', color: '#8a8273' }
            }
          >
            {g}
          </button>
        ))}
      </div>

      {/* Result buttons */}
      <div className="flex gap-2 mb-5">
        {(['send', 'fall', 'project'] as Result[]).map(r => (
          <button
            key={r}
            onClick={() => handleResult(r)}
            className="flex-1 py-3 rounded-[10px] text-[12px] tracking-[0.06em] uppercase font-semibold transition-all duration-150 active:scale-95"
            style={{ background: `${RESULT_COLOR[r]}22`, color: RESULT_COLOR[r], border: `1px solid ${RESULT_COLOR[r]}44` }}
          >
            {RESULT_LABEL[r]}
          </button>
        ))}
      </div>

      {/* Entries list */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {[...entries].reverse().map(e => (
            <div key={e.id} className="flex items-center gap-3 rounded-[10px] bg-card border border-line px-3.5 py-2.5">
              <span className="font-display font-black text-[18px] text-chalk">{e.grade}</span>
              <span className="text-[12px] uppercase tracking-[0.06em] font-medium flex-1" style={{ color: RESULT_COLOR[e.result] }}>
                {RESULT_LABEL[e.result]}
              </span>
              <span className="text-[10.5px] text-muted">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <button
                onClick={() => onDelete(e.id)}
                className="text-muted hover:text-chalk transition-colors w-6 h-6 grid place-items-center"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
