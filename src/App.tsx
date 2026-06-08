import { useState } from 'react'
import workoutsData from './data/workouts.json'
import { DayPicker } from './components/DayPicker'
import { WorkoutBanner } from './components/WorkoutBanner'
import { ExerciseList } from './components/ExerciseList'
import { TimerOverlay } from './components/TimerOverlay'
import { SettingsToggle } from './components/SettingsToggle'
import { useSettings } from './hooks/useSettings'
import type { TimerConfig } from './hooks/useTimer'
import type { Exercise } from './components/ExerciseCard'

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type DayName = typeof DAYS_ORDER[number]

interface DayPlan {
  tag: string
  name: string
  focus: string
  color: 'accent' | 'cool'
  exercises: Exercise[]
}

const workouts = workoutsData.days as Record<DayName, DayPlan>
const today = DAY_NAMES[new Date().getDay()] as DayName

function formatDate() {
  const d = new Date()
  return `${today.toUpperCase()} · ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DayName>(today)
  const [doneMap, setDoneMap] = useState<Record<string, Set<string>>>({})
  const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null)
  const settings = useSettings()

  const plan = workouts[selectedDay]
  const doneSet = doneMap[selectedDay] ?? new Set<string>()
  const doneCount = doneSet.size
  const totalCount = plan.exercises.length
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  function toggleDone(id: string) {
    setDoneMap(prev => {
      const current = new Set(prev[selectedDay] ?? [])
      current.has(id) ? current.delete(id) : current.add(id)
      return { ...prev, [selectedDay]: current }
    })
  }

  function handleDaySelect(day: string) {
    setSelectedDay(day as DayName)
    setTimerConfig(null)
  }

  const menuColor = plan.color === 'cool' ? 'var(--cool)' : 'var(--accent)'

  return (
    <>
      <div style={{ '--menucol': menuColor } as React.CSSProperties}>
        <div style={{ maxWidth: 460, margin: '0 auto', padding: '0 18px' }}>
          <header style={{ padding: '26px 0 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)', display: 'inline-block' }} />
              wallhatesme · grip lab
            </div>
            <h1 style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(48px, 17vw, 76px)',
              lineHeight: 0.84,
              letterSpacing: '-0.01em',
              marginTop: 6,
              textTransform: 'uppercase',
            }}>
              HAND<br /><span style={{ color: 'var(--accent)' }}>LAB</span>
            </h1>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
              {formatDate()}
            </div>
          </header>

          <div style={{ margin: '20px 0 6px' }}>
            <DayPicker
              days={Object.keys(workouts)}
              selected={selectedDay}
              today={today}
              onSelect={handleDaySelect}
            />
          </div>

          <WorkoutBanner
            tag={plan.tag}
            name={plan.name}
            focus={plan.focus}
            color={plan.color}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>
            <span>{doneCount} / {totalCount}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--line)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: menuColor,
                transition: 'width 0.35s cubic-bezier(0.3,1,0.4,1)',
                borderRadius: 99,
              }} />
            </div>
          </div>

          <ExerciseList
            exercises={plan.exercises}
            doneSet={doneSet}
            animKey={selectedDay}
            onToggle={toggleDone}
            onOpenTimer={setTimerConfig}
          />

          <footer style={{ marginTop: 22, textAlign: 'center', fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.05em', lineHeight: 1.7 }}>
            Warm the fingers up before any hard squeeze. Stop on sharp pain in fingers/elbow.<br />
            <b style={{ color: 'var(--accent)', fontWeight: 500 }}>No</b> heavy grip training on days after hard climbing.
          </footer>
        </div>
      </div>

      <TimerOverlay
        config={timerConfig}
        settings={settings}
        onClose={() => setTimerConfig(null)}
      />

      <SettingsToggle
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
        onToggleSound={settings.toggleSound}
        onToggleHaptic={settings.toggleHaptic}
      />
    </>
  )
}
