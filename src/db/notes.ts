import { db, type NoteRecord } from './db'
import { generateId } from './id'

export async function listNotes(profileId: string): Promise<NoteRecord[]> {
  if (!profileId) return []
  const notes = await db.notes.where({ profileId }).toArray()
  // Plus récemment modifiée en premier — une note qu'on vient de compléter
  // (ex. juste après avoir entendu une expression) doit remonter en haut,
  // pas rester triée par date de création.
  return notes.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getNote(id: string): Promise<NoteRecord | undefined> {
  return db.notes.get(id)
}

export async function createNote(profileId: string, title = 'Nouvelle note'): Promise<NoteRecord> {
  const now = Date.now()
  const note: NoteRecord = {
    id: generateId(),
    profileId,
    title,
    text: '',
    drawingDataUrl: '',
    createdAt: now,
    updatedAt: now,
  }
  await db.notes.add(note)
  return note
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<NoteRecord, 'title' | 'text' | 'drawingDataUrl'>>,
): Promise<void> {
  await db.notes.update(id, { ...patch, updatedAt: Date.now() })
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id)
}

export async function resetNotes(profileId: string): Promise<void> {
  if (!profileId) return
  await db.notes.where({ profileId }).delete()
}
