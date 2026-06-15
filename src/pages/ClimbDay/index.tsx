import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader } from '../../components/ui'

export function ClimbDay() {
  const navigate = useNavigate()
  return (
    <AppShell accent="session">
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
        line1="CLIMB"
        line2="DAY"
        accent="session"
        subtitle="Coming soon"
      />
      <div className="mt-10 text-center text-muted text-[13px]">
        Climb Day is coming in the next release.
      </div>
    </AppShell>
  )
}
