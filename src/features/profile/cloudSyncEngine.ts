import { exportProfileData, replaceProfileData, type ProfileBackupPayload } from '../../db/profileSync'
import { getCloudSyncState, setLastSyncedAt } from '../../db/cloudSyncState'
import { mergePayloads } from '../../db/cloudSyncMerge'
import { backupProfile, restoreProfile, HttpError } from './cloudSync'

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

/**
 * Synchronise le profil `profileId` (nommé `profileName` côté cloud) :
 * exporte l'état local, récupère l'état distant, fusionne les deux (voir
 * cloudSyncMerge.ts — jamais un simple écrasement, pour ne perdre ni les
 * suppressions ni les modifications concurrentes), réécrit le résultat
 * fusionné en local ET le repousse vers le serveur. Le serveur reste une
 * simple boîte noire (voir api/backup.ts) — toute la logique de fusion
 * vit ici, côté client.
 */
export async function syncNow(profileId: string, profileName: string): Promise<SyncResult> {
  if (!profileId || !profileName) return 'skipped'
  if (inFlight.has(profileId)) return 'skipped'
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'skipped'

  const state = await getCloudSyncState(profileId)
  if (!state?.enabled || !state.pin) return 'skipped'

  inFlight.add(profileId)
  try {
    const local = await exportProfileData(profileId)

    let remote: ProfileBackupPayload | null = null
    try {
      remote = (await restoreProfile(profileName, state.pin)).payload
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

    const size = new Blob([JSON.stringify(toPush)]).size
    if (size > MAX_PAYLOAD_BYTES) {
      console.warn(`Synchro : sauvegarde trop volumineuse (${Math.round(size / 1024)} Ko), synchro ignorée.`)
      return 'error'
    }

    // Seulement si on a vraiment fusionné quelque chose de nouveau — sur
    // un premier sync (remote absent), le local n'a pas changé, pas la
    // peine de réécrire ce qui est déjà là.
    if (remote) await replaceProfileData(profileId, toPush)
    await backupProfile(profileName, state.pin, toPush)
    await setLastSyncedAt(profileId, Date.now())
    return 'ok'
  } catch (err) {
    console.error('Synchro échouée :', err)
    return 'error'
  } finally {
    inFlight.delete(profileId)
  }
}
