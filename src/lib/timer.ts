export type OnTick = (secondsLeft: number, totalSeconds: number) => void
export type OnDone = () => void

export class TimerEngine {
  private rafId = 0
  private startMs = 0
  private offset = 0
  private pausedAt = 0
  private _paused = false
  private _active = false

  get active() { return this._active }
  get paused() { return this._paused }

  stop() {
    cancelAnimationFrame(this.rafId)
    this._active = false
    this._paused = false
  }

  pause() {
    if (!this._active || this._paused) return
    this._paused = true
    this.pausedAt = performance.now()
  }

  resume() {
    if (!this._active || !this._paused) return
    this.offset += performance.now() - this.pausedAt
    this._paused = false
  }

  countdown(
    seconds: number,
    onTick: OnTick,
    onDone: OnDone,
    onCountBeep?: () => void,
  ) {
    this._active = true
    this._paused = false
    const total = seconds * 1000
    this.startMs = performance.now()
    this.offset = 0
    let lastWhole = Math.ceil(seconds)
    onTick(lastWhole, seconds)

    const frame = (now: number) => {
      if (!this._active) return
      if (this._paused) { this.rafId = requestAnimationFrame(frame); return }
      const elapsed = now - this.startMs - this.offset
      const remain = Math.max(0, total - elapsed)
      const whole = Math.ceil(remain / 1000)
      if (whole !== lastWhole) {
        lastWhole = whole
        onTick(whole, seconds)
        if (whole > 0 && whole <= 3) onCountBeep?.()
      }
      if (remain <= 0) { onDone(); return }
      this.rafId = requestAnimationFrame(frame)
    }
    this.rafId = requestAnimationFrame(frame)
  }
}
