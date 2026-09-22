import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { consumePendingEmailLinkProfileId, consumePendingEmailSignup } from './emailAuth'
import { linkExistingProfileToEmail, createProfileFromEmailAuth } from './completeEmailAuth'
import { useProfileStore } from './profileStore'

/**
 * Monté une seule fois (voir App.tsx) — filet de sécurité pour le seul cas
 * qui reste asynchrone/multi-page dans la connexion par email : une
 * CRÉATION de compte qui exige une confirmation par email avant de
 * pouvoir se connecter (voir emailAuth.ts, signUpWithPassword) — Supabase
 * établit alors la session automatiquement au clic sur le lien de
 * confirmation, dans un contexte JS tout neuf, potentiellement bien après
 * l'appel initial. La connexion à un compte déjà confirmé, elle, est
 * directe/synchrone (voir ProfileSelector.tsx/Settings.tsx) — ce hook n'a
 * alors rien à faire, aucun marqueur "en attente" n'a été posé.
 */
export function useEmailAuthLink() {
  const navigate = useNavigate()
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)

  useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_IN') return

      const pendingProfileId = consumePendingEmailLinkProfileId()
      if (pendingProfileId) {
        linkExistingProfileToEmail(pendingProfileId)
        return
      }

      const pendingSignupName = consumePendingEmailSignup()
      if (pendingSignupName) {
        ;(async () => {
          const record = await createProfileFromEmailAuth(pendingSignupName)
          setActiveProfile(record.id, record.name, record.colorIndex)
          navigate('/dashboard')
        })()
      }
    })
    return () => subscription.unsubscribe()
  }, [navigate, setActiveProfile])
}
