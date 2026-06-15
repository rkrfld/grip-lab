import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BrandHeader } from '../components/ui'
import { gymStorage, userProfile } from '../lib/storage'

type Step = 'gym' | 'profile'
type GradingSystem = 'hueco' | 'font' | 'custom'

const SYSTEM_OPTIONS: { value: GradingSystem; label: string; sub: string }[] = [
  { value: 'hueco',  label: 'Hueco V-scale', sub: 'V0 – V10+' },
  { value: 'font',   label: 'Fontainebleau', sub: '6A – 8B+' },
  { value: 'custom', label: 'Gym custom',    sub: '1 – 10' },
]

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

const inputStyle = {
  background: '#1b1813',
  border: '1px solid #2c2820',
  color: '#f3ede0',
} as const

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('gym')

  const [gymName, setGymName] = useState('')
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>('hueco')
  const [gymError, setGymError] = useState<string | null>(null)
  const [gymSubmitting, setGymSubmitting] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [handle, setHandle] = useState('')
  const [level, setLevel] = useState<typeof LEVELS[number]>('beginner')
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  async function handleGymSubmit(e: FormEvent) {
    e.preventDefault()
    setGymError(null)
    setGymSubmitting(true)
    const { error } = await gymStorage.add({ name: gymName.trim(), grading_system: gradingSystem, is_home: true })
    setGymSubmitting(false)
    if (error) { setGymError(error); return }
    setStep('profile')
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setProfileSubmitting(true)
    await userProfile.update({
      display_name: displayName.trim() || null,
      handle: handle.trim() ? `@${handle.replace(/^@/, '')}` : null,
      current_level: level,
    })
    setProfileSubmitting(false)
    navigate('/climb-day', { replace: true })
  }

  function handleSkipProfile() {
    navigate('/climb-day', { replace: true })
  }

  return (
    <AppShell accent="session">
      {step === 'gym' ? (
        <>
          <BrandHeader
            brand="wallhatesme · grip lab"
            line1="YOUR"
            line2="HOME GYM"
            accent="session"
          />
          <form onSubmit={handleGymSubmit} className="flex flex-col gap-3 mt-8">
            <input
              type="text"
              placeholder="Gym name"
              value={gymName}
              onChange={e => setGymName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-[14px] outline-none"
              style={inputStyle}
            />

            <div className="flex flex-col gap-2 mt-1">
              {SYSTEM_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGradingSystem(opt.value)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-left transition-all"
                  style={
                    gradingSystem === opt.value
                      ? { background: '#a3e63522', border: '1px solid #a3e635', color: '#f3ede0' }
                      : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
                  }
                >
                  <span className="text-[13px]">{opt.label}</span>
                  <span className="text-[11px]" style={{ color: '#8a8273' }}>{opt.sub}</span>
                </button>
              ))}
            </div>

            {gymError && (
              <p className="text-[12px] text-center" style={{ color: '#ff4a1c' }}>{gymError}</p>
            )}

            <button
              type="submit"
              disabled={gymSubmitting}
              className="w-full py-3 rounded-lg text-[13px] font-semibold tracking-[0.05em] uppercase transition-opacity mt-2"
              style={{ background: '#a3e635', color: '#0e0d0b', opacity: gymSubmitting ? 0.6 : 1 }}
            >
              {gymSubmitting ? '…' : 'Continue →'}
            </button>
          </form>
        </>
      ) : (
        <>
          <BrandHeader
            brand="wallhatesme · grip lab"
            line1="YOUR"
            line2="PROFILE"
            accent="session"
          />
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3 mt-8">
            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-[14px] outline-none"
              style={inputStyle}
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: '#8a8273' }}>@</span>
              <input
                type="text"
                placeholder="handle"
                value={handle}
                onChange={e => setHandle(e.target.value.replace(/^@/, ''))}
                className="w-full pl-8 pr-4 py-3 rounded-lg text-[14px] outline-none"
                style={inputStyle}
              />
            </div>

            <div className="flex gap-2 mt-1">
              {LEVELS.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className="flex-1 py-2.5 rounded-lg text-[12px] tracking-[0.04em] capitalize transition-all"
                  style={
                    level === l
                      ? { background: '#a3e63522', border: '1px solid #a3e635', color: '#f3ede0' }
                      : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
                  }
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={profileSubmitting}
              className="w-full py-3 rounded-lg text-[13px] font-semibold tracking-[0.05em] uppercase transition-opacity mt-2"
              style={{ background: '#a3e635', color: '#0e0d0b', opacity: profileSubmitting ? 0.6 : 1 }}
            >
              {profileSubmitting ? '…' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={handleSkipProfile}
              className="text-[12px] text-center tracking-[0.06em] text-muted mt-1"
            >
              Skip for now
            </button>
          </form>
        </>
      )}
    </AppShell>
  )
}
