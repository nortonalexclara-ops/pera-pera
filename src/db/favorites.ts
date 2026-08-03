import { db, type ItemKind } from './db'

export async function isFavorite(profileId: string, kind: ItemKind, itemId: string): Promise<boolean> {
  if (!profileId) return false
  const existing = await db.favorites.where({ profileId, kind, itemId }).first()
  return existing !== undefined
}

export async function toggleFavorite(profileId: string, kind: ItemKind, itemId: string): Promise<boolean> {
  if (!profileId) return false
  const existing = await db.favorites.where({ profileId, kind, itemId }).first()
  if (existing?.id !== undefined) {
    await db.favorites.delete(existing.id)
    return false
  }
  await db.favorites.add({ profileId, kind, itemId, favoritedAt: Date.now() })
  return true
}

export async function getFavoriteIds(profileId: string, kind: ItemKind): Promise<Set<string>> {
  if (!profileId) return new Set()
  const rows = await db.favorites.where({ profileId, kind }).toArray()
  return new Set(rows.map((r) => r.itemId))
}

// Toutes les kinds en un aller-retour — même motif que
// `getAllMasteredIds` (voir src/db/mastery.ts), utilisé par Explorer qui
// affiche les trois types de contenu mélangés.
export async function getAllFavoriteIds(profileId: string): Promise<Record<ItemKind, Set<string>>> {
  const empty = { kanji: new Set<string>(), vocab: new Set<string>(), grammar: new Set<string>() }
  if (!profileId) return empty
  const rows = await db.favorites.where({ profileId }).toArray()
  for (const row of rows) empty[row.kind].add(row.itemId)
  return empty
}

export async function resetFavorites(profileId: string): Promise<void> {
  if (!profileId) return
  await db.favorites.where({ profileId }).delete()
}
