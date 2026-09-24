import { enableEmailSync } from '../../db/cloudSyncState'
import { setHasCloudBackup } from '../../db/settings'
import { syncNow } from './cloudSyncEngine'
import { getCurrentSession } from './emailAuth'
import { fetchRemoteProfileMeta } from './emailSync'
import { replaceProfileData } from '../../db/profileSync'
import { createProfile } from '../../db/profiles'
import type { ProfileRecord } from '../../db/db'

// Termine la liaison d'un compte email à un profil LOCAL déjà existant —
// utilisé depuis Réglages, une fois la connexion/création de compte
// réussie (voir Settings.tsx, useEmailAuthLink.ts).
export async function linkExistingProfileToEmail(profileId: string): Promise<void> {
  const session = await getCurrentSession()
  if (!session) throw new Error('Non connecté.')
  const remote = await fetchRemoteProfileMeta()
  if (remote) await replaceProfileData(profileId, remote.payload)
  await enableEmailSync(profileId, session.user.email ?? '', session.user.id)
  await setHasCloudBackup(profileId, true)
  await syncNow(profileId, '')
}

// Termine une connexion/création de compte lancée SANS profil local actif
// (écran de sélection de profil — nouvel appareil, ou première visite) :
// crée le profil local correspondant, rempli avec la sauvegarde existante
// de ce compte si elle existe déjà (connexion depuis un autre appareil —
// `fallbackName` n'est alors pas utilisé, le vrai nom sauvegardé prime).
// Sinon, nom choisi dans l'ordre : celui fourni par Google (connexion
// Google, pas de prénom demandé avant le redirect) > `fallbackName` (tapé
// à la main pour une création de compte par mot de passe).
export async function createProfileFromEmailAuth(fallbackName: string): Promise<ProfileRecord> {
  const session = await getCurrentSession()
  if (!session) throw new Error('Non connecté.')
  const remote = await fetchRemoteProfileMeta()
  const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name
  const record = await createProfile(remote?.displayName || googleName || fallbackName)
  if (remote) await replaceProfileData(record.id, remote.payload)
  await enableEmailSync(record.id, session.user.email ?? '', session.user.id)
  await setHasCloudBackup(record.id, true)
  await syncNow(record.id, '')
  return record
}
