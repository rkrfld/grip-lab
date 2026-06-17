import { useMemo, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { CompactOverlay, type RecapScheme } from '../recap/CompactOverlay'
import { DetailedOverlay } from '../recap/DetailedOverlay'
import { deriveRecap } from '../../lib/recapData'
import type { Session, UserGym } from '../../lib/types'

type Variant = 'compact' | 'detailed'

interface RecapExportProps {
  sessions: Session[]
  gyms: UserGym[]
  handle: string
  onGoToSession?: () => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}`
}

export function RecapExport({ sessions, gyms, handle, onGoToSession }: RecapExportProps) {
  const recent = useMemo(() => sessions.slice(0, 5), [sessions])
  const [selectedId, setSelectedId] = useState<string | null>(recent[0]?.id ?? null)
  const [variant, setVariant] = useState<Variant>('compact')
  const [scheme, setScheme] = useState<RecapScheme>('original')
  const [busy, setBusy] = useState(false)
  const [exportedUrl, setExportedUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const captureRef = useRef<HTMLDivElement>(null)

  const selectedSession = recent.find(s => s.id === selectedId) ?? recent[0] ?? null
  const gymId = selectedSession?.gym_id ?? selectedSession?.attempts?.[0]?.gym_id ?? null
  const gymName = gymId ? gyms.find(g => g.id === gymId)?.name ?? null : null
  const data = selectedSession ? deriveRecap(selectedSession, handle, gymName) : null

  if (!selectedSession || !data || data.totalAttempts === 0) {
    return (
      <div className="rounded-[14px] border border-line bg-card px-[18px] py-4">
        <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Share Your Session</div>
        <p className="text-[12px] text-muted leading-[1.5] mb-3">
          No session data yet. Log your attempts in Session first.
        </p>
        {onGoToSession && (
          <button
            onClick={onGoToSession}
            className="w-full py-2.5 rounded-lg text-[12px] tracking-[0.06em] uppercase border border-line text-chalk"
          >
            Go to Session →
          </button>
        )}
      </div>
    )
  }

  async function handleDownload() {
    if (!captureRef.current || busy) return
    setBusy(true)
    setErrorMsg(null)
    if (exportedUrl) {
      URL.revokeObjectURL(exportedUrl)
      setExportedUrl(null)
    }
    try {
      if (document.fonts?.ready) await document.fonts.ready
      const rect = captureRef.current.getBoundingClientRect()
      const blob = await toBlob(captureRef.current, {
        pixelRatio: 2,
        backgroundColor: 'transparent',
        width: rect.width,
        height: rect.height,
        style: {
          position: 'static',
          left: 'auto',
          top: 'auto',
          transform: 'none',
        },
      })
      if (!blob) {
        setErrorMsg('Could not render image.')
        return
      }

      const safeDate = data!.date.replace(/\s/g, '-')
      const filename = `griplab-${safeDate}-${variant}.png`

      if (isIOS && typeof navigator.canShare === 'function') {
        try {
          const file = new File([blob], filename, { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Grip Lab session' })
            return
          }
        } catch (e: unknown) {
          const name = e instanceof Error ? e.name : ''
          if (name === 'AbortError') return
        }
      }

      const url = URL.createObjectURL(blob)

      if (isIOS) {
        setExportedUrl(url)
        return
      }

      const link = document.createElement('a')
      link.download = filename
      link.href = url
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setErrorMsg(`Export failed: ${msg}`)
    } finally {
      setBusy(false)
    }
  }

  const Overlay = variant === 'compact' ? CompactOverlay : DetailedOverlay

  return (
    <div className="rounded-[14px] border border-line bg-card px-[18px] py-4">
      <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Share Your Session</div>

      {recent.length > 1 && (
        <div className="flex gap-2 mb-3 overflow-x-auto -mx-1 px-1 pb-1">
          {recent.map(s => {
            const count = s.attempts?.length ?? 0
            const isSelected = s.id === selectedSession.id
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[11px] tracking-[0.04em] transition-all whitespace-nowrap"
                style={
                  isSelected
                    ? { background: '#a3e63522', border: '1px solid #a3e63566', color: '#f3ede0' }
                    : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
                }
              >
                {shortDate(s.session_date)} · {count}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-2 mb-2">
        {(['compact', 'detailed'] as Variant[]).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className="flex-1 py-2 rounded-lg text-[12px] capitalize transition-all"
            style={
              variant === v
                ? { background: '#a3e63522', border: '1px solid #a3e63566', color: '#f3ede0' }
                : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
            }
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {([['original', 'Original'], ['mono', 'Mono']] as Array<[RecapScheme, string]>).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setScheme(key)}
            className="flex-1 py-2 rounded-lg text-[12px] transition-all"
            style={
              scheme === key
                ? { background: '#a3e63522', border: '1px solid #a3e63566', color: '#f3ede0' }
                : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="rounded-[10px] mb-4 overflow-hidden flex items-center justify-center"
        style={{
          background:
            'repeating-linear-gradient(45deg, #1b1813 0 8px, #161310 8px 16px)',
          padding: 12,
        }}
      >
        <div
          style={{
            transform: 'scale(0.62)',
            transformOrigin: 'center center',
            display: 'inline-block',
          }}
        >
          <Overlay data={data} scheme={scheme} />
        </div>
      </div>

      <div
        ref={captureRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          display: 'inline-block',
          pointerEvents: 'none',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <Overlay data={data} scheme={scheme} />
      </div>

      <button
        onClick={handleDownload}
        disabled={busy}
        className="w-full py-2.5 rounded-lg text-[12px] tracking-[0.06em] uppercase transition-all disabled:opacity-50"
        style={{ background: '#a3e635', color: '#0e0d0b', fontWeight: 600 }}
      >
        {busy ? 'Rendering…' : '↓ Download PNG'}
      </button>

      {errorMsg && (
        <p className="text-[11px] mt-3 leading-[1.5] text-center" style={{ color: '#ff4a1c' }}>
          {errorMsg}
        </p>
      )}

      {exportedUrl && (
        <div className="mt-3">
          <p className="text-[11px] text-muted mb-2 leading-[1.5] text-center">
            📱 Long-press the image below to save it to Photos.
          </p>
          <img
            src={exportedUrl}
            alt="Session recap"
            className="block w-full rounded-[10px]"
            style={{ background: '#1b1813' }}
          />
        </div>
      )}
    </div>
  )
}
