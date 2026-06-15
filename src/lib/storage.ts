import { supabase } from './supabase'
import { syncQueue } from './syncQueue'
import type { StorageResult, Session, Attempt, WorkoutLog, Profile } from './types'

const CACHE = {
  sessionToday: 'grip-lab-session-today',
  sessionsAll:  'grip-lab-sessions-all',
  workoutPfx:   'grip-lab-workout-',
  streak:       'grip-lab-streak',
  profile:      'grip-lab-profile',
} as const

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

type TodayCache = { session: Session; attempts: Attempt[] }

async function fetchTodayFromRemote(): Promise<StorageResult<Attempt[]>> {
  if (!navigator.onLine) {
    const cached = readCache<TodayCache>(CACHE.sessionToday)
    return { data: cached?.attempts ?? [], error: null, source: 'offline' }
  }
  const userId = await currentUserId()
  if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

  const { data, error } = await supabase
    .from('sessions')
    .select('*, attempts(*)')
    .eq('user_id', userId)
    .eq('session_date', todayStr())

  if (error) return { data: null, error: error.message, source: 'remote' }

  const session = data?.[0] ?? null
  if (!session) {
    writeCache(CACHE.sessionToday, null)
    return { data: [], error: null, source: 'remote' }
  }

  const cache: TodayCache = { session, attempts: (session.attempts as Attempt[]) ?? [] }
  writeCache(CACHE.sessionToday, cache)
  return { data: cache.attempts, error: null, source: 'remote' }
}

async function fetchAllFromRemote(): Promise<StorageResult<Session[]>> {
  if (!navigator.onLine) {
    return { data: readCache<Session[]>(CACHE.sessionsAll) ?? [], error: null, source: 'offline' }
  }
  const userId = await currentUserId()
  if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

  const { data, error } = await supabase
    .from('sessions')
    .select('*, attempts(*)')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })

  if (error) return { data: null, error: error.message, source: 'remote' }
  writeCache(CACHE.sessionsAll, data)
  return { data: data ?? [], error: null, source: 'remote' }
}

async function ensureTodaySession(userId: string): Promise<Session | null> {
  const date = todayStr()
  const cached = readCache<TodayCache>(CACHE.sessionToday)
  if (cached?.session.session_date === date) return cached.session

  if (navigator.onLine) {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_date', date)
      .single()

    if (data) {
      writeCache(CACHE.sessionToday, { session: data, attempts: cached?.attempts ?? [] })
      return data as Session
    }

    const newSession: Session = {
      id: crypto.randomUUID(),
      user_id: userId,
      session_date: date,
      duration_minutes: null,
      gym_name: null,
      created_at: new Date().toISOString(),
    }
    const { error: insertError } = await supabase.from('sessions').insert(newSession)
    if (insertError) {
      syncQueue.add({ table: 'sessions', operation: 'insert', payload: newSession, timestamp: new Date().toISOString() })
    }
    writeCache(CACHE.sessionToday, { session: newSession, attempts: [] })
    return newSession
  } else {
    const newSession: Session = {
      id: crypto.randomUUID(),
      user_id: userId,
      session_date: date,
      duration_minutes: null,
      gym_name: null,
      created_at: new Date().toISOString(),
    }
    writeCache(CACHE.sessionToday, { session: newSession, attempts: [] })
    syncQueue.add({ table: 'sessions', operation: 'insert', payload: newSession, timestamp: new Date().toISOString() })
    return newSession
  }
}

export const sessionLog = {
  async getToday(): Promise<StorageResult<Attempt[]>> {
    const cached = readCache<TodayCache>(CACHE.sessionToday)
    if (cached) {
      fetchTodayFromRemote().catch(() => {})
      return { data: cached.attempts, error: null, source: 'cache' }
    }
    return fetchTodayFromRemote()
  },

  async getAll(): Promise<StorageResult<Session[]>> {
    const cached = readCache<Session[]>(CACHE.sessionsAll)
    if (cached) {
      fetchAllFromRemote().catch(() => {})
      return { data: cached, error: null, source: 'cache' }
    }
    return fetchAllFromRemote()
  },

  async add(
    attempt: Omit<Attempt, 'id' | 'user_id' | 'logged_at'>,
  ): Promise<StorageResult<Attempt>> {
    const userId = await currentUserId()
    if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

    const session = await ensureTodaySession(userId)
    if (!session) return { data: null, error: 'Failed to create session', source: 'offline' }

    const newAttempt: Attempt = {
      ...attempt,
      id: crypto.randomUUID(),
      session_id: session.id,
      user_id: userId,
      logged_at: new Date().toISOString(),
    }

    const cached = readCache<TodayCache>(CACHE.sessionToday) ?? { session, attempts: [] }
    writeCache(CACHE.sessionToday, { ...cached, attempts: [...cached.attempts, newAttempt] })

    if (navigator.onLine) {
      const { error } = await supabase.from('attempts').insert(newAttempt)
      if (error) {
        syncQueue.add({ table: 'attempts', operation: 'insert', payload: newAttempt, timestamp: new Date().toISOString() })
      }
    } else {
      syncQueue.add({ table: 'attempts', operation: 'insert', payload: newAttempt, timestamp: new Date().toISOString() })
    }

    return { data: newAttempt, error: null, source: navigator.onLine ? 'remote' : 'offline' }
  },

  async delete(id: string): Promise<StorageResult<void>> {
    const cached = readCache<TodayCache>(CACHE.sessionToday)
    if (cached) {
      writeCache(CACHE.sessionToday, { ...cached, attempts: cached.attempts.filter(a => a.id !== id) })
    }

    if (navigator.onLine) {
      const { error } = await supabase.from('attempts').delete().eq('id', id)
      if (error) {
        syncQueue.add({ table: 'attempts', operation: 'delete', payload: { id }, timestamp: new Date().toISOString() })
      }
    } else {
      syncQueue.add({ table: 'attempts', operation: 'delete', payload: { id }, timestamp: new Date().toISOString() })
    }

    return { data: undefined, error: null, source: navigator.onLine ? 'remote' : 'offline' }
  },

  async endSession(durationMinutes: number): Promise<StorageResult<Session>> {
    const userId = await currentUserId()
    if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

    const cached = readCache<TodayCache>(CACHE.sessionToday)
    if (!cached) return { data: null, error: 'No active session', source: 'offline' }

    const updated: Session = { ...cached.session, duration_minutes: durationMinutes }
    writeCache(CACHE.sessionToday, { ...cached, session: updated })

    if (navigator.onLine) {
      const { error } = await supabase
        .from('sessions')
        .update({ duration_minutes: durationMinutes })
        .eq('id', updated.id)
      if (error) {
        syncQueue.add({ table: 'sessions', operation: 'update', payload: { id: updated.id, duration_minutes: durationMinutes }, timestamp: new Date().toISOString() })
      }
    } else {
      syncQueue.add({ table: 'sessions', operation: 'update', payload: { id: updated.id, duration_minutes: durationMinutes }, timestamp: new Date().toISOString() })
    }

    return { data: updated, error: null, source: navigator.onLine ? 'remote' : 'offline' }
  },
}

async function fetchWorkoutFromRemote(date: string): Promise<StorageResult<WorkoutLog | null>> {
  if (!navigator.onLine) {
    return { data: readCache<WorkoutLog>(CACHE.workoutPfx + date), error: null, source: 'offline' }
  }
  const userId = await currentUserId()
  if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .single()

  if (error && error.code !== 'PGRST116') return { data: null, error: error.message, source: 'remote' }

  writeCache(CACHE.workoutPfx + date, data ?? null)
  return { data: (data as WorkoutLog) ?? null, error: null, source: 'remote' }
}

export const workoutLog = {
  async getByDate(date: string): Promise<StorageResult<WorkoutLog | null>> {
    const cached = readCache<WorkoutLog>(CACHE.workoutPfx + date)
    if (cached) {
      fetchWorkoutFromRemote(date).catch(() => {})
      return { data: cached, error: null, source: 'cache' }
    }
    return fetchWorkoutFromRemote(date)
  },

  async save(menu: string, completedItems: number[]): Promise<StorageResult<WorkoutLog>> {
    const userId = await currentUserId()
    if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

    const date = todayStr()
    const key = CACHE.workoutPfx + date
    const existing = readCache<WorkoutLog>(key)

    const log: WorkoutLog = existing
      ? { ...existing, menu, completed_items: completedItems, completed_at: new Date().toISOString() }
      : {
          id: crypto.randomUUID(),
          user_id: userId,
          log_date: date,
          menu,
          completed_items: completedItems,
          completed_at: new Date().toISOString(),
        }

    writeCache(key, log)

    if (navigator.onLine) {
      const { error } = await supabase
        .from('workout_logs')
        .upsert(log, { onConflict: 'user_id,log_date' })
      if (error) {
        syncQueue.add({ table: 'workout_logs', operation: 'insert', payload: log, timestamp: new Date().toISOString() })
      }
    } else {
      syncQueue.add({ table: 'workout_logs', operation: 'insert', payload: log, timestamp: new Date().toISOString() })
    }

    await streakData.recordToday()
    return { data: log, error: null, source: navigator.onLine ? 'remote' : 'offline' }
  },
}

async function fetchStreakFromRemote(): Promise<StorageResult<Record<string, boolean>>> {
  if (!navigator.onLine) {
    return { data: readCache<Record<string, boolean>>(CACHE.streak) ?? {}, error: null, source: 'offline' }
  }
  const userId = await currentUserId()
  if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

  const [{ data: logs, error: logsError }, { data: sessions, error: sessionsError }] = await Promise.all([
    supabase.from('workout_logs').select('log_date').eq('user_id', userId),
    supabase.from('sessions').select('session_date').eq('user_id', userId),
  ])

  if (logsError || sessionsError) {
    const msg = logsError?.message ?? sessionsError?.message ?? 'Unknown error'
    return { data: readCache<Record<string, boolean>>(CACHE.streak) ?? {}, error: msg, source: 'cache' }
  }

  const streak: Record<string, boolean> = {}
  logs?.forEach((l: { log_date: string }) => { streak[l.log_date] = true })
  sessions?.forEach((s: { session_date: string }) => { streak[s.session_date] = true })

  writeCache(CACHE.streak, streak)
  return { data: streak, error: null, source: 'remote' }
}

export const streakData = {
  async get(): Promise<StorageResult<Record<string, boolean>>> {
    const cached = readCache<Record<string, boolean>>(CACHE.streak)
    if (cached) {
      fetchStreakFromRemote().catch(() => {})
      return { data: cached, error: null, source: 'cache' }
    }
    return fetchStreakFromRemote()
  },

  async recordToday(): Promise<StorageResult<void>> {
    const streak = { ...(readCache<Record<string, boolean>>(CACHE.streak) ?? {}), [todayStr()]: true }
    writeCache(CACHE.streak, streak)
    return { data: undefined, error: null, source: 'cache' }
  },
}

async function fetchProfileFromRemote(): Promise<StorageResult<Profile>> {
  if (!navigator.onLine) {
    return { data: readCache<Profile>(CACHE.profile), error: 'Offline', source: 'offline' }
  }
  const userId = await currentUserId()
  if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return { data: null, error: error.message, source: 'remote' }
  writeCache(CACHE.profile, data)
  return { data: data as Profile, error: null, source: 'remote' }
}

export const userProfile = {
  async get(): Promise<StorageResult<Profile>> {
    const cached = readCache<Profile>(CACHE.profile)
    if (cached) {
      fetchProfileFromRemote().catch(() => {})
      return { data: cached, error: null, source: 'cache' }
    }
    return fetchProfileFromRemote()
  },

  async update(data: Partial<Profile>): Promise<StorageResult<Profile>> {
    const userId = await currentUserId()
    if (!userId) return { data: null, error: 'Not authenticated', source: 'offline' }

    const existing = readCache<Profile>(CACHE.profile) ?? {
      id: userId,
      username: null,
      created_at: new Date().toISOString(),
    }
    const updated = { ...existing, ...data }
    writeCache(CACHE.profile, updated)

    if (navigator.onLine) {
      const { error } = await supabase.from('profiles').update(data).eq('id', userId)
      if (error) {
        syncQueue.add({ table: 'profiles', operation: 'update', payload: { id: userId, ...data }, timestamp: new Date().toISOString() })
      }
    } else {
      syncQueue.add({ table: 'profiles', operation: 'update', payload: { id: userId, ...data }, timestamp: new Date().toISOString() })
    }

    return { data: updated, error: null, source: navigator.onLine ? 'remote' : 'offline' }
  },
}
