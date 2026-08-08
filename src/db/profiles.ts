import { db, type ProfileRecord } from './db'
import { generateId } from './id'

// Amorçait la base au tout premier lancement avec deux profils fictifs
// "Alex"/"Camille" (hérités de la phase mock) — retiré à la demande de
// l'utilisatrice : de vraies personnes utilisent maintenant l'app sur
// leurs propres appareils, et chaque nouvel appareil qui ouvrait l'app
// pour la première fois se retrouvait avec ces deux faux profils de test
// (un profil = une base IndexedDB locale par appareil, il n'y a pas de
// liste partagée entre utilisateurs). Un nouvel appareil démarre
// désormais sur une liste vide — juste "Nouveau profil"/"Récupérer un
// profil".
export async function listProfiles(): Promise<ProfileRecord[]> {
  const profiles = await db.profiles.toArray()
  return profiles.sort((a, b) => a.createdAt - b.createdAt)
}

export async function createProfile(name: string): Promise<ProfileRecord> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Le nom du profil ne peut pas être vide.')
  const count = await db.profiles.count()
  const record: ProfileRecord = {
    id: generateId(),
    name: trimmed,
    // Fait tourner la palette de dégradés existante plutôt que d'en
    // ajouter une nouvelle — cohérent avec la palette restreinte du
    // système de design (voir PROJECT_STATE.md).
    colorIndex: count,
    createdAt: Date.now(),
  }
  await db.profiles.add(record)
  return record
}

// Supprime le profil ET toutes ses données locales (maîtrise, notes,
// activité, favoris) — la sauvegarde en ligne éventuelle est supprimée
// séparément côté serveur avant l'appel à cette fonction (voir
// Settings.tsx, api/delete-account.ts). Transaction unique pour ne pas
// laisser des données orphelines si une étape échoue en cours de route.
export async function deleteProfile(profileId: string): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.profiles,
      db.mastery,
      db.notes,
      db.activity,
      db.favorites,
      db.timeSpent,
      db.profileSettings,
      db.reviewMarks,
      db.savedWords,
    ],
    async () => {
      await db.profiles.delete(profileId)
      await db.mastery.where({ profileId }).delete()
      await db.notes.where({ profileId }).delete()
      await db.activity.where({ profileId }).delete()
      await db.favorites.where({ profileId }).delete()
      await db.timeSpent.where({ profileId }).delete()
      await db.profileSettings.delete(profileId)
      await db.reviewMarks.where({ profileId }).delete()
      await db.savedWords.where({ profileId }).delete()
    },
  )
}
