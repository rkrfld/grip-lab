import { useState } from 'react'

type Variant = 'compact' | 'detailed'

export function RecapExport() {
  const [variant, setVariant] = useState<Variant>('compact')

  return (
    <div className="rounded-[14px] border border-line bg-card px-[18px] py-4">
      <div className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">Export Recap</div>

      <div className="flex gap-2 mb-4">
        {(['compact', 'detailed'] as Variant[]).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className="flex-1 py-2 rounded-lg text-[12px] capitalize transition-all"
            style={
              variant === v
                ? { background: '#8a827322', border: '1px solid #8a8273', color: '#f3ede0' }
                : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
            }
          >
            {v}
          </button>
        ))}
      </div>

      <div
        className="rounded-[10px] border border-dashed border-line flex items-center justify-center mb-4"
        style={{ height: 120, background: '#1b1813' }}
      >
        <span className="text-[12px] text-muted">Preview · coming in next release</span>
      </div>

      <button
        disabled
        className="w-full py-2.5 rounded-lg text-[12px] tracking-[0.06em] uppercase cursor-not-allowed"
        style={{ background: '#2c2820', color: '#8a8273' }}
      >
        ↓ Download PNG
      </button>
    </div>
  )
}
