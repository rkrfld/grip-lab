import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AppShell, BrandHeader } from '../../components/ui'
import { toVLabel } from '../../lib/gradeConversion'
import type { Session, Attempt } from '../../lib/types'

interface RecapState {
  session: Session
  attempts: Attempt[]
}

export function SessionRecap() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RecapState | null

  if (!state?.session) return <Navigate to="/climb-day" replace />

  const { session, attempts } = state
  const sends = attempts.filter(a => a.result === 'send')
  const falls = attempts.filter(a => a.result === 'fall')
  const projects = attempts.filter(a => a.result === 'project')
  const maxSendV = sends.reduce((m, a) => Math.max(m, a.v_grade ?? -1), -1)
  const duration = session.duration_minutes ?? 0

  return (
    <AppShell accent="session">
      <BrandHeader
        brand="wallhatesme · grip lab"
        line1="SESSION"
        line2="DONE"
        accent="session"
        subtitle={`${duration} MIN · ${attempts.length} ATTEMPTS`}
      />

      <div className="mt-8 rounded-[14px] border border-line bg-card px-[18px] py-5 text-center">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">Best Send</div>
        <div className="font-display font-black text-[56px] leading-none" style={{ color: '#a3e635' }}>
          {maxSendV >= 0 ? toVLabel(maxSendV) : '—'}
        </div>
      </div>

      <div className="mt-3 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Breakdown</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="font-display font-black text-[28px]" style={{ color: '#9fd17a' }}>{sends.length}</div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Sends</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-[28px]" style={{ color: '#ff4a1c' }}>{falls.length}</div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Falls</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-[28px]" style={{ color: '#f59e0b' }}>{projects.length}</div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Projects</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 mb-6">
        <button
          onClick={() => navigate('/climb-day/cooldown')}
          className="w-full rounded-full py-3 text-[13px] tracking-[0.08em] uppercase font-semibold bg-chalk text-black"
        >
          Cool Down
        </button>
        <button
          onClick={() => navigate('/climb-day')}
          className="w-full rounded-full py-3 text-[12px] tracking-[0.08em] uppercase border border-line text-muted"
        >
          Back to Home
        </button>
      </div>
    </AppShell>
  )
}
