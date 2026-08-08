import { db } from './db'

export async function toggleSavedWord(
  profileId: string,
  word: string,
  reading: string,
  meaning: string,
  kanjiChar: string,
): Promise<boolean> {
  if (!profileId) return false
  const existing = await db.savedWords.where({ profileId, word }).first()
  if (existing?.id !== undefined) {
    await db.savedWords.delete(existing.id)
    return false
  }
  await db.savedWords.add({ profileId, word, reading, meaning, kanjiChar, savedAt: Date.now() })
  return true
}

// Juste les textes sauvegardés — sert à savoir si un mot exemple donné
// est déjà dans la liste (icône marque-page remplie ou non), sans charger
// le détail complet de chaque enregistrement.
export async function getSavedWordTexts(profileId: string): Promise<Set<string>> {
  if (!profileId) return new Set()
  const rows = await db.savedWords.where({ profileId }).toArray()
  return new Set(rows.map((r) => r.word))
}

export async function listSavedWords(profileId: string) {
  if (!profileId) return []
  const rows = await db.savedWords.where({ profileId }).toArray()
  return rows.sort((a, b) => b.savedAt - a.savedAt)
}
