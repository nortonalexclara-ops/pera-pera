import { db } from './db'
import type { ItemKind } from './db'
import { getKanjiGoal, setKanjiGoal, DEFAULT_KANJI_GOAL } from './settings'

// Forme envoyée/reçue par /api/backup et /api/restore — tout ce qui
// définit la progression d'un profil, sans son id local (qui diffère
// forcément d'un appareil à l'autre, voir importProfileData). PAS
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
  timeSpent: { date: string; seconds: number }[]
  reviewMarks: { kind: ItemKind; itemId: string; markedAt: number }[]
}

export async function exportProfileData(profileId: string): Promise<ProfileBackupPayload> {
  const [mastery, activity, notes, favorites, kanjiGoal, timeSpent, reviewMarks] = await Promise.all([
    db.mastery.where({ profileId }).toArray(),
    db.activity.where({ profileId }).toArray(),
    db.notes.where({ profileId }).toArray(),
    db.favorites.where({ profileId }).toArray(),
    getKanjiGoal(profileId),
    db.timeSpent.where({ profileId }).toArray(),
    db.reviewMarks.where({ profileId }).toArray(),
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
    timeSpent: timeSpent.map((t) => ({ date: t.date, seconds: t.seconds })),
    reviewMarks: reviewMarks.map((r) => ({ kind: r.kind, itemId: r.itemId, markedAt: r.markedAt })),
  }
}

// Écrit les données récupérées du cloud dans le profil local `profileId`
// (créé juste avant côté appelant, voir ProfileSelector "Récupérer un
// profil"). Remplace entièrement ce qui existait déjà pour ce profil
// plutôt que fusionner — un profil local flambant neuf n'a de toute façon
// rien à fusionner, et ça évite les doublons si l'utilisateur récupère
// deux fois de suite.
export async function importProfileData(profileId: string, payload: ProfileBackupPayload): Promise<void> {
  // `favorites`/`kanjiGoal` n'existaient pas dans les sauvegardes créées
  // avant leur ajout au payload — repli pour rester compatible avec une
  // sauvegarde plus ancienne récupérée maintenant, plutôt que de planter
  // ou d'écrire `undefined` sur un champ absent.
  const favorites = payload.favorites ?? []
  const kanjiGoal = payload.kanjiGoal ?? DEFAULT_KANJI_GOAL
  const timeSpent = payload.timeSpent ?? []
  const reviewMarks = payload.reviewMarks ?? []
  await db.transaction(
    'rw',
    [db.mastery, db.activity, db.notes, db.favorites, db.timeSpent, db.reviewMarks],
    async () => {
      await db.mastery.where({ profileId }).delete()
      await db.activity.where({ profileId }).delete()
      await db.notes.where({ profileId }).delete()
      await db.favorites.where({ profileId }).delete()
      await db.timeSpent.where({ profileId }).delete()
      await db.reviewMarks.where({ profileId }).delete()

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
    },
  )
  // Hors de la transaction ci-dessus : `setKanjiGoal` fait son propre
  // lire-modifier-écrire sur `profileSettings`, pas besoin d'atomicité
  // avec le reste (rien ne dépend de son ordre relatif aux autres tables).
  await setKanjiGoal(profileId, kanjiGoal)
}
