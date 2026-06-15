import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppShell, BrandHeader, PhaseRail, PhaseBanner,
  ExerciseCard, PhaseCompleteCard, TimerOverlay,
} from '../../components/ui'
import type { ExerciseTimerConfig } from '../../components/ui'
import { useSettings } from '../../hooks/useSettings'

interface WarmUpExercise {
  id: string
  title: string
  subtitle?: string
  tip?: string
  timerSeconds?: number
  timerLabel?: string
}

interface WarmUpPhase {
  key: string
  label: string
  name: string
  duration: string
  location?: string
  subtitle?: string
  exercises: WarmUpExercise[]
}

const PHASES: WarmUpPhase[] = [
  {
    key: '0', label: 'General', name: 'General Warm-Up', duration: '5 min',
    exercises: [
      { id: 'jj',  title: 'Jumping jacks',               subtitle: '×30' },
      { id: 'as',  title: 'Arm swings — cross body',      subtitle: '×20 each direction' },
      { id: 'tr',  title: 'Torso rotations',              subtitle: '×10 each side' },
      { id: 'hc',  title: 'Hip circles',                  subtitle: '×10 each side' },
    ],
  },
  {
    key: '1', label: 'Shoulder', name: 'Shoulder Prep', duration: '7 min',
    location: 'pull-up bar area',
    exercises: [
      { id: 'ac',  title: 'Arm circles — fwd & back',     subtitle: '×10 each direction' },
      { id: 'sc',  title: 'Shoulder CARs',                subtitle: '30s each side', timerSeconds: 30, timerLabel: 'SHOULDER CARs',
        tip: 'Move as slowly as possible. If you hear a click, slow down further.' },
      { id: 'er',  title: 'External rotation',            subtitle: '×15 each side' },
      { id: 'dh',  title: 'Dead hang — passive',          subtitle: '20s',            timerSeconds: 20, timerLabel: 'DEAD HANG' },
      { id: 'sp',  title: 'Scapular pull-ups',            subtitle: '×8' },
      { id: 'ah',  title: 'Active hang shrug',            subtitle: '×8, hold top 2s' },
    ],
  },
  {
    key: '2', label: 'Fingers', name: 'Finger Activation', duration: '5 min',
    location: 'fingerboard area',
    exercises: [
      { id: 'od',  title: 'Open hand drag',               subtitle: '3×10s each hand, light', timerSeconds: 10, timerLabel: 'OPEN HAND' },
      { id: 'hcr', title: 'Half-crimp light',             subtitle: '3×7s each hand',        timerSeconds: 7,  timerLabel: 'HALF-CRIMP' },
      { id: 'tg',  title: 'Finger tendon glides',         subtitle: 'Full fist → open ×10 slow' },
      { id: 'wc',  title: 'Wrist circles',                subtitle: '20s each direction',    timerSeconds: 20, timerLabel: 'WRIST CIRCLES' },
    ],
  },
  {
    key: '3', label: 'On Wall', name: 'On-Wall Warm-Up', duration: '3 min',
    location: 'wall',
    subtitle: "Move deliberately. Don't rush.",
    exercises: [
      { id: 'v0',  title: 'V0 — focus on footwork',       subtitle: '2 problems' },
      { id: 'v1',  title: 'V1 — full movement',           subtitle: '2 problems' },
      { id: 'v2',  title: 'V2 — start reading',           subtitle: '1–2 problems' },
    ],
  },
]

export function WarmUp() {
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
    <AppShell accent="warmup">
      <button
        onClick={() => navigate('/climb-day')}
        className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Climb Day
      </button>

      <BrandHeader brand="wallhatesme · grip lab" line1="WARM" line2="UP" accent="warmup" />

      <PhaseRail
        phases={PHASES.map(p => ({ key: p.key, label: p.label }))}
        active={phaseKey}
        done={doneKeys}
        onChange={setPhaseKey}
        accent="warmup"
      />

      <PhaseBanner
        phaseNum={parseInt(phaseKey) + 1}
        phaseName={phase.name}
        duration={phase.duration}
        location={phase.location}
        subtitle={phase.subtitle}
        accent="warmup"
      />

      {allDone ? (
        isLastPhase ? (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: '#9fd17a22' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9fd17a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 13 9 18 20 6" />
              </svg>
            </div>
            <div className="text-[12px] tracking-[0.22em] uppercase text-muted mb-3">Warm-up complete</div>
            <div className="font-display font-extrabold text-[22px] uppercase text-chalk mb-6">Ready to climb. Send it. 🧗</div>
            <button
              onClick={() => navigate('/climb-day')}
              className="rounded-full px-8 py-3.5 text-[13px] font-semibold tracking-[0.06em] uppercase"
              style={{ background: '#f59e0b', color: '#0e0d0b' }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <PhaseCompleteCard
            phaseNum={parseInt(phaseKey) + 1}
            nextPhaseName={nextPhase?.name}
            nextPhaseSubtitle={nextPhase?.location ? `📍 ${nextPhase.location}` : undefined}
            onContinue={advancePhase}
            accent="warmup"
          />
        )
      ) : (
        phase.exercises.map(ex => (
          <div key={ex.id}>
            {ex.tip && (
              <div className="text-[11.5px] text-muted rounded-[10px] border border-line bg-card px-3 py-2 mb-1.5 leading-[1.5]">
                💬 {ex.tip}
              </div>
            )}
            <ExerciseCard
              title={ex.title}
              subtitle={ex.subtitle}
              done={done.has(ex.id)}
              onToggle={() => toggle(ex.id)}
              timerType={ex.timerSeconds ? 'countdown' : 'none'}
              timerConfig={ex.timerSeconds ? { seconds: ex.timerSeconds, label: ex.timerLabel ?? 'TIMER' } : undefined}
              onOpenTimer={ex.timerSeconds ? (cfg) => setTimer({ open: true, config: cfg }) : undefined}
              accent="warmup"
            />
          </div>
        ))
      )}

      <TimerOverlay
        open={timer.open}
        onClose={() => setTimer(t => ({ ...t, open: false }))}
        mode="countdown"
        config={timer.config as { seconds: number; label: string }}
        accent="warmup"
        settings={settings}
      />
    </AppShell>
  )
}
