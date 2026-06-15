import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserGym } from '../../lib/types'
import { gymStorage } from '../../lib/storage'
import { ACCENT_HEX } from '../ui'

const GRADING_OPTIONS = [
  { value: 'hueco',  label: 'Hueco V-scale' },
  { value: 'font',   label: 'Fontainebleau' },
  { value: 'custom', label: 'Gym custom 1–10' },
]

interface GymSelectorModalProps {
  open: boolean
  onConfirm: (gym: UserGym) => void
}

export function GymSelectorModal({ open, onConfirm }: GymSelectorModalProps) {
  const [gyms, setGyms] = useState<UserGym[]>([])
  const [selected, setSelected] = useState<UserGym | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSystem, setNewSystem] = useState('hueco')
  const [addError, setAddError] = useState<string | null>(null)
  const [addSubmitting, setAddSubmitting] = useState(false)

  const color = ACCENT_HEX['session']

  useEffect(() => {
    if (!open) return
    setLoading(true)
    gymStorage.getAll().then(({ data }) => {
      const list = data ?? []
      setGyms(list)
      setSelected(list.find(g => g.is_home) ?? list[0] ?? null)
      setLoading(false)
    })
  }, [open])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setAddError(null)
    setAddSubmitting(true)
    const { data, error } = await gymStorage.add({ name: newName.trim(), grading_system: newSystem, is_home: false })
    setAddSubmitting(false)
    if (error || !data) { setAddError(error ?? 'Failed to add gym'); return }
    setGyms(prev => [...prev, data])
    setSelected(data)
    setShowAdd(false)
    setNewName('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(8,7,6,0.7)' }}>
      <div
        className="rounded-t-[20px] border-t border-line bg-card px-5 pt-5 animate-slide-up"
        style={{
          paddingBottom: 'max(32px, calc(32px + var(--sab)))',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div className="text-[10px] tracking-[0.28em] uppercase mb-1" style={{ color }}>Starting</div>
        <div className="font-display font-extrabold text-[28px] uppercase text-chalk mb-5">SESSION</div>

        {loading ? (
          <div className="py-6 flex justify-center">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: '#2c2820', borderTopColor: color }} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-4">
            {gyms.map(gym => (
              <button
                key={gym.id}
                onClick={() => setSelected(gym)}
                className="flex items-center justify-between rounded-[12px] px-4 py-3.5 text-left transition-all"
                style={
                  selected?.id === gym.id
                    ? { background: `${color}22`, border: `1px solid ${color}` }
                    : { background: '#1b1813', border: '1px solid #2c2820' }
                }
              >
                <div>
                  <div className="text-[14px] text-chalk">{gym.name}</div>
                  <div className="text-[11px] text-muted capitalize">{gym.grading_system}</div>
                </div>
                <div className="flex items-center gap-2">
                  {gym.is_home && (
                    <span className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full" style={{ background: `${color}22`, color }}>
                      Home
                    </span>
                  )}
                  {selected?.id === gym.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 13 9 18 20 6" />
                    </svg>
                  )}
                </div>
              </button>
            ))}

            {showAdd ? (
              <form onSubmit={handleAdd} className="flex flex-col gap-2 rounded-[12px] border border-line bg-bg2 p-3">
                <input
                  type="text"
                  placeholder="Gym name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                  style={{ background: '#1b1813', border: '1px solid #2c2820', color: '#f3ede0' }}
                />
                <div className="flex gap-1.5">
                  {GRADING_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewSystem(opt.value)}
                      className="flex-1 py-2 rounded-lg text-[11px] transition-all"
                      style={
                        newSystem === opt.value
                          ? { background: `${color}22`, border: `1px solid ${color}`, color: '#f3ede0' }
                          : { background: '#1b1813', border: '1px solid #2c2820', color: '#8a8273' }
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {addError && <p className="text-[11px]" style={{ color: '#ff4a1c' }}>{addError}</p>}
                <div className="flex gap-2 mt-1">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-lg text-[12px] text-muted border border-line">
                    Cancel
                  </button>
                  <button type="submit" disabled={addSubmitting} className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold" style={{ background: color, color: '#0e0d0b', opacity: addSubmitting ? 0.6 : 1 }}>
                    {addSubmitting ? '…' : 'Add'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="text-[12px] tracking-[0.06em] text-muted text-left px-1 py-2"
              >
                + Add new gym
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => selected && onConfirm(selected)}
          disabled={!selected}
          className="w-full py-3.5 rounded-full text-[13px] font-semibold tracking-[0.06em] uppercase transition-opacity"
          style={{ background: color, color: '#0e0d0b', opacity: selected ? 1 : 0.4 }}
        >
          Start Session →
        </button>
      </div>
    </div>
  )
}
