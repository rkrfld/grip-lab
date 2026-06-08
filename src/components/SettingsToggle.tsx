import { useState } from 'react'
import { Settings2, Volume2, VolumeX, Vibrate } from 'lucide-react'

interface Props {
  soundEnabled: boolean
  hapticEnabled: boolean
  onToggleSound: () => void
  onToggleHaptic: () => void
}

export function SettingsToggle({ soundEnabled, hapticEnabled, onToggleSound, onToggleHaptic }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-39"
        />
      )}

      <div
        className="fixed z-40 flex flex-col items-end gap-2.5"
        style={{
          bottom: 'max(24px, calc(20px + var(--sab)))',
          right:  'max(20px, calc(20px + var(--sar)))',
        }}
      >
        {open && (
          <div className="bg-card border border-line rounded-[14px] py-1 min-w-[180px] animate-slide-up">
            <ToggleRow
              label="Sound"
              enabled={soundEnabled}
              icon={soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              onToggle={onToggleSound}
            />
            <ToggleRow
              label="Haptic"
              enabled={hapticEnabled}
              icon={<Vibrate size={15} />}
              onToggle={onToggleHaptic}
            />
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          className={[
            'w-11 h-11 rounded-full grid place-items-center border border-line transition-all duration-[180ms] shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
            open ? 'bg-chalk text-black' : 'bg-card text-muted',
          ].join(' ')}
        >
          <Settings2 size={18} />
        </button>
      </div>
    </>
  )
}

function ToggleRow({ label, enabled, icon, onToggle }: {
  label: string
  enabled: boolean
  icon: React.ReactNode
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={[
        'w-full flex items-center justify-between px-3.5 py-2.5 text-[12px] tracking-[0.05em] uppercase transition-colors duration-150',
        enabled ? 'text-chalk' : 'text-muted',
      ].join(' ')}
    >
      <span className="flex items-center gap-2">
        {icon} {label}
      </span>
      <span
        className={[
          'w-8 h-[18px] rounded-full relative flex-none transition-colors duration-200',
          enabled ? 'bg-accent' : 'bg-line',
        ].join(' ')}
      >
        <span
          className="absolute top-[3px] w-3 h-3 rounded-full bg-chalk transition-[left] duration-200"
          style={{ left: enabled ? 'calc(100% - 15px)' : '3px' }}
        />
      </span>
    </button>
  )
}
