import type { RecapData } from '../../lib/recapData'
import type { RecapScheme } from './CompactOverlay'

interface Props { data: RecapData; scheme?: RecapScheme }

const LIME    = '#a3e635'
const AMBER   = '#f59e0b'
const CHALK   = '#f3ede0'
const MUTED   = '#8a8273'
const SEND    = '#9fd17a'
const FALL    = '#ff4a1c'
const PROJECT = '#f59e0b'
const BG      = 'rgba(14,13,11,0.76)'
const LINE    = '#2c2820'
const DISPLAY_FONT = '"Big Shoulders Display", Impact, sans-serif'
const MONO_FONT    = '"DM Mono", "SF Mono", monospace'

export function DetailedOverlay({ data, scheme = 'original' }: Props) {
  const isMono = scheme === 'mono'
  const barColor = isMono ? CHALK : LIME
  const lineColor = isMono ? CHALK : LINE
  void barColor; void GradeBars; // kept for the commented <GradeBars /> below
  return (
    <div
      style={{
        background: isMono ? "transparent" : BG,
        borderRadius: 18,
        boxSizing: "border-box",
        color: CHALK,
        fontFamily: DISPLAY_FONT,
        display: "inline-block",
        overflow: "hidden",
        minWidth: 320,
      }}
    >
      <div
        style={{
          height: 2,
          background: isMono
            ? CHALK
            : `linear-gradient(90deg, ${LIME}, ${AMBER})`,
        }}
      />

      <div style={{ padding: "18px 24px 22px 24px" }}>
        <Header data={data} />
        {/* <GradeBars bars={data.gradeBreakdown} barColor={barColor} /> */}
        <AttemptDots attempts={data.attempts} />
        <Legend />
      </div>

      <BottomStats data={data} lineColor={lineColor} />

      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 9,
          letterSpacing: "0.22em",
          color: CHALK,
          textAlign: 'right',
          padding: '8px 22px 12px 22px',
        }}
      >
        tracked on GRIP<span style={{ color: AMBER }}>LAB</span>
      </div>
    </div>
  );
}

function Header({ data }: { data: RecapData }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: CHALK, letterSpacing: '0.04em' }}>
          @{data.username}
        </span>
        <span style={{ fontFamily: MONO_FONT, fontSize: 13, color: CHALK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          · {data.date}
        </span>
      </div>
      {data.gymName && (
        <div style={{ fontFamily: MONO_FONT, fontSize: 12, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
          {data.gymName}
        </div>
      )}
    </div>
  )
}

function GradeBars({ bars, barColor }: { bars: RecapData['gradeBreakdown']; barColor: string }) {
  if (bars.length === 0) {
    return <div style={{ fontFamily: MONO_FONT, fontSize: 13, color: MUTED, padding: '6px 0' }}>No sends yet</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
      {bars.slice(0, 5).map(bar => (
        <div key={bar.grade} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 14, color: CHALK, width: 32 }}>
            {bar.grade}
          </span>
          <div style={{ flex: 1, height: 10, background: '#1b1813', borderRadius: 3, overflow: 'hidden', transform: 'translateY(2px)' }}>
            <div
              style={{
                width: `${Math.max(bar.pct, 6)}%`,
                height: '100%',
                background: barColor,
                borderRadius: 3,
              }}
            />
          </div>
          <span style={{ fontFamily: MONO_FONT, fontSize: 12, color: CHALK, letterSpacing: '0.06em', width: 60, textAlign: 'right' }}>
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
    <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-start' }}>
      {items.map(([label, color]) => (
        <div
          key={label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 2,
              background: color,
            }}
          />
          <span
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              lineHeight: 1,
              color: CHALK,
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

function BottomStats({ data, lineColor }: { data: RecapData; lineColor: string }) {
  return (
    <div
      style={{
        padding: '12px 24px 12px 24px',
        borderTop: `1px solid ${lineColor}`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 24,
      }}
    >
      <Stat value={String(data.totalAttempts)} label="Attempts" />
      <Divider color={lineColor} />
      <Stat value={String(data.totalSends)} label="Sends" />
      <Divider color={lineColor} />
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
      <span style={{ fontFamily: MONO_FONT, fontSize: 11, lineHeight: 1, letterSpacing: '0.16em', color: CHALK, textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
    </div>
  )
}

function Divider({ color }: { color: string }) {
  return <div style={{ width: 1, height: 50, background: color }} />
}
