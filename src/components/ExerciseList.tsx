import { ExerciseCard, type Exercise } from './ExerciseCard'
import type { TimerConfig } from '../hooks/useTimer'

interface Props {
  exercises: Exercise[]
  doneSet: Set<string>
  animKey: string
  slideDir: 'left' | 'right'
  onToggle: (id: string) => void
  onOpenTimer: (config: TimerConfig) => void
}

export function ExerciseList({ exercises, doneSet, animKey, slideDir, onToggle, onOpenTimer }: Props) {
  return (
    <div
      key={animKey}
      className={slideDir === 'left' ? 'animate-slide-from-right' : 'animate-slide-from-left'}
    >
      {exercises.map(ex => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          done={doneSet.has(ex.id)}
          onToggle={() => onToggle(ex.id)}
          onOpenTimer={onOpenTimer}
        />
      ))}
    </div>
  )
}
