import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { consumePendingEmailLinkProfileId } from './emailAuth'
import { enableEmailSync } from '../../db/cloudSyncState'
import { setHasCloudBackup } from '../../db/settings'
import { syncNow } from './cloudSyncEngine'

/**
 * Monté une seule fois (voir App.tsx) — après un clic sur le lien magique
 * reçu par email, Supabase établit la session automatiquement au chargement
 * de la page (détection du jeton dans l'URL, comportement par défaut du
 * client). Ce hook écoute cet événement et termine la liaison côté appli :
 * retrouve quel profil local attendait cette connexion (voir
 * setPendingEmailLinkProfileId, posé juste avant l'envoi du lien dans
 * Settings.tsx), l'enregistre comme lié à ce compte, puis lance une
 * première synchro (qui rapatrie automatiquement une sauvegarde existante
 * si ce compte email en a déjà une sur un autre appareil).
 */
export function useEmailAuthLink() {
  useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' || !session) return
      const pendingProfileId = consumePendingEmailLinkProfileId()
      if (!pendingProfileId) return
      ;(async () => {
        await enableEmailSync(pendingProfileId, session.user.email ?? '', session.user.id)
        await setHasCloudBackup(pendingProfileId, true)
        await syncNow(pendingProfileId, '')
      })()
    })
    return () => subscription.unsubscribe()
  }, [])
}
