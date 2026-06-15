import { useState } from 'react'
import { TimerOverlay } from './TimerOverlay'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface RestTimerProps {
  presets?: number[]
  defaultPreset?: number
  hint?: string
  accent?: AccentKey
  settings?: { soundEnabled: boolean; hapticEnabled: boolean }
}

export function RestTimer({
  presets = [30, 60, 90, 120],
  defaultPreset = 60,
  hint,
  accent = 'griplab',
  settings = { soundEnabled: true, hapticEnabled: true },
}: RestTimerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultPreset)
  const color = ACCENT_HEX[accent]

  function start(seconds: number) {
    setSelected(seconds)
    setOpen(true)
  }

  return (
    <>
      <div className="rounded-[14px] border border-line bg-card px-[18px] py-4">
        {hint && (
          <div className="text-[11.5px] text-muted mb-3">{hint}</div>
        )}
        <div className="flex gap-2 flex-wrap">
          {presets.map(s => (
            <button
              key={s}
              onClick={() => start(s)}
              className="rounded-full px-4 py-2 text-[12px] tracking-[0.06em] uppercase font-medium transition-all duration-150"
              style={
                s === selected
                  ? { background: color, color: '#0e0d0b' }
                  : { background: '#161410', border: '1px solid #2c2820', color: '#8a8273' }
              }
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      <TimerOverlay
        open={open}
        onClose={() => setOpen(false)}
        mode="countdown"
        config={{ seconds: selected, label: 'REST' }}
        accent={accent}
        settings={settings}
      />
    </>
  )
}
