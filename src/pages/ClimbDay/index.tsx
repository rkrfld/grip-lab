import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader, HomeCard } from '../../components/ui'
import type { AccentKey } from '../../components/ui'
import { ACCENT_HEX } from '../../components/ui'
import { gymStorage } from '../../lib/storage'
import { useAuth } from '../../hooks/useAuth'
import { PWAInstallPrompt } from '../../components/PWAInstallPrompt'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function formatDate() {
  const d = new Date()
  return `${DAY_NAMES[d.getDay()].toUpperCase()} · ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

interface ModeCardProps {
  icon: string
  name: string
  sub: string
  accent: AccentKey
  onClick: () => void
}

function ModeCard({ icon, name, sub, accent, onClick }: ModeCardProps) {
  const color = ACCENT_HEX[accent]
  return (
    <button
      onClick={onClick}
      className="rounded-[14px] border border-line bg-card p-4 text-left relative overflow-hidden active:scale-[0.97] transition-transform duration-150"
    >
      <div
        className="absolute bottom-0 right-0 w-full h-[50%] pointer-events-none"
        style={{ background: `linear-gradient(0deg, ${color}1a, transparent)` }}
      />
      <div className="text-[22px] mb-3 relative z-10">{icon}</div>
      <div className="font-display font-extrabold text-[18px] uppercase text-chalk leading-none relative z-10">{name}</div>
      <div className="text-[11px] text-muted mt-1 relative z-10">{sub}</div>
    </button>
  )
}

export function ClimbDay() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const showInstall = !!localStorage.getItem('grip:show-install') && !localStorage.getItem('grip:install-prompted')

  useEffect(() => {
    gymStorage.getAll().then(({ data, source }) => {
      if (source !== 'cache' && data !== null && data.length === 0) {
        navigate('/onboarding', { replace: true })
      }
    })
  }, [navigate])

  return (
    <AppShell accent="session">
      {showInstall && <PWAInstallPrompt />}
      <BrandHeader
        brand="wallhatesme · grip lab"
        line1="CLIMB"
        line2="DAY"
        accent="session"
        subtitle={formatDate()}
      />

      <div className="grid grid-cols-2 gap-3 mt-6">
        <ModeCard icon="🔥" name="Warm Up" sub="4 phases · 20 min" accent="warmup" onClick={() => navigate('/climb-day/warmup')} />
        <ModeCard icon="🧗" name="Session" sub="Log + rest timer" accent="session" onClick={() => navigate('/climb-day/session')} />
        <ModeCard icon="❄️" name="Cool Down" sub="3 phases · 10 min" accent="cooldown" onClick={() => navigate('/climb-day/cooldown')} />
        <ModeCard icon="📊" name="Insights" sub="Grades + history" accent="insights" onClick={() => navigate('/climb-day/insights')} />
      </div>

      <div className="mt-3">
        <HomeCard
          icon={<span style={{ fontSize: 20 }}>✊</span>}
          name="Hand Lab"
          subtitle="Daily grip training · 7 workouts"
          timeContext="Any time"
          accent="griplab"
          onClick={() => navigate('/hand-lab')}
        />
      </div>

      <div className="mt-3 rounded-[14px] border border-line bg-card px-[18px] py-4">
        <p className="text-[12px] text-muted leading-[1.5]">
          💡 Shoulder CARs before any overhead move. Your shoulder clicks — warm it up fully.
        </p>
      </div>

      <div className="mt-6 mb-2 flex justify-center">
        <button
          onClick={() => signOut()}
          className="text-[11px] tracking-[0.1em] uppercase text-muted hover:text-chalk transition-colors"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  )
}
