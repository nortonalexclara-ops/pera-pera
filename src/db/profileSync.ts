import { db } from './db'
import type { ItemKind } from './db'

// Forme envoyée/reçue par /api/backup et /api/restore — tout ce qui
// définit la progression d'un profil, sans son id local (qui diffère
// forcément d'un appareil à l'autre, voir importProfileData).
export interface ProfileBackupPayload {
  mastery: { kind: ItemKind; itemId: string; masteredAt: number }[]
  activity: { date: string }[]
  notes: { id: string; title: string; text: string; drawingDataUrl: string; createdAt: number; updatedAt: number }[]
  favorites: { kind: ItemKind; itemId: string; favoritedAt: number }[]
}

export async function exportProfileData(profileId: string): Promise<ProfileBackupPayload> {
  const [mastery, activity, notes, favorites] = await Promise.all([
    db.mastery.where({ profileId }).toArray(),
    db.activity.where({ profileId }).toArray(),
    db.notes.where({ profileId }).toArray(),
    db.favorites.where({ profileId }).toArray(),
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
  }
}

// Écrit les données récupérées du cloud dans le profil local `profileId`
// (créé juste avant côté appelant, voir ProfileSelector "Récupérer un
// profil"). Remplace entièrement ce qui existait déjà pour ce profil
// plutôt que fusionner — un profil local flambant neuf n'a de toute façon
// rien à fusionner, et ça évite les doublons si l'utilisateur récupère
// deux fois de suite.
export async function importProfileData(profileId: string, payload: ProfileBackupPayload): Promise<void> {
  // `favorites` n'existait pas dans les sauvegardes créées avant son ajout
  // au payload — `?? []` pour rester compatible avec une sauvegarde plus
  // ancienne récupérée maintenant, plutôt que de planter sur un champ
  // absent.
  const favorites = payload.favorites ?? []
  await db.transaction('rw', db.mastery, db.activity, db.notes, db.favorites, async () => {
    await db.mastery.where({ profileId }).delete()
    await db.activity.where({ profileId }).delete()
    await db.notes.where({ profileId }).delete()
    await db.favorites.where({ profileId }).delete()

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
  })
}
