import type { ProfileBackupPayload } from './profileSync'
import type { SyncTombstoneTable } from './db'
import { itemKey, parseItemKey } from './syncTombstones'
import { DEFAULT_KANJI_GOAL } from './settings'

type Tombstone = ProfileBackupPayload['tombstones'][number]

// Union par (table, key), garde le `deletedAt` le plus récent — jamais de
// perte : un tombstone créé sur un appareil doit survivre à toutes les
// fusions suivantes, même après avoir déjà "gagné" une fois.
export function mergeTombstones(local: Tombstone[], remote: Tombstone[]): Tombstone[] {
  const byKey = new Map<string, Tombstone>()
  for (const t of [...local, ...remote]) {
    const mapKey = `${t.table}:${t.key}`
    const existing = byKey.get(mapKey)
    if (!existing || t.deletedAt > existing.deletedAt) byKey.set(mapKey, t)
  }
  return [...byKey.values()]
}

function tombstoneMapFor(tombstones: Tombstone[], table: SyncTombstoneTable): Map<string, number> {
  const map = new Map<string, number>()
  for (const t of tombstones) {
    if (t.table === table) map.set(t.key, t.deletedAt)
  }
  return map
}

// Fusion générique "dernier événement gagne, sauf si un tombstone plus
// récent existe" — utilisée pour favorites/savedWords/notes : chaque item
// a une clé naturelle et un timestamp de dernière modification ; on
// prend le plus récent des deux côtés (local/distant), sauf si un
// tombstone (déjà fusionné, voir mergeTombstones) est encore plus récent
// que ça, auquel cas l'item est considéré supprimé.
function mergeMembership<T>(
  local: T[],
  remote: T[],
  mergedTombstones: Tombstone[],
  table: SyncTombstoneTable,
  getKey: (item: T) => string,
  getTimestamp: (item: T) => number,
): T[] {
  const tombstoneMap = tombstoneMapFor(mergedTombstones, table)
  const byKey = new Map<string, T>()
  for (const item of [...local, ...remote]) {
    const key = getKey(item)
    const existing = byKey.get(key)
    if (!existing || getTimestamp(item) > getTimestamp(existing)) byKey.set(key, item)
  }
  const result: T[] = []
  for (const [key, item] of byKey) {
    const deletedAt = tombstoneMap.get(key)
    if (deletedAt !== undefined && deletedAt >= getTimestamp(item)) continue
    result.push(item)
  }
  return result
}

// Mastery et reviewMarks sont mutuellement exclusifs PAR CONSTRUCTION
// (voir setMastered, mastery.ts) — mais seulement sur UN appareil à la
// fois. Les fusionner comme deux tables indépendantes casserait cet
// invariant (un item pourrait finir "maîtrisé" ET "à revoir" après
// fusion, si chaque table gagne sa propre comparaison séparément).
// Traités ici comme UN statut combiné par item : pour chaque clé, on
// compare le seul événement le plus récent parmi {mastery local,
// reviewMarks local, mastery distant, reviewMarks distant, tombstone
// "remis à zéro" le plus récent} — celui-là gagne et détermine le statut
// final (mastered / review / aucun). Les transitions normales
// mastered<->review n'ont pas besoin de tombstone : elles se résolvent
// déjà par cette comparaison de timestamp.
function mergeStatus(
  localMastery: ProfileBackupPayload['mastery'],
  localReview: ProfileBackupPayload['reviewMarks'],
  remoteMastery: ProfileBackupPayload['mastery'],
  remoteReview: ProfileBackupPayload['reviewMarks'],
  mergedTombstones: Tombstone[],
): { mastery: ProfileBackupPayload['mastery']; reviewMarks: ProfileBackupPayload['reviewMarks'] } {
  type Status = 'mastered' | 'review' | 'none'
  const winners = new Map<string, { status: Status; timestamp: number }>()

  function consider(key: string, status: Status, timestamp: number) {
    const existing = winners.get(key)
    if (!existing || timestamp > existing.timestamp) winners.set(key, { status, timestamp })
  }

  for (const m of localMastery) consider(itemKey(m.kind, m.itemId), 'mastered', m.masteredAt)
  for (const m of remoteMastery) consider(itemKey(m.kind, m.itemId), 'mastered', m.masteredAt)
  for (const r of localReview) consider(itemKey(r.kind, r.itemId), 'review', r.markedAt)
  for (const r of remoteReview) consider(itemKey(r.kind, r.itemId), 'review', r.markedAt)
  for (const t of mergedTombstones) {
    if (t.table === 'mastery') consider(t.key, 'none', t.deletedAt)
  }

  const mastery: ProfileBackupPayload['mastery'] = []
  const reviewMarks: ProfileBackupPayload['reviewMarks'] = []
  for (const [key, winner] of winners) {
    if (winner.status === 'none') continue
    const { kind, itemId } = parseItemKey(key)
    if (winner.status === 'mastered') mastery.push({ kind, itemId, masteredAt: winner.timestamp })
    else reviewMarks.push({ kind, itemId, markedAt: winner.timestamp })
  }
  return { mastery, reviewMarks }
}

// Simple union des dates — pas de notion de suppression individuelle
// d'un jour d'activité en usage normal (voir limites documentées dans le
// plan : un reset en masse du streak peut être "ressuscité" par la
// fusion, cas rare et volontaire, non couvert par un tombstone dédié).
function mergeActivity(
  local: ProfileBackupPayload['activity'],
  remote: ProfileBackupPayload['activity'],
): ProfileBackupPayload['activity'] {
  const dates = new Set([...local.map((a) => a.date), ...remote.map((a) => a.date)])
  return [...dates].map((date) => ({ date }))
}

// PAS un simple MAX(local, distant) : ça ferait perdre du temps
// réellement pratiqué en parallèle sur les deux appareils le même jour
// (ex. 3min PC + 5min téléphone le même jour → MAX donnerait 5min au
// lieu de 8min). Chaque ligne garde `syncedSeconds`, sa valeur au dernier
// sync réussi — le delta local (secondes ajoutées depuis cette valeur)
// s'additionne au total distant, sans jamais compter deux fois au sync
// suivant puisque `syncedSeconds` est remis à jour à chaque fusion.
function mergeTimeSpent(
  local: ProfileBackupPayload['timeSpent'],
  remote: ProfileBackupPayload['timeSpent'],
): ProfileBackupPayload['timeSpent'] {
  const remoteByDate = new Map(remote.map((t) => [t.date, t.seconds]))
  const dates = new Set([...local.map((t) => t.date), ...remote.map((t) => t.date)])
  const result: ProfileBackupPayload['timeSpent'] = []
  for (const date of dates) {
    const localRow = local.find((t) => t.date === date)
    const delta = Math.max(0, (localRow?.seconds ?? 0) - (localRow?.syncedSeconds ?? 0))
    const merged = (remoteByDate.get(date) ?? 0) + delta
    result.push({ date, seconds: merged, syncedSeconds: merged })
  }
  return result
}

// Préférence locale à faible enjeu : si ce profil a déjà personnalisé
// son objectif SUR CET APPAREIL, on le garde ; sinon on reprend celui du
// distant. Pas de nouveau timestamp nécessaire pour ce champ.
function mergeKanjiGoal(localGoal: number, remoteGoal: number): number {
  return localGoal !== DEFAULT_KANJI_GOAL ? localGoal : remoteGoal
}

export function mergePayloads(local: ProfileBackupPayload, remote: ProfileBackupPayload): ProfileBackupPayload {
  const tombstones = mergeTombstones(local.tombstones ?? [], remote.tombstones ?? [])
  const { mastery, reviewMarks } = mergeStatus(
    local.mastery,
    local.reviewMarks,
    remote.mastery,
    remote.reviewMarks,
    tombstones,
  )
  return {
    mastery,
    reviewMarks,
    favorites: mergeMembership(
      local.favorites,
      remote.favorites,
      tombstones,
      'favorites',
      (f) => itemKey(f.kind, f.itemId),
      (f) => f.favoritedAt,
    ),
    savedWords: mergeMembership(
      local.savedWords,
      remote.savedWords,
      tombstones,
      'savedWords',
      (s) => s.word,
      (s) => s.savedAt,
    ),
    notes: mergeMembership(
      local.notes,
      remote.notes,
      tombstones,
      'notes',
      (n) => n.id,
      (n) => n.updatedAt,
    ),
    activity: mergeActivity(local.activity, remote.activity),
    timeSpent: mergeTimeSpent(local.timeSpent, remote.timeSpent),
    kanjiGoal: mergeKanjiGoal(local.kanjiGoal, remote.kanjiGoal),
    tombstones,
  }
}
