import type { ReactNode } from 'react'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface HomeCardProps {
  icon: ReactNode
  name: string
  subtitle: string
  timeContext?: string
  accent?: AccentKey
  onClick: () => void
}

export function HomeCard({ icon, name, subtitle, timeContext, accent = 'griplab', onClick }: HomeCardProps) {
  const color = ACCENT_HEX[accent]
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[14px] border border-line bg-card overflow-hidden relative active:scale-[0.98] transition-transform duration-150"
    >
      <div
        className="absolute top-0 right-0 w-[35%] h-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}18)` }}
      />
      <div className="px-[18px] py-5 relative z-10 flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-none"
          style={{ background: `${color}22` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          {timeContext && (
            <div className="text-[10.5px] tracking-[0.14em] uppercase text-muted mb-0.5">{timeContext}</div>
          )}
          <div className="font-display font-extrabold text-[22px] uppercase text-chalk leading-none">{name}</div>
          <div className="text-[12px] text-muted mt-1 leading-[1.4]">{subtitle}</div>
        </div>
        <div className="self-center" style={{ color }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </button>
  )
}
