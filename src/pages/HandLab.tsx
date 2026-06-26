import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import workoutsData from '../data/workouts.json'
import { SplashScreen } from '../components/SplashScreen'
import { LandscapeHint } from '../components/LandscapeHint'
import { SettingsToggle } from '../components/SettingsToggle'
import { Figure } from '../assets/figures'
import {
  AppShell, BrandHeader, DayPills, ModeBanner,
  ProgressBar, ExerciseCard, TimerOverlay,
} from '../components/ui'
import type { DayItem, CountdownConfig, RepeaterConfig, ExerciseTimerConfig } from '../components/ui'
import { useSettings } from '../hooks/useSettings'

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type DayName = typeof DAYS_ORDER[number]

interface RawExercise {
  id: string
  title: string
  subtitle?: string
  type: 'reps' | 'timer' | 'repeater'
  seconds?: number
  timerLabel?: string
  hold?: number
  rest?: number
  reps?: number
  figure?: string
}

interface DayPlan {
  tag: string
  name: string
  focus: string
  color: 'accent' | 'cool'
  exercises: RawExercise[]
}

const workouts = workoutsData.days as Record<DayName, DayPlan>
const today = DAY_NAMES[new Date().getDay()] as DayName

function formatDate() {
  const d = new Date()
  return `${today.toUpperCase()} · ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

type TimerState = {
  open: boolean
  mode: 'countdown' | 'repeater'
  config: ExerciseTimerConfig
}

const DEFAULT_TIMER_STATE: TimerState = {
  open: false,
  mode: 'countdown',
  config: { seconds: 30, label: 'REST' },
}

export function HandLab() {
  const navigate = useNavigate()
  const [splash, setSplash] = useState(() => !localStorage.getItem('grip:launched'))
  const hideSplash = useCallback(() => {
    localStorage.setItem('grip:launched', 'true')
    setSplash(false)
  }, [])

  const [selectedDay, setSelectedDay] = useState<DayName>(today)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const [doneMap, setDoneMap] = useState<Record<string, Set<string>>>({})
  const [timer, setTimer] = useState<TimerState>(DEFAULT_TIMER_STATE)
  const settings = useSettings()

  const plan = workouts[selectedDay]
  const doneSet = doneMap[selectedDay] ?? new Set<string>()
  const doneCount = doneSet.size
  const totalCount = plan.exercises.length

  const days: DayItem[] = DAYS_ORDER.map(name => ({
    key: name,
    label: name.slice(0, 3),
    isToday: name === today,
  }))

  function toggleDone(id: string) {
    if (settings.hapticEnabled) navigator.vibrate?.(30)
    setDoneMap(prev => {
      const current = new Set(prev[selectedDay] ?? [])
      current.has(id) ? current.delete(id) : current.add(id)
      return { ...prev, [selectedDay]: current }
    })
  }

  function handleDayChange(day: string) {
    const prevIdx = DAYS_ORDER.indexOf(selectedDay)
    const nextIdx = DAYS_ORDER.indexOf(day as DayName)
    setSlideDir(nextIdx >= prevIdx ? 'left' : 'right')
    setSelectedDay(day as DayName)
    setTimer(DEFAULT_TIMER_STATE)
  }

  function handleOpenTimer(ex: RawExercise) {
    if (ex.type === 'timer' && ex.seconds && ex.timerLabel) {
      setTimer({ open: true, mode: 'countdown', config: { seconds: ex.seconds, label: ex.timerLabel } satisfies CountdownConfig })
    } else if (ex.type === 'repeater' && ex.hold && ex.rest && ex.reps) {
      setTimer({ open: true, mode: 'repeater', config: { hold: ex.hold, rest: ex.rest, reps: ex.reps } satisfies RepeaterConfig })
    }
  }

  return (
    <>
      {splash && <SplashScreen onDone={hideSplash} />}
      <LandscapeHint />

      <AppShell accent="griplab">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted transition-colors hover:text-chalk"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Home
        </button>
        <BrandHeader
          brand="wallhatesme · grip lab"
          line1="HAND"
          line2="LAB"
          accent="griplab"
          subtitle={formatDate()}
        />

        <div className="mt-5 mb-1.5">
          <DayPills days={days} active={selectedDay} onChange={handleDayChange} accent="griplab" />
        </div>

        <ModeBanner tag={plan.tag} name={plan.name} focus={plan.focus} accent={plan.color === 'cool' ? 'cooldown' : 'griplab'} />

        <ProgressBar current={doneCount} total={totalCount} accent="griplab" />

        <div
          key={selectedDay}
          className={slideDir === 'left' ? 'animate-slide-from-right' : 'animate-slide-from-left'}
        >
          {plan.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              title={ex.title}
              subtitle={ex.subtitle}
              done={doneSet.has(ex.id)}
              onToggle={() => toggleDone(ex.id)}
              timerType={ex.type === 'reps' ? 'none' : ex.type === 'timer' ? 'countdown' : 'repeater'}
              timerConfig={
                ex.type === 'timer' && ex.seconds && ex.timerLabel
                  ? { seconds: ex.seconds, label: ex.timerLabel }
                  : ex.type === 'repeater' && ex.hold && ex.rest && ex.reps
                  ? { hold: ex.hold, rest: ex.rest, reps: ex.reps }
                  : undefined
              }
              onOpenTimer={() => handleOpenTimer(ex)}
              illustration={ex.figure ? <Figure name={ex.figure} /> : undefined}
              accent="griplab"
            />
          ))}
        </div>

        <footer className="mt-[22px] text-center text-[10.5px] text-muted tracking-[0.05em] leading-[1.7]">
          Warm the fingers up before any hard squeeze. Stop on sharp pain in fingers/elbow.<br />
          <b className="font-medium" style={{ color: '#ff4a1c' }}>No</b> heavy grip training on days after hard climbing.
        </footer>
      </AppShell>

      <TimerOverlay
        open={timer.open}
        onClose={() => setTimer(DEFAULT_TIMER_STATE)}
        mode={timer.mode}
        config={timer.config}
        accent="griplab"
        settings={settings}
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
