interface Props {
  tag: string
  name: string
  focus: string
  color: 'accent' | 'cool'
}

const COLOR_MAP = {
  accent: { col: 'var(--accent)', tint: 'rgba(255,74,28,.12)' },
  cool:   { col: 'var(--cool)',   tint: 'rgba(127,180,201,.10)' },
}

export function WorkoutBanner({ tag, name, focus, color }: Props) {
  const { col, tint } = COLOR_MAP[color] ?? COLOR_MAP.accent

  return (
    <div style={{
      border: '1px solid var(--line)', borderRadius: 'var(--radius)',
      background: `linear-gradient(135deg, var(--card), var(--bg2))`,
      overflow: 'hidden', position: 'relative',
      marginBottom: 18,
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
        background: `linear-gradient(90deg, transparent, ${tint})`,
        pointerEvents: 'none',
      }} />
      <div style={{ padding: '16px 18px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', color: col, textTransform: 'uppercase', fontWeight: 500 }}>
          {tag}
        </div>
        <div style={{
          fontFamily: "'Big Shoulders Display', sans-serif",
          fontWeight: 800, fontSize: 30, lineHeight: 1,
          margin: '5px 0 7px', textTransform: 'uppercase',
        }}>
          {name}
        </div>
        {focus && (
          <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
            {focus}
          </div>
        )}
      </div>
    </div>
  )
}
