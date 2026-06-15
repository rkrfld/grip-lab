import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface PhaseCompleteCardProps {
  phaseNum: number
  nextPhaseName?: string
  nextPhaseSubtitle?: string
  onContinue: () => void
  accent?: AccentKey
}

export function PhaseCompleteCard({ phaseNum, nextPhaseName, nextPhaseSubtitle, onContinue, accent = 'griplab' }: PhaseCompleteCardProps) {
  const color = ACCENT_HEX[accent]
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: '#9fd17a22' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9fd17a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 13 9 18 20 6" />
        </svg>
      </div>
      <div className="text-[12px] tracking-[0.22em] uppercase text-muted mb-1">Phase {phaseNum} complete</div>
      {nextPhaseName && (
        <div className="rounded-[14px] border border-line bg-card px-6 py-4 my-5 w-full max-w-[280px]">
          <div className="text-[11px] tracking-[0.1em] uppercase text-muted mb-1">Up next</div>
          <div className="font-display font-extrabold text-[22px] uppercase text-chalk">{nextPhaseName}</div>
          {nextPhaseSubtitle && (
            <div className="text-[12px] text-muted mt-1">{nextPhaseSubtitle}</div>
          )}
        </div>
      )}
      <button
        onClick={onContinue}
        className="rounded-full px-8 py-3.5 text-[13px] font-semibold tracking-[0.06em] uppercase"
        style={{ background: color, color: '#0e0d0b' }}
      >
        {nextPhaseName ? `Start ${nextPhaseName}` : 'Continue'}
      </button>
    </div>
  )
}
