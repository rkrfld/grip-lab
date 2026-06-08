# GRIP LAB — React App Design Spec
**Date:** 2026-06-08  
**Status:** Approved

---

## Overview

Convert the existing single-file `grip-lab (2).html` into a Vite + React app. Workout data moves to a `workouts.json` file acting as the data source. Add PWA support (offline, installable), sound/haptic settings toggles, and visual polish focused on mobile-native feel. Deploy target: static hosting (Vercel / Netlify / GitHub Pages).

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| PWA | `vite-plugin-pwa` (Workbox) |
| Icons | `lucide-react` |
| Fonts | `@fontsource/big-shoulders-display`, `@fontsource/dm-mono` |
| Styling | CSS custom properties (no CSS framework) |
| State | `useState` in App.tsx |
| Settings persistence | `localStorage` |
| Workout progress persistence | Deferred (scaffold clean, add later) |

---

## Folder Structure

```
grip-lab/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── manifest.webmanifest
├── src/
│   ├── data/
│   │   └── workouts.json
│   ├── components/
│   │   ├── DayPicker.tsx
│   │   ├── WorkoutBanner.tsx
│   │   ├── ExerciseList.tsx
│   │   ├── ExerciseCard.tsx
│   │   ├── TimerOverlay.tsx
│   │   └── SettingsToggle.tsx
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   └── useSettings.ts
│   ├── assets/
│   │   └── figures.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
└── package.json
```

---

## Data Layer — `workouts.json`

Single source of truth. No workout data anywhere in component code.

### Schema

```json
{
  "days": {
    "Monday": {
      "tag": "Menu A",
      "name": "Endurance Pump",
      "focus": "High volume, light-to-moderate load...",
      "color": "accent",
      "exercises": [
        {
          "id": "mon-1",
          "title": "Warm-up: 20 light squeezes each hand",
          "type": "reps",
          "figure": "gripper"
        },
        {
          "id": "mon-2",
          "title": "3 sets × 25–30 reps, light-moderate load",
          "subtitle": "rest 30–45s between sets",
          "type": "timer",
          "seconds": 40,
          "timerLabel": "REST",
          "figure": "gripper"
        },
        {
          "id": "mon-3",
          "title": "Repeaters: hold 7s / release 3s × 7",
          "subtitle": "auto: left → swap → right",
          "type": "repeater",
          "hold": 7,
          "rest": 3,
          "reps": 7,
          "figure": "hold"
        }
      ]
    }
  }
}
```

### Exercise `type` values

| Type | Description | Required fields |
|---|---|---|
| `reps` | Checkbox only, no timer | `id`, `title`, `figure` |
| `timer` | Countdown with label | `seconds`, `timerLabel` |
| `repeater` | Full hold/release cycle | `hold`, `rest`, `reps` |

`figure` maps to an SVG component key in `figures.tsx`. Valid values: `gripper`, `hold`, `extension`, `stretch`, `shake`, `wrist`, `wall`.

---

## Component Design

### State (App.tsx)

```ts
const [selectedDay, setSelectedDay] = useState<string>(todayName)
const [doneSet, setDoneSet] = useState<Set<string>>(new Set())
const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null)
```

`doneSet` resets when `selectedDay` changes. No persistence in v1.

### Data Flow

```
App
├── DayPicker       → receives: days[], selectedDay, onSelect
├── WorkoutBanner   → receives: tag, name, focus, color
├── ProgressBar     → receives: done count, total count (inline in App)
├── ExerciseList    → receives: exercises[], doneSet, onToggle, onOpenTimer
│   └── ExerciseCard (one per exercise)
├── TimerOverlay    → receives: config | null, onClose — uses useTimer()
└── SettingsToggle  → uses useSettings() — floated bottom-right
```

### Timer Config Type

```ts
type TimerConfig =
  | { type: 'countdown'; seconds: number; label: string }
  | { type: 'repeater'; hold: number; rest: number; reps: number }
```

---

## Hooks

### `useTimer(config, settings)`

Encapsulates all timer logic extracted from the original HTML:
- `requestAnimationFrame` loop for smooth countdown
- Pause / resume via offset tracking
- `beep()` via WebAudio API — gated by `settings.soundEnabled`
- `navigator.vibrate()` — gated by `settings.hapticEnabled`
- Handles both `countdown` and `repeater` modes
- Returns: `{ secondsLeft, phase, isPaused, toggle, stop }`

### `useSettings()`

```ts
{
  soundEnabled: boolean
  hapticEnabled: boolean
  toggleSound: () => void
  toggleHaptic: () => void
}
```

Persists to `localStorage` under key `grip-lab-settings`. Defaults: both `true`.

---

## PWA

- `vite-plugin-pwa` with Workbox `generateSW` strategy
- Precaches all static assets — full offline support
- `manifest.webmanifest`:
  - `name`: "GRIP LAB"
  - `short_name`: "GRIP LAB"
  - `theme_color`: `#0e0d0b`
  - `background_color`: `#0e0d0b`
  - `display`: `standalone`
  - Icons: 192×192 and 512×512 (grip mark on dark background, accent orange)
- Fonts loaded via `@fontsource` packages — available offline

---

## Settings UI

- `SettingsToggle` component — fixed position, bottom-right, always visible
- Tap → compact panel slides up from button anchor
- Two toggle rows: **Sound** (speaker icon) and **Haptic** (phone vibrate icon)
- Tap outside panel → dismiss
- Same dark card style as exercise cards (`--card` background, `--line` border)
- Uses `lucide-react` for icons (Settings2, Volume2, VolumeX, Vibrate)

---

## Visual Polish

### Animations
- **Day switch:** exercise list fades + slides in via `key` prop change on ExerciseList → CSS `@keyframes` entry animation
- **Check-off:** scale pulse on ExerciseCard check button, green fill transition
- **Timer overlay:** slides up from bottom (`transform: translateY(100%)` → `translateY(0)`)
- **Settings panel:** slides up from bottom-right anchor
- **Progress bar:** smooth `width` transition (already in original)

### Mobile-native feel
- `touch-action: manipulation` on all buttons — eliminates 300ms tap delay
- `-webkit-tap-highlight-color: transparent` on all interactive elements
- `padding: env(safe-area-inset-bottom)` on footer and overlays — iPhone notch/home bar safe
- `overflow: hidden` on `body` when overlay is open — prevents background scroll

### Typography
- Big Shoulders Display + DM Mono loaded via `@fontsource` (offline-capable)
- No changes to font usage or sizing

### Color
- Existing CSS custom property tokens carried over unchanged:
  `--bg`, `--bg2`, `--card`, `--line`, `--chalk`, `--muted`, `--accent`, `--accent-dim`, `--cool`, `--cool-dim`, `--good`
- Defined in `index.css` `:root`

---

## Out of Scope (v1)

- Workout progress persistence (localStorage) — deferred
- Custom program editor (add/edit workout days from UI)
- User accounts / sync
- Rest timer history / session tracking
- Push notifications
