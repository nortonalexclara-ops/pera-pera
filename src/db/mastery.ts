import { db, type ItemKind } from './db'

// Décision prise sur une carte en séance — "review" ne stocke rien de
// spécifique, c'est juste l'absence (ou le retrait) d'un enregistrement de
// maîtrise pour cet item. La table `mastery` ne représente donc que le
// dernier verdict connu, pas un historique complet des essais.
export type CardDecision = 'mastered' | 'review'

export async function setMastered(profileId: string, kind: ItemKind, itemId: string, decision: CardDecision) {
  if (!profileId) return
  const existing = await db.mastery.where({ profileId, kind, itemId }).first()
  if (decision === 'mastered') {
    if (!existing) await db.mastery.add({ profileId, kind, itemId, masteredAt: Date.now() })
    // Un item maîtrisé n'a plus de raison de rester marqué "à revoir" —
    // voir ReviewMarkRecord (db.ts) : les deux tables restent mutuellement
    // exclusives.
    await db.reviewMarks.where({ profileId, kind, itemId }).delete()
    return
  }
  if (existing?.id !== undefined) await db.mastery.delete(existing.id)
  const existingReview = await db.reviewMarks.where({ profileId, kind, itemId }).first()
  if (existingReview?.id !== undefined) {
    await db.reviewMarks.update(existingReview.id, { markedAt: Date.now() })
  } else {
    await db.reviewMarks.add({ profileId, kind, itemId, markedAt: Date.now() })
  }
}

export async function getReviewIds(profileId: string, kind: ItemKind): Promise<Set<string>> {
  if (!profileId) return new Set()
  const rows = await db.reviewMarks.where({ profileId, kind }).toArray()
  return new Set(rows.map((r) => r.itemId))
}

export async function resetReviewMarks(profileId: string, kinds?: ItemKind[]): Promise<void> {
  if (!profileId) return
  if (!kinds || kinds.length === 0) {
    await db.reviewMarks.where({ profileId }).delete()
    return
  }
  for (const kind of kinds) {
    await db.reviewMarks.where({ profileId, kind }).delete()
  }
}

export async function getMasteredIds(profileId: string, kind: ItemKind): Promise<Set<string>> {
  if (!profileId) return new Set()
  const rows = await db.mastery.where({ profileId, kind }).toArray()
  return new Set(rows.map((r) => r.itemId))
}

export async function countMastered(profileId: string, kind: ItemKind): Promise<number> {
  if (!profileId) return 0
  return db.mastery.where({ profileId, kind }).count()
}

// Toutes les lignes de maîtrise d'un profil en un seul aller-retour —
// utilisé par l'écran Stats pour dériver plusieurs répartitions (par
// module, par niveau JLPT) sans une requête séparée par sous-ensemble.
export async function getAllMasteredIds(profileId: string): Promise<Record<ItemKind, Set<string>>> {
  const empty = {
    kanji: new Set<string>(),
    vocab: new Set<string>(),
    grammar: new Set<string>(),
    hiragana: new Set<string>(),
    katakana: new Set<string>(),
  }
  if (!profileId) return empty
  const rows = await db.mastery.where({ profileId }).toArray()
  for (const row of rows) empty[row.kind].add(row.itemId)
  return empty
}

// Marquage en masse depuis Réglages — pour un profil qui connaît déjà tout
// un niveau JLPT (ex. N5) et ne veut pas recocher "Maîtrisé" carte par
// carte. N'ajoute que ce qui manque (skip les itemIds déjà maîtrisés) pour
// rester idempotent si rappelé deux fois.
export async function bulkMarkMastered(profileId: string, kind: ItemKind, itemIds: string[]): Promise<number> {
  if (!profileId || itemIds.length === 0) return 0
  const existing = await db.mastery.where({ profileId, kind }).toArray()
  const existingIds = new Set(existing.map((r) => r.itemId))
  const toAdd = itemIds
    .filter((itemId) => !existingIds.has(itemId))
    .map((itemId) => ({ profileId, kind, itemId, masteredAt: Date.now() }))
  if (toAdd.length > 0) await db.mastery.bulkAdd(toAdd)
  return toAdd.length
}

// Réinitialisation depuis Réglages — `kinds` absent efface toute la
// maîtrise du profil, sinon seulement les types cochés (ex. juste
// Kanjis) pour laisser le choix plutôt qu'un unique "tout effacer".
export async function resetMastery(profileId: string, kinds?: ItemKind[]): Promise<void> {
  if (!profileId) return
  if (!kinds || kinds.length === 0) {
    await db.mastery.where({ profileId }).delete()
    return
  }
  for (const kind of kinds) {
    await db.mastery.where({ profileId, kind }).delete()
  }
}
