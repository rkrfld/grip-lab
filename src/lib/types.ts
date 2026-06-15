export type StorageResult<T> = {
  data: T | null
  error: string | null
  source: 'remote' | 'cache' | 'offline'
}

export interface Profile {
  id: string
  username: string | null
  created_at: string
  display_name?: string | null
  handle?: string | null
  current_level?: 'beginner' | 'intermediate' | 'advanced' | null
}

export interface Session {
  id: string
  user_id: string
  session_date: string
  duration_minutes: number | null
  gym_name: string | null
  gym_id?: string | null
  created_at: string
  attempts?: Attempt[]
}

export interface Attempt {
  id: string
  session_id: string
  user_id: string
  grade: string
  result: 'send' | 'fall' | 'project'
  logged_at: string
  raw_grade?: string
  v_grade?: number
  grading_system?: string
  gym_id?: string
}

export interface WorkoutLog {
  id: string
  user_id: string
  log_date: string
  menu: string
  completed_items: number[]
  completed_at: string
}

export interface SyncItem {
  id: string
  table: string
  operation: 'insert' | 'update' | 'delete'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>
  timestamp: string
}

export type GymDirectoryEntry = {
  id: string
  name: string
  slug: string
  grading_system: string
  created_at: string
}

export type UserGym = {
  id: string
  user_id: string
  directory_id: string
  is_home: boolean
  name: string
  slug: string
  grading_system: string
}
