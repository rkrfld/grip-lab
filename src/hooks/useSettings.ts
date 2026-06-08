import { useState } from 'react'

interface Settings {
  soundEnabled: boolean
  hapticEnabled: boolean
}

const KEY = 'grip-lab-settings'

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Settings
  } catch {}
  return { soundEnabled: true, hapticEnabled: true }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  function update(patch: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return {
    soundEnabled: settings.soundEnabled,
    hapticEnabled: settings.hapticEnabled,
    toggleSound: () => update({ soundEnabled: !settings.soundEnabled }),
    toggleHaptic: () => update({ hapticEnabled: !settings.hapticEnabled }),
  }
}
