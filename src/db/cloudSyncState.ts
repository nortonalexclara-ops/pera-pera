import { db, type CloudSyncStateRecord } from './db'

export async function getCloudSyncState(profileId: string): Promise<CloudSyncStateRecord | undefined> {
  if (!profileId) return undefined
  return db.cloudSyncState.get(profileId)
}

// Active la synchro automatique pour ce profil sur CET appareil — appelé
// juste après un "Sauvegarder en ligne"/"Récupérer un profil" réussi
// (voir Settings.tsx, ProfileSelector.tsx). Le code est gardé en clair en
// local pour pouvoir resynchroniser sans le redemander à chaque fois —
// cohérent avec le niveau de sécurité déjà assumé par ce backend (voir
// api/_redis.ts : "pas un vrai système de comptes").
export async function enableCloudSync(profileId: string, pin: string): Promise<void> {
  if (!profileId) return
  await db.cloudSyncState.put({ profileId, pin, enabled: true, lastSyncedAt: null })
}

// Équivalent de enableCloudSync mais pour un profil lié par compte email
// (voir useEmailAuthLink.ts, déclenché après un lien magique cliqué avec
// succès) — `pin` vide, `authUserId` sert de garde dans
// cloudSyncEngine.ts pour vérifier que la session Supabase active sur cet
// appareil correspond bien au compte auquel ce profil a été lié (et pas à
// un autre, si quelqu'un d'autre s'est connecté entre-temps sur le même
// appareil).
export async function enableEmailSync(profileId: string, email: string, authUserId: string): Promise<void> {
  if (!profileId) return
  await db.cloudSyncState.put({ profileId, pin: '', enabled: true, lastSyncedAt: null, email, authUserId })
}

export async function disableCloudSync(profileId: string): Promise<void> {
  if (!profileId) return
  const existing = await db.cloudSyncState.get(profileId)
  if (!existing) return
  await db.cloudSyncState.put({ ...existing, enabled: false })
}

export async function setLastSyncedAt(profileId: string, timestamp: number): Promise<void> {
  if (!profileId) return
  const existing = await db.cloudSyncState.get(profileId)
  if (!existing) return
  await db.cloudSyncState.put({ ...existing, lastSyncedAt: timestamp })
}
