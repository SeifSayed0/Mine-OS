import { DBSchema, IDBPDatabase, openDB } from 'idb'
import type { Commitment, InboxItem, Note, Person, Preference, Project, ProjectStep, Reminder, Review, Task } from '../domain/types'

export interface LifeDb extends DBSchema {
  tasks: { key: string; value: Task; indexes: { 'by-status': string; 'by-due': number } }
  inbox: { key: string; value: InboxItem; indexes: { 'by-created': number } }
  projects: { key: string; value: Project; indexes: { 'by-status': string } }
  steps: { key: string; value: ProjectStep; indexes: { 'by-project': string } }
  people: { key: string; value: Person }
  commitments: { key: string; value: Commitment; indexes: { 'by-person': string; 'by-status': string } }
  notes: { key: string; value: Note; indexes: { 'by-updated': number } }
  reminders: { key: string; value: Reminder; indexes: { 'by-trigger': number } }
  reviews: { key: string; value: Review; indexes: { 'by-created': number } }
  preferences: { key: string; value: Preference }
}

let dbPromise: Promise<IDBPDatabase<LifeDb>> | undefined
export function getDb() {
  dbPromise ??= openDB<LifeDb>('personal-life-os', 1, {
    upgrade(db) {
      const tasks = db.createObjectStore('tasks', { keyPath: 'id' }); tasks.createIndex('by-status', 'status'); tasks.createIndex('by-due', 'dueAt')
      const inbox = db.createObjectStore('inbox', { keyPath: 'id' }); inbox.createIndex('by-created', 'createdAt')
      const projects = db.createObjectStore('projects', { keyPath: 'id' }); projects.createIndex('by-status', 'status')
      const steps = db.createObjectStore('steps', { keyPath: 'id' }); steps.createIndex('by-project', 'projectId')
      db.createObjectStore('people', { keyPath: 'id' })
      const commitments = db.createObjectStore('commitments', { keyPath: 'id' }); commitments.createIndex('by-person', 'personId'); commitments.createIndex('by-status', 'status')
      const notes = db.createObjectStore('notes', { keyPath: 'id' }); notes.createIndex('by-updated', 'updatedAt')
      const reminders = db.createObjectStore('reminders', { keyPath: 'id' }); reminders.createIndex('by-trigger', 'triggerAt')
      const reviews = db.createObjectStore('reviews', { keyPath: 'id' }); reviews.createIndex('by-created', 'createdAt')
      db.createObjectStore('preferences', { keyPath: 'key' })
    },
  })
  return dbPromise
}
