import type { ReactNode } from 'react'
import type { AccentKey } from './types'
import { ACCENT_HEX } from './types'

interface AppShellProps {
  accent?: AccentKey
  children: ReactNode
}

export function AppShell({ accent = 'griplab', children }: AppShellProps) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center"
      style={{ '--accent': ACCENT_HEX[accent] } as React.CSSProperties}
    >
      <div
        className="w-full max-w-[460px]"
        style={{
          paddingLeft:  'max(18px, calc(18px + var(--sal)))',
          paddingRight: 'max(18px, calc(18px + var(--sar)))',
        }}
      >
        {children}
      </div>
    </div>
  )
}
