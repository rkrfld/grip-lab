import { useCallback, useEffect, useRef, useState } from 'react'
import { beep, buzz } from '../lib/audio'

export type TimerConfig =
  | { type: 'countdown'; seconds: number; label: string }
  | { type: 'repeater'; hold: number; rest: number; reps: number }

export type RepeaterPhase = 'ready' | 'hold' | 'release' | 'swap' | 'done'

export interface TimerState {
  secondsLeft: number
  totalSeconds: number
  isPaused: boolean
  phase: string
  subLabel: string
  color: string
  isActive: boolean
}

interface Settings {
  soundEnabled: boolean
  hapticEnabled: boolean
}

export function useTimer(config: TimerConfig | null, settings: Settings, onDone?: () => void) {
  const [state, setState] = useState<TimerState>({
    secondsLeft: 0, totalSeconds: 0, isPaused: false,
    phase: 'READY', subLabel: '', color: 'var(--accent)', isActive: false,
  })

  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const offsetRef = useRef<number>(0)
  const pausedAtRef = useRef<number>(0)
  const isPausedRef = useRef<boolean>(false)
  const activeRef = useRef<boolean>(false)

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    activeRef.current = false
    setState(s => ({ ...s, isActive: false, isPaused: false }))
  }, [])

  const togglePause = useCallback(() => {
    if (!activeRef.current) return
    if (!isPausedRef.current) {
      isPausedRef.current = true
      pausedAtRef.current = performance.now()
      setState(s => ({ ...s, isPaused: true }))
    } else {
      offsetRef.current += performance.now() - pausedAtRef.current
      isPausedRef.current = false
      setState(s => ({ ...s, isPaused: false }))
    }
  }, [])

  useEffect(() => {
    if (!config) { stop(); return }

    cancelAnimationFrame(rafRef.current)
    activeRef.current = true
    isPausedRef.current = false
    offsetRef.current = 0

    if (config.type === 'countdown') {
      runCountdown(config.seconds, config.label, 'var(--accent)', () => {
        beep(880, 0.18, 'sine', 0.25, settings.soundEnabled)
        beep(1100, 0.18, 'sine', 0.25, settings.soundEnabled)
        buzz([120, 60, 120], settings.hapticEnabled)
        setState(s => ({ ...s, phase: 'DONE', subLabel: '', secondsLeft: 0, isActive: false }))
        onDone?.()
      })
    } else {
      runRepeater(config.hold, config.rest, config.reps)
    }

    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  function runCountdown(
    seconds: number,
    phase: string,
    color: string,
    onComplete: () => void,
    subLabel = '',
  ) {
    const total = seconds * 1000
    startRef.current = performance.now()
    offsetRef.current = 0
    let lastWhole = Math.ceil(seconds)

    setState({ secondsLeft: lastWhole, totalSeconds: seconds, isPaused: false, phase, subLabel, color, isActive: true })

    function frame(now: number) {
      if (!activeRef.current) return
      if (isPausedRef.current) { rafRef.current = requestAnimationFrame(frame); return }
      const elapsed = now - startRef.current - offsetRef.current
      const remain = Math.max(0, total - elapsed)
      const whole = Math.ceil(remain / 1000)
      if (whole !== lastWhole) {
        lastWhole = whole
        setState(s => ({ ...s, secondsLeft: whole }))
        if (whole > 0 && whole <= 3) { beep(520, 0.08, 'sine', 0.2, settings.soundEnabled); buzz(40, settings.hapticEnabled) }
      }
      if (remain <= 0) { onComplete(); return }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
  }

  function runRepeater(hold: number, rest: number, reps: number) {
    const HANDS = ['LEFT HAND', 'RIGHT HAND']
    let handIdx = 0
    let rep = 0

    function startHand() { rep = 0; holdPhase() }

    function holdPhase() {
      rep++
      beep(880, 0.14, 'sine', 0.25, settings.soundEnabled)
      buzz(90, settings.hapticEnabled)
      runCountdown(hold, 'HOLD', 'var(--accent)', () => {
        if (rep >= reps) afterHand()
        else releasePhase()
      }, `${HANDS[handIdx]} · round ${rep}/${reps}`)
    }

    function releasePhase() {
      beep(360, 0.14, 'sine', 0.25, settings.soundEnabled)
      buzz(50, settings.hapticEnabled)
      runCountdown(rest, 'RELEASE', 'var(--cool)', () => holdPhase(), `${HANDS[handIdx]} · ${rep}/${reps} done`)
    }

    function afterHand() {
      if (handIdx === 0) { handIdx = 1; swapPhase() }
      else finish()
    }

    function swapPhase() {
      beep(700, 0.12, 'sine', 0.25, settings.soundEnabled)
      buzz([90, 70, 90], settings.hapticEnabled)
      runCountdown(8, 'SWAP HANDS', 'var(--good)', () => startHand(), 'get the right hand ready')
    }

    function finish() {
      beep(880, 0.16, 'sine', 0.25, settings.soundEnabled)
      beep(1100, 0.16, 'sine', 0.25, settings.soundEnabled)
      beep(1320, 0.2, 'sine', 0.25, settings.soundEnabled)
      buzz([120, 60, 120, 60, 180], settings.hapticEnabled)
      activeRef.current = false
      setState(s => ({ ...s, phase: 'DONE', subLabel: 'round complete · rest 60s', secondsLeft: 0, color: 'var(--good)', isActive: false }))
      onDone?.()
    }

    readyPhase()

    function readyPhase() {
      beep(500, 0.1, 'sine', 0.2, settings.soundEnabled)
      buzz(60, settings.hapticEnabled)
      runCountdown(5, 'GET READY', 'var(--good)', () => startHand(), 'left hand first')
    }
  }

  return { state, togglePause, stop }
}
