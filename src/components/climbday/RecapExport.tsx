import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { CompactOverlay } from '../recap/CompactOverlay'
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
  const [busy, setBusy] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)
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
    try {
      if (document.fonts?.ready) await document.fonts.ready
      const w = 480
      const h = variant === 'compact' ? 200 : 340
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const safeDate = data!.date.replace(/\s/g, '-')
      const filename = `griplab-${safeDate}-${variant}.png`

      if (isIOS) {
        const w = window.open()
        if (w) {
          w.document.write(`<img src="${dataUrl}" alt="${filename}" style="max-width:100%;display:block;margin:0 auto" />`)
          w.document.title = filename
        }
        setShowIOSHint(true)
      } else {
        const link = document.createElement('a')
        link.download = filename
        link.href = dataUrl
        link.click()
      }
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

      <div className="flex gap-2 mb-4">
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
            width: 480,
            height: variant === 'compact' ? 200 : 340,
          }}
        >
          <Overlay data={data} />
        </div>
      </div>

      <div
        ref={captureRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: 480,
          height: variant === 'compact' ? 200 : 340,
          pointerEvents: 'none',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <Overlay data={data} />
      </div>

      <button
        onClick={handleDownload}
        disabled={busy}
        className="w-full py-2.5 rounded-lg text-[12px] tracking-[0.06em] uppercase transition-all disabled:opacity-50"
        style={{ background: '#a3e635', color: '#0e0d0b', fontWeight: 600 }}
      >
        {busy ? 'Rendering…' : '↓ Download PNG'}
      </button>

      {showIOSHint && (
        <p className="text-[11px] text-muted mt-3 leading-[1.5] text-center">
          📱 Press &amp; hold the image in the new tab to save.
        </p>
      )}
    </div>
  )
}
