import type { SyncItem } from './types'
import { supabase } from './supabase'

const QUEUE_KEY = 'grip-lab-sync-queue'

function load(): SyncItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (raw) return JSON.parse(raw) as SyncItem[]
  } catch {}
  return []
}

function save(items: SyncItem[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items))
  } catch {}
}

export const syncQueue = {
  add(item: Omit<SyncItem, 'id'>): void {
    const items = load()
    items.push({ ...item, id: crypto.randomUUID() })
    save(items)
  },

  getPending(): SyncItem[] {
    return load()
  },

  async flush(): Promise<void> {
    const items = load()
    if (items.length === 0) return

    const remaining: SyncItem[] = []

    for (const item of items) {
      try {
        let error: { message: string } | null = null

        if (item.operation === 'insert') {
          const result = await supabase.from(item.table).upsert(item.payload)
          error = result.error
        } else if (item.operation === 'update') {
          const result = await supabase
            .from(item.table)
            .update(item.payload)
            .eq('id', (item.payload as { id: string }).id)
          error = result.error
        } else if (item.operation === 'delete') {
          const result = await supabase
            .from(item.table)
            .delete()
            .eq('id', (item.payload as { id: string }).id)
          error = result.error
        }

        if (error) remaining.push(item)
      } catch {
        remaining.push(item)
      }
    }

    save(remaining)
  },
}
