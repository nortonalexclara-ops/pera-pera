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
    if (existing) return
    await db.mastery.add({ profileId, kind, itemId, masteredAt: Date.now() })
  } else if (existing?.id !== undefined) {
    await db.mastery.delete(existing.id)
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
  const empty = { kanji: new Set<string>(), vocab: new Set<string>(), grammar: new Set<string>() }
  if (!profileId) return empty
  const rows = await db.mastery.where({ profileId }).toArray()
  for (const row of rows) empty[row.kind].add(row.itemId)
  return empty
}
