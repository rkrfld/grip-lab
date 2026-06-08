import { useEffect, useRef } from 'react'

export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  async function acquire() {
    if (!('wakeLock' in navigator)) return
    try {
      lockRef.current = await navigator.wakeLock.request('screen')
    } catch {}
  }

  async function release() {
    try {
      await lockRef.current?.release()
      lockRef.current = null
    } catch {}
  }

  useEffect(() => {
    if (active) acquire()
    else release()
    return () => { release() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // iOS releases the lock when the page is hidden — re-acquire on visibility
  useEffect(() => {
    if (!active) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
