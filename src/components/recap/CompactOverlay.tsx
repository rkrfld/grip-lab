import type { RecapData } from '../../lib/recapData'

interface Props { data: RecapData }

const LIME   = '#a3e635'
const CHALK  = '#f3ede0'
const MUTED  = '#8a8273'
const DIM    = '#5a5448'
const BG     = 'rgba(14,13,11,0.78)'
const BORDER = 'rgba(163,230,53,0.28)'
const DISPLAY_FONT = '"Big Shoulders Display", Impact, sans-serif'
const MONO_FONT    = '"DM Mono", "SF Mono", monospace'

export function CompactOverlay({ data }: Props) {
  return (
    <div
      style={{
        width: 480,
        height: 200,
        background: BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: '18px 28px 22px 28px',
        boxSizing: 'border-box',
        color: CHALK,
        fontFamily: DISPLAY_FONT,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: LIME, display: 'inline-block' }} />
          <span style={{ fontFamily: MONO_FONT, fontSize: 11, lineHeight: 1, letterSpacing: '0.22em', color: MUTED, textTransform: 'uppercase', marginBottom: 4 }}>
            GRIP LAB · SESSION
          </span>
        </div>
        {data.gymName && (
          <div style={{ fontFamily: MONO_FONT, fontSize: 10, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6, marginLeft: 15 }}>
            {data.gymName}
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          <Stat value={data.bestGrade ?? '—'} label="Best" valueColor={LIME} valueSize={56} />
          <Divider />
          <Stat value={String(data.totalSends)} label="Sends" valueColor={CHALK} valueSize={46} />
          <Divider />
          <Stat value={String(data.totalAttempts)} label="Attempts" valueColor={CHALK} valueSize={46} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 22,
          fontFamily: MONO_FONT,
          fontSize: 9,
          lineHeight: 1,
          letterSpacing: '0.22em',
          color: DIM,
        }}
      >
        GRIP LAB
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
      <span style={{ fontFamily: MONO_FONT, fontSize: 10, lineHeight: 1, letterSpacing: '0.16em', color: MUTED, textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 52, background: '#2c2820', alignSelf: 'flex-end' }} />
}
