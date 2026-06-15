import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { AuthScreen } from './AuthScreen'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const { isOnline } = useOnlineStatus()

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0e0d0b' }}>
        <div
          className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: '#2c2820', borderTopColor: '#ff4a1c' }}
        />
      </div>
    )
  }

  if (!user) return <AuthScreen />

  return (
    <>
      {!isOnline && (
        <div
          className="fixed top-0 inset-x-0 z-50 py-1.5 text-center text-[11px] tracking-[0.08em] uppercase"
          style={{ background: '#2c2820', color: '#8a8273' }}
        >
          Offline — data will sync when connected
        </div>
      )}
      {children}
    </>
  )
}
