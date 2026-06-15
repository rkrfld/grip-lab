import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader, GradeBarChart, StreakDots } from '../../components/ui'
import { RecapExport } from '../../components/climbday/RecapExport'
import { sessionLog, streakData } from '../../lib/storage'
import { toVLabel } from '../../lib/gradeConversion'
import type { Session, Attempt } from '../../lib/types'

function getDayStrings(count: number): string[] {
  const days: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function Insights() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [streak, setStreak] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sessionLog.getAll(),
      streakData.get(),
    ]).then(([sessionsResult, streakResult]) => {
      setSessions(sessionsResult.data ?? [])
      setStreak(streakResult.data ?? {})
      setLoading(false)
    })
  }, [])

  const allAttempts: Attempt[] = sessions.flatMap(s => s.attempts ?? [])
  const sends = allAttempts.filter(a => a.result === 'send')

  const gradeCount: Record<number, number> = {}
  sends.forEach(a => {
    const v = a.v_grade ?? 0
    gradeCount[v] = (gradeCount[v] ?? 0) + 1
  })
  const chartData = Object.entries(gradeCount)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([v, count]) => ({ grade: toVLabel(parseInt(v)), count }))

  const maxSendV = sends.reduce((m, a) => Math.max(m, a.v_grade ?? 0), -1)
  const highlightGrade = maxSendV >= 0 ? toVLabel(maxSendV) : undefined

  const maxAttempted = allAttempts.reduce((m, a) => Math.max(m, a.v_grade ?? 0), -1)
  const attemptsBySession: Record<string, number> = {}
  allAttempts.forEach(a => {
    attemptsBySession[a.session_id] = (attemptsBySession[a.session_id] ?? 0) + 1
  })
  const mostAttempts = Object.values(attemptsBySession).reduce((m, v) => Math.max(m, v), 0)

  const last7 = getDayStrings(7)
  const streakBools = last7.map(d => streak[d] ?? false)
  const todayIndex = 6

  const recentSessions = sessions.slice(0, 5)

  if (loading) {
    return (
      <AppShell accent="insights">
        <div className="flex items-center justify-center h-40">
          <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: '#2c2820', borderTopColor: '#8a8273' }} />
        </div>
      </AppShell>
    )
  }

  if (allAttempts.length === 0) {
    return (
      <AppShell accent="insights">
        <button
          onClick={() => navigate('/climb-day')}
          className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Climb Day
        </button>
        <BrandHeader brand="wallhatesme · grip lab" line1="IN" line2="SIGHTS" accent="insights" />
        <div className="mt-10 text-center">
          <p className="text-muted text-[14px] mb-4">No sessions yet.</p>
          <button
            onClick={() => navigate('/climb-day/session')}
            className="rounded-full px-6 py-3 text-[13px] tracking-[0.06em] uppercase border border-line text-chalk"
          >
            Start a Session
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell accent="insights">
      <button
        onClick={() => navigate('/climb-day')}
        className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Climb Day
      </button>

      <BrandHeader brand="wallhatesme · grip lab" line1="IN" line2="SIGHTS" accent="insights" />

      <div className="mt-6 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Grade Distribution</div>
        <GradeBarChart data={chartData} highlightGrade={highlightGrade} accent="insights" />
        <p className="text-[10.5px] text-muted mt-3 leading-[1.5]">
          All grades normalized to V-scale · difficulty varies by gym
        </p>
      </div>

      <div className="mt-3 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">
          Weekly Streak · {streakBools.filter(Boolean).length} this week
        </div>
        <StreakDots days={streakBools} todayIndex={todayIndex} accent="insights" />
      </div>

      <div className="mt-3 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Personal Bests</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="font-display font-black text-[24px]" style={{ color: '#a3e635' }}>
              {maxSendV >= 0 ? toVLabel(maxSendV) : '—'}
            </div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Best send</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-[24px] text-chalk">
              {maxAttempted >= 0 ? toVLabel(maxAttempted) : '—'}
            </div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Highest tried</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-[24px] text-chalk">{mostAttempts}</div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-muted mt-1">Most in session</div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Recent Sessions</div>
        <div className="flex flex-col gap-2">
          {recentSessions.map(s => {
            const att = s.attempts ?? []
            const s_count = att.filter(a => a.result === 'send').length
            const f_count = att.filter(a => a.result === 'fall').length
            const p_count = att.filter(a => a.result === 'project').length
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="text-[12px] text-muted w-[90px]">{s.session_date}</div>
                <div className="flex gap-2 text-[11px]">
                  <span style={{ color: '#9fd17a' }}>{s_count}S</span>
                  <span style={{ color: '#ff4a1c' }}>{f_count}F</span>
                  <span style={{ color: '#f59e0b' }}>{p_count}P</span>
                </div>
                <div className="text-[11px] text-muted ml-auto">{att.length} total</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 mb-6">
        <RecapExport />
      </div>
    </AppShell>
  )
}
