import { useEffect, useState } from 'react'

export function LandscapeHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (!isTouchDevice) return

    const check = () => setShow(window.innerWidth > window.innerHeight)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[80] flex items-center justify-center gap-2 bg-card/95 backdrop-blur-sm py-2 px-4 animate-fade-in"
      style={{ paddingTop: 'max(8px, calc(8px + var(--sat)))' }}
    >
      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-muted rotate-90">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M12 18h.01"/>
      </svg>
      <span className="text-[11px] text-muted tracking-[0.14em] uppercase">Best in portrait</span>
    </div>
  )
}
