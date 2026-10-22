export type TaskStatus = 'ready' | 'progress' | 'done' | 'deferred' | 'cancelled'
export type Priority = 'low' | 'normal' | 'important' | 'urgent'

export type Task = {
  id: string
  title: string
  originalText: string
  description: string
  status: TaskStatus
  priority: Priority
  dueAt?: number
  projectId?: string
  personId?: string
  createdAt: number
  updatedAt: number
  completedAt?: number
}

export type InboxItem = { id: string; originalText: string; createdAt: number; processed: boolean }
export type Project = { id: string; name: string; description: string; goal: string; nextStep: string; status: 'active' | 'paused' | 'done'; createdAt: number; updatedAt: number }
export type ProjectStep = { id: string; projectId: string; title: string; done: boolean; order: number }
export type Person = { id: string; name: string; description: string; contact: string; notes: string; createdAt: number }
export type Commitment = { id: string; personId?: string; originalText: string; followUpAt?: number; status: 'open' | 'done' | 'cancelled'; createdAt: number }
export type Note = { id: string; title: string; body: string; kind: 'note' | 'idea' | 'reference'; createdAt: number; updatedAt: number }
export type Reminder = { id: string; title: string; triggerAt: number; taskId?: string; enabled: boolean }
export type Review = { id: string; kind: 'daily' | 'weekly'; reflection: string; createdAt: number }
export type Preference = { key: string; value: string }
export type Entity = Task | InboxItem | Project | ProjectStep | Person | Commitment | Note | Reminder | Review | Preference

export type SearchResult = { type: 'task' | 'project' | 'person' | 'note' | 'inbox'; id: string; title: string; context: string }

export const uid = () => crypto.randomUUID()
export const now = () => Date.now()
