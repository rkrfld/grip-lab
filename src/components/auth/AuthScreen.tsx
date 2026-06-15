import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function AuthScreen() {
  const { signIn, signUp, /* signInWithGoogle */ } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function switchMode(next: 'signin' | 'signup') {
    setMode(next)
    setError(null)
    setSuccessMsg(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) setError(error.message)
      } else {
        const { error, data } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else if (data.user && !data.session) {
          setSuccessMsg('Check your email to confirm your account.')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  // async function handleGoogle() {
  //   setError(null)
  //   const { error } = await signInWithGoogle()
  //   if (error) setError(error.message)
  // }

  const inputStyle = {
    background: '#1b1813',
    border: '1px solid #2c2820',
    color: '#f3ede0',
  } as const

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: '#0e0d0b' }}
    >
      <div className="w-full max-w-[360px]">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase mb-3" style={{ color: '#8a8273' }}>
          <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#ff4a1c', boxShadow: '0 0 12px #ff4a1c' }} />
          wallhatesme · grip lab
        </div>

        <h1 className="font-display font-black text-[clamp(48px,17vw,72px)] leading-[0.84] tracking-[-0.01em] uppercase mb-10">
          <span style={{ color: '#f3ede0' }}>HAND</span>
          <br />
          <span style={{ color: '#ff4a1c' }}>LAB</span>
        </h1>

        <div className="flex gap-4 mb-7">
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="text-[13px] tracking-[0.05em] pb-1 border-b transition-colors"
              style={{
                borderColor: mode === m ? '#ff4a1c' : 'transparent',
                color: mode === m ? '#f3ede0' : '#8a8273',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg text-[14px] outline-none"
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg text-[14px] outline-none"
            style={inputStyle}
          />

          {error && (
            <p className="text-[12px] text-center" style={{ color: '#ff4a1c' }}>
              {error}
            </p>
          )}
          {successMsg && (
            <p className="text-[12px] text-center" style={{ color: '#9fd17a' }}>
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg text-[13px] font-semibold tracking-[0.05em] uppercase transition-opacity mt-1"
            style={{
              background: '#ff4a1c',
              color: '#0e0d0b',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Google OAuth — disabled for now, re-enable when provider is configured
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: '#2c2820' }} />
          <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: '#8a8273' }}>or</span>
          <div className="flex-1 h-px" style={{ background: '#2c2820' }} />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 rounded-lg text-[13px] font-medium tracking-[0.03em] flex items-center justify-center gap-2.5"
          style={{ background: '#1b1813', border: '1px solid #2c2820', color: '#f3ede0' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        */}
      </div>
    </div>
  )
}
