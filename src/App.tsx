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
  const menuColor = plan.color === 'cool' ? 'var(--cool)' : 'var(--accent)'

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

  return (
    <>
      <div style={{ '--menucol': menuColor } as React.CSSProperties}>
        <div className="max-w-[460px] mx-auto px-[18px]">

          <header className="pt-[26px] pb-[14px]">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-muted">
              <span className="w-[7px] h-[7px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] inline-block" />
              wallhatesme · grip lab
            </div>
            <h1 className="font-display font-black text-[clamp(48px,17vw,76px)] leading-[0.84] tracking-[-0.01em] uppercase mt-1.5">
              HAND<br /><span className="text-accent">LAB</span>
            </h1>
            <div className="mt-2.5 text-[12px] text-muted tracking-[0.04em]">
              {formatDate()}
            </div>
          </header>

          <div className="mt-5 mb-1.5">
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

          <div className="flex items-center gap-2.5 mb-4 text-[12px] text-muted">
            <span>{doneCount} / {totalCount}</span>
            <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.3,1,0.4,1)]"
                style={{ width: `${progress}%`, background: menuColor }}
              />
            </div>
          </div>

          <ExerciseList
            exercises={plan.exercises}
            doneSet={doneSet}
            animKey={selectedDay}
            onToggle={toggleDone}
            onOpenTimer={setTimerConfig}
          />

          <footer className="mt-[22px] text-center text-[10.5px] text-muted tracking-[0.05em] leading-[1.7]">
            Warm the fingers up before any hard squeeze. Stop on sharp pain in fingers/elbow.<br />
            <b className="text-accent font-medium">No</b> heavy grip training on days after hard climbing.
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
