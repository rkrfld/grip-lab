export type StorageResult<T> = {
  data: T | null
  error: string | null
  source: 'remote' | 'cache' | 'offline'
}

export interface Profile {
  id: string
  username: string | null
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  session_date: string
  duration_minutes: number | null
  gym_name: string | null
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
  payload: Record<string, unknown>
  timestamp: string
}
