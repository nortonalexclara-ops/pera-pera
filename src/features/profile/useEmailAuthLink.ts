import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { consumePendingEmailLinkProfileId, consumePendingEmailSignup } from './emailAuth'
import { enableEmailSync } from '../../db/cloudSyncState'
import { setHasCloudBackup } from '../../db/settings'
import { syncNow } from './cloudSyncEngine'
import { restoreProfileEmail } from './emailSync'
import { replaceProfileData } from '../../db/profileSync'
import { createProfile } from '../../db/profiles'
import { useProfileStore } from './profileStore'

/**
 * Monté une seule fois (voir App.tsx) — après un clic sur le lien magique
 * reçu par email, Supabase établit la session automatiquement au
 * chargement de la page. Ce hook termine la liaison côté appli, selon
 * lequel des deux écrans a lancé la connexion (voir emailAuth.ts) :
 * - un profil local déjà actif, depuis Réglages (setPendingEmailLinkProfileId)
 *   → ce profil devient lié à ce compte ;
 * - aucun profil local, depuis l'écran de sélection (setPendingEmailSignup)
 *   → un nouveau profil local est créé, rempli avec la sauvegarde de ce
 *   compte si elle existe déjà (autre appareil), et activé directement.
 */
export function useEmailAuthLink() {
  const navigate = useNavigate()
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)

  useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' || !session) return

      const pendingProfileId = consumePendingEmailLinkProfileId()
      if (pendingProfileId) {
        ;(async () => {
          await enableEmailSync(pendingProfileId, session.user.email ?? '', session.user.id)
          await setHasCloudBackup(pendingProfileId, true)
          await syncNow(pendingProfileId, '')
        })()
        return
      }

      const pendingSignupName = consumePendingEmailSignup()
      if (pendingSignupName) {
        ;(async () => {
          const record = await createProfile(pendingSignupName)
          // Récupère une sauvegarde existante pour ce compte (connexion
          // depuis un autre appareil) — sans ça, ce nouveau profil local
          // resterait vide même si la progression existe déjà ailleurs.
          const remote = await restoreProfileEmail().catch(() => null)
          if (remote) await replaceProfileData(record.id, remote)
          await enableEmailSync(record.id, session.user.email ?? '', session.user.id)
          await setHasCloudBackup(record.id, true)
          await syncNow(record.id, '')
          setActiveProfile(record.id, record.name, record.colorIndex)
          navigate('/dashboard')
        })()
      }
    })
    return () => subscription.unsubscribe()
  }, [navigate, setActiveProfile])
}
