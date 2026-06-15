import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader, HomeCard } from '../components/ui'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function formatDate() {
  const d = new Date()
  return `${DAY_NAMES[d.getDay()].toUpperCase()} · ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export function Home() {
  const navigate = useNavigate()
  return (
    <AppShell accent="griplab">
      <BrandHeader
        brand="wallhatesme · grip lab"
        line1="GRIP"
        line2="LAB"
        accent="griplab"
        subtitle={formatDate()}
      />
      <div className="flex flex-col gap-3 mt-6">
        <HomeCard
          icon={<span style={{ fontSize: 20 }}>✊</span>}
          name="Hand Lab"
          subtitle="Daily grip training · 7 workouts"
          timeContext="Any time"
          accent="griplab"
          onClick={() => navigate('/hand-lab')}
        />
        <HomeCard
          icon={<span style={{ fontSize: 20 }}>🧗</span>}
          name="Climb Day"
          subtitle="Warm up · Session · Cool down"
          timeContext="Before climbing"
          accent="session"
          onClick={() => navigate('/climb-day')}
        />
      </div>
    </AppShell>
  )
}
