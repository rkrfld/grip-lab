import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader, BoulderLog, RestTimer } from '../../components/ui'
import type { LogEntry } from '../../components/ui'
import { GymSelectorModal } from '../../components/climbday/GymSelectorModal'
import { sessionLog } from '../../lib/storage'
import { toVGrade, getGradeList } from '../../lib/gradeConversion'
import type { UserGym, Attempt } from '../../lib/types'
import { useSettings } from '../../hooks/useSettings'

type Tab = 'rest' | 'log'

export function Session() {
  const navigate = useNavigate()
  const settings = useSettings()
  const [modalOpen, setModalOpen] = useState(true)
  const [activeGym, setActiveGym] = useState<UserGym | null>(null)
  const [tab, setTab] = useState<Tab>('rest')
  const [attempts, setAttempts] = useState<Attempt[]>([])

  useEffect(() => {
    sessionLog.getToday().then(({ data }) => {
      if (data) setAttempts(data)
    })
  }, [])

  function handleGymConfirm(gym: UserGym) {
    setActiveGym(gym)
    setModalOpen(false)
    setTab('log')
  }

  async function handleLog({ grade, result }: Omit<LogEntry, 'id' | 'timestamp'>) {
    if (!activeGym) return
    const v_grade = toVGrade(grade, activeGym.grading_system)
    const { data } = await sessionLog.add({
      grade,
      result,
      raw_grade: grade,
      v_grade,
      grading_system: activeGym.grading_system,
      gym_id: activeGym.id,
    })
    if (data) setAttempts(prev => [...prev, data])
  }

  async function handleDelete(id: string) {
    await sessionLog.delete(id)
    setAttempts(prev => prev.filter(a => a.id !== id))
  }

  const sends    = attempts.filter(a => a.result === 'send').length
  const falls    = attempts.filter(a => a.result === 'fall').length
  const projects = attempts.filter(a => a.result === 'project').length
  const total    = attempts.length

  const sentGrades = [...new Set(
    attempts.filter(a => a.result === 'send').map(a => a.raw_grade ?? a.grade)
  )]

  const maxV = attempts.reduce((m, a) => Math.max(m, a.v_grade ?? 0), 0)
  const v4Hint = maxV >= 4
    ? `You're on V${maxV}. Full 3–5 min rest matters most now.`
    : 'Rest 3–5 min between hard attempts.'

  const entries: LogEntry[] = attempts.map(a => ({
    id: a.id,
    grade: a.raw_grade ?? a.grade,
    result: a.result,
    timestamp: a.logged_at,
  }))

  const grades = activeGym ? getGradeList(activeGym.grading_system) : []

  return (
    <>
      <GymSelectorModal open={modalOpen} onConfirm={handleGymConfirm} />

      <AppShell accent="session">
        <button
          onClick={() => navigate('/climb-day')}
          className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Climb Day
        </button>

        <BrandHeader
          brand={activeGym ? `session · ${activeGym.name}` : 'session'}
          line1="SESSION"
          line2=""
          accent="session"
        />

        <div className="flex border-b border-line mb-5">
          {(['rest', 'log'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 pb-2.5 pt-2 text-[11px] tracking-[0.1em] uppercase transition-colors"
              style={{
                color: tab === t ? '#a3e635' : '#8a8273',
                borderBottom: tab === t ? '2px solid #a3e635' : '2px solid transparent',
              }}
            >
              {t === 'rest' ? 'Rest Timer' : 'Boulder Log'}
            </button>
          ))}
        </div>

        {tab === 'rest' ? (
          <RestTimer
            presets={[120, 180, 300]}
            defaultPreset={180}
            hint={v4Hint}
            accent="session"
            settings={settings}
          />
        ) : (
          <BoulderLog
            grades={grades}
            entries={entries}
            onLog={handleLog}
            onDelete={handleDelete}
            sentGrades={sentGrades}
            accent="session"
          />
        )}
      </AppShell>

      {total > 0 && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 flex justify-around text-center border-t border-line bg-card"
          style={{ paddingBottom: 'max(12px, calc(12px + var(--sab)))', paddingTop: '10px' }}
        >
          {[
            { label: 'Sends',    value: sends,    color: '#9fd17a' },
            { label: 'Falls',    value: falls,    color: '#ff4a1c' },
            { label: 'Projects', value: projects, color: '#f59e0b' },
            { label: 'Total',    value: total,    color: '#f3ede0' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="font-display font-black text-[22px]" style={{ color }}>{value}</div>
              <div className="text-[9px] tracking-[0.12em] uppercase text-muted">{label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
