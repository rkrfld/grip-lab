import { useState } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'

const DISPLAY_FONT = '"Big Shoulders Display", Impact, sans-serif'
const MONO_FONT = '"DM Mono", "SF Mono", monospace'

function dismiss() {
  localStorage.removeItem('grip:show-install')
  localStorage.setItem('grip:install-prompted', 'true')
}

function AppIcon() {
  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: '#1b1813',
        border: '1px solid #2c2820',
        boxShadow: '0 0 24px rgba(255,74,28,0.35)',
        fontFamily: DISPLAY_FONT,
        fontWeight: 900,
        fontSize: 28,
        color: '#ff4a1c',
      }}
    >
      G
    </div>
  )
}

interface Step {
  icon: React.ReactNode
  title: string
  sub: string
}

const IOS_STEPS: Step[] = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7fb4c9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V4M8 8l4-4 4 4" />
        <path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </svg>
    ),
    title: "Tap the Share button",
    sub: 'Bottom center of Safari browser bar',
  },
  {
    icon: <span style={{ color: '#f3ede0', fontSize: 16, fontWeight: 600 }}>＋</span>,
    title: "Tap 'Add to Home Screen'",
    sub: 'Scroll down in the share sheet',
  },
  {
    icon: <span style={{ color: '#a3e635', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>ADD</span>,
    title: "Tap 'Add'",
    sub: 'Top right of the confirmation screen',
  },
]

export function PWAInstallPrompt() {
  const { isIOS, promptInstall } = usePWAInstall()
  const [hidden, setHidden] = useState(() => !!localStorage.getItem('grip:install-prompted'))

  if (hidden) return null

  function handleAndroidInstall() {
    promptInstall()
    dismiss()
    setHidden(true)
  }

  function handleDismiss() {
    dismiss()
    setHidden(true)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div
        onClick={handleDismiss}
        className="absolute inset-0 backdrop-blur-[6px]"
        style={{ background: 'rgba(8,7,6,0.7)' }}
      />
      <div
        className="relative w-full max-w-[480px] animate-slide-up px-5 pt-6"
        style={{
          background: '#161410',
          borderTop: '1px solid #2c2820',
          borderLeft: '1px solid #2c2820',
          borderRight: '1px solid #2c2820',
          borderRadius: '20px 20px 0 0',
          paddingBottom: 'max(24px, calc(24px + var(--sab)))',
          fontFamily: MONO_FONT,
        }}
      >
        <div className="flex items-center gap-3">
          <AppIcon />
          <div>
            <div
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 22, color: '#f3ede0', lineHeight: 1, textTransform: 'uppercase' }}
            >
              Add to Home Screen
            </div>
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-[1.5]" style={{ color: '#555' }}>
          {isIOS
            ? "Follow these steps in Safari to install Grip Lab."
            : 'Get the full Grip Lab experience — no browser bar, instant launch.'}
        </p>

        {isIOS ? (
          <div className="flex flex-col gap-3 mt-5">
            {IOS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36, borderRadius: 10, background: '#1b1813', border: '1px solid #2c2820' }}
                >
                  {step.icon}
                </div>
                <div>
                  <div className="text-[13px]" style={{ color: '#f3ede0' }}>{step.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#555' }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { icon: '⚡', label: 'Instant launch' },
              { icon: '📶', label: 'Works offline' },
              { icon: '📱', label: 'Full screen' },
            ].map(b => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 rounded-[14px] py-3 px-1 text-center"
                style={{ background: '#1b1813', border: '1px solid #2c2820' }}
              >
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span className="text-[10px] leading-[1.3]" style={{ color: '#f3ede0' }}>{b.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-6">
          {isIOS ? (
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-full text-[13px] tracking-[0.05em] uppercase transition-opacity"
              style={{ background: 'transparent', border: '1px solid #2c2820', color: '#f3ede0' }}
            >
              Got it
            </button>
          ) : (
            <>
              <button
                onClick={handleAndroidInstall}
                className="w-full py-3 rounded-full text-[13px] font-semibold tracking-[0.05em] uppercase transition-opacity"
                style={{ background: '#a3e635', color: '#0e0d0b' }}
              >
                ⬇ Add to Home Screen
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-full text-[13px] tracking-[0.05em] uppercase transition-opacity"
                style={{ background: 'transparent', border: '1px solid #2c2820', color: '#f3ede0' }}
              >
                Maybe later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
