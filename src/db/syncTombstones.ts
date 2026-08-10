import { db, type ItemKind, type SyncTombstoneTable } from './db'

// Clé naturelle d'un item kind+itemId (mastery/reviewMarks, favorites) —
// savedWords utilise directement `word`, notes directement `id`, pas
// besoin d'un helper pour ceux-là.
export function itemKey(kind: ItemKind, itemId: string): string {
  return `${kind}:${itemId}`
}

// Inverse d'itemKey — `kind` est un petit enum fixe sans ':', donc
// découper sur le PREMIER ':' rencontré isole toujours correctement le
// reste (itemId) même si celui-ci en contenait un.
export function parseItemKey(key: string): { kind: ItemKind; itemId: string } {
  const i = key.indexOf(':')
  return { kind: key.slice(0, i) as ItemKind, itemId: key.slice(i + 1) }
}

// Upsert sur (profileId, table, key) plutôt qu'un simple `add` — basculer
// un favori on/off/on plusieurs fois ne doit pas empiler des tombstones
// en double, juste garder le plus récent. Garde le `deletedAt` le plus
// grand entre l'existant et le nouveau (pas un simple écrasement) : cette
// même fonction sert aussi à absorber les tombstones reçus d'un autre
// appareil lors d'une fusion (voir cloudSyncEngine.ts) — un tombstone
// distant plus ANCIEN qu'un tombstone local ne doit jamais le remplacer.
export async function writeTombstone(
  profileId: string,
  table: SyncTombstoneTable,
  key: string,
  deletedAt: number = Date.now(),
): Promise<void> {
  if (!profileId) return
  const existing = await db.syncTombstones.where({ profileId, table, key }).first()
  if (existing?.id !== undefined) {
    if (deletedAt > existing.deletedAt) await db.syncTombstones.update(existing.id, { deletedAt })
  } else {
    await db.syncTombstones.add({ profileId, table, key, deletedAt })
  }
}
