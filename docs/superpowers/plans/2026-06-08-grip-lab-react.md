# GRIP LAB React App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-file `grip-lab (2).html` into a Vite + React + TypeScript PWA with workout data in JSON, sound/haptic settings, and polished mobile-native feel.

**Architecture:** Flat component tree with state in App.tsx. Two custom hooks (useTimer, useSettings) isolate the complex logic. workouts.json is the sole data source — no workout data in component code.

**Tech Stack:** Vite 5, React 18, TypeScript, vite-plugin-pwa, lucide-react, @fontsource packages.

---

## File Map

| File | Responsibility |
|---|---|
| `src/data/workouts.json` | All workout data — the "database" |
| `src/assets/figures.tsx` | SVG grip illustrations as named React components |
| `src/index.css` | CSS custom properties, resets, global styles |
| `src/hooks/useSettings.ts` | Sound/haptic boolean state, localStorage persistence |
| `src/hooks/useTimer.ts` | rAF countdown loop, repeater state machine, beep, vibrate |
| `src/components/DayPicker.tsx` | Horizontal scrollable day tab strip |
| `src/components/WorkoutBanner.tsx` | Menu tag, name, focus description card |
| `src/components/ExerciseCard.tsx` | Single exercise row: check, title, sub, timer button, figure |
| `src/components/ExerciseList.tsx` | Maps exercises to ExerciseCards, entry animation on day switch |
| `src/components/TimerOverlay.tsx` | Fullscreen overlay, SVG ring, countdown/repeater display |
| `src/components/SettingsToggle.tsx` | Fixed bottom-right gear button + slide-up settings panel |
| `src/App.tsx` | Root: state, day derivation, progress bar, layout |
| `vite.config.ts` | Vite + vite-plugin-pwa config |
| `public/manifest.webmanifest` | PWA manifest |

---

## Task 1: Scaffold project and install dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite + React + TS in the grip-lab directory**

```bash
cd /Users/riki/Documents/personal/grip-lab
npm create vite@latest . -- --template react-ts --force 2>/dev/null || true
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/riki/Documents/personal/grip-lab
npm install
npm install lucide-react
npm install @fontsource/big-shoulders-display @fontsource/dm-mono
npm install -D vite-plugin-pwa
```

- [ ] **Step 3: Remove Vite boilerplate**

Delete `src/App.css`, `src/assets/react.svg`, `public/vite.svg`. Clear `src/App.tsx` and `src/index.css` to empty shells.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: server running at `http://localhost:5173`

---

## Task 2: Global styles (`src/index.css`)

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: Write full CSS**

```css
@import '@fontsource/big-shoulders-display/500.css';
@import '@fontsource/big-shoulders-display/700.css';
@import '@fontsource/big-shoulders-display/800.css';
@import '@fontsource/big-shoulders-display/900.css';
@import '@fontsource/dm-mono/400.css';
@import '@fontsource/dm-mono/500.css';

:root {
  --bg: #0e0d0b;
  --bg2: #161410;
  --card: #1b1813;
  --line: #2c2820;
  --chalk: #f3ede0;
  --muted: #8a8273;
  --accent: #ff4a1c;
  --accent-dim: #7a2d18;
  --cool: #7fb4c9;
  --cool-dim: #2f4750;
  --good: #9fd17a;
  --radius: 14px;
  --menucol: var(--accent);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  background: var(--bg);
  overscroll-behavior: none;
}

body {
  font-family: 'DM Mono', monospace;
  color: var(--chalk);
  min-height: 100dvh;
  background:
    radial-gradient(120% 90% at 90% -10%, rgba(255,74,28,.12), transparent 55%),
    radial-gradient(120% 80% at -10% 110%, rgba(127,180,201,.08), transparent 50%),
    var(--bg);
  overflow-x: hidden;
  padding-bottom: max(110px, calc(80px + env(safe-area-inset-bottom)));
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: .5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E");
}

button {
  touch-action: manipulation;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Task 3: Workout data (`src/data/workouts.json`)

**Files:**
- Create: `src/data/workouts.json`

- [ ] **Step 1: Write the full JSON**

```json
{
  "days": {
    "Monday": {
      "tag": "Menu A",
      "name": "Endurance Pump",
      "focus": "High volume, light-to-moderate load. Forearm pump without loading the finger pulleys.",
      "color": "accent",
      "exercises": [
        { "id": "mon-1", "title": "Warm-up: 20 light squeezes each hand", "type": "reps", "figure": "gripper" },
        { "id": "mon-2", "title": "3 sets × 25–30 reps, light-moderate load", "subtitle": "rest 30–45s between sets", "type": "timer", "seconds": 40, "timerLabel": "REST", "figure": "gripper" },
        { "id": "mon-3", "title": "Cooldown: wrist circles + shake-out", "type": "timer", "seconds": 30, "timerLabel": "SHAKE-OUT", "figure": "wrist" }
      ]
    },
    "Tuesday": {
      "tag": "Menu B",
      "name": "Climbing Repeaters",
      "focus": "Isometric holds — closest match to gripping on the wall. Run it per hand.",
      "color": "accent",
      "exercises": [
        { "id": "tue-1", "title": "Warm-up: 20 light squeezes", "type": "reps", "figure": "gripper" },
        { "id": "tue-2", "title": "Repeaters: hold 7s / release 3s × 7 = 1 round", "subtitle": "auto: left → swap → right", "type": "repeater", "hold": 7, "rest": 3, "reps": 7, "figure": "hold" },
        { "id": "tue-3", "title": "3–4 rounds per hand", "subtitle": "rest 60s between rounds", "type": "timer", "seconds": 60, "timerLabel": "REST", "figure": "hold" },
        { "id": "tue-4", "title": "Finisher: finger extension ×15 + stretch", "type": "reps", "figure": "extension" }
      ]
    },
    "Wednesday": {
      "tag": "Menu C",
      "name": "Recovery & Antagonist",
      "focus": "Recovery day. Train the opposing muscles to keep climber's elbow away.",
      "color": "cool",
      "exercises": [
        { "id": "wed-1", "title": "Finger extension (band on fingertips) ×15–20, 3 sets", "type": "reps", "figure": "extension" },
        { "id": "wed-2", "title": "Stretch flexors & extensors", "subtitle": "20s each side", "type": "timer", "seconds": 20, "timerLabel": "STRETCH", "figure": "stretch" },
        { "id": "wed-3", "title": "Shake-out / light forearm massage", "type": "reps", "figure": "shake" }
      ]
    },
    "Thursday": {
      "tag": "Menu A",
      "name": "Endurance Pump",
      "focus": "High volume, light-to-moderate load. Forearm pump without loading the finger pulleys.",
      "color": "accent",
      "exercises": [
        { "id": "thu-1", "title": "Warm-up: 20 light squeezes each hand", "type": "reps", "figure": "gripper" },
        { "id": "thu-2", "title": "3 sets × 25–30 reps, light-moderate load", "subtitle": "rest 30–45s between sets", "type": "timer", "seconds": 40, "timerLabel": "REST", "figure": "gripper" },
        { "id": "thu-3", "title": "Cooldown: wrist circles + shake-out", "type": "timer", "seconds": 30, "timerLabel": "SHAKE-OUT", "figure": "wrist" }
      ]
    },
    "Friday": {
      "tag": "Menu B",
      "name": "Climbing Repeaters",
      "focus": "Isometric holds — closest match to gripping on the wall. Run it per hand.",
      "color": "accent",
      "exercises": [
        { "id": "fri-1", "title": "Warm-up: 20 light squeezes", "type": "reps", "figure": "gripper" },
        { "id": "fri-2", "title": "Repeaters: hold 7s / release 3s × 7 = 1 round", "subtitle": "auto: left → swap → right", "type": "repeater", "hold": 7, "rest": 3, "reps": 7, "figure": "hold" },
        { "id": "fri-3", "title": "3–4 rounds per hand", "subtitle": "rest 60s between rounds", "type": "timer", "seconds": 60, "timerLabel": "REST", "figure": "hold" },
        { "id": "fri-4", "title": "Finisher: finger extension ×15 + stretch", "type": "reps", "figure": "extension" }
      ]
    },
    "Saturday": {
      "tag": "Menu C",
      "name": "Recovery & Antagonist",
      "focus": "Recovery day. Train the opposing muscles to keep climber's elbow away.",
      "color": "cool",
      "exercises": [
        { "id": "sat-1", "title": "Finger extension (band on fingertips) ×15–20, 3 sets", "type": "reps", "figure": "extension" },
        { "id": "sat-2", "title": "Stretch flexors & extensors", "subtitle": "20s each side", "type": "timer", "seconds": 20, "timerLabel": "STRETCH", "figure": "stretch" },
        { "id": "sat-3", "title": "Shake-out / light forearm massage", "type": "reps", "figure": "shake" }
      ]
    },
    "Sunday": {
      "tag": "Menu A",
      "name": "Endurance Pump",
      "focus": "High volume, light-to-moderate load. Forearm pump without loading the finger pulleys.",
      "color": "accent",
      "exercises": [
        { "id": "sun-1", "title": "Warm-up: 20 light squeezes each hand", "type": "reps", "figure": "gripper" },
        { "id": "sun-2", "title": "3 sets × 25–30 reps, light-moderate load", "subtitle": "rest 30–45s between sets", "type": "timer", "seconds": 40, "timerLabel": "REST", "figure": "gripper" },
        { "id": "sun-3", "title": "Cooldown: wrist circles + shake-out", "type": "timer", "seconds": 30, "timerLabel": "SHAKE-OUT", "figure": "wrist" }
      ]
    }
  }
}
```

---

## Task 4: SVG figures (`src/assets/figures.tsx`)

**Files:**
- Create: `src/assets/figures.tsx`

- [ ] **Step 1: Write figure components**

Each figure is a React component returning an `<svg>`. The `.eq` class strokes use `var(--menucol)`.

---

## Task 5: `useSettings` hook

**Files:**
- Create: `src/hooks/useSettings.ts`

- [ ] **Step 1: Write hook**

```ts
import { useState } from 'react'

interface Settings {
  soundEnabled: boolean
  hapticEnabled: boolean
}

const STORAGE_KEY = 'grip-lab-settings'

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { soundEnabled: true, hapticEnabled: true }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  function update(patch: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
```

---

## Task 6: `useTimer` hook

**Files:**
- Create: `src/hooks/useTimer.ts`

- [ ] **Step 1: Define types and beep/buzz helpers**
- [ ] **Step 2: Implement countdown mode**
- [ ] **Step 3: Implement repeater state machine**
- [ ] **Step 4: Expose pause/resume/stop controls**

---

## Task 7: Components

**Files:**
- Create: `src/components/DayPicker.tsx`
- Create: `src/components/WorkoutBanner.tsx`
- Create: `src/components/ExerciseCard.tsx`
- Create: `src/components/ExerciseList.tsx`
- Create: `src/components/TimerOverlay.tsx`
- Create: `src/components/SettingsToggle.tsx`

---

## Task 8: `App.tsx`

**Files:**
- Modify: `src/App.tsx`

---

## Task 9: PWA setup

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.webmanifest`
- Create: `public/icons/icon-192.png`, `public/icons/icon-512.png`

---

## Task 10: Final verification

- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run preview` — test PWA installability on mobile
- [ ] Verify all 7 days render, timers work, settings persist
