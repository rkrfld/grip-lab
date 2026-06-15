let audioCtx: AudioContext | null = null

export function beep(
  freq = 660,
  dur = 0.12,
  type: OscillatorType = 'sine',
  vol = 0.25,
  enabled = true,
) {
  if (!enabled) return
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.type = type
    o.frequency.value = freq
    o.connect(g)
    g.connect(audioCtx.destination)
    g.gain.setValueAtTime(vol, audioCtx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur)
    o.start()
    o.stop(audioCtx.currentTime + dur)
  } catch {}
}

export function buzz(ms: number | number[], enabled = true) {
  if (!enabled) return
  if (navigator.vibrate) navigator.vibrate(ms)
}
