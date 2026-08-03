import { db, type ProfileRecord } from './db'
import { generateId } from './id'

// Amorce la base au tout premier lancement avec les deux profils qui
// existaient en dur (mock) jusqu'ici — pour ne pas faire disparaître
// "Alex"/"Camille" du jour au lendemain pour les gens qui les utilisaient
// déjà en phase mock.
//
// Ne se base PAS sur "la table est vide" pour décider de semer : une fois
// la suppression de profil ajoutée (voir `deleteProfile`), supprimer le
// tout dernier profil videait la table, et le prochain montage de
// ProfileSelector rappelait `listProfiles` → table vide → Alex/Camille
// ressuscitaient tout seuls, ce que le commentaire d'origine promettait
// justement d'éviter. Un flag `localStorage` persistant (indépendant du
// contenu de la table) marque "le seed a déjà eu lieu" une fois pour
// toutes, y compris pour les bases déjà existantes qui n'ont jamais semé.
const SEED_FLAG_KEY = 'pera-pera:profiles-seeded'

async function seedIfEmpty() {
  if (localStorage.getItem(SEED_FLAG_KEY)) return
  const count = await db.profiles.count()
  if (count === 0) {
    const now = Date.now()
    await db.profiles.bulkAdd([
      { id: 'p1', name: 'Alex', colorIndex: 0, createdAt: now },
      { id: 'p2', name: 'Camille', colorIndex: 1, createdAt: now + 1 },
    ])
  }
  localStorage.setItem(SEED_FLAG_KEY, '1')
}

export async function listProfiles(): Promise<ProfileRecord[]> {
  await seedIfEmpty()
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
  await db.transaction('rw', db.profiles, db.mastery, db.notes, db.activity, db.favorites, async () => {
    await db.profiles.delete(profileId)
    await db.mastery.where({ profileId }).delete()
    await db.notes.where({ profileId }).delete()
    await db.activity.where({ profileId }).delete()
    await db.favorites.where({ profileId }).delete()
  })
}
