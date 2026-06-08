interface Props {
  tag: string
  name: string
  focus: string
  color: 'accent' | 'cool'
}

const COLOR_MAP = {
  accent: { col: 'text-accent', tint: 'rgba(255,74,28,.12)' },
  cool:   { col: 'text-cool',   tint: 'rgba(127,180,201,.10)' },
}

export function WorkoutBanner({ tag, name, focus, color }: Props) {
  const { col, tint } = COLOR_MAP[color] ?? COLOR_MAP.accent

  return (
    <div className="border border-line rounded-[14px] bg-gradient-to-br from-card to-bg2 overflow-hidden relative mb-[18px]">
      <div
        className="absolute top-0 right-0 w-[40%] h-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${tint})` }}
      />
      <div className="px-[18px] py-4 relative z-10">
        <div className={`text-[11px] tracking-[0.22em] uppercase font-medium ${col}`}>
          {tag}
        </div>
        <div className="font-display font-extrabold text-[30px] leading-none uppercase mt-[5px] mb-[7px]">
          {name}
        </div>
        {focus && (
          <div className="text-[12.5px] text-muted leading-[1.5]">
            {focus}
          </div>
        )}
      </div>
    </div>
  )
}
