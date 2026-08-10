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
