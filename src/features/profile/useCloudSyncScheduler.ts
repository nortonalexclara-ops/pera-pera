import { useEffect, useRef } from 'react'
import { useProfileStore } from './profileStore'
import { syncNow } from './cloudSyncEngine'

// Toutes les ~3 minutes pendant qu'un profil est actif — pas besoin de
// "temps réel" pour une appli personnelle à faible enjeu, juste que les
// notes/progrès du téléphone finissent par apparaître sur le PC (et
// inversement) sans action manuelle, dans un délai raisonnable.
const SYNC_INTERVAL_MS = 3 * 60 * 1000

/**
 * Monté une seule fois (voir App.tsx, PAS MainLayout.tsx — les écrans
 * plein écran de séance, où mastery/reviewMarks/timeSpent/activity
 * s'écrivent le plus, sont hors MainLayout). Déclenche `syncNow` (voir
 * cloudSyncEngine.ts, no-op silencieux si la synchro n'est pas activée
 * pour ce profil) au changement de profil actif, au retour au premier
 * plan de l'onglet, et périodiquement tant qu'un profil reste actif.
 */
export function useCloudSyncScheduler() {
  const profileId = useProfileStore((s) => s.activeProfileId)
  const profileName = useProfileStore((s) => s.activeProfileName)

  // Lus depuis des callbacks posés une seule fois (visibilitychange,
  // intervalle) — évite de les redéclarer/réabonner à chaque changement
  // de profil, juste besoin de la valeur la plus récente au moment où
  // ils se déclenchent.
  const profileIdRef = useRef(profileId)
  const profileNameRef = useRef(profileName)
  useEffect(() => {
    profileIdRef.current = profileId
    profileNameRef.current = profileName
  }, [profileId, profileName])

  useEffect(() => {
    if (!profileId || !profileName) return
    syncNow(profileId, profileName)
  }, [profileId, profileName])

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible' && profileIdRef.current && profileNameRef.current) {
        syncNow(profileIdRef.current, profileNameRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (profileIdRef.current && profileNameRef.current) {
        syncNow(profileIdRef.current, profileNameRef.current)
      }
    }, SYNC_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])
}
