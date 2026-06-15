import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface BrandHeaderProps {
  brand: string
  line1: string
  line2: string
  accent?: AccentKey
  subtitle?: string
}

export function BrandHeader({ brand, line1, line2, accent = 'griplab', subtitle }: BrandHeaderProps) {
  const color = ACCENT_HEX[accent]
  return (
    <header className="pt-[26px] pb-[14px]">
      <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-muted">
        <span
          className="w-[7px] h-[7px] rounded-full inline-block"
          style={{ background: color, boxShadow: `0 0 12px ${color}` }}
        />
        {brand}
      </div>
      <h1 className="font-display font-black text-[clamp(48px,17vw,76px)] leading-[0.84] tracking-[-0.01em] uppercase mt-1.5">
        {line1}<br />
        <span style={{ color }}>{line2}</span>
      </h1>
      {subtitle && (
        <div className="mt-2.5 text-[12px] text-muted tracking-[0.04em]">
          {subtitle}
        </div>
      )}
    </header>
  )
}
