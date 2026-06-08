import { ExerciseCard, type Exercise } from './ExerciseCard'
import type { TimerConfig } from '../hooks/useTimer'

interface Props {
  exercises: Exercise[]
  doneSet: Set<string>
  animKey: string
  onToggle: (id: string) => void
  onOpenTimer: (config: TimerConfig) => void
}

export function ExerciseList({ exercises, doneSet, animKey, onToggle, onOpenTimer }: Props) {
  return (
    <div key={animKey} className="animate-fade-in">
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
