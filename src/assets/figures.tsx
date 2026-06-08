export function GripperFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <path stroke="var(--menucol)" d="M46 28a4 4 0 0 1 0 8M46 28a4 4 0 0 0 0 8" />
      <path stroke="var(--menucol)" d="M46 28 20 22M46 36 20 42" />
      <path d="M22 22c0-5 4-8 7-7M28 23c0-5 4-8 7-7M34 24c0-4 3-7 6-6" />
      <path d="M22 42c-4 1-7-2-6-6" />
    </svg>
  )
}

export function HoldFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <path stroke="var(--menucol)" d="M10 40h30v12H10" />
      <path d="M46 14c-6 4-10 8-12 14M52 18c-6 4-10 8-12 12" />
      <path d="M16 30c0 6-2 10-2 14M22 30c0 6-2 10-2 14M28 30c0 6-2 10-2 14M34 30c0 5-1 9-1 12" />
      <path d="M14 30h21" />
    </svg>
  )
}

export function ExtensionFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <rect x="18" y="38" width="26" height="16" rx="7" />
      <rect x="20" y="18" width="5" height="22" rx="2.5" />
      <rect x="27" y="14" width="5" height="26" rx="2.5" />
      <rect x="34" y="16" width="5" height="24" rx="2.5" />
      <rect x="41" y="20" width="5" height="20" rx="2.5" />
      <path d="M18 44c-6 0-9-4-7-9" />
      <path stroke="var(--menucol)" d="M19 22c7-8 21-10 28 0" />
      <path stroke="var(--menucol)" d="M12 27 8 25v5zM52 27l4-2v5z" />
    </svg>
  )
}

export function StretchFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <path d="M8 42h20M8 50h20" />
      <rect x="26" y="40" width="14" height="12" rx="5" />
      <path d="M40 44c8-4 10-12 6-18M40 48c9-3 13-10 10-17" />
      <path stroke="var(--menucol)" d="M30 30a14 14 0 0 1 18-6" />
      <path stroke="var(--menucol)" d="M30 30l1-5 4 3z" />
    </svg>
  )
}

export function ShakeFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <rect x="24" y="20" width="16" height="14" rx="6" />
      <path d="M26 34c-1 6-1 10 0 14M31 35c-1 6-1 11 0 15M37 35c1 6 1 10 0 14M42 33c2 5 2 9 0 13" />
      <path d="M24 24c-6 0-8 4-5 8" />
      <path stroke="var(--menucol)" d="M14 26q4 4 0 8M50 26q-4 4 0 8" />
    </svg>
  )
}

export function WristFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <path d="M26 46v12M38 46v12" />
      <rect x="22" y="28" width="20" height="18" rx="8" />
      <path d="M27 30v4M32 29v4M37 30v4" />
      <path stroke="var(--menucol)" d="M16 48a16 12 0 1 1 32 0" />
      <path stroke="var(--menucol)" d="M48 48l3-4-5-1z" />
    </svg>
  )
}

export function WallFig() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="var(--chalk)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      <rect stroke="var(--menucol)" x="14" y="12" width="36" height="40" rx="4" />
      <circle stroke="var(--menucol)" cx="22" cy="20" r="1.4" />
      <circle stroke="var(--menucol)" cx="42" cy="44" r="1.4" />
      <path d="M26 34c-2-6 6-10 12-7 6 3 4 13-3 13-5 0-7-1-9-6Z" />
    </svg>
  )
}

const FIGS: Record<string, () => JSX.Element> = {
  gripper: GripperFig,
  hold: HoldFig,
  extension: ExtensionFig,
  stretch: StretchFig,
  shake: ShakeFig,
  wrist: WristFig,
  wall: WallFig,
}

export function Figure({ name }: { name: string }) {
  const Comp = FIGS[name]
  if (!Comp) return null
  return (
    <div style={{
      flex: '0 0 auto', width: 58, height: 58,
      display: 'grid', placeItems: 'center',
      border: '1px solid var(--line)', borderRadius: 12,
      background: 'var(--bg2)',
    }}>
      <div style={{ width: 46, height: 46 }}>
        <Comp />
      </div>
    </div>
  )
}
