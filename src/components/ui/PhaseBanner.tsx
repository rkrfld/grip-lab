import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface PhaseBannerProps {
  phaseNum: number
  phaseName: string
  duration: string
  location?: string
  subtitle?: string
  accent?: AccentKey
}

export function PhaseBanner({ phaseNum, phaseName, duration, location, subtitle, accent = 'griplab' }: PhaseBannerProps) {
  const color = ACCENT_HEX[accent]
  return (
    <div className="rounded-[14px] border border-line bg-card px-[18px] py-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color }}>
          Phase {phaseNum}
        </span>
        <span className="text-[11px] tracking-[0.08em] text-muted">{duration}</span>
      </div>
      <div className="font-display font-extrabold text-[26px] leading-none uppercase text-chalk mb-1">
        {phaseName}
      </div>
      {location && (
        <div className="text-[11.5px] text-muted mt-1">📍 {location}</div>
      )}
      {subtitle && (
        <div className="text-[12px] text-muted leading-[1.5] mt-1">{subtitle}</div>
      )}
    </div>
  )
}
