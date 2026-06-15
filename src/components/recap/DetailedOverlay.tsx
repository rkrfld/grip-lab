import type { RecapData } from '../../lib/recapData'

interface Props { data: RecapData }

const LIME    = '#a3e635'
const AMBER   = '#f59e0b'
const CHALK   = '#f3ede0'
const MUTED   = '#8a8273'
const DIM     = '#5a5448'
const SEND    = '#9fd17a'
const FALL    = '#ff4a1c'
const PROJECT = '#f59e0b'
const BG      = 'rgba(14,13,11,0.76)'
const LINE    = '#2c2820'
const DISPLAY_FONT = '"Big Shoulders Display", Impact, sans-serif'
const MONO_FONT    = '"DM Mono", "SF Mono", monospace'

export function DetailedOverlay({ data }: Props) {
  return (
    <div
      style={{
        width: 480,
        height: 340,
        background: BG,
        borderRadius: 18,
        boxSizing: 'border-box',
        color: CHALK,
        fontFamily: DISPLAY_FONT,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, ${LIME}, ${AMBER})` }} />

      <div style={{ padding: '18px 24px 0 24px' }}>
        <Header data={data} />
        <GradeBars bars={data.gradeBreakdown} />
        <AttemptDots attempts={data.attempts} />
        <Legend />
      </div>

      <BottomStats data={data} />

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 22,
          fontFamily: MONO_FONT,
          fontSize: 9,
          letterSpacing: '0.22em',
          color: DIM,
        }}
      >
        GRIP LAB
      </div>
    </div>
  )
}

function Header({ data }: { data: RecapData }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: MONO_FONT, fontSize: 13, color: CHALK, letterSpacing: '0.04em' }}>
          @{data.username}
        </span>
        <span style={{ fontFamily: MONO_FONT, fontSize: 11, color: MUTED, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          · {data.date}
        </span>
      </div>
      {data.gymName && (
        <div style={{ fontFamily: MONO_FONT, fontSize: 10, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
          {data.gymName}
        </div>
      )}
    </div>
  )
}

function GradeBars({ bars }: { bars: RecapData['gradeBreakdown'] }) {
  if (bars.length === 0) {
    return <div style={{ fontFamily: MONO_FONT, fontSize: 11, color: MUTED, padding: '6px 0' }}>No sends yet</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
      {bars.slice(0, 5).map(bar => (
        <div key={bar.grade} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 14, color: CHALK, width: 32 }}>
            {bar.grade}
          </span>
          <div style={{ flex: 1, height: 10, background: '#1b1813', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.max(bar.pct, 6)}%`,
                height: '100%',
                background: LIME,
                borderRadius: 3,
              }}
            />
          </div>
          <span style={{ fontFamily: MONO_FONT, fontSize: 10, color: MUTED, letterSpacing: '0.06em', width: 60, textAlign: 'right' }}>
            {bar.sends} {bar.sends === 1 ? 'send' : 'sends'}
          </span>
        </div>
      ))}
    </div>
  )
}

function AttemptDots({ attempts }: { attempts: RecapData['attempts'] }) {
  const max = 40
  const shown = attempts.slice(0, max)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8, maxHeight: 26, overflow: 'hidden' }}>
      {shown.map((a, i) => {
        const bg = a.result === 'send' ? SEND : a.result === 'fall' ? FALL : PROJECT
        return (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: bg,
              display: 'inline-block',
            }}
          />
        )
      })}
    </div>
  )
}

function Legend() {
  const items: Array<[string, string]> = [['Send', SEND], ['Fall', FALL], ['Project', PROJECT]]
  return (
    <div style={{ display: 'flex', gap: 18, marginBottom: 14, justifyContent: 'flex-start' }}>
      {items.map(([label, color]) => (
        <div
          key={label}
          style={{
            position: 'relative',
            height: 10,
            paddingLeft: 13,
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 7,
              width: 7,
              height: 7,
              borderRadius: 2,
              background: color,
            }}
          />
          <span
            style={{
              display: 'block',
              fontFamily: MONO_FONT,
              fontSize: 10,
              lineHeight: '10px',
              color: MUTED,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

function BottomStats({ data }: { data: RecapData }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 24px 28px 24px',
        borderTop: `1px solid ${LINE}`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 24,
      }}
    >
      <Stat value={String(data.totalAttempts)} label="Attempts" />
      <Divider />
      <Stat value={String(data.totalSends)} label="Sends" />
      <Divider />
      <Stat value={data.sessionDuration != null ? `${data.sessionDuration}m` : '—'} label="Session" />
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 26, lineHeight: 1.05, color: CHALK, display: 'block' }}>
        {value}
      </span>
      <span style={{ fontFamily: MONO_FONT, fontSize: 9, lineHeight: 1, letterSpacing: '0.16em', color: MUTED, textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 28, background: LINE }} />
}
