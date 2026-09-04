import { exportProfileData, replaceProfileData, type ProfileBackupPayload } from '../../db/profileSync'
import { getCloudSyncState, setLastSyncedAt } from '../../db/cloudSyncState'
import { mergePayloads } from '../../db/cloudSyncMerge'
import { backupProfile, restoreProfile, HttpError } from './cloudSync'
import { backupProfileEmail, restoreProfileEmail } from './emailSync'
import { getCurrentSession } from './emailAuth'

// Marge sous les limites habituelles de taille de requête/valeur
// (fonctions serverless Vercel, valeurs Upstash Redis) — pas de chiffre
// officiel documenté ici, choisi prudemment plutôt que de laisser un
// échec réseau cryptique si une sauvegarde devient trop volumineuse
// (beaucoup de notes avec dessins, voir NoteCanvas.tsx).
const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024

export type SyncResult = 'ok' | 'skipped' | 'error'

// Garde anti-chevauchement — le démarrage, le retour au premier plan et
// l'intervalle périodique (voir useCloudSyncScheduler.ts) peuvent se
// déclencher à quelques secondes d'intervalle ; jamais deux synchros en
// parallèle pour le même profil.
const inFlight = new Set<string>()

function tooLarge(payload: ProfileBackupPayload): boolean {
  const size = new Blob([JSON.stringify(payload)]).size
  if (size > MAX_PAYLOAD_BYTES) {
    console.warn(`Synchro : sauvegarde trop volumineuse (${Math.round(size / 1024)} Ko), synchro ignorée.`)
    return true
  }
  return false
}

// Compte email (Supabase Auth) — voir emailSync.ts. La session Supabase
// est partagée par tout l'appareil (un seul compte connecté à la fois,
// pas un par profil local) : `authUserId` sert à vérifier que la session
// active correspond bien au compte auquel CE profil a été lié, plutôt que
// de pousser les données de ce profil vers le compte de quelqu'un d'autre
// si une autre personne s'est connectée entre-temps sur le même appareil.
async function syncEmailPayload(profileId: string, authUserId: string): Promise<SyncResult> {
  const session = await getCurrentSession()
  if (!session || session.user.id !== authUserId) return 'skipped'

  const local = await exportProfileData(profileId)

  let remote: ProfileBackupPayload | null = null
  try {
    remote = await restoreProfileEmail()
  } catch (err) {
    console.error('Synchro email : lecture distante impossible', err)
    return 'error'
  }

  const toPush = remote ? mergePayloads(local, remote) : local
  if (tooLarge(toPush)) return 'error'

  if (remote) await replaceProfileData(profileId, toPush)
  await backupProfileEmail(toPush, session.user.email ?? '')
  return 'ok'
}

// Nom+code (Redis) — mode d'origine, conservé tel quel pour les profils
// déjà liés ainsi avant l'ajout de la connexion par email.
async function syncPinPayload(profileId: string, profileName: string, pin: string): Promise<SyncResult> {
  const local = await exportProfileData(profileId)

  let remote: ProfileBackupPayload | null = null
  try {
    remote = (await restoreProfile(profileName, pin)).payload
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      // Pas encore de sauvegarde distante sous ce nom+code — premier
      // sync, rien à fusionner, on pousse juste l'état local tel quel.
    } else {
      console.error('Synchro : lecture distante impossible', err)
      return 'error'
    }
  }

  const toPush = remote ? mergePayloads(local, remote) : local
  if (tooLarge(toPush)) return 'error'

  // Seulement si on a vraiment fusionné quelque chose de nouveau — sur
  // un premier sync (remote absent), le local n'a pas changé, pas la
  // peine de réécrire ce qui est déjà là.
  if (remote) await replaceProfileData(profileId, toPush)
  await backupProfile(profileName, pin, toPush)
  return 'ok'
}

/**
 * Synchronise le profil `profileId` : exporte l'état local, récupère
 * l'état distant, fusionne les deux (voir cloudSyncMerge.ts — jamais un
 * simple écrasement, pour ne perdre ni les suppressions ni les
 * modifications concurrentes), réécrit le résultat fusionné en local ET
 * le repousse vers le serveur. Deux transports possibles selon comment ce
 * profil est lié (voir db/cloudSyncState.ts) : compte email (Supabase) si
 * `authUserId` est présent, sinon nom+code (Redis, voir cloudSync.ts).
 */
export async function syncNow(profileId: string, profileName: string): Promise<SyncResult> {
  if (!profileId) return 'skipped'
  if (inFlight.has(profileId)) return 'skipped'
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'skipped'

  const state = await getCloudSyncState(profileId)
  if (!state?.enabled) return 'skipped'

  inFlight.add(profileId)
  try {
    const result = state.authUserId
      ? await syncEmailPayload(profileId, state.authUserId)
      : profileName && state.pin
        ? await syncPinPayload(profileId, profileName, state.pin)
        : ('skipped' as SyncResult)

    if (result === 'ok') await setLastSyncedAt(profileId, Date.now())
    return result
  } catch (err) {
    console.error('Synchro échouée :', err)
    return 'error'
  } finally {
    inFlight.delete(profileId)
  }
}
