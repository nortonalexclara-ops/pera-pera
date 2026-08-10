import { db, type ItemKind, type SyncTombstoneTable } from './db'
import { getKanjiGoal, setKanjiGoal, DEFAULT_KANJI_GOAL } from './settings'
import { writeTombstone } from './syncTombstones'

// Forme envoyée/reçue par /api/backup et /api/restore — tout ce qui
// définit la progression d'un profil, sans son id local (qui diffère
// forcément d'un appareil à l'autre, voir replaceProfileData). PAS
// `hasCloudBackup` (voir `profileSettings`) : c'est un statut LOCAL à
// l'appareil ("ce profil a-t-il déjà été sauvegardé DEPUIS ICI"), pas
// une donnée de profil à faire voyager — `ProfileSelector.tsx` le pose
// à `true` directement après une récupération réussie plutôt que de le
// faire transiter par ce payload.
export interface ProfileBackupPayload {
  mastery: { kind: ItemKind; itemId: string; masteredAt: number }[]
  activity: { date: string }[]
  notes: { id: string; title: string; text: string; drawingDataUrl: string; createdAt: number; updatedAt: number }[]
  favorites: { kind: ItemKind; itemId: string; favoritedAt: number }[]
  kanjiGoal: number
  // `syncedSeconds` : voir TimeSpentRecord (db.ts) — valeur au dernier
  // sync, sert au calcul du delta lors d'une fusion (cloudSyncMerge.ts).
  timeSpent: { date: string; seconds: number; syncedSeconds?: number }[]
  reviewMarks: { kind: ItemKind; itemId: string; markedAt: number }[]
  savedWords: { word: string; reading: string; meaning: string; kanjiChar: string; savedAt: number }[]
  // Traces de suppression (voir SyncTombstoneRecord, db.ts) — nécessaire
  // pour qu'une suppression faite sur UN appareil ne "ressuscite" pas au
  // contact d'un autre appareil qui ne l'a pas encore vue.
  tombstones: { table: SyncTombstoneTable; key: string; deletedAt: number }[]
}

export async function exportProfileData(profileId: string): Promise<ProfileBackupPayload> {
  const [mastery, activity, notes, favorites, kanjiGoal, timeSpent, reviewMarks, savedWords, tombstones] =
    await Promise.all([
      db.mastery.where({ profileId }).toArray(),
      db.activity.where({ profileId }).toArray(),
      db.notes.where({ profileId }).toArray(),
      db.favorites.where({ profileId }).toArray(),
      getKanjiGoal(profileId),
      db.timeSpent.where({ profileId }).toArray(),
      db.reviewMarks.where({ profileId }).toArray(),
      db.savedWords.where({ profileId }).toArray(),
      db.syncTombstones.where({ profileId }).toArray(),
    ])
  return {
    mastery: mastery.map((m) => ({ kind: m.kind, itemId: m.itemId, masteredAt: m.masteredAt })),
    activity: activity.map((a) => ({ date: a.date })),
    notes: notes.map((n) => ({
      id: n.id,
      title: n.title,
      text: n.text,
      drawingDataUrl: n.drawingDataUrl,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    })),
    favorites: favorites.map((f) => ({ kind: f.kind, itemId: f.itemId, favoritedAt: f.favoritedAt })),
    kanjiGoal,
    timeSpent: timeSpent.map((t) => ({ date: t.date, seconds: t.seconds, syncedSeconds: t.syncedSeconds })),
    reviewMarks: reviewMarks.map((r) => ({ kind: r.kind, itemId: r.itemId, markedAt: r.markedAt })),
    savedWords: savedWords.map((s) => ({
      word: s.word,
      reading: s.reading,
      meaning: s.meaning,
      kanjiChar: s.kanjiChar,
      savedAt: s.savedAt,
    })),
    tombstones: tombstones.map((t) => ({ table: t.table, key: t.key, deletedAt: t.deletedAt })),
  }
}

// Écrit `payload` dans le profil local `profileId`, en remplaçant
// entièrement ce qui existait pour chaque table — SAUF `syncTombstones`,
// qui s'union/upsert (voir writeTombstone) plutôt que d'être remplacée :
// un tombstone local pas encore poussé vers le cloud ne doit jamais être
// perdu en écrivant un résultat qui n'en a pas encore connaissance.
// Utilisée à la fois par le flux "Récupérer un profil" (profil flambant
// neuf, rien à fusionner) et par le moteur de synchro (résultat déjà
// fusionné à écrire localement, voir cloudSyncEngine.ts).
export async function replaceProfileData(profileId: string, payload: ProfileBackupPayload): Promise<void> {
  // Champs absents dans une sauvegarde plus ancienne (créée avant leur
  // ajout au payload) — repli pour rester compatible plutôt que de
  // planter ou d'écrire `undefined`.
  const favorites = payload.favorites ?? []
  const kanjiGoal = payload.kanjiGoal ?? DEFAULT_KANJI_GOAL
  const timeSpent = payload.timeSpent ?? []
  const reviewMarks = payload.reviewMarks ?? []
  const savedWords = payload.savedWords ?? []
  const tombstones = payload.tombstones ?? []
  await db.transaction(
    'rw',
    [db.mastery, db.activity, db.notes, db.favorites, db.timeSpent, db.reviewMarks, db.savedWords, db.syncTombstones],
    async () => {
      await db.mastery.where({ profileId }).delete()
      await db.activity.where({ profileId }).delete()
      await db.notes.where({ profileId }).delete()
      await db.favorites.where({ profileId }).delete()
      await db.timeSpent.where({ profileId }).delete()
      await db.reviewMarks.where({ profileId }).delete()
      await db.savedWords.where({ profileId }).delete()

      if (payload.mastery.length > 0) {
        await db.mastery.bulkAdd(payload.mastery.map((m) => ({ profileId, ...m })))
      }
      if (payload.activity.length > 0) {
        await db.activity.bulkAdd(payload.activity.map((a) => ({ profileId, ...a })))
      }
      if (payload.notes.length > 0) {
        // Les ids de notes viennent du cloud (générés sur l'appareil
        // d'origine) — repris tels quels, `id` est déjà la clé primaire de
        // la table `notes` (pas d'auto-incrément à éviter de percuter ici).
        await db.notes.bulkAdd(payload.notes.map((n) => ({ profileId, ...n })))
      }
      if (favorites.length > 0) {
        await db.favorites.bulkAdd(favorites.map((f) => ({ profileId, ...f })))
      }
      if (timeSpent.length > 0) {
        await db.timeSpent.bulkAdd(timeSpent.map((t) => ({ profileId, ...t })))
      }
      if (reviewMarks.length > 0) {
        await db.reviewMarks.bulkAdd(reviewMarks.map((r) => ({ profileId, ...r })))
      }
      if (savedWords.length > 0) {
        await db.savedWords.bulkAdd(savedWords.map((s) => ({ profileId, ...s })))
      }
      for (const t of tombstones) {
        await writeTombstone(profileId, t.table, t.key, t.deletedAt)
      }
    },
  )
  // Hors de la transaction ci-dessus : `setKanjiGoal` fait son propre
  // lire-modifier-écrire sur `profileSettings`, pas besoin d'atomicité
  // avec le reste (rien ne dépend de son ordre relatif aux autres tables).
  await setKanjiGoal(profileId, kanjiGoal)
}
