import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppShell, BrandHeader, PhaseRail, PhaseBanner,
  ExerciseCard, PhaseCompleteCard, TimerOverlay,
} from '../../components/ui'
import type { ExerciseTimerConfig } from '../../components/ui'
import { useSettings } from '../../hooks/useSettings'

interface CoolDownExercise {
  id: string
  title: string
  subtitle?: string
  timerSeconds?: number
  timerLabel?: string
}

interface CoolDownPhase {
  key: string
  label: string
  name: string
  duration: string
  exercises: CoolDownExercise[]
}

const PHASES: CoolDownPhase[] = [
  {
    key: '0', label: 'Forearm', name: 'Forearm Flush', duration: '4 min',
    exercises: [
      { id: 'so', title: 'Shake-out forearms',          subtitle: '30s',              timerSeconds: 30,  timerLabel: 'SHAKE-OUT' },
      { id: 'ff', title: 'Finger flexor stretch',       subtitle: '20s each hand',    timerSeconds: 20,  timerLabel: 'FLEXOR STRETCH' },
      { id: 'fe', title: 'Finger extensor stretch',     subtitle: '20s each hand',    timerSeconds: 20,  timerLabel: 'EXTENSOR STRETCH' },
      { id: 'lm', title: 'Light forearm massage',       subtitle: 'Thumb press wrist → elbow' },
    ],
  },
  {
    key: '1', label: 'Shoulder', name: 'Shoulder Release', duration: '4 min',
    exercises: [
      { id: 'cb', title: 'Cross-body shoulder stretch', subtitle: '30s each side',    timerSeconds: 30,  timerLabel: 'CROSS-BODY' },
      { id: 'co', title: 'Chest opener',                subtitle: '30s',              timerSeconds: 30,  timerLabel: 'CHEST OPENER' },
      { id: 'ph', title: 'Passive hang',                subtitle: '20s',              timerSeconds: 20,  timerLabel: 'PASSIVE HANG' },
      { id: 'cp', title: "Child's pose arm reach",      subtitle: '30s',              timerSeconds: 30,  timerLabel: "CHILD'S POSE" },
    ],
  },
  {
    key: '2', label: 'Full Body', name: 'Full Body', duration: '2 min',
    exercises: [
      { id: 'hf', title: 'Hip flexor stretch',          subtitle: '20s each side',    timerSeconds: 20,  timerLabel: 'HIP FLEXOR' },
      { id: 'qs', title: 'Quad stretch',                subtitle: '20s each side',    timerSeconds: 20,  timerLabel: 'QUAD STRETCH' },
      { id: 'db', title: 'Deep breath + neck rolls',    subtitle: '5 slow breaths' },
    ],
  },
]

export function CoolDown() {
  const navigate = useNavigate()
  const settings = useSettings()
  const [phaseKey, setPhaseKey] = useState('0')
  const [doneMap, setDoneMap] = useState<Record<string, Set<string>>>({})
  const [timer, setTimer] = useState<{ open: boolean; config: ExerciseTimerConfig }>({
    open: false,
    config: { seconds: 30, label: 'TIMER' },
  })

  const phase = PHASES.find(p => p.key === phaseKey) ?? PHASES[0]
  const done = doneMap[phaseKey] ?? new Set<string>()
  const allDone = done.size === phase.exercises.length
  const isLastPhase = phaseKey === PHASES[PHASES.length - 1].key
  const nextPhase = PHASES[PHASES.indexOf(phase) + 1]
  const doneKeys = PHASES.filter(p => (doneMap[p.key]?.size ?? 0) === p.exercises.length).map(p => p.key)

  function toggle(id: string) {
    if (settings.hapticEnabled) navigator.vibrate?.(30)
    setDoneMap(prev => {
      const set = new Set(prev[phaseKey] ?? [])
      set.has(id) ? set.delete(id) : set.add(id)
      return { ...prev, [phaseKey]: set }
    })
  }

  function advancePhase() {
    if (nextPhase) setPhaseKey(nextPhase.key)
  }

  return (
    <AppShell accent="cooldown">
      <button
        onClick={() => navigate('/climb-day')}
        className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Climb Day
      </button>

      <BrandHeader brand="wallhatesme · grip lab" line1="COOL" line2="DOWN" accent="cooldown" />

      <PhaseRail
        phases={PHASES.map(p => ({ key: p.key, label: p.label }))}
        active={phaseKey}
        done={doneKeys}
        onChange={setPhaseKey}
        accent="cooldown"
      />

      <PhaseBanner
        phaseNum={parseInt(phaseKey) + 1}
        phaseName={phase.name}
        duration={phase.duration}
        accent="cooldown"
      />

      {allDone ? (
        isLastPhase ? (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: '#7fb4c922' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7fb4c9" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 13 9 18 20 6" />
              </svg>
            </div>
            <div className="text-[12px] tracking-[0.22em] uppercase text-muted mb-3">Cool-down complete</div>
            <div className="font-display font-extrabold text-[22px] uppercase text-chalk mb-6">Recovery done. Rest up. 💤</div>
            <button
              onClick={() => navigate('/climb-day')}
              className="rounded-full px-8 py-3.5 text-[13px] font-semibold tracking-[0.06em] uppercase"
              style={{ background: '#7fb4c9', color: '#0e0d0b' }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <PhaseCompleteCard
            phaseNum={parseInt(phaseKey) + 1}
            nextPhaseName={nextPhase?.name}
            onContinue={advancePhase}
            accent="cooldown"
          />
        )
      ) : (
        phase.exercises.map(ex => (
          <ExerciseCard
            key={ex.id}
            title={ex.title}
            subtitle={ex.subtitle}
            done={done.has(ex.id)}
            onToggle={() => toggle(ex.id)}
            timerType={ex.timerSeconds ? 'countdown' : 'none'}
            timerConfig={ex.timerSeconds ? { seconds: ex.timerSeconds, label: ex.timerLabel ?? 'TIMER' } : undefined}
            onOpenTimer={ex.timerSeconds ? (cfg) => setTimer({ open: true, config: cfg }) : undefined}
            accent="cooldown"
          />
        ))
      )}

      <TimerOverlay
        open={timer.open}
        onClose={() => setTimer(t => ({ ...t, open: false }))}
        mode="countdown"
        config={timer.config as { seconds: number; label: string }}
        accent="cooldown"
        settings={settings}
      />
    </AppShell>
  )
}
