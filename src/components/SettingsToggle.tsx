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
          style={{ position: 'fixed', inset: 0, zIndex: 39 }}
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: `max(24px, calc(20px + env(safe-area-inset-bottom)))`,
        right: 20,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}>
        {open && (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: '4px 0',
            minWidth: 180,
            animation: 'slideUp 0.2s cubic-bezier(0.3,1,0.4,1) both',
          }}>
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
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: open ? 'var(--chalk)' : 'var(--card)',
            border: '1px solid var(--line)',
            color: open ? '#000' : 'var(--muted)',
            display: 'grid', placeItems: 'center',
            transition: 'background 0.18s, color 0.18s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
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
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px', background: 'none',
        color: enabled ? 'var(--chalk)' : 'var(--muted)',
        fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase',
        transition: 'color 0.15s',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon} {label}
      </span>
      <span style={{
        width: 32, height: 18, borderRadius: 99,
        background: enabled ? 'var(--accent)' : 'var(--line)',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute',
          top: 3, left: enabled ? 'calc(100% - 15px)' : 3,
          width: 12, height: 12, borderRadius: '50%',
          background: 'var(--chalk)',
          transition: 'left 0.2s cubic-bezier(0.3,1,0.4,1)',
        }} />
      </span>
    </button>
  )
}
