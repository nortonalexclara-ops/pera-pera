import { db, type ProfileRecord } from './db'
import { generateId } from './id'

// Amorce la base au tout premier lancement avec les deux profils qui
// existaient en dur (mock) jusqu'ici — pour ne pas faire disparaître
// "Alex"/"Camille" du jour au lendemain pour les gens qui les utilisaient
// déjà en phase mock. Un utilisateur qui les supprime ensuite (pas encore
// de suppression dans l'UI, mais la donnée le permettrait) ne les reverra
// pas revenir : ce seed ne s'exécute que si la table est entièrement vide.
async function seedIfEmpty() {
  const count = await db.profiles.count()
  if (count > 0) return
  const now = Date.now()
  await db.profiles.bulkAdd([
    { id: 'p1', name: 'Alex', colorIndex: 0, createdAt: now },
    { id: 'p2', name: 'Camille', colorIndex: 1, createdAt: now + 1 },
  ])
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
