import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface ModeBannerProps {
  tag: string
  name: string
  focus?: string
  accent?: AccentKey
}

export function ModeBanner({ tag, name, focus, accent = 'griplab' }: ModeBannerProps) {
  const color = ACCENT_HEX[accent]
  return (
    <div className="border border-line rounded-[14px] bg-gradient-to-br from-card to-bg2 overflow-hidden relative mb-[18px]">
      <div
        className="absolute top-0 right-0 w-[40%] h-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}1f)` }}
      />
      <div className="px-[18px] py-4 relative z-10">
        <div className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color }}>
          {tag}
        </div>
        <div className="font-display font-extrabold text-[30px] leading-none uppercase mt-[5px] mb-[7px] text-chalk">
          {name}
        </div>
        {focus && (
          <div className="text-[12.5px] text-muted leading-[1.5]">
            {focus}
          </div>
        )}
      </div>
    </div>
  )
}
