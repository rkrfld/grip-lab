import type { RecapData } from '../../lib/recapData'

export type RecapScheme = 'original' | 'mono'

interface Props { data: RecapData; scheme?: RecapScheme }

const LIME   = '#a3e635'
const CHALK  = '#f3ede0'
const AMBER   = '#f59e0b'
const BG     = 'rgba(14,13,11,0.78)'
const BORDER = 'rgba(163,230,53,0.28)'
const DISPLAY_FONT = '"Big Shoulders Display", Impact, sans-serif'
const MONO_FONT    = '"DM Mono", "SF Mono", monospace'

export function CompactOverlay({ data, scheme = 'original' }: Props) {
  const isMono = scheme === 'mono'
  return (
    <div
      style={{
        background: isMono ? 'transparent' : BG,
        border: isMono ? '1px solid transparent' : `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: '18px 28px 14px 28px',
        boxSizing: 'border-box',
        color: CHALK,
        fontFamily: DISPLAY_FONT,
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center' , gap: 8}}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: LIME, display: 'inline-block' }} />
          <span style={{ fontFamily: MONO_FONT, fontSize: 11, lineHeight: 1, letterSpacing: '0.22em', color: CHALK, textTransform: 'uppercase' }}>
            GRIP LAB · SESSION
          </span>
        </div>
        {data.gymName && (
          <div style={{ fontFamily: MONO_FONT, fontSize: 10, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6, marginLeft: 15 }}>
            {data.gymName}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
        <Stat value={data.bestGrade ?? '—'} label="Best" valueColor={LIME} valueSize={56} />
        <Divider />
        <Stat value={String(data.totalSends)} label="Sends" valueColor={CHALK} valueSize={46} />
        <Divider />
        <Stat value={String(data.totalAttempts)} label="Attempts" valueColor={CHALK} valueSize={46} />
      </div>

      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 9,
          letterSpacing: '0.22em',
          color: CHALK,
          textAlign: 'right',
        }}
      >
        tracked on GRIP<span style={{ color: AMBER }}>LAB</span>
      </div>
    </div>
  )
}

function Stat({ value, label, valueColor, valueSize }: { value: string; label: string; valueColor: string; valueSize: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: valueSize, lineHeight: 1.05, color: valueColor, display: 'block' }}>
        {value}
      </span>
      <span style={{ fontFamily: MONO_FONT, fontSize: 10, lineHeight: 1, letterSpacing: '0.16em', color: CHALK, textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 52, background: '#2c2820', alignSelf: 'flex-end' }} />
}
