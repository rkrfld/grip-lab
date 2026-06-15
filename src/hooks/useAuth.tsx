import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../lib/auth'
import {
  getSession,
  onAuthStateChange,
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
} from '../lib/auth'
import { syncQueue } from '../lib/syncQueue'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: typeof signIn
  signUp: typeof signUp
  signInWithGoogle: typeof signInWithGoogle
  signOut: typeof signOut
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(session => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const unsubscribe = onAuthStateChange(nextUser => {
      setUser(nextUser)
      setLoading(false)
      if (nextUser) syncQueue.flush()
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
