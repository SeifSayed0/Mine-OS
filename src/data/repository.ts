import { getDb } from './db'
import type { Commitment, Entity, InboxItem, Note, Person, Preference, Project, ProjectStep, Reminder, Review, SearchResult, Task } from '../domain/types'

const stores = ['tasks', 'inbox', 'projects', 'steps', 'people', 'commitments', 'notes', 'reminders', 'reviews', 'preferences'] as const

type StoreName = typeof stores[number]
export async function all<T extends Entity>(store: StoreName): Promise<T[]> { return (await getDb()).getAll(store) as Promise<T[]> }
export async function put<T extends Entity>(store: StoreName, item: T) { return (await getDb()).put(store, item as never) }
export async function remove(store: StoreName, id: string) { return (await getDb()).delete(store, id) }
export async function clear(store: StoreName) { return (await getDb()).clear(store) }
export async function getPreference(key: string) { return (await getDb()).get('preferences', key) }
export async function savePreference(value: Preference) { return put('preferences', value) }

export async function searchLocal(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return []
  const [tasks, projects, people, notes, inbox] = await Promise.all([all<Task>('tasks'), all<Project>('projects'), all<Person>('people'), all<Note>('notes'), all<InboxItem>('inbox')])
  return [
    ...tasks.filter(x => `${x.title} ${x.description} ${x.originalText}`.toLocaleLowerCase().includes(q)).map(x => ({ type: 'task' as const, id: x.id, title: x.title, context: `${x.status} · ${x.priority}` })),
    ...projects.filter(x => `${x.name} ${x.description} ${x.goal}`.toLocaleLowerCase().includes(q)).map(x => ({ type: 'project' as const, id: x.id, title: x.name, context: x.nextStep || 'مشروع' })),
    ...people.filter(x => `${x.name} ${x.description} ${x.notes}`.toLocaleLowerCase().includes(q)).map(x => ({ type: 'person' as const, id: x.id, title: x.name, context: x.contact || 'شخص' })),
    ...notes.filter(x => `${x.title} ${x.body}`.toLocaleLowerCase().includes(q)).map(x => ({ type: 'note' as const, id: x.id, title: x.title, context: x.kind })),
    ...inbox.filter(x => x.originalText.toLocaleLowerCase().includes(q)).map(x => ({ type: 'inbox' as const, id: x.id, title: x.originalText, context: 'الوارد' })),
  ].slice(0, 30)
}

export async function exportBackup() {
  const data: Record<string, unknown> = {}
  for (const store of stores) data[store] = await all(store)
  return JSON.stringify({ schema: 1, exportedAt: Date.now(), data }, null, 2)
}

export async function restoreBackup(raw: string, mode: 'merge' | 'replace') {
  const parsed = JSON.parse(raw) as { schema?: number; data?: Record<string, unknown> }
  if (parsed.schema !== 1 || !parsed.data || typeof parsed.data !== 'object') throw new Error('ملف النسخة الاحتياطية غير صالح أو غير مدعوم.')
  const db = await getDb()
  const tx = db.transaction(stores, 'readwrite')
  if (mode === 'replace') for (const store of stores) await tx.objectStore(store).clear()
  for (const store of stores) {
    const values = parsed.data[store]
    if (Array.isArray(values)) for (const value of values) await tx.objectStore(store).put(value as never)
  }
  await tx.done
}
