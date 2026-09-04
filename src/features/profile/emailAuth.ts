import { supabase } from '../../lib/supabaseClient'

// Clé localStorage posée juste avant l'envoi du lien magique (voir
// Settings.tsx handleSendMagicLink) — le clic sur le lien recharge
// l'appli dans un contexte JS tout neuf (nouvel onglet/navigation), donc
// le seul moyen de savoir "quel profil local voulait se connecter" est de
// le déposer ici avant de partir, puis de le relire une fois la session
// établie (voir useEmailAuthLink.ts).
const PENDING_LINK_KEY = 'pera-pera-pending-email-link'

export function setPendingEmailLinkProfileId(profileId: string): void {
  localStorage.setItem(PENDING_LINK_KEY, profileId)
}

export function consumePendingEmailLinkProfileId(): string | null {
  const value = localStorage.getItem(PENDING_LINK_KEY)
  if (value) localStorage.removeItem(PENDING_LINK_KEY)
  return value
}

export async function sendMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/` },
  })
  if (error) throw new Error(error.message)
}

export async function getCurrentSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signOutEmail(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}
